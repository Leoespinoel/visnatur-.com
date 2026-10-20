import { products, type Product } from "./products";

/**
 * Collections, first called drops (Leo, 2026-10-20): limited units, released on a date, then gone. Internally still "drops". A piece joins a drop with
 * `line: "drop"` and `drop: <id>` in products.ts. The list stays empty until the first drop's designs are set;
 * /collections shows an empty state until then.
 */
export type Drop = {
  /** Stable id used by products, e.g. "drop-01". */
  id: string;
  number: number;
  /** e.g. "Collection 01". */
  name: string;
  /** Release day, ISO date (UTC), e.g. "2026-12-04". */
  date: string;
  /** How many pieces are made in all, across its designs and sizes. */
  units: number;
  image?: string;
  alt?: string;
  dek?: string;
};

export const drops: Drop[] = [];

const today = () => new Date().toISOString().slice(0, 10);

export function getDrop(id: string | undefined): Drop | undefined {
  return id ? drops.find((d) => d.id === id) : undefined;
}

/** Released drops, newest first. */
export function releasedDrops(): Drop[] {
  return drops.filter((d) => d.date <= today()).sort((a, b) => b.date.localeCompare(a.date));
}

/** Drops announced but not out yet, soonest first. */
export function upcomingDrops(): Drop[] {
  return drops.filter((d) => d.date > today()).sort((a, b) => a.date.localeCompare(b.date));
}

/** The latest released drop. */
export function currentDrop(): Drop | undefined {
  return releasedDrops()[0];
}

export function piecesInDrop(d: Drop): Product[] {
  return products.filter((p) => p.drop === d.id);
}

/** "4 December 2026". */
export function formatDropDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
