import { site } from "@/data/site";

/** "1/5" (Leo, 2026-10-21: "replace the 20% with 1/5"): the fifth, the share of each year's profit after tax that goes to the wild (Leo, 2026-10-21). */
export function pledgePercentLabel(): string {
  return `1/${Math.round(1 / site.pledgeRate)}`;
}
