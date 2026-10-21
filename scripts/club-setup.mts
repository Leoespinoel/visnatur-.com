// Sets Shopify up for The VN Club's member page (/members, signed in), once. Safe to run again.
//   1. Checks the Dev Dashboard app has the access the club needs, and says which is missing.
//   2. Creates the customer metafield definition custom.club (JSON) with NO customer-account and NO storefront access,
//      so members can't read or write their club record themselves: only the site's server can, through the Admin API.
//
//   npm run club:setup              (add -- --dry-run to only check)
//
// Env (.env.local): SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET.

const DRY = process.argv.includes("--dry-run");
const API_VERSION = "2026-07";
const NEEDED = ["read_customers", "write_customers", "read_discounts", "write_discounts", "read_orders", "read_all_orders"];

const fail = (msg: string): never => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};
const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
if (!domain || !process.env.SHOPIFY_CLIENT_ID || !process.env.SHOPIFY_CLIENT_SECRET) fail("Set SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET in .env.local");

const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }),
});
if (!tokenRes.ok) fail(`Couldn't get an Admin API token (${tokenRes.status}): ${await tokenRes.text()}`);
const { access_token: token, scope } = (await tokenRes.json()) as { access_token: string; scope: string };
const granted = new Set(scope.split(","));
// A write scope includes its read.
const has = (s: string) => granted.has(s) || (s.startsWith("read_") && granted.has(s.replace("read_", "write_")));
const missing = NEEDED.filter((s) => !has(s));
console.log(`✓ Connected to ${domain}`);
console.log(`  access: ${[...granted].sort().join(", ")}`);
if (missing.length) {
  fail(
    `The app is missing: ${missing.join(", ")}.\n` +
      "  Shopify Dev Dashboard → the app → Versions → new version → Access scopes: add them (keep the ones it has), release,\n" +
      "  then approve the update in the store admin. Then run this again.",
  );
}
console.log("✓ All the access the club needs");

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

type Def = { id: string; access: { customerAccount: string; storefront: string | null } };
const found = await gql<{ metafieldDefinitions: { nodes: Def[] } }>(
  `{ metafieldDefinitions(first: 1, ownerType: CUSTOMER, namespace: "custom", key: "club") { nodes { id access { customerAccount storefront } } } }`,
);
const def = found.metafieldDefinitions.nodes[0];
const access = { customerAccount: "NONE", storefront: "NONE" };
type Errors = { userErrors: { field: string[] | null; message: string }[] };
const check = (what: string, p: Errors) => p.userErrors.length && fail(`${what}: ${p.userErrors.map((e) => e.message).join("; ")}`);

if (!def) {
  if (DRY) {
    console.log("· Would create the customer metafield definition custom.club (JSON, no customer or storefront access)");
  } else {
    const made = await gql<{ metafieldDefinitionCreate: Errors & { createdDefinition: { id: string } | null } }>(
      `mutation Make($d: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $d) { createdDefinition { id } userErrors { field message } } }`,
      {
        d: {
          name: "The VN Club",
          namespace: "custom",
          key: "club",
          type: "json",
          ownerType: "CUSTOMER",
          description: "Points, rewards and requests for The VN Club. Written by the site only: do not edit.",
          access,
        },
      },
    );
    check("Creating custom.club", made.metafieldDefinitionCreate);
    console.log(`✓ Created custom.club (${made.metafieldDefinitionCreate.createdDefinition!.id})`);
  }
} else if (def.access.customerAccount !== "NONE" || (def.access.storefront ?? "NONE") !== "NONE") {
  if (DRY) {
    console.log(`· Would turn off customer and storefront access on custom.club (now ${JSON.stringify(def.access)})`);
  } else {
    const updated = await gql<{ metafieldDefinitionUpdate: Errors }>(
      `mutation Fix($d: MetafieldDefinitionUpdateInput!) { metafieldDefinitionUpdate(definition: $d) { userErrors { field message } } }`,
      { d: { namespace: "custom", key: "club", ownerType: "CUSTOMER", access } },
    );
    check("Updating custom.club", updated.metafieldDefinitionUpdate);
    console.log("✓ custom.club: customer and storefront access turned off");
  }
} else {
  console.log("✓ custom.club exists, with no customer or storefront access");
}
console.log("\nNext: in Hostinger, add SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET to the site's environment variables and redeploy.");
