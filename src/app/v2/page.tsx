import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { productImages, products } from "@/data/products";
import { partners, site } from "@/data/site";
import { actionFilm, freshSlugs, hero, onNowFamily, piecesOf, v2Href } from "@/data/v2";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { LookCollage } from "@/components/v2/LookCollage";
import { LoopVideo } from "@/components/v2/LoopVideo";
import { V2Newsletter } from "@/components/v2/Newsletter";
import { V2Rail } from "@/components/v2/Rail";
import { SectionIndex } from "@/components/v2/SectionIndex";
import { Sticker } from "@/components/v2/Sticker";
import { V2Ticker } from "@/components/v2/Ticker";

export const metadata: Metadata = {
  title: { absolute: "Vis Naturæ — Made when you order it" },
  description: site.description,
};

/** A band's big heading with an optional link on the right. */
function BandHead({ title, link, className = "" }: { title: React.ReactNode; link?: { label: string; href: string; light?: boolean }; className?: string }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 px-4 pb-6 pt-14 md:px-6 md:pt-20 ${className}`}>
      <h2 className="v2-display text-[18vw] md:text-[10vw] xl:text-[9rem]">{title}</h2>
      {link && (
        <Link href={link.href} className={`v2-btn ${link.light ? "v2-btn-light" : "v2-btn-outline"}`}>
          {link.label}
        </Link>
      )}
    </div>
  );
}

export default function V2Home() {
  const caps = products.filter((p) => p.family === onNowFamily);
  const cap = caps[0];
  const fresh = piecesOf(freshSlugs);

  return (
    <>
      {/* 1. Hero: one flash-lit picture, the line as big as it goes, stickers */}
      <section className="v2-grain v2-grain-light relative h-[calc(100svh-5.75rem)] min-h-[34rem] overflow-hidden bg-ink text-white md:h-[calc(100svh-6.25rem)]">
        <Image src={hero.image} alt={hero.alt} fill priority unoptimized sizes="100vw" className="object-cover" style={{ objectPosition: hero.position }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <Image src="/brand/badger-mark.png" alt="" width={852} height={300} priority className="v2-cutout absolute right-4 top-20 w-28 rotate-[8deg] md:right-10 md:top-10 md:w-56" />
        <Sticker tone="red" tilt={-7} className="absolute left-4 top-6 text-[0.75rem] md:left-6 md:top-10 md:text-[0.9rem]">
          Made when you order it
        </Sticker>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 md:px-6 md:pb-8">
          <h1 className="v2-display text-[21vw] md:text-[15vw] xl:text-[13.5rem]">
            Nothing on
            <br />
            the shelf.
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href={v2Href.shop} className="v2-btn v2-btn-light">
              Shop everything
            </Link>
            <Link href={v2Href.lookbook} className="v2-btn v2-btn-outline !border-white !text-white hover:!border-red">
              Lookbook
            </Link>
            <span className="v2-mono ml-auto hidden max-w-xs text-right text-white/80 md:block">
              Hoodies, tees, caps, rugby shirts. Cut and sewn in Mauritius in your size. {pledgePercentLabel()} of every order to the wild.
            </span>
          </div>
        </div>
      </section>

      {/* 2. The piece you can order today */}
      {cap && (
        <section className="bg-red text-white">
          <div className="grid lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-8 px-4 py-12 md:px-6 md:py-16 lg:col-span-5">
              <div>
                <p className="v2-mono">On now · Order today</p>
                <h2 className="v2-display mt-4 text-[24vw] md:text-[14vw] lg:text-[9.5rem]">
                  The
                  <br />
                  cap.
                </h2>
                <p className="mt-6 max-w-sm text-base leading-relaxed">
                  The {cap.name}. {caps.length} colourways, {formatPrice(cap.price)}. Six panels of washed organic cotton, our name in script across the
                  front. Made when you order it, with you in {leadTimeLabel()}.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={v2Href.product(cap.slug)} className="v2-btn v2-btn-light">
                  Get the cap · {formatPrice(cap.price)}
                </Link>
                <Link href={v2Href.section("caps")} className="v2-btn v2-btn-outline !border-white !text-white">
                  All caps
                </Link>
              </div>
            </div>
            <ul className="grid grid-cols-3 border-t-[1.5px] border-ink lg:col-span-7 lg:border-l-[1.5px] lg:border-t-0">
              {caps.map((c) => (
                <li key={c.slug} className="border-b-[1.5px] border-r-[1.5px] border-ink bg-white last:border-r-0 [&:nth-child(3n)]:border-r-0">
                  <Link href={v2Href.product(c.slug)} className="group relative block aspect-square overflow-hidden" aria-label={`${c.name}, ${c.colour.name}`}>
                    <Image src={productImages(c)[0]} alt="" fill unoptimized sizes="(min-width: 1024px) 19vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="v2-mono absolute bottom-1.5 left-2 text-ink opacity-0 transition-opacity group-hover:opacity-100">{c.colour.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 3. Every section as a giant index */}
      <section>
        <BandHead title="The goods" link={{ label: "Shop everything", href: v2Href.shop }} />
        <SectionIndex />
      </section>

      {/* 4. Lookbook collage */}
      <section className="bg-ink pb-4 text-paper md:pb-6">
        <BandHead title="Lookbook" link={{ label: "See it all", href: v2Href.lookbook, light: true }} />
        <div className="px-2 md:px-3">
          <LookCollage />
        </div>
      </section>

      {/* 5. Fresh: one colourway per design, street staples */}
      <section className="pb-14">
        <BandHead title="Fresh" link={{ label: "Shop everything", href: v2Href.shop }} />
        <V2Rail products={fresh} />
      </section>

      {/* 6. How it works, as a statement */}
      <section className="relative overflow-hidden border-t-[1.5px] border-ink px-4 py-16 md:px-6 md:py-24">
        <p className="v2-display text-[15vw] md:text-[9.5vw] xl:text-[8.5rem]">
          We cut it
          <br />
          <span className="text-red">when you</span>
          <br />
          order it.
        </p>
        <Sticker tone="black" tilt={9} round className="absolute right-6 top-10 w-28 text-[0.7rem] md:right-16 md:top-16 md:w-40 md:text-[0.95rem]">
          Zero stock
        </Sticker>
        <ol className="mt-12 grid border-l-[1.5px] border-t-[1.5px] border-ink md:grid-cols-3">
          {[
            ["01", "You order", "Pick the piece, the colour and your size."],
            ["02", "We make it", "Cut and sewn by hand in a small workshop in Mauritius."],
            ["03", "It ships", `Express to your door, ${leadTimeLabel()} after you order. Free repairs for life.`],
          ].map(([n, t, d]) => (
            <li key={n} className="border-b-[1.5px] border-r-[1.5px] border-ink bg-white p-5 md:p-6">
              <span className="v2-mono text-red">{n}</span>
              <p className="v2-wide mt-3 text-[1.1rem]">{t}</p>
              <p className="mt-2 text-sm text-ink-2">{d}</p>
            </li>
          ))}
        </ol>
        <Link href="/made-to-order" className="v2-mono mt-6 inline-block underline underline-offset-4 hover:text-red">
          How made to order works →
        </Link>
      </section>

      {/* 7. The action film, the grind */}
      <section className="v2-grain v2-grain-light relative h-[80svh] min-h-[28rem] overflow-hidden bg-ink text-white">
        <LoopVideo src={actionFilm.src} poster={actionFilm.poster} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-6 md:pb-10">
          <p className="v2-display text-[22vw] md:text-[16vw] xl:text-[14rem]">The grind.</p>
          <p className="v2-wide mt-2 text-[1rem] md:text-[1.4rem]">Then the calm.</p>
        </div>
        <V2Ticker tone="red" reverse lines={["Rugby", "Skate", "Surf", "Snowboard", "Climb", "Ride", "Run", "Kite"]} className="absolute inset-x-0 top-0" />
      </section>

      {/* 8. Where the 10% goes */}
      <section className="bg-red text-white">
        <BandHead title={`${pledgePercentLabel()} to the wild`} link={{ label: "Where it goes", href: "/conservation", light: true }} />
        <p className="max-w-2xl px-4 text-base leading-relaxed md:px-6 md:text-lg">
          {pledgePercentLabel()} of the price of every piece, not the profit, goes to conservation around Mauritius: reefs, native forest and mangrove
          coast. Small places where a little money goes a long way.
        </p>
        <ul className="mt-10 grid border-t-[1.5px] border-ink md:grid-cols-3">
          {partners.map((p) => (
            <li key={p.name} className="border-b-[1.5px] border-ink bg-ink p-5 text-paper md:border-b-0 md:border-r-[1.5px] md:p-6 md:last:border-r-0">
              <p className="v2-display text-[5rem] text-red">{p.leverage.figure}</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/85">{p.leverage.text}</p>
              <a href={p.leverage.source.url} target="_blank" rel="noopener noreferrer" className="v2-mono mt-4 inline-block text-paper/60 underline underline-offset-4 hover:text-paper">
                Source: {p.leverage.source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 9. Newsletter */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <h2 className="v2-display text-[17vw] md:text-[10vw] xl:text-[9rem]">Get on the list.</h2>
        <p className="mt-4 max-w-md text-sm text-ink-2 md:text-base">New pieces the day they go on sale, the films, and where the money went. No spam, not often.</p>
        <div className="mt-8">
          <V2Newsletter />
        </div>
      </section>
    </>
  );
}
