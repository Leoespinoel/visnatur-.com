import { NextResponse } from "next/server";
import { designNumber, getProduct } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { dispatchLabel, madeToOrderLabel } from "@/lib/format";
import { adjustSummary, cleanAdjustments, offersMadeToOrder, type Adjustments } from "@/lib/adjust";
import { storefront, storefrontConfigured } from "@/lib/shopify";
import { accessToken } from "@/lib/customer-account";

type Item = { slug: string; size: string; adjust?: Adjustments };

/** The Shopify product that carries the made to order surcharge (created by scripts/shopify-sync.mts), one per adjusted piece. */
const SURCHARGE_HANDLE = "made-to-order-adjustment";

export async function POST(req: Request) {
  if (!storefrontConfigured()) {
    return NextResponse.json(
      { error: "Checkout opens soon. Add the Shopify settings (see README) to enable payments." },
      { status: 503 },
    );
  }

  let items: Item[];
  let measurements = "";
  try {
    const body = (await req.json()) as { items?: unknown; measurements?: unknown };
    if (!Array.isArray(body.items) || body.items.length === 0) throw new Error("empty");
    items = body.items as Item[];
    // The customer's saved sizes, sent with a made to order piece: plain text, trimmed and capped.
    if (typeof body.measurements === "string") measurements = body.measurements.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 500);
  } catch {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  // A bag line is one piece of a design in one size, adjusted (made to order) or as it is.
  const units: Item[] = [];

  for (const item of items) {
    const product = getProduct(String(item.slug));
    if (!product) {
      return NextResponse.json({ error: "A piece in your bag is no longer available, so we took it out.", unavailable: [String(item.slug)] }, { status: 409 });
    }
    if (!isAvailable(product)) {
      return NextResponse.json({ error: `The ${product.name} is coming soon and can't be ordered yet, so we took it out.`, unavailable: [product.slug] }, { status: 409 });
    }
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json({ error: `Unknown size for ${product.name}.` }, { status: 400 });
    }
    let adjust: Adjustments | undefined;
    if (item.adjust !== undefined && item.adjust !== null) {
      const clean = offersMadeToOrder(product) ? cleanAdjustments(product.garment, item.adjust) : null;
      if (!clean) {
        return NextResponse.json({ error: `The adjustments for ${product.name} aren't valid any more. Please set them again.`, unavailable: [product.slug] }, { status: 409 });
      }
      adjust = clean;
    }
    units.push({ slug: product.slug, size: item.size, adjust });
  }

  // Shopify variant for each unit: the product's handle is the slug, the variant's Size option the size.
  const slugs = [...new Set(units.map((u) => u.slug))];
  if (units.some((u) => u.adjust)) slugs.push(SURCHARGE_HANDLE);
  let variants: Map<string, string>;
  let soldOut: Set<string>;
  try {
    ({ variants, soldOut } = await variantIds(slugs));
  } catch (err) {
    console.error("Shopify variant lookup failed", err);
    return NextResponse.json({ error: "We couldn't reach checkout. Please try again in a moment." }, { status: 502 });
  }

  const lines = [];
  for (const u of units) {
    const product = getProduct(u.slug)!;
    const merchandiseId = variants.get(`${u.slug}:${u.size}`);
    if (merchandiseId && !u.adjust && soldOut.has(merchandiseId)) {
      return NextResponse.json({ error: `${product.name} in ${u.size} has just sold out, so we took it out.`, unavailable: [product.slug] }, { status: 409 });
    }
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
        ...(u.adjust
          ? [
              { key: "Made to order", value: adjustSummary(u.adjust) || "As cut" },
              { key: "When", value: `Made to order. Ships ${madeToOrderLabel()} after the order.` },
            ]
          : [{ key: "When", value: `In stock. Dispatched within ${dispatchLabel()}.` }]),
      ],
    });
    // The made to order fee is its own line: Shopify can't change a price through line attributes.
    if (u.adjust) {
      const surchargeId = variants.get(`${SURCHARGE_HANDLE}:`) ?? [...variants].find(([k]) => k.startsWith(`${SURCHARGE_HANDLE}:`))?.[1];
      if (!surchargeId) {
        console.error("No Shopify product for the made to order surcharge - run `npm run shopify:sync`");
        return NextResponse.json({ error: "Made to order can't be checked out online yet. Please try again soon." }, { status: 409 });
      }
      lines.push({
        merchandiseId: surchargeId,
        quantity: 1,
        attributes: [{ key: "For", value: `${designNumber(product)} · ${product.colour.name} · ${u.size}` }],
      });
    }
  }

  const input = {
    lines,
    attributes: [
      { key: "units", value: units.map((u) => `${u.slug}:${u.size}${u.adjust ? ":made-to-order" : ""}`).join(",") },
      ...(measurements && units.some((u) => u.adjust) ? [{ key: "Measurements", value: measurements }] : []),
    ],
  };
  // Signed in on the site: checkout opens with their details and the order goes on their account.
  const customerAccessToken = await accessToken().catch(() => null);

  try {
    let data = await storefront<CartCreate>(CART_CREATE, { input: customerAccessToken ? { ...input, buyerIdentity: { customerAccessToken } } : input });
    if (customerAccessToken && data.cartCreate.userErrors.length) {
      // A sign-in Shopify won't take for the cart shouldn't stop the order: check out as a guest instead.
      console.error("Shopify cartCreate with buyer identity failed, retrying as guest", data.cartCreate.userErrors);
      data = await storefront<CartCreate>(CART_CREATE, { input });
    }
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

/** "slug:size" → variant GID for the given product handles, and the GIDs Shopify reports as sold out. */
async function variantIds(slugs: string[]): Promise<{ variants: Map<string, string>; soldOut: Set<string> }> {
  const fields = slugs
    .map((slug, i) => `p${i}: product(handle: ${JSON.stringify(slug)}) { handle variants(first: 50) { nodes { id availableForSale selectedOptions { name value } } } }`)
    .join("\n");
  type Variant = { id: string; availableForSale: boolean; selectedOptions: { name: string; value: string }[] };
  const data = await storefront<Record<string, { handle: string; variants: { nodes: Variant[] } } | null>>(`query Variants {\n${fields}\n}`);
  const map = new Map<string, string>();
  const soldOut = new Set<string>();
  for (const product of Object.values(data)) {
    if (!product) continue;
    for (const v of product.variants.nodes) {
      const size = v.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ?? "";
      map.set(`${product.handle}:${size}`, v.id);
      if (!v.availableForSale) soldOut.add(v.id);
    }
  }
  return { variants: map, soldOut };
}
