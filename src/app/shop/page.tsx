import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/site";
import { getProduct, interleaveFamilies, products, siblingsOf, type Product } from "@/data/products";
import { favouriteSlugs } from "@/data/favourites";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CampaignBlock } from "@/components/CampaignBlock";
import { LabelTile } from "@/components/LabelTile";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Shop",
  description: "Every Vis Naturæ piece is made to order in Mauritius, in your size. Swim, hoodies and knitwear, linen shirts, chinos, linen trousers, caps and socks.",
};

/** Shop landing, modelled on Kith's "Shop Mens": split hero with picks, category tiles, campaigns. */
export default function ShopLandingPage() {
  const picks = favouriteSlugs.map(getProduct).filter((p): p is Product => Boolean(p)).slice(0, 9);

  return (
    <>
      <h1 className="sr-only">Shop</h1>

      {/* 1. Split hero: one big image, held in view while the picks scroll beside it */}
      <section className="grid gap-1.5 md:grid-cols-2 md:gap-2">
        <Link href="/shop/all" className="group relative block aspect-[4/5] overflow-hidden bg-paper-2 md:sticky md:top-[73px] md:aspect-auto md:h-[calc(100svh-73px)] md:min-h-[600px] md:self-start">
          <Image src="/community/p12.jpg?v=2" alt="A climber in a clementine linen shirt at the foot of a sea cliff" fill unoptimized preload sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]" />
        </Link>
        <div className="px-4 py-8 md:px-8 md:py-10 xl:px-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="display text-4xl md:text-5xl">Collection I</h2>
              <p className="eyebrow mt-3">Made to order in Mauritius</p>
            </div>
            <Link href="/shop/all" className="eyebrow !text-ink link-underline inline-flex items-center gap-2">
              Shop all
              <ArrowIcon width={14} height={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 lg:grid-cols-3 md:gap-x-2 max-lg:[&>*:nth-child(9)]:hidden">
            {picks.map((p, i) => (
              <ProductCard key={p.slug} product={p} siblings={siblingsOf(p)} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Category tiles with the label on the picture */}
      <section className="grid grid-cols-2 gap-1.5 pt-1.5 md:grid-cols-3 md:gap-2 md:pt-2 lg:grid-cols-6 [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1">
        {categories.map((c) => (
          <LabelTile key={c.slug} href={`/shop/${c.slug}`} image={c.scene} label={c.name} />
        ))}
      </section>

      {/* 3. Campaign, then every piece */}
      <div className="pt-1.5 md:pt-2">
        <CampaignBlock
          image="/images/campaign-atelier.jpg?v=2"
          alt="A seamstress stitching red linen in the Port Louis workshop"
          title="Made in Mauritius"
          text="Nothing is cut until you order it. Then your piece is cut and sewn by hand, in your size."
          primary={{ label: "Shop all", href: "/shop/all" }}
          secondary={{ label: "A closer look", href: "/made-to-order" }}
        />
      </div>
      <div className="container-x py-10 md:py-12">
        <ProductCarousel variant="kith" title="All pieces" products={interleaveFamilies(products)} link={{ label: "Shop all", href: "/shop/all" }} />
      </div>

      {/* 4. Half-width pair */}
      <section className="grid gap-1.5 md:grid-cols-2 md:gap-2">
        <LabelTile href="/shop/swim" image="/community/p6.jpg?v=2" label="Swim" cta="Shop now" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
        <LabelTile href="/shop/shirts-trousers" image="/community/p5.jpg?v=2" label="Linen" cta="Shop now" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
      </section>

    </>
  );
}
