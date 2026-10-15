import type { Metadata } from "next";
import Link from "next/link";
import { impact, partners, site } from "@/data/site";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { PageIntro } from "@/components/PageIntro";
import { RollingNumber } from "@/components/RollingNumber";
import { PartnerBand } from "@/components/PartnerBand";
import { ImpactCharts } from "@/components/ImpactCharts";
import { BadgerRows } from "@/components/BadgerRows";

export const metadata: Metadata = {
  title: "Conservation",
  description: `${pledgePercentLabel()} of the price of every Vis Naturæ piece goes to conservation. Here is how it works and where it goes.`,
};

/** How a partner earns the ten percent: the tests behind "Highest leverage, not highest profile." */
const leverageTests = [
  { title: "Concentrated", text: "Small places that hold a lot of life, so each euro protects more of it." },
  { title: "Close to the edge", text: "Habitats with the least left, where money now is worth more than money later." },
  {
    title: "Counted",
    text: "Partners who measure outcomes, not activity, and publish them: coral that survives, trees that take, mangroves that hold the shore again.",
  },
];

export default function ConservationPage() {
  const examples = [...products].sort((a, b) => a.price - b.price).filter((_, i, arr) => i === 0 || i === Math.floor(arr.length / 2) || i === arr.length - 1);

  return (
    <>
      {/* Running total */}
      <section className="relative overflow-hidden">
        {/* Rows of badgers drifting behind the figure */}
        <BadgerRows />
        <div className="container-x relative py-20 text-center md:py-28">
          <p className="eyebrow mx-auto flex w-fit items-center gap-2.5 bg-paper px-3 py-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
            </span>
            Pledged to date
          </p>
          <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-6 text-[clamp(6.5rem,24vw,18rem)] md:gap-x-12">
            <p className="display -mt-[0.12em] font-semibold leading-none tracking-tight text-red lining-nums tabular-nums">
              <RollingNumber value={formatPrice(site.pledgeRaisedCents)} />
            </p>
            {/* Centred on the gap between the two bars of the € (0.51em below the top of the figure). */}
            <span className="mt-[0.39em] flex">
              <a
                href={site.donateUrl || `mailto:${site.email}?subject=${encodeURIComponent("Supporting conservation")}`}
                {...(site.donateUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="btn btn-primary -translate-y-1/2"
              >
                Support
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* Intro and impact charts on black */}
      <div className="theme-dark pb-16 md:pb-24">
        <PageIntro
          eyebrow="The pledge"
          title={`${pledgePercentLabel()} of every sale goes to conservation.`}
          lede="Of the price, not the profit. It is calculated on every order before shipping and tax, shown on every product page, and reported every season."
        />

        <section id="impact" className="container-x scroll-mt-24">
          <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="eyebrow mb-3">Impact</p>
              <h2 className="display text-4xl md:text-5xl">Counted, not claimed.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-2">
              What the ten percent has done so far, updated as the receipts come in.
              {impact.placeholder && <strong className="font-medium text-ink"> Every figure here is a placeholder until the first drop ships and the first transfer clears.</strong>}
            </p>
          </div>
          <ImpactCharts />
        </section>
      </div>

      {/* How it's calculated */}
      <section id="how-it-works" className="container-x grid scroll-mt-24 gap-12 py-16 md:grid-cols-12 md:py-24">
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

      {/* Partners */}
      <section id="partners" className="scroll-mt-24 bg-surface py-16 md:py-24">
        <div className="container-x mb-10 md:mb-12">
          <div className="mb-10 grid gap-10 md:mb-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow mb-3">Where it goes</p>
              <h2 className="display text-4xl md:text-5xl">Highest leverage, not highest profile.</h2>
              <p className="mt-5 text-sm leading-relaxed text-ink-2">
                We don&apos;t give the ten percent to the best-known name, or spread it so thin it changes nothing. It goes where each euro
                changes the most, and every partner has to pass three tests.
              </p>
            </div>
            <ol className="divide-y divide-line border-y border-line md:col-span-6 md:col-start-7">
              {leverageTests.map((t, i) => (
                <li key={t.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-5">
                  <span className="eyebrow pt-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {partners.map((p) => (
              <div key={p.name} className="flex flex-col border border-line bg-paper p-6">
                <p className="display text-6xl leading-none text-red lining-nums">{p.leverage.figure}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">{p.leverage.text}</p>
                <a href={p.leverage.source.url} target="_blank" rel="noopener noreferrer" className="eyebrow mt-4 w-fit leading-snug link-underline">
                  Source: {p.leverage.source.label}
                </a>
                <div className="mt-auto pt-8">
                  <div className="border-t border-line pt-6">
                    <h3 className="font-serif text-2xl">{p.name}</h3>
                    <p className="mt-2 text-sm text-ink-2">{p.focus}</p>
                    <p className="eyebrow mt-6">{p.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PartnerBand />
        <div className="container-x">
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
            We are finalising partnerships with established, audited organisations in each area, held to the same three tests. Names and
            agreements will be published here before the first transfer is made.
          </p>
        </div>
      </section>

      {/* Why: red like the homepage newsletter, flush against the trust row */}
      <section className="bg-red text-paper">
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
