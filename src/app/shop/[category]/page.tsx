import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/site";
import { productsInCategory } from "@/data/products";
import { getInventory } from "@/lib/inventory";
import { currentDrop, formatDropDate, listableProducts, nextDrop, windowLabel } from "@/lib/editions";
import { PageIntro } from "@/components/PageIntro";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductGrid } from "@/components/ProductGrid";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  const inventory = await getInventory();
  const items = listableProducts(inventory, productsInCategory(cat.slug));
  const drop = currentDrop(inventory.now);
  const next = nextDrop(inventory.now);

  return (
    <>
      <PageIntro variant="listing" eyebrow={drop ? `${drop.name} · ${windowLabel(drop, inventory.now)}` : "Between drops"} title={cat.name} lede={cat.description} />
      <section className="container-x pb-10">
        {items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">
            Every design in this family has closed or found its owners.{next ? ` ${next.name} opens ${formatDropDate(next.opens)}.` : " New designs are coming."}
          </p>
        ) : (
          <Suspense fallback={<ProductGrid products={items} inventory={inventory} />}>
            <ShopGrid products={items} inventory={inventory} fixedCategory={cat.slug} />
          </Suspense>
        )}
      </section>
    </>
  );
}
