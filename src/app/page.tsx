import Image from "next/image";
import Link from "next/link";
import { categories, site } from "@/data/site";
import { featuredProducts, productImages } from "@/data/products";
import { getInventory } from "@/lib/inventory";
import { listableProducts } from "@/lib/editions";
import { editionWord, formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Carousel } from "@/components/Carousel";
import { FilmBlock } from "@/components/FilmBlock";
import { Newsletter } from "@/components/Newsletter";
import { HeroFilm } from "@/components/HeroFilm";
import { CommunityCard } from "@/components/CommunityCard";
import { communityPosts } from "@/data/community";
import { atelierFilm } from "@/data/film";

/** Three ways we work, shown as the "services" row. */
const services = [
  {
    title: "Made to order",
    text: `Nothing is cut until you claim a number. Each edition is made as one batch in Mauritius, ${leadTimeLabel()} after orders close.`,
    image: "/images/journal-1.svg",
    href: "/made-to-order",
    link: "Discover",
  },
  {
    title: "The pledge",
    text: `${pledgePercentLabel()} of the price of every piece, not the profit, goes to organisations protecting oceans, forests and rivers.`,
    image: "/images/conservation.svg",
    href: "/conservation",
    link: "Where it goes",
  },
  {
    title: "The archive",
    text: "Every design we have ever released, with the number of pieces that exist. Once a design closes, it stays closed.",
    image: "/images/journal-3.svg",
    href: "/archive",
    link: "Browse",
  },
];

export default async function HomePage() {
  const inventory = await getInventory();
  const featured = listableProducts(inventory, featuredProducts(12)).slice(0, 8);
  const spotlight = featured.find((p) => p.badge === "Signature") ?? featured[0];
  const spotlightCategory = spotlight ? categories.find((c) => c.slug === spotlight.category) : undefined;

  return (
    <>
      {/* Hero: the film. Whole thing is one link, chrome floats over it. */}
      <HeroFilm />
      <h1 className="sr-only">
        {site.name}. {site.tagline}
      </h1>

      {/* 1. The new collection: four-up carousel of studio tiles */}
      <section id="new-collection" className="container-x py-12 md:py-16">
        <ProductCarousel title="The new collection" products={featured} priorityCount={4} inventory={inventory} link={{ label: "All available pieces", href: "/shop" }} />
      </section>

      {/* 2. Statement: image left, three-line headline right */}
      <section className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[640px]">
          <Image src="/images/hero.svg" alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center md:px-12 md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">Nothing is made until you ask for it.</p>
          <h2 className="headline mt-8 text-6xl md:text-8xl">
            <span className="block text-ink">Once.</span>
            <span className="block text-red">Twelve.</span>
            <span className="block text-muted">Gone.</span>
          </h2>
          <p className="mt-8 max-w-xs text-sm leading-relaxed text-ink-2">
            Every design is released once, in a numbered edition of {editionWord(site.editionSize.core)}, made in Mauritius for the people who asked for it. Then it is retired for good.
          </p>
          <Link href="/shop" className="btn btn-outline mt-8 min-w-[240px]">
            Discover
          </Link>
        </div>
      </section>

      {/* 3. The universe: half-width family tiles in a carousel */}
      <section className="pt-1.5 md:pt-2">
        <Carousel ariaLabel="Families" itemClassName="w-[88%] md:w-[calc((100%-0.5rem)/2.15)]">
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="group relative block" aria-label={c.name}>
              <div className="image-frame aspect-[4/5] md:aspect-[6/7]">
                <Image src={c.image} alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap bg-paper px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                {c.name}
              </span>
            </Link>
          ))}
        </Carousel>
      </section>

      {/* 4. Editorial: big image left, two small images and a story right */}
      <section className="container-x grid gap-6 py-12 md:grid-cols-2 md:gap-8 md:py-16">
        <div className="image-frame aspect-[4/5]">
          <Image src="/images/about.svg" alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-between gap-10 md:pl-8">
          <div className="grid grid-cols-2 gap-2">
            <div className="image-frame aspect-square">
              <Image src="/images/journal-2.svg" alt="" fill unoptimized sizes="25vw" className="object-cover" />
            </div>
            <div className="image-frame aspect-square">
              <Image src="/images/journal-1.svg" alt="" fill unoptimized sizes="25vw" className="object-cover" />
            </div>
          </div>
          <div>
            <h2 className="headline text-3xl md:text-4xl">Made to order.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
              Claim a number, choose your size, and when the window closes the whole edition is cut and sewn together in a small workshop in Mauritius. {leadTimeLabel()} later it is at your door, with details inside that no photograph shows.
            </p>
            <Link href="/made-to-order" className="mt-5 inline-block text-sm font-medium text-ink underline underline-offset-4 hover:text-red">
              Discover now
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Product spotlight: packshot left, scene right */}
      {spotlight && (
        <section className="grid md:grid-cols-2">
          <Link href={`/product/${spotlight.slug}`} className="group flex flex-col bg-paper-2">
            <div className="relative aspect-[4/5] md:flex-1">
              <Image src={productImages(spotlight)[0]} alt={spotlight.name} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <div className="px-6 py-10 text-center">
              <h2 className="headline text-2xl md:text-3xl">{spotlight.name}</h2>
              <p className="mt-2 text-sm text-ink-2">{formatPrice(spotlight.price)}</p>
              <span className="mt-4 inline-block text-sm font-medium underline underline-offset-4 group-hover:text-red">Discover</span>
            </div>
          </Link>
          <div className="relative aspect-[4/5] md:aspect-auto">
            <Image src={spotlightCategory?.image ?? "/images/hero.svg"} alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </section>
      )}

      {/* 6. The making-of, full width */}
      <div className="mt-1.5 md:mt-2">
        <FilmBlock {...atelierFilm} />
      </div>

      {/* 7. How we work: three tiles */}
      <section className="container-x py-16 md:py-24">
        <h2 className="headline mx-auto max-w-md text-center text-2xl md:text-3xl">
          <span className="block">{site.name}</span>
          <span className="block">How we work</span>
        </h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-3 md:gap-10">
          {services.map((s) => (
            <div key={s.title} className="text-center">
              <Link href={s.href} className="image-frame block aspect-[3/2]">
                <Image src={s.image} alt="" fill unoptimized sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
              </Link>
              <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em]">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-ink-2">{s.text}</p>
              <Link href={s.href} className="mt-3 inline-block text-xs font-medium underline underline-offset-4 hover:text-red">
                {s.link}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Brand story */}
      <section className="container-x pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="headline text-3xl md:text-5xl">Made once. Made to last.</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-2">
            <p>
              Vis Naturæ means <em>force of nature</em>. We make resort clothing the slow way: every design is released once, in a numbered edition of {editionWord(site.editionSize.core)}, and nothing is made until someone asks for it. No stock, no sales, no waste.
            </p>
            <p>
              Each piece is cut and sewn in Mauritius, in the owner&rsquo;s size, and finished with details inside the garment that the photographs never show. {pledgePercentLabel()} of the price of every piece goes to protecting the oceans, forests and rivers the clothes are made for.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Community: tall cards of people in the clothes, some playable */}
      <section className="pb-16 md:pb-24">
        <h2 className="headline mb-8 text-center text-2xl uppercase tracking-[0.08em] md:mb-10 md:text-3xl">Community</h2>
        <Carousel ariaLabel="Community" itemClassName="w-[62%] sm:w-[40%] md:w-[calc((100%-2rem)/4.3)] lg:w-[calc((100%-2.5rem)/5.3)]" gap="gap-1.5 md:gap-2">
          {communityPosts.map((post, i) => (
            <CommunityCard key={i} post={post} />
          ))}
        </Carousel>
      </section>

      <Newsletter />
    </>
  );
}
