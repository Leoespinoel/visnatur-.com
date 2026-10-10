import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getInventory } from "@/lib/inventory";
import { availabilityOf, currentDrop, formatDropDate, listableProducts, nextDrop, upcomingProducts, windowLabel } from "@/lib/editions";
import { categories } from "@/data/site";
import { interleaveFamilies, products, siblingsOf } from "@/data/products";
import { favouriteSlugs } from "@/data/favourites";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CampaignBlock } from "@/components/CampaignBlock";
import { LabelTile } from "@/components/LabelTile";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Shop",
  description: "Every Vis Naturæ design is released once, in a numbered edition made to order in Mauritius. Swim, quarter zips, linen shirts and caps.",
};

/** Shop landing, modelled on Kith's "Shop Mens": split hero with picks, category tiles, campaigns. */
export default async function ShopLandingPage() {
  const inventory = await getInventory();
  const all = listableProducts(inventory);
  const drop = currentDrop(inventory.now);
  const next = nextDrop(inventory.now);
  const upcoming = next ? upcomingProducts(inventory) : [];
  const picks = listableProducts(
    inventory,
    favouriteSlugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is (typeof products)[number] => Boolean(p)),
  ).slice(0, 6);

  return (
    <>
      <h1 className="sr-only">Shop</h1>

      {/* 1. Split hero: one big image, the drop's picks beside it */}
      <section className="grid gap-1.5 md:grid-cols-2 md:gap-2">
        <Link href="/shop/all" className="group relative block aspect-[4/5] overflow-hidden bg-paper-2 md:aspect-auto md:min-h-[760px]">
          <Image src="/community/p12.jpg" alt="A man in a knitted shirt and pleated trousers on a sea cliff" fill unoptimized preload sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]" />
        </Link>
        <div className="px-4 py-8 md:px-8 md:py-10 xl:px-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="display text-4xl md:text-5xl">{drop ? drop.name : "Between drops"}</h2>
              {drop && <p className="eyebrow mt-3">{windowLabel(drop, inventory.now)}</p>}
            </div>
            <Link href="/shop/all" className="eyebrow !text-ink link-underline inline-flex items-center gap-2">
              Shop all
              <ArrowIcon width={14} height={14} />
            </Link>
          </div>
          {picks.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 lg:grid-cols-3 md:gap-x-2">
              {picks.map((p, i) => (
                <ProductCard key={p.slug} product={p} siblings={siblingsOf(p)} priority={i < 3} availability={availabilityOf(p, inventory)} />
              ))}
            </div>
          ) : (
            <p className="py-20 text-sm text-muted">Every design in this drop has closed or found its owners.{next ? ` ${next.name} opens ${formatDropDate(next.opens)}.` : " New designs are coming."}</p>
          )}
        </div>
      </section>

      {/* 2. Category tiles with the label on the picture */}
      <section className="grid grid-cols-2 gap-1.5 pt-1.5 md:grid-cols-4 md:gap-2 md:pt-2">
        {categories.map((c) => (
          <LabelTile key={c.slug} href={`/shop/${c.slug}`} image={c.scene} label={c.name} />
        ))}
      </section>

      {/* 3. Campaign, then every available piece */}
      <div className="pt-1.5 md:pt-2">
        <CampaignBlock
          image="/images/campaign-atelier.jpg"
          alt="Linen being stitched on a sewing machine"
          title="Made in Mauritius"
          text="Nothing is cut until you claim a number. When orders close, the whole edition is made as one batch, by hand."
          primary={{ label: "Shop all", href: "/shop/all" }}
          secondary={{ label: "A closer look", href: "/made-to-order" }}
        />
      </div>
      {all.length > 0 && (
        <div className="container-x py-10 md:py-12">
          <ProductCarousel variant="kith" title="Available pieces" products={interleaveFamilies(all)} inventory={inventory} link={{ label: "Shop all", href: "/shop/all" }} />
        </div>
      )}

      {/* 4. Half-width pair */}
      <section className="grid gap-1.5 md:grid-cols-2 md:gap-2">
        <LabelTile href="/shop/swim" image="/community/p6.jpg" label="Swim" cta="Shop now" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
        <LabelTile href="/shop/shirts-trousers" image="/community/p5.jpg" label="Linen Shirts" cta="Shop now" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
      </section>

      {/* 5. What comes next */}
      {next && upcoming.length > 0 && (
        <section className="container-x py-12 md:py-16">
          <p className="eyebrow mb-3">
            {next.name} · Opens {formatDropDate(next.opens)}
          </p>
          <p className="max-w-2xl font-serif text-2xl leading-snug md:text-3xl">{upcoming.map((p) => p.name).join(", ")}.</p>
          <p className="mt-3 max-w-md text-sm text-ink-2">Orders open {formatDropDate(next.opens)} and close {formatDropDate(next.closes)}. Join the list below to hear first.</p>
        </section>
      )}
    </>
  );
}
