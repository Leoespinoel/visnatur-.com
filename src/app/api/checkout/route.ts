import { NextResponse } from "next/server";
import { designNumber, getProduct } from "@/data/products";
import { leadTimeLabel } from "@/lib/format";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
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

  // A bag line is one piece of a design in one size. Every piece is made to order, so there is no stock to check.
  const units: Item[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProduct(String(item.slug));
    if (!product) {
      return NextResponse.json({ error: "A piece in your bag is no longer available, so we took it out.", unavailable: [String(item.slug)] }, { status: 409 });
    }
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json({ error: `Unknown size for ${product.name}.` }, { status: 400 });
    }
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
        { key: "Design", value: `${designNumber(product)} · ${product.colour.name}` },
        { key: "When", value: `Made to order in your size. Ships ${leadTimeLabel()} after you order.` },
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
