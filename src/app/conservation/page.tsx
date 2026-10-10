import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { partners, site } from "@/data/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { LeafIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Conservation",
  description: `${pledgePercentLabel()} of the price of every Vis Naturæ piece goes to conservation. Here is how it works and where it goes.`,
};

export default function ConservationPage() {
  const examples = [...products].sort((a, b) => a.price - b.price).filter((_, i, arr) => i === 0 || i === Math.floor(arr.length / 2) || i === arr.length - 1);

  return (
    <>
      <PageIntro
        eyebrow="The pledge"
        title={`${pledgePercentLabel()} of every sale goes to conservation.`}
        lede="Of the price, not the profit. It is calculated on every order before shipping and tax, shown on every product page, and reported every season."
      />

      <section className="container-x">
        <div className="image-frame aspect-[16/9] md:aspect-[21/9]">
          <Image src="/images/sea-cliff-wide.jpg?v=2" alt="A man in a black knitted gilet on a sea cliff above the Indian Ocean at golden hour" fill unoptimized priority sizes="100vw" className="object-cover" />
        </div>
      </section>

      {/* How it's calculated */}
      <section className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <p className="eyebrow mb-4">How it is calculated</p>
          <h2 className="display text-4xl md:text-5xl">Simple on purpose.</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-2">
            Percent-of-profit pledges are easy to make and hard to check. Ours is on the sale price, so you can do the sum yourself on
            every page. If a piece costs {formatPrice(16500)}, {formatPrice(pledgeCents(16500))} goes to conservation. Shipping and taxes are excluded.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ul className="divide-y divide-line border-y border-line">
            {examples.map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-4 py-4">
                <Link href={`/product/${p.slug}`} className="font-serif text-xl link-underline">
                  {p.name}
                </Link>
                <div className="text-right text-sm">
                  <p className="tabular-nums">{formatPrice(p.price)}</p>
                  <p className="text-red tabular-nums">{formatPrice(pledgeCents(p.price))} pledged</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Running total */}
      <section className="border-y border-line bg-red text-white">
        <div className="container-x grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="eyebrow !text-white/70 mb-4">Pledged to date</p>
            <p className="display text-6xl md:text-8xl tabular-nums">{formatPrice(site.pledgeRaisedCents)}</p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            {site.pledgeRaisedCents === 0
              ? "We count from the first order. This number updates as pieces are made and paid for, and we publish the transfers every season."
              : "Updated as pieces are made and paid for. We publish the transfers every season."}
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="container-x py-16 md:py-24">
        <SectionHeading eyebrow="Where it goes" title="Three places, chosen carefully." />
        <div className="grid gap-6 md:grid-cols-3">
          {partners.map((p) => (
            <div key={p.name} className="border border-line bg-surface p-6">
              <LeafIcon className="text-red" />
              <h3 className="mt-5 font-serif text-2xl">{p.name}</h3>
              <p className="mt-2 text-sm text-ink-2">{p.focus}</p>
              <p className="eyebrow mt-6">{p.status}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
          We are finalising partnerships with established, audited organisations in each area. Names and agreements will be published here
          before the first transfer is made.
        </p>
      </section>

      {/* Why: red like the homepage newsletter, flush against the trust row */}
      <section className="-mb-24 bg-red text-paper">
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4 text-paper/70">Why</p>
            <h2 className="display text-4xl md:text-5xl">Force of nature.</h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-paper/90 md:col-span-6 md:col-start-6 md:text-base">
            <p>
              Clothing made for the sea and the sun borrows everything from the places it is made and worn in. Ours is made on an island in the Indian Ocean. A swim short that never sees
              clean water is a strange object. We would rather make fewer pieces, make them properly, and put a fixed share of each one back into the
              coastlines and forests that make them worth wearing.
            </p>
            <p>
              Making to order is the other half of the same idea. There is no overstock to discount, no end-of-season landfill, and no pressure to
              sell what nobody asked for.
            </p>
            <Link href="/made-to-order" className="btn btn-light">
              How made to order works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
