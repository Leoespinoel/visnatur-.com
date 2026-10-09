import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { site } from "@/data/site";
import type { Inventory } from "@/lib/editions";
import { adminConfigured, paidUnits } from "@/lib/shopify";

export const INVENTORY_TAG = "inventory";

/**
 * Reads the truth from Shopify: every unit on a paid, uncancelled order is sold.
 * Edition sizes live in the product data, so no database. Shopify checkout does not
 * hold units, so nothing is ever "reserved"; the webhook flags any oversell.
 */
export async function readInventory(): Promise<Inventory> {
  const now = Date.now();
  const sold: Record<string, number> = {};
  for (const slug of site.soldOffline) sold[slug] = (sold[slug] ?? 0) + 1;
  if (!adminConfigured()) return { sold, reserved: {}, now };

  for (const unit of await paidUnits()) sold[unit.slug] = (sold[unit.slug] ?? 0) + 1;
  return { sold, reserved: {}, now };
}

/** Cached for pages. The Shopify webhook clears it the moment an order is paid, cancelled or refunded. */
export async function getInventory(): Promise<Inventory> {
  "use cache";
  cacheTag(INVENTORY_TAG);
  cacheLife("minutes");
  try {
    return await readInventory();
  } catch (err) {
    // Shopify unreachable: keep the shop up and show counts from the offline list only.
    // Checkout re-reads uncached and refuses to proceed if Shopify is still down.
    console.error("Inventory read failed", err);
    const sold: Record<string, number> = {};
    for (const slug of site.soldOffline) sold[slug] = (sold[slug] ?? 0) + 1;
    return { sold, reserved: {}, now: Date.now() };
  }
}
