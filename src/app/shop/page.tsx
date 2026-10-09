import type { Metadata } from "next";
import { Suspense } from "react";
import { getInventory } from "@/lib/inventory";
import { currentDrop, formatDropDate, listableProducts, nextDrop, upcomingProducts, windowLabel } from "@/lib/editions";
import { editionWord } from "@/lib/format";
import { site } from "@/data/site";
import { PageIntro } from "@/components/PageIntro";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Available pieces",
  description: "Every Vis Naturæ design is released once, in a numbered edition made to order. Swim, polos, knitwear, shirts, trousers, outerwear and accessories.",
};

export default async function ShopPage() {
  const inventory = await getInventory();
  const items = listableProducts(inventory);
  const drop = currentDrop(inventory.now);
  const next = nextDrop(inventory.now);
  const upcoming = next ? upcomingProducts(inventory) : [];

  return (
    <>
      <PageIntro variant="listing"
        eyebrow={drop ? `${drop.name} · ${windowLabel(drop, inventory.now)}` : "Between drops"}
        title="Available pieces"
        lede={`Every design here is released once, in a numbered edition of ${editionWord(site.editionSize.core)}. Claim a number before orders close, we make it in your size, and the design leaves the site for good. Outerwear is one of one.`}
      />
      <section className="container-x pb-10">
        {items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">
            Every design in this drop has closed or found its owners.{next ? ` ${next.name} opens ${formatDropDate(next.opens)}.` : " New designs are coming."}
          </p>
        ) : (
          <Suspense fallback={<ProductGrid products={items} inventory={inventory} />}>
            <ShopGrid products={items} inventory={inventory} />
          </Suspense>
        )}
      </section>
      {next && upcoming.length > 0 && (
        <section className="container-x border-t border-line py-12">
          <p className="eyebrow mb-3">
            {next.name} · Opens {formatDropDate(next.opens)}
          </p>
          <p className="max-w-2xl font-serif text-2xl leading-snug md:text-3xl">
            {upcoming.map((p) => p.name).join(", ")}.
          </p>
          <p className="mt-3 max-w-md text-sm text-ink-2">Orders open {formatDropDate(next.opens)} and close {formatDropDate(next.closes)}. Join the list below to hear first.</p>
        </section>
      )}
    </>
  );
}
