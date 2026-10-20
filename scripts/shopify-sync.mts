/**
 * Mirrors the catalogue in src/data/products.ts into Shopify.
 *
 *   npm run shopify:sync              create/update every product and the made to order surcharge, publish them, drop the old order webhook
 *   npm run shopify:sync -- --dry-run print what would be sent, without calling Shopify
 *
 * Reads SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET and NEXT_PUBLIC_SITE_URL
 * from the environment or .env.local. Safe to run again: products are matched by handle (= slug).
 *
 * The site stays the source of truth for names, prices, sizes and descriptions. Edit
 * products.ts, then re-run this. A product with no photos in Shopify gets the site's (packshot, on
 * model, detail) fetched from NEXT_PUBLIC_SITE_URL, so deploy before syncing new products.
 */
import { products, productImages, designNumber, lineOf, type Product } from "../src/data/products.ts";
import { getDrop } from "../src/data/drops.ts";
import { categories, site } from "../src/data/site.ts";

const API_VERSION = "2026-07";
const DRY = process.argv.includes("--dry-run");
/**
 * `--track-stock` turns on Shopify inventory tracking for every Signature and drop variant. Only run it once the stock
 * quantities are entered in Shopify (Products → Inventory): a tracked variant at 0 shows as sold out and can't be bought.
 */
const TRACK_STOCK = process.argv.includes("--track-stock");

/** The made to order surcharge: one untracked product, one line per adjusted piece at checkout (src/app/api/checkout/route.ts). */
const SURCHARGE = {
  title: "Made to order",
  handle: "made-to-order-adjustment",
  descriptionHtml: "<p>A Signature piece adjusted to fit: sleeve, length, inseam, waist or fit. Added once per adjusted piece.</p>",
  vendor: site.name,
  productType: "Service",
  tags: ["made-to-order"],
  status: "ACTIVE",
  productOptions: [{ name: "Title", position: 1, values: [{ name: "Default Title" }] }],
  variants: [
    {
      optionValues: [{ optionName: "Title", name: "Default Title" }],
      price: (site.delivery.madeToOrderSurchargeCents / 100).toFixed(2),
      inventoryItem: { sku: "VN-MTO", tracked: false, requiresShipping: false },
    },
  ],
};

const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

function fail(msg: string): never {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

/* ---------- Mapping ---------- */

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "Signature", or the collection's name ("Collection 01"). */
const lineName = (p: Product) => (lineOf(p) === "drop" ? (getDrop(p.drop)?.name ?? "Collection") : "Signature");

function descriptionHtml(p: Product): string {
  return [
    `<p>${escape(p.description)}</p>`,
    `<p><strong>${escape(designNumber(p))} · ${escape(lineName(p))}</strong> · ${escape(p.colour.name)}</p>`,
    `<p>${escape(p.fabric)}</p>`,
    `<ul>${p.details.map((d) => `<li>${escape(d)}</li>`).join("")}</ul>`,
    `<p><em>${escape(p.care)}</em></p>`,
  ].join("\n");
}

function productInput(p: Product) {
  const category = categories.find((c) => c.slug === p.category);
  return {
    title: p.name,
    handle: p.slug,
    descriptionHtml: descriptionHtml(p),
    vendor: site.name,
    productType: category?.name ?? p.category,
    tags: [
      `no-${String(p.number).padStart(3, "0")}`,
      p.garment,
      lineOf(p) === "drop" ? (p.drop ?? "drop") : "signature",
    ],
    status: "ACTIVE",
    productOptions: [{ name: "Size", position: 1, values: p.sizes.map((name) => ({ name })) }],
    variants: p.sizes.map((size) => ({
      optionValues: [{ optionName: "Size", name: size }],
      price: (p.price / 100).toFixed(2),
      // Signature and drop pieces are held in stock (Leo, 2026-10-20): Shopify tracks it and won't oversell. Quantities are set in
      // the Shopify admin; this sync never sends them, so a re-run leaves stock as it is. Untracked until stock is entered there,
      // a tracked variant at 0 can't be bought, which is why TRACK_STOCK must be switched on deliberately.
      inventoryPolicy: "DENY",
      inventoryItem: { sku: `VN-${String(p.number).padStart(3, "0")}-${size.replace(/\s+/g, "").toUpperCase()}`, tracked: TRACK_STOCK, requiresShipping: true },
    })),
  };
}

if (DRY) {
  const sample = productInput(products[0]);
  console.log(`Dry run: ${products.length} products would be synced. First one:\n`);
  console.log(JSON.stringify(sample, null, 2));
  console.log(`\nMade to order surcharge product:\n${JSON.stringify(SURCHARGE, null, 2)}`);
  console.log(`\nStock tracking: ${TRACK_STOCK ? "ON (--track-stock)" : "off (pass --track-stock once quantities are set in Shopify)"}`);
  console.log(`\nWould remove any webhook pointing at ${siteUrl || "<NEXT_PUBLIC_SITE_URL>"}/api/webhook`);
  process.exit(0);
}

/* ---------- Admin API ---------- */

if (!domain) fail("Set SHOPIFY_STORE_DOMAIN, e.g. vis-naturae.myshopify.com");
if (!process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) fail("Set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (Dev Dashboard app)");
if (!/^https:\/\//.test(siteUrl)) fail("Set NEXT_PUBLIC_SITE_URL to the live https address, e.g. https://xn--visnatur-q0a.com");

const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.SHOPIFY_CLIENT_ID!,
    client_secret: process.env.SHOPIFY_CLIENT_SECRET!,
  }),
});
if (!tokenRes.ok) fail(`Couldn't get an Admin API token (${tokenRes.status}): ${await tokenRes.text()}`);
const { access_token: token, scope } = (await tokenRes.json()) as { access_token: string; scope: string };
console.log(`✓ Connected to ${domain}`);
console.log(`  scopes: ${scope}`);

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!res.ok || json.errors) fail(`Shopify API error: ${JSON.stringify(json.errors ?? res.statusText)}`);
  return json.data!;
}

type UserErrors = { userErrors: { field?: string[] | null; message: string }[] };
const check = (what: string, payload: UserErrors) => {
  if (payload.userErrors.length) fail(`${what}: ${payload.userErrors.map((e) => `${e.field?.join(".") ?? ""} ${e.message}`).join("; ")}`);
};

const shop = await gql<{ shop: { name: string; currencyCode: string } }>(`{ shop { name currencyCode } }`);
if (shop.shop.currencyCode !== site.currency) {
  console.warn(`! Store currency is ${shop.shop.currencyCode}; the site prices in ${site.currency}. Change it in Settings → General → Store currency.`);
}

const pubs = await gql<{ publications: { nodes: { id: string; catalog: { title: string } | null }[] } }>(
  `{ publications(first: 50) { nodes { id catalog { title } } } }`,
);
// Publish to the Headless storefront (and any other channel) but not the Online Store theme,
// so the products don't also appear on a second, unbranded shop.
const targets = pubs.publications.nodes.filter((p) => !/online store/i.test(p.catalog?.title ?? ""));
if (!targets.length) fail("No sales channel to publish to. Install the Headless channel and create a storefront first.");
console.log(`  publishing to: ${targets.map((t) => t.catalog?.title ?? t.id).join(", ")}`);

/* ---------- Products ---------- */

for (const p of products) {
  const existing = await gql<{ productByIdentifier: { id: string } | null }>(
    `query Find($handle: String!) { productByIdentifier(identifier: { handle: $handle }) { id } }`,
    { handle: p.slug },
  );
  const input = { ...productInput(p), ...(existing.productByIdentifier ? { id: existing.productByIdentifier.id } : {}) };
  const set = await gql<{ productSet: UserErrors & { product: { id: string; mediaCount: { count: number } } | null } }>(
    `mutation Set($input: ProductSetInput!) {
       productSet(input: $input, synchronous: true) { product { id mediaCount { count } } userErrors { field message } }
     }`,
    { input },
  );
  check(`productSet ${p.slug}`, set.productSet);
  const id = set.productSet.product!.id;

  // Photos only go on once, so a re-run never duplicates them; Shopify fetches them from the live site.
  if (!set.productSet.product!.mediaCount.count) {
    const media = await gql<{ productUpdate: UserErrors }>(
      `mutation Media($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
         productUpdate(product: $product, media: $media) { userErrors { field message } }
       }`,
      {
        product: { id },
        media: productImages(p).map((src) => ({ originalSource: `${siteUrl}${src}`, mediaContentType: "IMAGE", alt: `${p.name}, ${p.colour.name}` })),
      },
    );
    check(`photos ${p.slug}`, media.productUpdate);
  }

  const pub = await gql<{ publishablePublish: UserErrors }>(
    `mutation Pub($id: ID!, $input: [PublicationInput!]!) {
       publishablePublish(id: $id, input: $input) { userErrors { field message } }
     }`,
    { id, input: targets.map((t) => ({ publicationId: t.id })) },
  );
  check(`publish ${p.slug}`, pub.publishablePublish);
  console.log(`✓ ${existing.productByIdentifier ? "updated" : "created"} ${p.slug} (${p.sizes.length} sizes, €${(p.price / 100).toFixed(2)})`);
}

/* ---------- Made to order surcharge ---------- */

{
  const existing = await gql<{ productByIdentifier: { id: string } | null }>(
    `query Find($handle: String!) { productByIdentifier(identifier: { handle: $handle }) { id } }`,
    { handle: SURCHARGE.handle },
  );
  const input = { ...SURCHARGE, ...(existing.productByIdentifier ? { id: existing.productByIdentifier.id } : {}) };
  const set = await gql<{ productSet: UserErrors & { product: { id: string } | null } }>(
    `mutation Set($input: ProductSetInput!) { productSet(input: $input, synchronous: true) { product { id } userErrors { field message } } }`,
    { input },
  );
  check("productSet made to order", set.productSet);
  const pub = await gql<{ publishablePublish: UserErrors }>(
    `mutation Pub($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { field message } } }`,
    { id: set.productSet.product!.id, input: targets.map((t) => ({ publicationId: t.id })) },
  );
  check("publish made to order", pub.publishablePublish);
  console.log(`✓ ${existing.productByIdentifier ? "updated" : "created"} ${SURCHARGE.handle} (€${SURCHARGE.variants[0].price})`);
}

/* ---------- Old webhook ---------- */

// The site used to count edition sales through an order webhook at /api/webhook. That route is gone (stock now
// lives in Shopify itself), so remove the subscriptions instead of letting them fail.
const uri = `${siteUrl}/api/webhook`;
const subs = await gql<{ webhookSubscriptions: { nodes: { id: string; topic: string; uri: string }[] } }>(
  `{ webhookSubscriptions(first: 50) { nodes { id topic uri } } }`,
);
for (const sub of subs.webhookSubscriptions.nodes.filter((s) => s.uri === uri)) {
  const deleted = await gql<{ webhookSubscriptionDelete: UserErrors }>(
    `mutation Unhook($id: ID!) { webhookSubscriptionDelete(id: $id) { userErrors { field message } } }`,
    { id: sub.id },
  );
  check(`webhook ${sub.topic}`, deleted.webhookSubscriptionDelete);
  console.log(`✓ removed webhook ${sub.topic} → ${uri}`);
}

console.log(`\nDone. ${products.length} products are in ${shop.shop.name}.`);
