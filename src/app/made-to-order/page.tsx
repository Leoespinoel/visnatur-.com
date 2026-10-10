import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { editionWord, formatPrice, leadTimeLabel } from "@/lib/format";
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
    q: "What is a numbered edition?",
    a: `Each design is released exactly once, in an edition of ${editionWord(site.editionSize.core)} (accessories ${editionWord(site.editionSize.accessories)}). During the drop's order window you claim a number and choose your size. When the window closes, the whole edition is cut and sewn together, each unit in its owner's size, and the design is retired to the Archive. Your number is assigned in order of payment and sewn into the garment.`,
  },
  {
    q: "What if the edition does not sell out?",
    a: "Then it closes at however many were claimed. An edition of twelve with seven owners is made as seven, and the other five are never made. The design still retires.",
  },
  {
    q: "And one of one?",
    a: `Outerwear and heavy knits are made first, once, in one size, photographed as they are, and sold as that exact garment. They ship within ${site.oneOfOneDispatchDays} working days of payment. If two people reach checkout at the same moment, the first to pay gets it and the other is refunded in full.`,
  },
  {
    q: `Why does it take ${leadTimeLabel()}?`,
    a: `Because your piece doesn't exist yet. Editions are made as one batch after orders close, so the ${leadTimeLabel()} runs from the closing date, not from the day you order. Making them together is what lets us keep prices where they are.`,
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
        title="Released once. Made to order."
        lede={`Every Vis Naturæ design is released once, in a numbered edition of ${editionWord(site.editionSize.core)}. It is cut and sewn after orders close, ships ${leadTimeLabel()} later, and is never made again. Here is what that means for you.`}
      />

      <section className="container-x pb-16 md:pb-24">
        <HowItWorks />
      </section>

      <section className="container-x grid gap-10 pb-16 md:grid-cols-2 md:items-center md:pb-24">
        <div className="image-frame aspect-[4/5]">
          <Image src="/images/cutting-table.jpg?v=2" alt="Sky blue linen being cut on the workshop table" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="md:pl-8 lg:pl-16">
          <p className="eyebrow mb-4">Why we work this way</p>
          <h2 className="display text-4xl md:text-6xl">Buy once, <em className="italic">wait</em> a little.</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-2 md:text-base">
            <p>
              The fashion industry makes far more than it sells, then discounts, destroys or dumps the rest. We decided not to take part. By
              making only what has been ordered, we carry no stock, hold no sales, and waste nothing.
            </p>
            <p>
              It also means your piece is yours from the first cut. Each unit carries its number. Trousers are hemmed to your inseam. Prints are placed by hand on each
              pair, so no two in an edition are the same. And when something wears, we repair it.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section id="shipping" className="scroll-mt-24 border-y border-line bg-surface">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Shipping & lead times</p>
            <h2 className="display text-4xl md:text-5xl">{leadTimeLabel()}, then a few days.</h2>
          </div>
          <dl className="grid gap-6 text-sm md:col-span-7 md:col-start-6 md:grid-cols-2">
            <div>
              <dt className="eyebrow mb-2">Making</dt>
              <dd className="text-ink-2">{leadTimeLabel()} from the day the drop closes, for editions. One-of-one pieces ship within {site.oneOfOneDispatchDays} working days. We email you when your piece is cut and when it ships.</dd>
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
      <section id="sizing" className="container-x scroll-mt-24 py-16 md:py-24">
        <SectionHeading eyebrow="Sizing" title="Measure a shirt you like." />
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
            <p className="mt-4 text-xs text-muted">Trousers and shorts are sized by waist in inches (28–38) and hemmed to your inseam.</p>
          </div>
          <div className="text-sm leading-relaxed text-ink-2 md:col-span-4 md:col-start-9">
            <p>
              Our fits are relaxed but not oversized. If you are between sizes, go down for polos and knitwear and up for shirts and
              outerwear. Still unsure? <Link href="/contact" className="underline">Write to us</Link> with the measurements of something
              that fits you well and we will tell you which size to order.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x pb-16 md:pb-24">
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
      </section>
    </>
  );
}
