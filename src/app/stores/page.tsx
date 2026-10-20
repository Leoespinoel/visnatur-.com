import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { dispatchLabel, formatPrice, madeToOrderLabel, transitLabel } from "@/lib/format";
import { Newsletter } from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "Stores",
  description: "Where to find Vis Naturæ: online across Europe, made in the workshop in Mauritius, with pop-ups and partner clubs listed the day they are confirmed.",
};

/** Stores (Leo, 2026-10-16: "Where to find us"). No shop exists yet, so the page says so and lists none. Bands: white → black → grey → red. */
export default function StoresPage() {
  return (
    <>
      <section className="container-x pt-14 pb-12 md:pt-20 md:pb-16">
        <p className="eyebrow mb-4">The VN World · Stores</p>
        <h1 className="display max-w-4xl text-5xl md:text-7xl">
          Where to find <em className="italic">us</em>.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">
          Online only for now. Every piece is cut and sewn in the workshop in Mauritius and sent across Europe from there.
        </p>
      </section>

      <section className="theme-dark">
        <div className="container-x grid gap-12 py-16 md:grid-cols-2 md:gap-10 md:py-24">
          <div className="flex flex-col">
            <p className="eyebrow mb-4">Online</p>
            <h2 className="display text-3xl md:text-4xl">Everywhere in Europe.</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-2">
              Signature and collection pieces leave Mauritius within {dispatchLabel()}, then {transitLabel()} express to Europe; made to order takes {madeToOrderLabel()}. Free shipping over{" "}
              {formatPrice(site.freeShippingThresholdCents)}, free repairs for life.
            </p>
            <div className="mt-8">
              <Link href="/shop/all" className="btn btn-primary">
                Shop all
              </Link>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="image-frame aspect-[4/3]">
              <Image src="/images/campaign-atelier.jpg" alt="The workshop in Mauritius, where every piece is cut and sewn by hand" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <p className="eyebrow mt-6 mb-3">The workshop</p>
            <h2 className="font-serif text-2xl md:text-3xl">Made in Mauritius.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">Cut and sewn by hand in a small workshop on the island, and made to order there when a piece is adjusted to fit.</p>
            <Link href="/made-to-order" className="eyebrow !text-ink link-underline mt-4 self-start">
              How it is made
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-x grid gap-8 py-16 md:grid-cols-12 md:items-end md:py-24">
          <div className="md:col-span-6">
            <p className="eyebrow mb-4">Pop-ups and partner clubs</p>
            <h2 className="display text-3xl md:text-5xl">None confirmed yet.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-ink-2 md:col-span-5 md:col-start-8">
            <p>The first pop-ups and the clubs that carry Vis Naturæ are listed here the day they are confirmed. Members of The VN Club hear first.</p>
            <Link href="/members" className="btn btn-outline">
              The VN Club
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
