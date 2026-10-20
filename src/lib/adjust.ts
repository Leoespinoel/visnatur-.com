import { canMadeToOrder, type Garment, type Product } from "@/data/products";

/**
 * Made to order (Leo, 2026-10-20): a Signature piece adjusted to fit, for a flat surcharge per piece. These are the
 * adjustments a buyer can set on the product page; they travel with the bag line to checkout and onto the Shopify order.
 * Shared by the client (product page, bag) and the checkout route, which re-validates them.
 */
export type Fit = "as-cut" | "slimmer" | "relaxed";

export type Adjustments = {
  /** Sleeve length, cm shorter (−) or longer (+). */
  sleeve?: number;
  /** Body length of a top, or leg length of shorts, cm shorter (−) or longer (+). */
  length?: number;
  /** Trouser inseam, cm. */
  inseam?: number;
  /** Waist taken in (−) or let out (+), cm. */
  waist?: number;
  fit?: Fit;
  note?: string;
};

export type AdjustField = "sleeve" | "length" | "inseam" | "waist" | "fit";

export const RANGES = {
  sleeve: { min: -4, max: 4 },
  length: { min: -4, max: 4 },
  waist: { min: -2, max: 2 },
  inseam: { min: 66, max: 92 },
} as const;

export const FIT_LABELS: Record<Fit, string> = { "as-cut": "As cut", slimmer: "Slimmer", relaxed: "More relaxed" };

export const NOTE_MAX = 200;

const TOPS: Garment[] = ["shirt", "overshirt", "polo", "tee", "rugby", "knit", "hoodie", "jacket", "rashguard"];

/** The adjustments a garment allows; empty for pieces that can't be made to order (caps, socks, swimsuits…). */
export function adjustFields(garment: Garment): AdjustField[] {
  if (TOPS.includes(garment)) return ["sleeve", "length", "fit"];
  if (garment === "trouser") return ["inseam", "waist", "fit"];
  if (garment === "short" || garment === "swim-short") return ["length", "waist", "fit"];
  return [];
}

/** Made to order is offered on Signature pieces whose garment has adjustments. */
export function offersMadeToOrder(p: Product): boolean {
  return canMadeToOrder(p) && adjustFields(p.garment).length > 0;
}

/** Keeps only the allowed, in-range values; null when nothing valid is left or something is out of range. */
export function cleanAdjustments(garment: Garment, raw: unknown): Adjustments | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const fields = adjustFields(garment);
  const out: Adjustments = {};
  for (const f of ["sleeve", "length", "waist", "inseam"] as const) {
    if (r[f] === undefined || r[f] === null || r[f] === "") continue;
    const n = Number(r[f]);
    const range = RANGES[f];
    if (!fields.includes(f) || !Number.isInteger(n) || n < range.min || n > range.max) return null;
    if (f !== "inseam" && n === 0) continue;
    out[f] = n;
  }
  if (r.fit !== undefined && r.fit !== "as-cut") {
    if (!fields.includes("fit") || (r.fit !== "slimmer" && r.fit !== "relaxed")) return null;
    out.fit = r.fit;
  }
  if (typeof r.note === "string" && r.note.trim()) out.note = r.note.trim().slice(0, NOTE_MAX);
  return Object.keys(out).length ? out : null;
}

const cm = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)} cm`;

/** "Sleeve +2 cm · Length −1 cm · Inseam 81 cm · Slimmer fit · Note: …" */
export function adjustSummary(a: Adjustments): string {
  const parts: string[] = [];
  if (a.sleeve) parts.push(`Sleeve ${cm(a.sleeve)}`);
  if (a.length) parts.push(`Length ${cm(a.length)}`);
  if (a.inseam) parts.push(`Inseam ${a.inseam} cm`);
  if (a.waist) parts.push(`Waist ${cm(a.waist)}`);
  if (a.fit && a.fit !== "as-cut") parts.push(`${FIT_LABELS[a.fit]} fit`);
  if (a.note) parts.push(`Note: ${a.note}`);
  return parts.join(" · ");
}

/** A stable key for an adjusted line, so the same design and size can sit in the bag plain and adjusted. */
export function adjustKey(a: Adjustments | undefined): string {
  if (!a) return "";
  return JSON.stringify([a.sleeve ?? 0, a.length ?? 0, a.inseam ?? 0, a.waist ?? 0, a.fit ?? "as-cut", a.note ?? ""]);
}
