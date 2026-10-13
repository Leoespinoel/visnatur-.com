import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/site";
import { productsInCategory } from "@/data/products";
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
  const items = productsInCategory(cat.slug);

  return (
    <>
      <PageIntro variant="listing" eyebrow="Made to order" title={cat.name} lede={cat.description} />
      <section className="container-x pb-10">
        {items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">New designs are coming.</p>
        ) : (
          <Suspense fallback={<ProductGrid products={items} />}>
            <ShopGrid products={items} fixedCategory={cat.slug} />
          </Suspense>
        )}
      </section>
    </>
  );
}
