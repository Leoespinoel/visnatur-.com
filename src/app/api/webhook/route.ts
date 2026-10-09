import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { editionTotal, getProduct } from "@/data/products";
import { INVENTORY_TAG } from "@/lib/inventory";
import { admin, paidUnits, verifyWebhook } from "@/lib/shopify";

/**
 * Shopify webhook. `npm run shopify:sync` subscribes it to orders/paid, orders/cancelled
 * and refunds/create; Shopify signs each call with the app's client secret.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-shopify-hmac-sha256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic");
  if (topic === "orders/paid") {
    try {
      await numberOrder(JSON.parse(raw) as { admin_graphql_api_id?: string; name?: string });
    } catch (err) {
      // Never fail the webhook over bookkeeping; Shopify would retry and re-tag.
      console.error("Numbering failed", err);
    }
  }

  // Paid, cancelled or refunded: the counts on the site change either way.
  revalidateTag(INVENTORY_TAG, { expire: 0 });
  return NextResponse.json({ received: true });
}

/**
 * Unit numbers are assigned in order of payment: the nth paid unit of a design is "n of 12".
 * Tags the order with each number ("tidal-swim-short 3/12") so the atelier sees it in Shopify,
 * and flags an oversell (two buyers paying for the last unit at once).
 */
async function numberOrder(order: { admin_graphql_api_id?: string; name?: string }) {
  if (!order.admin_graphql_api_id) return;
  const all = await paidUnits();
  const position: Record<string, number> = {};
  const tags: string[] = [];
  const oversold: string[] = [];

  for (const unit of all) {
    position[unit.slug] = (position[unit.slug] ?? 0) + 1;
    if (unit.orderId !== order.admin_graphql_api_id) continue;
    const product = getProduct(unit.slug);
    const total = product ? editionTotal(product) : 0;
    tags.push(`${unit.slug} ${position[unit.slug]}/${total || "?"}`);
    if (total && position[unit.slug] > total) oversold.push(unit.slug);
  }
  if (oversold.length) tags.push("OVERSOLD");
  if (!tags.length) return;

  await admin(
    /* GraphQL */ `
      mutation Tag($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) { userErrors { message } }
      }
    `,
    { id: order.admin_graphql_api_id, tags },
  );

  console.log("Order numbered", { order: order.name, tags });
  if (oversold.length) {
    console.error("OVERSOLD: more units paid for than the edition holds. Refund the later order and contact the customer", {
      order: order.name,
      oversold,
    });
  }
}
