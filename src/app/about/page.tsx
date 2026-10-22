import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { collagePicture, collagePool } from "@/data/collage";
import { PolaroidBand } from "@/components/PolaroidBand";
import { Carousel } from "@/components/Carousel";
import { Chapter } from "@/components/Chapter";
import { ChapterCover } from "@/components/ChapterCover";
import { FitLine } from "@/components/FitLine";
import { Newsletter } from "@/components/Newsletter";
import { pledgePercentLabel } from "@/lib/pledge";
import { PullQuote } from "@/components/PullQuote";
import { StoryCopy } from "@/components/StoryCopy";
import { WordReveal } from "@/components/WordReveal";

export const metadata: Metadata = {
  title: "Origins",
  description: "Vis Naturæ is a clothing label for men and women, founded in 2026 and made by hand in Mauritius. Force of nature, taken seriously.",
};

/**
 * Four chapters, each opening on a full-screen title card (ChapterCover.tsx) that the chapter's content slides over
 * (Leo, 2026-10-21: "told like a story"). The content is set plainly on the page (Leo, 2026-10-21: no mood-board pins or
 * sheets): running text in columns 1 to 8 of the twelve-column grid (Leo, 2026-10-20: "greater alignment"), pictures in the
 * remaining 4, chapter rules across the full width. The inspiration passage runs between two sliding bands of Polaroids.
 * The last chapter, The Result, is the sum of the two before it (Leo, 2026-10-21: "everything the brand stands for in every
 * sense", combining the inspiration and the badger; then "about creating value and being intentional about everything with
 * integrity"): The Life + The Attitude = The Result, then "value" in three senses (worth, intent, integrity), set as the
 * name is in chapter I. It sits on white (Leo, 2026-10-21: "make the last chapter background white"); the red band before the
 * footer is the letter (Newsletter.tsx), which Leo put on Origins the same evening.
 */
const grid = "grid gap-x-3 gap-y-0 md:grid-cols-12";
const text = "md:col-span-8";
/** A chapter's content: an opaque sheet that slides up over the chapter's cover (ChapterCover.tsx), with a shadow on its leading edge. */
const sheet = "relative z-[1] bg-paper shadow-[0_-24px_60px_rgb(0_0_0/0.35)]";

/**
 * The real animal in chapter III, in a row of tiles under the text like the homepage Collections row (Leo, 2026-10-21; before
 * that, round the mark). Square pictures (public/images/about/, shots badger-* in scripts/stills-shots.mjs), each with a short title.
 */
const badgerWild = [
  { image: "/images/about/badger-lion.jpg", title: "Standing its ground", alt: "A honey badger standing its ground in front of a lioness in dry grass at dawn" },
  { image: "/images/about/badger-cobra.jpg", title: "Facing the cobra", alt: "A honey badger facing a cape cobra reared up with its hood spread, on red sand" },
  { image: "/images/about/badger-dig.jpg", title: "Through hard ground", alt: "A honey badger digging into hard ground, soil flying behind its claws" },
  { image: "/images/about/badger-dusk.jpg", title: "Across the savanna", alt: "A honey badger trotting across open savanna at dusk, acacias behind" },
  { image: "/images/about/badger-bees.jpg", title: "Into the hive", alt: "A honey badger tearing honeycomb out of a wild hive in a tree trunk, bees swarming round its head" },
  { image: "/images/about/badger-hyena.jpg", title: "Facing the hyena", alt: "A honey badger facing down a spotted hyena over a carcass on an open plain" },
  { image: "/images/about/badger-jackals.jpg", title: "Clearing the jackals", alt: "A honey badger charging two black-backed jackals that scatter across dry grass" },
  { image: "/images/about/badger-tree.jpg", title: "Up the tree", alt: "A honey badger climbing a leaning camelthorn tree, looking back over its shoulder" },
];

/** The page's scale: `giant` (PullQuote xl), `big` (every headline, PullQuote lg), then the passage, the senses and body text. */
const big = "text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]";
/** The inspiration passage, in ink on the paper band between the two Polaroid bands. */
const passage = "font-serif text-2xl leading-snug text-ink md:text-3xl";

/**
 * Senses as a dictionary sets them: numbered down the left, one line each, ruled between (chapters I and IV). The numerals
 * are red on paper (white on a red card, where red would vanish).
 */
function Senses({ senses, numeralClassName = "text-red" }: { senses: React.ReactNode[]; numeralClassName?: string }) {
  return (
    <ol className="border-t border-line">
      {senses.map((sense, i) => (
        <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-3 md:grid-cols-[3.5rem_1fr] md:py-4">
          <span aria-hidden="true" className={`display text-2xl leading-none md:text-3xl ${numeralClassName}`}>
            {i + 1}
          </span>
          <p className="font-serif text-lg leading-snug text-ink md:text-xl">{sense}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Chapter IV's sum: The Life (II) and The Attitude (III) make The Result (IV). One picture for each term, with the "+" and "="
 * between them (Leo, 2026-10-21: "combining the inspiration section and the badger section to create this product").
 * Only badger pictures on this page: two Polaroids of the plush badger and one of the real animal.
 */
const sumLife = collagePicture("e01-first-light");
const sumMade = collagePicture("e14-made-properly");
const sumCobra = badgerWild[1];
const sumTerms = [
  { numeral: "II", name: "The Life", image: sumLife?.image ?? "", alt: sumLife?.alt ?? "", line: "Salt, songs and the nights nobody can remember." },
  { numeral: "III", name: "The Attitude", image: sumCobra.image, alt: sumCobra.alt, line: "No respect for anything standing in the way. Then rest like you mean it." },
  { numeral: "IV", name: "The Result", image: sumMade?.image ?? "", alt: sumMade?.alt ?? "", line: "Clothes for a life well lived, made with the same attitude: on purpose, properly, and built to last." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Origins: the brand's birth before the first chapter, in the Nude Project shape (born where and when, why not just clothes, who it is
          for, the mission, a belief, a question) and in "we" (Leo, 2026-10-22: "many people helped me along the way"). White, no cover card:
          the black Chapter I cover follows it as the chapters follow each other. */}
      <section id="origins" className="scroll-mt-(--hdr)">
        <div className="container-x pt-10 pb-14 md:pt-14 md:pb-20">
          {/* Centred, like the Nude Project statement it is shaped after (Leo, 2026-10-22: "center the text"). */}
          <div className="mx-auto max-w-4xl text-center">
            <div>
              <p className="eyebrow">Origins</p>
              {/* Every paragraph the same width (Leo, 2026-10-22: "make each paragraph the same width"): text-pretty, not text-balance,
                  which narrowed the shorter paragraphs to even out their lines; from md the lines are justified, each last line centred. */}
              <WordReveal
                className={`mt-6 space-y-6 text-pretty md:text-justify md:[text-align-last:center] ${passage}`}
                paragraphs={[
                  `Vis Naturæ was born in ${site.foundedYear}, in Mauritius, between years spent in Europe and an island that kept calling us home. ` +
                    "There was no brand plan at first, just a way of living: a wave before breakfast, a match in the afternoon, a dinner that turned " +
                    "into a night out, and nothing in the wardrobe that could keep up.",
                  "We didn’t start Vis Naturæ simply to make clothes. We wanted the things we love, nature, style, music and sport, to be one " +
                    "life instead of four, and to make the pieces for it properly, at home, with people who care.",
                  "This label is for those who go all in and rest like they mean it. Those who find out the time from the colour of the sky. " +
                    "Those who let the tide, not the clock, decide when it’s over. And those who do not let a camera get in the way of the moment. " +
                    "A lot has changed since the first sketch, but the mission remains the same: to make clothes we love for the people and places we love.",
                  "Inspired by nature, to live life, not to understand, but simply to experience.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* I. The name, set as a dictionary entry: the headword as the chapter name, pronunciation, senses, then origin, history and what it asks of the brand. */}
      <section id="the-name" className="scroll-mt-(--hdr)">
        <ChapterCover numeral="I" name="The Label" as="h1" />
        <div className={sheet}>
          <div className="container-x pt-10 pb-12 md:pt-14 md:pb-16">
            <Chapter
              as="h2"
              eyebrow={
                <>
                  <span aria-hidden="true">
                    Vis Na<span className="text-muted">·</span>tu<span className="text-muted">·</span>r<span className="text-red">æ</span>
                  </span>
                  <span className="sr-only">Vis Naturæ</span>
                </>
              }
            />
            <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-serif text-xl text-ink-2 md:text-2xl">
              <span>/vɪs naˈtuːraɪ/</span>
              <span className="text-muted">vis na-TOO-rye</span>
              <span className="eyebrow">Latin · Noun phrase</span>
            </p>

            <div className={`mt-8 ${grid} md:mt-10`}>
              <div className={text}>
                <Senses
                  senses={[
                    <>Force of nature; the power by which the natural world moves, grows and renews itself.</>,
                    <>
                      Of a person: an energy that cannot be argued with or held back. <span className="italic text-ink-2">&ldquo;She is a force of nature.&rdquo;</span>
                    </>,
                    <>A clothing label for men and women, founded in {site.foundedYear} and made by hand in Mauritius.</>,
                  ]}
                />
                <p className="eyebrow mt-5">Synonyms</p>
                <p className="mt-3 text-base text-ink-2 md:text-lg">
                  force of nature · vigour · vital force ·{" "}
                  <Link href="#the-mark" className="whitespace-nowrap underline decoration-line underline-offset-4 hover:decoration-ink">
                    honey badger
                  </Link>
                </p>
              </div>
            </div>

            {/* Origin, history and what the name asks of the brand, three across. */}
            <div className={`mt-10 text-sm leading-relaxed text-ink-2 md:mt-12 md:text-base ${grid} gap-y-6`}>
              <div className="md:col-span-4">
                <p className="eyebrow mb-4">Origin</p>
                <p>
                  From Latin <i>vīs</i>, &ldquo;force, strength&rdquo;, and <i>nātūrae</i>, &ldquo;of nature&rdquo;, the genitive of <i>nātūra</i>.{" "}
                  <i>Nātūra</i> grew from <i>nātus</i>, &ldquo;born&rdquo;: before it meant the natural world, it meant birth, and then the character a thing
                  is born with.
                </p>
              </div>
              <div className="md:col-span-4">
                <p className="eyebrow mb-4">History</p>
                <p>
                  The Romans used <i>natura</i> for the Greek <i>physis</i>, the order of the living world, and Lucretius called his poem on how the
                  world works <i>De rerum natura</i>. Natural philosophy kept <i>vis</i> for the forces it found, from the physician&rsquo;s{" "}
                  <i>vis medicatrix naturae</i>, the healing power of nature, to Newton&rsquo;s <i>vis inertiae</i> in 1687. In Classical Latin the
                  name sounded like &ldquo;wees naa-TOO-rye&rdquo;. Scribes and printers later joined the a and e of its ending into one letter, æ.
                </p>
              </div>
              <div className="md:col-span-4">
                <p className="eyebrow mb-4">The name, worn</p>
                <p>
                  <span className="font-medium text-ink">Force.</span> Clothes for people who go all in, then rest like they mean it, like the
                  badger on the label. <span className="font-medium text-ink">Nature.</span> The island the clothes are made on, and the sea and forest
                  they are made for. <span className="font-medium text-ink">Birth.</span> The character a thing is born with: made by hand, made
                  to last, and repaired for life. And the æ, two letters made one, is the red letter at the end of the name.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* II. The inspiration: the passage between two bands of badger Polaroids drifting
          the opposite way to each other, each one a sideways scroller to browse through (Leo, 2026-10-21). */}
      <section id="inspiration" className="scroll-mt-(--hdr)">
        <ChapterCover numeral="II" name="The Life" />
        <div className={sheet}>
          <div className="container-x pt-16 md:pt-24">
            <Chapter
              eyebrow={
                <>
                  Salt, songs and the nights nobody can <em className="italic">remember</em>.
                </>
              }
            />
          </div>
          <PolaroidBand pictures={collagePool.slice(0, Math.ceil(collagePool.length / 2))} className="mt-12 md:mt-16" />
          <div className="container-x py-12 md:py-16">
            <div className={grid}>
              <div className={text}>
                <p className={passage}>
                  It starts on an adventure, at first light: the same break every morning, wax on the board, salt in the hair. Then catching the one
                  that barrels, inside it, the whole world gone quiet for a second, and out the other side. Breakfast after, shared with your loved
                  ones, and lots of it: fruit cut that morning, a little taste of what nature has to offer, until nobody can fit another bite. The
                  same faces since school, the ones picked up along the way, the ones met in the lineup; nobody needs an invitation. One of them
                  mixing songs on the deck, another shooting it all on film that nobody will see for months.
                </p>
                <p className={`mt-8 md:mt-10 ${passage}`}>
                  One drink at sunset, by the canals, in a pub or a bistro, turns into three, then into a plan nobody agreed to, then on to
                  someone&apos;s kitchen in Amsterdam, a rooftop in London, a courtyard in Paris. Songs played on repeat until they belong to a summer,
                  so that one melody, years later, brings the whole night back.
                </p>
                <PullQuote stop="." size="lg" className="mt-12 md:mt-16">
                  Sleep can happen tomorrow
                </PullQuote>
                {/* The line that ties the water and the cities together. */}
                <p className={`mt-12 md:mt-16 ${passage}`}>
                  Lost in the sauce, found again at sunrise, and paddling out anyway, because the feeling of that wave and the stories to tell are what
                  get you up in the morning and keep you up at night.
                </p>
                <p className="mt-8 text-base leading-relaxed text-ink-2 md:mt-10 md:text-lg">
                  Clothes built for all of it, and made properly, with a Nordic respect for things that last. Live it fully. The pieces will keep up.
                </p>
              </div>
            </div>
          </div>
          <PolaroidBand pictures={collagePool.slice(Math.ceil(collagePool.length / 2))} reverse className="pb-16 md:pb-24" />
        </div>
      </section>

      {/* III. The mark: why the logo is a honey badger, asleep on its back. */}
      <section id="the-mark" className="scroll-mt-(--hdr)">
        <ChapterCover numeral="III" name="The Attitude" />
        <div className={sheet}>
          <div className="container-x py-16 md:py-24">
            {/* The headline and the closing line each run on one line from the left edge of the grid to the right edge of the
                paragraphs, sized to fit (Leo, 2026-10-21); the paragraphs sit beside the mark. The real animal follows in the row below. */}
            <FitLine as="h3" className={`display text-ink ${big}`}>
              Most animals survive by knowing when to run.
            </FitLine>
            <div className={`mt-10 md:mt-14 ${grid} gap-y-10 md:items-center`}>
              <div className="md:col-span-5">
                <Image src="/brand/badger-mark.png" alt="The Vis Naturæ badger, inspired by the African honey badger, asleep on its back" width={852} height={300} unoptimized className="h-auto w-full" />
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <div className="space-y-6 text-base leading-relaxed text-ink-2 md:text-lg">
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
                </div>
              </div>
            </div>
            <PullQuote size="lg" stop="." fit className="mt-12 md:mt-16">
              Proof that fear is sometimes the most overrated instinct in nature
            </PullQuote>
          </div>
          {/* The real animal: a row of tiles to swipe through, as the Collections row on the homepage, with no end in either
              direction (Leo, 2026-10-21). */}
          <div className="pb-16 md:pb-24">
            <Carousel ariaLabel="The honey badger" arrows="sides" loop itemClassName="w-[80%] sm:w-[45%] md:w-[calc((100%-1rem)/3.2)] lg:w-[calc((100%-1.5rem)/4.2)]">
              {badgerWild.map((p) => (
                <article key={p.image} className="relative aspect-square overflow-hidden bg-paper-2">
                  <Image src={p.image} alt={p.alt} fill unoptimized sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 80vw" className="object-cover" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8">
                    <StoryCopy eyebrow="Honey badger" title={p.title} links={[]} size="sm" />
                  </div>
                </article>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* IV. The result: value created with intent and integrity, as the sum of the life (II) and the attitude (III), then
          "value" in three senses like the name in chapter I (Leo, 2026-10-21: not a question any more). On white like the other chapters, so the
          signs and numerals are red as in chapter I; the letter's red band follows. */}
      <section id="the-result" className="scroll-mt-(--hdr)">
        <ChapterCover numeral="IV" name="The Result" />
        <div className={sheet}>
          <div className="container-x py-16 md:py-24">
            <Chapter eyebrow="What it adds up to" />

            {/* The sum: three pictures across the full width, "+" and "=" between them; stacked, with the signs centred, on phones. */}
            <div className="mt-12 grid grid-cols-1 items-start gap-y-4 md:mt-16 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-x-4 lg:gap-x-8">
              {sumTerms.map((t, i) => (
                <Fragment key={t.numeral}>
                  {i > 0 && (
                    <p aria-hidden="true" className={`display text-center text-red ${big} md:self-center`}>
                      {i === sumTerms.length - 1 ? "=" : "+"}
                    </p>
                  )}
                  <figure>
                    <div className="image-frame aspect-square">
                      <Image src={t.image} alt={t.alt} fill unoptimized sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                    </div>
                    <figcaption className="mt-4">
                      <p className="eyebrow">
                        {t.numeral} · {t.name}
                      </p>
                      <p className="mt-2 font-serif text-lg leading-snug text-ink md:text-xl">{t.line}</p>
                    </figcaption>
                  </figure>
                </Fragment>
              ))}
            </div>

            {/* The word "value", in every sense (worth, intent, integrity), set as the name is in chapter I: headword, pronunciation, then its senses. */}
            <div className={`mt-16 md:mt-24 ${grid}`}>
              <div className={text}>
                <p className="eyebrow">What it stands for, in every sense</p>
                <p className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-serif text-xl text-ink-2 md:text-2xl">
                  <span className={`display text-ink ${big}`}>Value</span>
                  <span>/ˈvæl.juː/</span>
                  <span className="text-muted">VAL-yoo</span>
                  <span className="eyebrow">Noun</span>
                </p>
                <div className="mt-6">
                  <Senses
                    senses={[
                      <>What a thing is worth: what it is made of, how long it lasts, and who stands behind it.</>,
                      <>
                        What is done on purpose. Every cloth, cut and mark chosen with intent; nothing there by default.{" "}
                        <span className="italic text-ink-2">&ldquo;Fewer things, each one meant.&rdquo;</span>
                      </>,
                      <>What holds when nobody is watching. The same inside as out.</>,
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* The three senses, worn: the value, the intent and the integrity, three across like Origin, History and The name, worn. */}
            <div className={`mt-10 text-sm leading-relaxed text-ink-2 md:mt-12 md:text-base ${grid} gap-y-6`}>
              <div className="md:col-span-4">
                <p className="eyebrow mb-4">The value</p>
                <p>
                  Cut and sewn by hand in Mauritius, an island that has made fine knitwear and tailoring for half a century. Cloth chosen to last: a
                  piqué heavy enough to hold its collar, linen that is allowed to crease, a knit for the drive home. Signature, always in stock.
                  Limited edition, made once in small numbers, then gone. Any Signature piece made to order, adjusted to fit. Repaired for life, so
                  the price is paid once.
                </p>
              </div>
              <div className="md:col-span-4">
                <p className="eyebrow mb-4">The intent</p>
                <p>
                  Nothing on a piece is there by default. The weight of a cloth, the depth of a collar, where a mark sits and how small it is: each one
                  a decision, taken once and kept. Fewer things, made on purpose, and made properly. All in, then rest like you mean it, like the
                  badger on the label. Shine, don&rsquo;t shout.
                </p>
              </div>
              <div className="md:col-span-4">
                <p className="eyebrow mb-4">The integrity</p>
                <p>
                  The inside gives more than the picture promised. What is said about a piece is true of it, and what is promised is kept: never
                  restocked means never restocked. The name is borrowed from the natural world, so the brand pays rent: {pledgePercentLabel()} of profits goes to
                  creating and sustaining the environments we love wearing the pieces in, published with the accounts every year.
                </p>
              </div>
            </div>

            {/* The closing line (Leo, 2026-10-21). */}
            <PullQuote size="lg" fit className="mt-16 md:mt-24">
              Inspired by nature.
            </PullQuote>
            <div className="mt-10 flex flex-wrap gap-3 md:mt-12">
              <Link href="/shop" className="btn btn-primary">
                Signature
              </Link>
              <Link href="/made-to-order" className="btn btn-outline">
                Made to order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The letter, red, last before the footer as on every editorial page (Leo, 2026-10-21: "put the newsletter on the origins section"). */}
      <Newsletter />
    </div>
  );
}
