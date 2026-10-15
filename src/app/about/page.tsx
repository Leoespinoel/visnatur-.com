import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { getProduct } from "@/data/products";
import { pledgePercentLabel } from "@/lib/pledge";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Origins",
  description: "Vis Naturæ is a made-to-order resort label for men and women, founded in 2026. Force of nature, taken seriously.",
};

/** A day on the island in four moments; each photo's pieces come from the stills shot list (scripts/stills-shots.mjs, day-*). */
const day = [
  {
    time: "Morning",
    title: "Kitesurfing with friends",
    text: "The trade wind fills in over the lagoon at Le Morne, and the kites are up before anyone has had breakfast.",
    image: "/images/day-kite.jpg",
    alt: "Friends rigging kites on the beach at Le Morne, one already riding on the turquoise lagoon",
    wears: "lido-stripe-swim-short-saffron",
  },
  {
    time: "Midday",
    title: "Out on the catamaran",
    text: "Off the west coast, spinner dolphins come up to ride the bow while everyone crowds onto the net to watch.",
    image: "/images/day-catamaran.jpg",
    alt: "Friends on the net of a catamaran watching spinner dolphins leap off the bow",
    wears: "cabana-linen-shirt-sky",
  },
  {
    time: "Afternoon",
    title: "Over the reef",
    text: "Mask on, face down, drifting over coral and shoals of reef fish in water as clear as glass.",
    image: "/images/day-reef.jpg",
    alt: "A snorkeller floating over a coral reef in clear turquoise water, sunlight falling in rays",
    wears: "tidal-swim-short-red",
  },
  {
    time: "Sunset",
    title: "The sundowner",
    text: "The day ends barefoot at a beach bar, a local DJ on the decks and a cocktail in hand.",
    image: "/images/day-sundowner.jpg",
    alt: "Friends with cocktails at a beach bar at sunset while a local DJ plays under festoon lights",
    wears: "cabana-hoodie-oat",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* The name, set as a dictionary entry: pronunciation, senses, synonyms, then origin, history and what it asks of the brand. */}
      <section id="the-name" className="container-x scroll-mt-24 pt-14 pb-16 md:pt-20 md:pb-24">
        <p className="eyebrow mb-4">Origins</p>
        <div className="grid gap-10 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <h1 className="display text-5xl md:text-7xl">
              <span aria-hidden="true">
                Vis Na<span className="text-muted">·</span>tu<span className="text-muted">·</span>ræ
              </span>
              <span className="sr-only">Vis Naturæ</span>
            </h1>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-base text-ink-2 md:text-lg">
              <span>/vɪs naˈtuːraɪ/</span>
              <span className="text-muted">vis na-TOO-rye</span>
            </p>
            <p className="eyebrow mt-8">Latin · Noun phrase</p>
            <ol className="mt-4 max-w-xl list-decimal space-y-3 pl-5 text-base leading-relaxed text-ink-2 marker:text-muted md:text-lg">
              <li>Force of nature; the power by which the natural world moves, grows and renews itself.</li>
              <li>
                Of a person: an energy that cannot be argued with or held back. <span className="italic">&ldquo;She is a force of nature.&rdquo;</span>
              </li>
              <li>
                A resort label for men and women, founded in {site.foundedYear} and made to order in Mauritius.
              </li>
            </ol>
            <p className="eyebrow mt-8">Synonyms</p>
            <p className="mt-3 text-base text-ink-2 md:text-lg">
              force of nature · vigour · vital force ·{" "}
              <Link href="#the-mark" className="whitespace-nowrap underline decoration-line underline-offset-4 hover:decoration-ink">
                honey badger
              </Link>
            </p>
          </div>
          <div className="xl:col-span-6">
            <div className="image-frame aspect-[16/9] xl:aspect-auto xl:h-full">
              <Image
                src="/images/campaign-drop.jpg?v=3"
                alt="Four friends on a basalt harbour wall in Mauritius in a navy quarter zip, oat linen shirt, red striped knit and saffron striped swim shorts"
                fill
                unoptimized
                priority
                sizes="(min-width: 1280px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-line pt-10 text-sm leading-relaxed text-ink-2 md:grid-cols-3 md:text-base">
          <div>
            <p className="eyebrow mb-4">Origin</p>
            <p>
              From Latin <i>vīs</i>, &ldquo;force, strength&rdquo;, and <i>nātūrae</i>, &ldquo;of nature&rdquo;, the genitive of <i>nātūra</i>.{" "}
              <i>Nātūra</i> grew from <i>nātus</i>, &ldquo;born&rdquo;: before it meant the natural world, it meant birth, and then the character a thing
              is born with.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">History</p>
            <p>
              The Romans used <i>natura</i> for the Greek <i>physis</i>, the order of the living world, and Lucretius called his poem on how the
              world works <i>De rerum natura</i>. Natural philosophy kept <i>vis</i> for the forces it found, from the physician&rsquo;s{" "}
              <i>vis medicatrix naturae</i>, the healing power of nature, to Newton&rsquo;s <i>vis inertiae</i> in 1687. In Classical Latin the
              name sounded like &ldquo;wees naa-TOO-rye&rdquo;. Scribes and printers later joined the a and e of its ending into one letter, æ.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">The name, worn</p>
            <p>
              <span className="font-medium text-ink">Force.</span> Clothes for people who go all in, then rest like they mean it, like the
              badger on the label. <span className="font-medium text-ink">Nature.</span> {pledgePercentLabel()} of every sale price goes back
              to the places they are made for. <span className="font-medium text-ink">Birth.</span> Nothing is made until someone asks for
              it: each piece is born the day it is ordered. And the æ, two letters made one, is the red letter at the end of the name.
            </p>
          </div>
        </div>
      </section>

      <section id="story" className="theme-dark scroll-mt-24">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <div className="image-frame aspect-[4/5]">
              <Image src="/images/about.jpg" alt="A man in a sage linen shirt walking barefoot over basalt rocks on the Mauritius coast" fill unoptimized priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-ink-2 md:col-span-6 md:col-start-7 md:pt-10 md:text-lg">
            <p className="display text-3xl text-ink md:text-4xl">We started with a question: what would a clothing brand look like if it refused to make anything nobody wanted?</p>
            <p>
              The answer was slower, and better. No stock. No sales. No seasons thrown away. Every design in Collection I is a pattern and a bolt of
              fabric until someone orders it, and then it is cut and sewn in their size in Mauritius, an island that has been making fine knitwear and tailoring for half a century.
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
        </div>
      </section>

      {/* The mark: why the logo is a honey badger, asleep on its back. */}
      <section id="the-mark" className="scroll-mt-24 bg-surface">
        <div className="container-x grid gap-10 py-16 md:grid-cols-12 md:items-center md:py-24">
          <div className="md:col-span-6">
            <div className="flex aspect-[4/3] items-center justify-center px-8 md:px-12">
              <Image src="/brand/badger-mark.png" alt="The Vis Naturæ badger, inspired by the African honey badger, asleep on its back" width={852} height={300} unoptimized className="h-auto w-full max-w-[520px]" />
            </div>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-ink-2 md:col-span-5 md:col-start-8 md:text-lg">
            <p className="eyebrow">The Vis Naturæ badger · inspired by the African honey badger</p>
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
              The Vis Naturæ badger is caught in that sleep. On its back, paws folded, one fight behind it and the next not yet begun. Go all in, then rest
              like you mean it.
            </p>
            <p className="font-serif text-2xl text-ink">Proof that fear is sometimes the most overrated instinct in nature.</p>
          </div>
        </div>
      </section>

      {/* The life that made it: one day on the island, from first wind to last light. */}
      <section id="the-life" className="theme-red scroll-mt-24">
        <div className="container-x py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6">
              <p className="eyebrow mb-4">The life that made it</p>
              <h2 className="display text-4xl md:text-6xl">
                In Mauritius, the luxury is time <em className="italic">outside</em>.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-ink-2 md:col-span-5 md:col-start-8 md:text-lg">
              On an island ringed by reef, lagoon and mountain, the best days are the ones spent in it, with friends, from the first wind to
              the last light. Vis Naturæ is made for that day: shorts that dry on the boat, linen for the deck, a hoodie for when the sun drops.
            </p>
          </div>

          {/* Each moment spans five rows of a shared subgrid, so photos, titles, text and links line up across the columns. */}
          <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 xl:grid-cols-4">
            {day.map((m) => {
              const worn = getProduct(m.wears);
              return (
                <li key={m.time} className="row-span-5 grid grid-rows-subgrid gap-y-0">
                  <div className="image-frame aspect-[4/5]">
                    <Image src={m.image} alt={m.alt} fill unoptimized sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <p className="eyebrow mt-5">{m.time}</p>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{m.text}</p>
                  {worn ? (
                    <Link href={`/product/${worn.slug}`} className="eyebrow !text-ink link-underline mt-4 inline-flex items-center gap-2 self-start justify-self-start">
                      Worn: {worn.name}
                      <ArrowIcon width={14} height={14} />
                    </Link>
                  ) : (
                    <span />
                  )}
                </li>
              );
            })}
          </ol>

          <p className="eyebrow mt-14 border-t border-line pt-5">
            Founded {site.foundedYear} · Made in Mauritius · {pledgePercentLabel()} of every sale to conservation
          </p>
        </div>
      </section>
    </>
  );
}
