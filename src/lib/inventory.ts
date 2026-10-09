import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type Stripe from "stripe";
import { site } from "@/data/site";
import { getStripe } from "@/lib/stripe";
import type { Inventory } from "@/lib/editions";

export const INVENTORY_TAG = "inventory";

export type Unit = { slug: string; size: string };

/** Units stored in a Checkout session's metadata as "slug:size,slug:size" (see /api/checkout). */
export function unitsFromSession(session: Pick<Stripe.Checkout.Session, "metadata">): Unit[] {
  return (session.metadata?.units ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean)
    .map((u) => {
      const i = u.lastIndexOf(":");
      return i === -1 ? { slug: u, size: "" } : { slug: u.slice(0, i), size: u.slice(i + 1) };
    });
}

function count(into: Record<string, number>, units: Unit[]) {
  for (const { slug } of units) into[slug] = (into[slug] ?? 0) + 1;
}

/**
 * Reads the truth from Stripe: every unit in a completed session is sold, every unit in a
 * still-open session is reserved. Edition sizes live in the product data, so no database.
 */
export async function readInventory(): Promise<Inventory> {
  const now = Date.now();
  const sold: Record<string, number> = {};
  const reserved: Record<string, number> = {};
  count(sold, site.soldOffline.map((slug) => ({ slug, size: "" })));

  const stripe = getStripe();
  if (!stripe) return { sold, reserved, now };

  const since = Math.floor(now / 1000) - site.reservationMinutes * 60;
  const completed = stripe.checkout.sessions.list({ status: "complete", limit: 100 });
  for await (const s of completed) count(sold, unitsFromSession(s));

  const open = stripe.checkout.sessions.list({ status: "open", limit: 100, created: { gte: since } });
  for await (const s of open) count(reserved, unitsFromSession(s));

  return { sold, reserved, now };
}

/** Cached for pages. The Stripe webhook clears it the moment a sale completes or a hold lapses. */
export async function getInventory(): Promise<Inventory> {
  "use cache";
  cacheTag(INVENTORY_TAG);
  cacheLife("minutes");
  return readInventory();
}
