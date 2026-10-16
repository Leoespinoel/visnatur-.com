import { rememberCheckout, type CartLine } from "@/lib/cart";

/**
 * Sends the bag to /api/checkout and goes on to Shopify's checkout. Used by both bag drawers (the
 * classic site and /v2). Pieces that can't be bought any more are handed to `removeUnavailable` so the
 * rest can proceed; any failure throws with a message to show.
 */
export async function startCheckout(lines: CartLine[], removeUnavailable: (slugs: string[]) => void): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: lines.map(({ slug, size }) => ({ slug, size })) }),
  });
  const data = (await res.json()) as { url?: string; cartId?: string; error?: string; unavailable?: string[] };
  if (!res.ok || !data.url) {
    // A piece that can't be bought any more is removed so the rest can proceed.
    if (data.unavailable?.length) removeUnavailable(data.unavailable);
    throw new Error(data.error ?? "Checkout failed. Please try again.");
  }
  // Shopify's checkout doesn't come back here, so remember it and empty the bag once it becomes an order.
  if (data.cartId) rememberCheckout(data.cartId);
  window.location.assign(data.url);
}
