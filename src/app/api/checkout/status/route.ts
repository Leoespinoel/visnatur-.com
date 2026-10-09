import { NextResponse } from "next/server";
import { storefront, storefrontConfigured } from "@/lib/shopify";

/**
 * Has this Shopify cart become an order? Shopify stops returning a cart once its checkout
 * completes, so "cart not found" means ordered. Used to empty the bag after a purchase.
 */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("cart");
  if (!id || !id.startsWith("gid://shopify/Cart/") || !storefrontConfigured()) {
    return NextResponse.json({ ordered: false });
  }
  try {
    const data = await storefront<{ cart: { id: string } | null }>(`query Cart($id: ID!) { cart(id: $id) { id } }`, { id });
    return NextResponse.json({ ordered: data.cart === null });
  } catch {
    return NextResponse.json({ ordered: false });
  }
}
