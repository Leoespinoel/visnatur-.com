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
