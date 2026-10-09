import { drops, site } from "@/data/site";
import { editionTotal, isOneOfOne, products, type Product } from "@/data/products";
import { leadTimeLabel } from "@/lib/format";

/** Pure edition logic shared by server and client code. Stripe reads live in inventory.ts. */

export type Drop = (typeof drops)[number];

export type Inventory = {
  /** Units paid for, per design slug (completed Checkout sessions plus the offline list). */
  sold: Record<string, number>;
  /** Units currently held by open Checkout sessions, per design slug. */
  reserved: Record<string, number>;
  /** Epoch ms when this snapshot was read. Window states are judged against it, never against Date.now() in a render. */
  now: number;
};

export const EMPTY_INVENTORY: Inventory = { sold: {}, reserved: {}, now: 0 };

export type WindowState = "upcoming" | "open" | "closed";

export type AvailabilityState =
  /** The drop has not opened yet. */
  | "upcoming"
  /** At least one unit can be claimed right now. */
  | "available"
  /** Every remaining unit is at checkout with someone; it may free up. */
  | "reserved"
  /** Every unit is paid for: a sold one-of-one or a sold-out edition. */
  | "sold"
  /** The order window passed with units unclaimed. The edition is made at the units sold and retired. */
  | "closed";

export type Availability = {
  state: AvailabilityState;
  total: number;
  sold: number;
  /** Units not yet paid for. */
  remaining: number;
  /** Units not paid for and not held at checkout. */
  free: number;
};

export function dropOf(p: Product): Drop {
  return drops.find((d) => d.number === p.drop) ?? drops[0];
}

const dayStart = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const dayEnd = (iso: string) => Date.parse(`${iso}T23:59:59.999Z`);

export function windowState(drop: Drop, now: number): WindowState {
  if (now < dayStart(drop.opens)) return "upcoming";
  if (now > dayEnd(drop.closes)) return "closed";
  return "open";
}

export function daysUntilClose(drop: Drop, now: number): number {
  return Math.max(0, Math.ceil((dayEnd(drop.closes) - now) / 86_400_000));
}

export function currentDrop(now: number): Drop | undefined {
  return drops.find((d) => windowState(d, now) === "open");
}

export function nextDrop(now: number): Drop | undefined {
  return drops.find((d) => windowState(d, now) === "upcoming");
}

export function availabilityOf(p: Product, inv: Inventory): Availability {
  const total = editionTotal(p);
  const sold = inv.sold[p.slug] ?? 0;
  const reserved = inv.reserved[p.slug] ?? 0;
  const remaining = Math.max(0, total - sold);
  const free = Math.max(0, remaining - reserved);
  const window = windowState(dropOf(p), inv.now);

  let state: AvailabilityState;
  if (window === "upcoming") state = "upcoming";
  else if (remaining === 0) state = "sold";
  else if (window === "closed" && !isOneOfOne(p)) state = "closed";
  else if (free === 0) state = "reserved";
  else state = "available";

  return { state, total, sold, remaining, free };
}

/** Can be claimed, or could be if a checkout lapses. */
export function isListable(a: Availability): boolean {
  return a.state === "available" || a.state === "reserved";
}

/** Finished: sold out, or the window closed. Lives in the archive. */
export function isArchived(a: Availability): boolean {
  return a.state === "sold" || a.state === "closed";
}

export function listableProducts(inv: Inventory, list: Product[] = products): Product[] {
  return list.filter((p) => isListable(availabilityOf(p, inv)));
}

export function archivedProducts(inv: Inventory, list: Product[] = products): Product[] {
  return list.filter((p) => isArchived(availabilityOf(p, inv))).sort((a, b) => a.number - b.number);
}

export function upcomingProducts(inv: Inventory, list: Product[] = products): Product[] {
  return list.filter((p) => availabilityOf(p, inv).state === "upcoming").sort((a, b) => a.number - b.number);
}

/** Drop pages and product pages exist once the drop has opened. */
export function isReleased(p: Product, now: number): boolean {
  return windowState(dropOf(p), now) !== "upcoming";
}

/** "29 October" */
export function formatDropDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(dayStart(iso)));
}

/** "Orders close 29 October" / "Orders close in 3 days" / "Opens 1 December" / "Closed 29 October" */
export function windowLabel(drop: Drop, now: number): string {
  const state = windowState(drop, now);
  if (state === "upcoming") return `Opens ${formatDropDate(drop.opens)}`;
  if (state === "closed") return `Closed ${formatDropDate(drop.closes)}`;
  const days = daysUntilClose(drop, now);
  if (days <= 1) return "Orders close today";
  if (days <= 7) return `Orders close in ${days} days`;
  return `Orders close ${formatDropDate(drop.closes)}`;
}

/** When the buyer gets it. */
export function dispatchLabel(p: Product): string {
  if (isOneOfOne(p)) return `Already made. Ships within ${site.oneOfOneDispatchDays} working days.`;
  return `Made after orders close on ${formatDropDate(dropOf(p).closes)}. Ships ${leadTimeLabel()} later.`;
}

/** "3 of 12 remaining" / "Last one" / "Sold out" / "One of one" */
export function remainingLabel(p: Product, a: Availability): string {
  if (isOneOfOne(p)) return a.state === "sold" ? "Sold" : "One of one";
  if (a.state === "sold") return "Sold out";
  if (a.state === "closed") return `Closed at ${a.sold} of ${a.total}`;
  if (a.remaining === 1) return `Last of ${a.total}`;
  return `${a.remaining} of ${a.total} remaining`;
}
