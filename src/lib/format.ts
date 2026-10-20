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

/** Signature and collection pieces: how soon an order leaves Mauritius, e.g. "1–2 working days". */
export function dispatchLabel(): string {
  const d = site.delivery.dispatchDays;
  return `${d.min}–${d.max} working days`;
}

/** Express from Mauritius to Europe, e.g. "4–7 working days". */
export function transitLabel(): string {
  const d = site.delivery.transitDays;
  return `${d.min}–${d.max} working days`;
}

/** Made to order (a Signature piece adjusted to fit): making time from the order, e.g. "3–4 weeks". */
export function madeToOrderLabel(): string {
  const m = site.delivery.madeToOrder;
  return `${m.minWeeks}–${m.maxWeeks} weeks`;
}
