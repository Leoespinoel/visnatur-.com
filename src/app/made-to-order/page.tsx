import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { measurementGroups } from "@/lib/measurements";
import { PageIntro } from "@/components/PageIntro";
import { HowItWorks } from "@/components/HowItWorks";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Made to order",
  description: `How Vis Naturæ makes every piece after it is ordered: lead times, sizing, shipping and returns.`,
};

const sizing = [
  { size: "XS", chest: "86–91", waist: "71–76" },
  { size: "S", chest: "91–96", waist: "76–81" },
  { size: "M", chest: "96–101", waist: "81–86" },
  { size: "L", chest: "101–106", waist: "86–91" },
  { size: "XL", chest: "106–112", waist: "91–97" },
  { size: "XXL", chest: "112–118", waist: "97–103" },
];

const faqs = [
  {
    q: "How does made to order work?",
    a: "You choose a design and a size and pay at checkout. Nothing is made in advance: your piece is cut and sewn in a small workshop in Mauritius after you order, in your size, and sent to you when it is finished. Every design stays on sale, so nothing sells out.",
  },
  {
    q: `Why does it take ${leadTimeLabel()}?`,
    a: `Because your piece doesn't exist yet. It is cut and sewn after you order, and the ${leadTimeLabel()} run from that day. Making only what has been ordered is what lets us keep prices where they are.`,
  },
  {
    q: "Can I cancel?",
    a: "Yes, within 48 hours of ordering, for a full refund. After that, your fabric has been cut and we can offer an exchange or credit instead.",
  },
  {
    q: "What if the size is wrong?",
    a: "Tell us within 14 days of delivery and we will remake it in the right size at no cost. Pieces must be unworn and unwashed.",
  },
  {
    q: "Do you ever run sales?",
    a: "No. Nothing is overstocked, so nothing needs clearing. Prices are the same all year.",
  },
  {
    q: "Where are the pieces made?",
    a: "In Mauritius, in small workshops we visit in person. The island has made knitwear and tailoring for the world's best-known labels for fifty years, and the Indian Ocean around it is part of why the pledge exists. We publish the workshop list as the partnerships are confirmed.",
  },
  {
    q: "Repairs?",
    a: "Free, for life. Send it back, we fix it, we send it home. You pay for postage to us, we pay for the return.",
  },
];

export default function MadeToOrderPage() {
  return (
    <>
      <PageIntro
        eyebrow="Made to order"
        title="Made once you order it."
        lede={`Nothing at Vis Naturæ is made in advance. Every piece is cut and sewn in Mauritius after it is ordered, in the size you choose, and ships ${leadTimeLabel()} later. Here is what that means for you.`}
      />

      <section id="how-it-works" className="container-x scroll-mt-24 pb-16 md:pb-24">
        <HowItWorks />
      </section>

      <section className="bg-black text-white">
        <div className="container-x grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div className="image-frame aspect-[4/5]">
            <Image src="/images/cutting-table.jpg?v=2" alt="Sky blue linen being cut on the workshop table" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="md:pl-8 lg:pl-16">
            <p className="eyebrow mb-4 !text-white/70">Why we work this way</p>
            <h2 className="display text-4xl text-white md:text-6xl">Buy once, <em className="italic">wait</em> a little.</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/80 md:text-base">
              <p>
                The fashion industry makes far more than it sells, then discounts, destroys or dumps the rest. We decided not to take part. By
                making only what has been ordered, we carry no stock, hold no sales, and waste nothing.
              </p>
              <p>
                It also means your piece is yours from the first cut. Trousers are hemmed to your inseam. Prints are placed by hand on each pair, so no two
                are quite the same. And when something wears, we repair it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section id="shipping" className="scroll-mt-24">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Shipping & lead times</p>
            <h2 className="display text-4xl md:text-5xl">{leadTimeLabel()}, then a few days.</h2>
          </div>
          <dl className="grid gap-6 text-sm md:col-span-7 md:col-start-6 md:grid-cols-2">
            <div>
              <dt className="eyebrow mb-2">Making</dt>
              <dd className="text-ink-2">{leadTimeLabel()} from the day you order. We email you when your piece is cut and when it ships.</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Delivery</dt>
              <dd className="text-ink-2">Shipped express from Mauritius, tracked, 4–7 working days to Europe. Free over {formatPrice(site.freeShippingThresholdCents)}, otherwise {formatPrice(site.flatShippingCents)}.</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Where we ship</dt>
              <dd className="text-ink-2">The EU, Norway, Iceland, Switzerland and the United Kingdom. Pieces are made outside the EU, so import duties and VAT may be collected on delivery; we show an estimate at checkout.</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Packaging</dt>
              <dd className="text-ink-2">Recycled card and paper. No plastic, no polybag.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Sizing */}
      <section id="sizing" className="scroll-mt-24 bg-surface">
        <div className="container-x py-16 md:py-24">
          <SectionHeading eyebrow="Sizing & measurements" title="Measure a shirt you like." />
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink">
                    <th className="eyebrow py-3 font-normal">Size</th>
                    <th className="eyebrow py-3 font-normal">Chest (cm)</th>
                    <th className="eyebrow py-3 font-normal">Waist (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sizing.map((r) => (
                    <tr key={r.size}>
                      <td className="py-3 font-medium">{r.size}</td>
                      <td className="py-3 tabular-nums text-ink-2">{r.chest}</td>
                      <td className="py-3 tabular-nums text-ink-2">{r.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-muted">Trousers and shorts are sized by waist in inches (28–38) and hemmed to your inseam. Socks come in EU 39–42 and 43–46.</p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-ink-2 md:col-span-4 md:col-start-9">
              <p>
                Our fits are relaxed but not oversized. If you are between sizes, go down for polos and knitwear and up for shirts and
                outerwear. Still unsure? <Link href="/contact" className="underline">Write to us</Link> with the measurements of something
                that fits you well and we will tell you which size to order.
              </p>
              <p>
                Every style has one measurement sheet for all its colourways, so every piece comes out the same, whoever orders it. Garments
                come in M, L and XL, sampled in L. The caps come in S, M and L, sampled in M; the socks in EU 39–42 and 43–46; the
                sunglasses in one size.
              </p>
              <p className="text-xs text-muted">
                Finished measurements in centimetres, sunglasses in millimetres. A ½ measurement is taken flat across one side; HPS is the high point of the shoulder; ±
                is the tolerance. These are working specs, to be confirmed against the first samples.
              </p>
            </div>
          </div>

          {/* Measurements per style, mirrored from the pitch appendix */}
          <div id="measurements" className="mt-12 scroll-mt-24 md:mt-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-10">
              {measurementGroups.map((g) => (
                <div key={g.label}>
                  <p className="eyebrow mb-2">{g.label}</p>
                  <div className="border-b border-line">
                    {g.specs.map((s) => (
                      <details key={s.name} className="group border-t border-line">
                        <summary className="flex items-baseline justify-between gap-4 py-3">
                          <span className="font-serif text-lg leading-tight">
                            <span className="inline-block w-5 font-sans text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                              +
                            </span>
                            {s.name}
                          </span>
                          <span className="whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.1em] text-muted">{s.meta}</span>
                        </summary>
                        <div className="grid gap-4 pb-5 pl-5">
                          <p className="text-sm text-ink-2">{s.description}</p>
                          {s.overview && (
                            <figure className="grid min-w-0 gap-2">
                              <a href={s.overview.src} target="_blank" rel="noopener" className="block overflow-x-auto overscroll-x-contain">
                                <Image
                                  src={s.overview.src}
                                  alt={s.overview.alt}
                                  width={s.overview.width}
                                  height={s.overview.height}
                                  unoptimized
                                  className="h-[clamp(15rem,45vh,27rem)] w-auto max-w-none bg-white"
                                />
                              </a>
                              <figcaption className="text-xs text-muted">{s.overview.caption}</figcaption>
                            </figure>
                          )}
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-[0.8125rem] tabular-nums">
                              <thead>
                                <tr className="border-b border-line">
                                  <th scope="col" className="eyebrow py-2 pr-2 text-left font-normal">
                                    {s.pointHeader}
                                  </th>
                                  {s.sizes.map((size) => (
                                    <th key={size} scope="col" className="eyebrow px-2 py-2 text-right font-normal">
                                      {size}
                                    </th>
                                  ))}
                                  <th scope="col" className="eyebrow py-2 pl-2 text-right font-normal">
                                    ±
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-line">
                                {s.points.map((p) => (
                                  <tr key={p.label}>
                                    <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                                      {p.label}
                                    </th>
                                    {p.values.map((v, i) => (
                                      <td key={s.sizes[i] ?? i} className="whitespace-nowrap px-2 py-1.5 text-right">
                                        {v}
                                      </td>
                                    ))}
                                    <td className="whitespace-nowrap py-1.5 pl-2 text-right text-muted">{p.tolerance}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {s.notes.length > 0 && (
                            <dl>
                              {s.notes.map((n) => (
                                <div key={n.term} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-t border-line py-2 text-[0.8125rem]">
                                  <dt className="eyebrow pt-[0.2em] !text-[0.625rem]">{n.term}</dt>
                                  <dd>{n.detail}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="questions" className="theme-red scroll-mt-24">
        <div className="container-x py-16 md:py-24">
          <SectionHeading eyebrow="Questions" title="Asked often." />
          <div className="divide-y divide-line border-y border-line md:max-w-3xl">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between gap-6 font-serif text-xl md:text-2xl">
                  {f.q}
                  <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pt-4 text-sm leading-relaxed text-ink-2 md:max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
