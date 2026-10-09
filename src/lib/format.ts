import { site } from "@/data/site";

const eur = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Format euro cents as a price string. Whole euros drop the decimals (€165), partial keep them (€16.50). */
export function formatPrice(cents: number): string {
  const hasCents = cents % 100 !== 0;
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatPriceExact(cents: number): string {
  return eur.format(cents / 100);
}

export function leadTimeLabel(): string {
  return `${site.leadTime.minWeeks}–${site.leadTime.maxWeeks} weeks`;
}

/** "twelve" for the default edition size, used in prose. Falls back to digits for odd sizes. */
export function editionWord(n: number): string {
  const words: Record<number, string> = { 1: "one", 6: "six", 8: "eight", 10: "ten", 12: "twelve", 20: "twenty", 24: "twenty-four", 25: "twenty-five", 30: "thirty", 50: "fifty" };
  return words[n] ?? String(n);
}
