import { NextResponse } from "next/server";
import { getProduct, editionLabel, editionKindLabel, isOneOfOne } from "@/data/products";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { availabilityOf, dispatchLabel, dropOf, formatDropDate } from "@/lib/editions";
import { readInventory } from "@/lib/inventory";
import { storefront, storefrontConfigured } from "@/lib/shopify";

type Item = { slug: string; size: string };

export async function POST(req: Request) {
  if (!storefrontConfigured()) {
    return NextResponse.json(
      { error: "Checkout opens soon. Add the Shopify settings (see README) to enable payments." },
      { status: 503 },
    );
  }

  let items: Item[];
  try {
    const body = (await req.json()) as { items?: unknown };
    if (!Array.isArray(body.items) || body.items.length === 0) throw new Error("empty");
    items = body.items as Item[];
  } catch {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  // A bag line is one unit of a design in one size. The edition must still have that many units free.
  let inventory;
  try {
    inventory = await readInventory();
  } catch (err) {
    console.error("Inventory read failed at checkout", err);
    return NextResponse.json({ error: "We couldn't reach checkout. Please try again in a moment." }, { status: 502 });
  }
  const wanted = new Map<string, number>();
  const units: Item[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProduct(String(item.slug));
    if (!product) return NextResponse.json({ error: `Unknown piece: ${item.slug}` }, { status: 400 });
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json({ error: `Unknown size for ${product.name}.` }, { status: 400 });
    }
    const already = wanted.get(product.slug) ?? 0;
    const a = availabilityOf(product, inventory);

    if (a.state === "upcoming") {
      return NextResponse.json(
        { error: `${product.name} is part of ${dropOf(product).name}, which opens ${formatDropDate(dropOf(product).opens)}.`, soldOut: [product.slug] },
        { status: 409 },
      );
    }
    if (a.state === "closed") {
      return NextResponse.json(
        { error: `Orders for ${product.name} closed on ${formatDropDate(dropOf(product).closes)}. The edition is being made and will not reopen.`, soldOut: [product.slug] },
        { status: 409 },
      );
    }
    if (a.state === "sold" || a.remaining <= already) {
      const msg = isOneOfOne(product)
        ? `${product.name} has just been sold. It was one of one.`
        : `${product.name} has just sold out. All ${a.total} are spoken for.`;
      return NextResponse.json({ error: msg, soldOut: [product.slug] }, { status: 409 });
    }
    wanted.set(product.slug, already + 1);
    units.push({ slug: product.slug, size: item.size });
    subtotal += product.price;
  }

  // Shopify variant for each unit: the product's handle is the slug, the variant's Size option the size.
  const slugs = [...new Set(units.map((u) => u.slug))];
  let variants: Map<string, string>;
  try {
    variants = await variantIds(slugs);
  } catch (err) {
    console.error("Shopify variant lookup failed", err);
    return NextResponse.json({ error: "We couldn't reach checkout. Please try again in a moment." }, { status: 502 });
  }

  const lines = [];
  for (const u of units) {
    const product = getProduct(u.slug)!;
    const merchandiseId = variants.get(`${u.slug}:${u.size}`);
    if (!merchandiseId) {
      console.error("No Shopify variant for", u, "- run `npm run shopify:sync`");
      return NextResponse.json({ error: `${product.name} in ${u.size} isn't available to buy online yet.` }, { status: 409 });
    }
    lines.push({
      merchandiseId,
      quantity: 1,
      // Shown on Shopify's checkout and kept on the order.
      attributes: [
        { key: "Design", value: `${editionLabel(product)} · ${product.colour.name}` },
        { key: "Edition", value: editionKindLabel(product) },
        { key: "When", value: dispatchLabel(product) },
      ],
    });
  }

  try {
    const data = await storefront<CartCreate>(CART_CREATE, {
      input: {
        lines,
        attributes: [
          { key: "units", value: units.map((u) => `${u.slug}:${u.size}`).join(",") },
          { key: "pledge_cents", value: String(pledgeCents(subtotal)) },
        ],
        note: `${pledgePercentLabel()} of this order goes to conservation.`,
      },
    });
    const { cart, userErrors } = data.cartCreate;
    if (!cart || userErrors.length) {
      console.error("Shopify cartCreate errors", userErrors);
      return NextResponse.json({ error: "We couldn't start checkout. Please try again in a moment." }, { status: 502 });
    }
    return NextResponse.json({ url: cart.checkoutUrl, cartId: cart.id });
  } catch (err) {
    console.error("Shopify checkout error", err);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again in a moment." }, { status: 502 });
  }
}

type CartCreate = {
  cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: { field: string[] | null; message: string }[] };
};

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

/** "slug:size" → variant GID, for the given product handles. */
async function variantIds(slugs: string[]): Promise<Map<string, string>> {
  const fields = slugs
    .map((slug, i) => `p${i}: product(handle: ${JSON.stringify(slug)}) { handle variants(first: 50) { nodes { id selectedOptions { name value } } } }`)
    .join("\n");
  type Variant = { id: string; selectedOptions: { name: string; value: string }[] };
  const data = await storefront<Record<string, { handle: string; variants: { nodes: Variant[] } } | null>>(`query Variants {\n${fields}\n}`);
  const map = new Map<string, string>();
  for (const product of Object.values(data)) {
    if (!product) continue;
    for (const v of product.variants.nodes) {
      const size = v.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ?? "";
      map.set(`${product.handle}:${size}`, v.id);
    }
  }
  return map;
}
