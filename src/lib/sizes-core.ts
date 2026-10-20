import type { Fit } from "./adjust";

/**
 * My sizes (Leo, 2026-10-20): the customer's own measurements and usual sizes, entered on /account/sizes. It lives in this
 * browser and, once the customer signs in, on their Shopify account too (src/lib/account-sync.tsx). It fills in a piece's size
 * and the Made to order fields, and goes with an order that has a made to order piece.
 */
export type MySizes = {
  /** cm */
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  /** Shoulder to wrist, cm. */
  sleeve?: number;
  /** Usual size in tops, e.g. "M". */
  top?: string;
  /** Usual waist size in trousers and shorts, in inches, e.g. "32". */
  bottom?: string;
  fit?: Fit;
  note?: string;
  /** ISO date of the last save. */
  updated?: string;
};

export type MeasureField = "height" | "chest" | "waist" | "hips" | "inseam" | "sleeve";

/** Plausible ranges in cm; anything outside is dropped. */
export const MEASURE_RANGES: Record<MeasureField, { min: number; max: number; label: string; hint: string }> = {
  height: { min: 140, max: 215, label: "Height", hint: "Standing, without shoes" },
  chest: { min: 70, max: 150, label: "Chest", hint: "Round the fullest part, under the arms" },
  waist: { min: 55, max: 140, label: "Waist", hint: "Where trousers usually sit" },
  hips: { min: 70, max: 160, label: "Hips", hint: "Round the fullest part" },
  inseam: { min: 60, max: 100, label: "Inseam", hint: "Crotch to the floor, without shoes" },
  sleeve: { min: 50, max: 80, label: "Sleeve", hint: "Shoulder to wrist, arm relaxed" },
};

export const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const BOTTOM_SIZES = ["28", "30", "32", "34", "36", "38"];
export const SIZES_NOTE_MAX = 200;

/** Keeps only valid, in-range values. */
export function cleanSizes(raw: unknown): MySizes {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const out: MySizes = {};
  for (const f of Object.keys(MEASURE_RANGES) as MeasureField[]) {
    const n = Number(r[f]);
    if (r[f] !== undefined && r[f] !== "" && Number.isFinite(n) && n >= MEASURE_RANGES[f].min && n <= MEASURE_RANGES[f].max) out[f] = Math.round(n);
  }
  if (typeof r.top === "string" && TOP_SIZES.includes(r.top)) out.top = r.top;
  if (typeof r.bottom === "string" && BOTTOM_SIZES.includes(r.bottom)) out.bottom = r.bottom;
  if (r.fit === "slimmer" || r.fit === "relaxed" || r.fit === "as-cut") out.fit = r.fit;
  if (typeof r.note === "string" && r.note.trim()) out.note = r.note.trim().slice(0, SIZES_NOTE_MAX);
  if (typeof r.updated === "string") out.updated = r.updated;
  return out;
}

/** "Height 182 cm · Chest 98 cm · … · Usual M / 32 · Slimmer fit · Note: …" for the order. */
export function sizesSummary(s: MySizes): string {
  const parts: string[] = [];
  for (const f of Object.keys(MEASURE_RANGES) as MeasureField[]) if (s[f]) parts.push(`${MEASURE_RANGES[f].label} ${s[f]} cm`);
  if (s.top || s.bottom) parts.push(`Usual ${[s.top, s.bottom && `W${s.bottom}`].filter(Boolean).join(" / ")}`);
  if (s.fit && s.fit !== "as-cut") parts.push(s.fit === "slimmer" ? "Slimmer fit" : "More relaxed fit");
  if (s.note) parts.push(`Note: ${s.note}`);
  return parts.join(" · ");
}

export const hasSizes = (s: MySizes) => Object.keys(s).some((k) => k !== "updated");
