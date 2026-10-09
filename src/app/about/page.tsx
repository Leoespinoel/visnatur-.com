import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { pledgePercentLabel } from "@/lib/pledge";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description: "Vis Naturæ is a made-to-order menswear and resort label founded in 2026. Force of nature, taken seriously.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title="Vis Naturæ." lede="Latin for force of nature. A menswear and resort label where every design is released once, in a numbered edition made to order, and a tenth of every sale goes back to the places it is made for." />

      <section className="container-x grid gap-10 pb-16 md:grid-cols-12 md:pb-24">
        <div className="md:col-span-5">
          <div className="image-frame aspect-[4/5]">
            <Image src="/images/summit.jpg" alt="A man on a summit above a sea of cloud" fill unoptimized priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-ink-2 md:col-span-6 md:col-start-7 md:pt-10 md:text-lg">
          <p className="display text-3xl text-ink md:text-4xl">We started with a question: what would a clothing brand look like if it refused to make anything nobody wanted?</p>
          <p>
            The answer was slower, and better. No stock. No sales. No seasons thrown away. Every design in Collection I is a pattern and a bolt of
            fabric until its numbers are claimed, and then it is made once, as one small edition, in Mauritius, an island that has been making fine knitwear and tailoring for half a century, and never repeated.
          </p>
          <p>
            The pieces are the ones we wanted and could not find. Swim shorts in a clean cut made from reclaimed fishing nets. A piqué polo heavy
            enough to hold its collar. Linen that is allowed to crease. A quarter zip for the drive home.
          </p>
          <p>
            And because the brand takes its name from the natural world, it pays rent. {pledgePercentLabel()} of every sale price goes to
            conservation, counted on every page and reported every season.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/shop" className="btn btn-primary">
              Collection I
            </Link>
            <Link href="/conservation" className="btn btn-outline">
              The pledge
            </Link>
          </div>
        </div>
      </section>

      {/* The mark: why the logo is a honey badger, asleep on its back. */}
      <section id="the-mark" className="border-t border-line">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:items-center md:py-24">
          <div className="md:col-span-6">
            <div className="flex aspect-[4/3] items-center justify-center bg-surface px-8 md:px-12">
              <Image src="/brand/badger-mark.png" alt="The Vis Naturæ honey badger, asleep on its back" width={852} height={300} unoptimized className="h-auto w-full max-w-[520px]" />
            </div>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-ink-2 md:col-span-5 md:col-start-8 md:text-lg">
            <p className="eyebrow">The mark</p>
            <h2 className="display text-3xl text-ink md:text-4xl">Most animals survive by knowing when to run.</h2>
            <p>
              The honey badger survives because it simply refuses to. It lives across Africa, no bigger than a house cat, and spends its life
              picking fights with animals far bigger than itself. The black mamba. Lions. Even elephants.
            </p>
            <p>
              Its skin is so thick and loose that teeth and claws struggle to find a hold. It digs through hard ground in minutes and raids
              beehives through a thousand stings. When a cobra sinks its fangs in, it has been seen to lie down, sleep it off, and get back up
              to finish the hunt.
            </p>
            <p>
              It does not have the sharpest claws, the fastest legs or the strongest bite. What it has is attitude: no respect at all for
              anything standing in its way.
            </p>
            <p>
              Ours is caught in that sleep. On its back, paws folded, one fight behind it and the next not yet begun. Go all in, then rest
              like you mean it.
            </p>
            <p className="font-serif text-2xl text-ink">Proof that fear is sometimes the most overrated instinct in nature.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-x grid gap-8 py-16 md:grid-cols-3 md:py-24">
          {[
            { k: "Founded", v: String(site.foundedYear) },
            { k: "Made in", v: "Mauritius" },
            { k: "Pledge", v: `${pledgePercentLabel()} of every sale` },
          ].map((s) => (
            <div key={s.k} className="border-t border-ink pt-4">
              <p className="eyebrow">{s.k}</p>
              <p className="mt-2 font-serif text-3xl">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
