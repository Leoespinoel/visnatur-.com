import { site } from "@/data/site";

/** Cents from a sale price that go to conservation. Rounded to the nearest cent. */
export function pledgeCents(priceCents: number): number {
  return Math.round(priceCents * site.pledgeRate);
}

export function pledgePercentLabel(): string {
  return `${Math.round(site.pledgeRate * 100)}%`;
}
