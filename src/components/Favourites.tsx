import Link from "next/link";
import { siblingsOf, type Product } from "@/data/products";
import { availabilityOf, type Inventory } from "@/lib/editions";
import { ProductCard } from "./ProductCard";
import { ArrowIcon } from "./Icons";

/** "Our favourites": a hand-picked grid of product cards, two across on phones, four on desktop. */
export function Favourites({ products, inventory }: { products: Product[]; inventory?: Inventory }) {
  if (products.length === 0) return null;
  return (
    <section id="favourites" className="container-x py-12 md:py-16">
      <h2 className="headline mb-6 text-center text-3xl uppercase tracking-[0.04em] md:mb-8 md:text-5xl">Our favourites</h2>
      <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 md:gap-x-2 md:gap-y-12 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} siblings={siblingsOf(p)} availability={inventory ? availabilityOf(p, inventory) : undefined} />
        ))}
      </div>
      <div className="mt-8 text-center md:mt-10">
        <Link href="/shop" className="eyebrow !text-ink link-underline inline-flex items-center gap-2">
          View all
          <ArrowIcon width={14} height={14} />
        </Link>
      </div>
    </section>
  );
}
