import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { altitudeLabel, bottom, grounds, leverageTests, summit } from "@/data/ground";
import { impact, site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { Newsletter } from "@/components/Newsletter";
import { RollingNumber } from "@/components/RollingNumber";
import { PartnerBand } from "@/components/PartnerBand";
import { ImpactCharts } from "@/components/ImpactCharts";
import { BandHeading } from "@/components/club/BandHeading";
import { GroundScene } from "@/components/ground/GroundScene";
import { GroundPanel } from "@/components/ground/GroundPanel";
import { GroundFigures } from "@/components/ground/GroundFigures";

export const metadata: Metadata = {
  title: "On the ground",
  description: `${pledgePercentLabel()} of profits goes to creating and sustaining the environments we love wearing the pieces in. Here is how it works and where it goes.`,
};

/** A block of copy that rises in once its panel is in view, `i` beats after the first; `depth` sets how far it follows the pointer. */
function Rise({ i = 0, depth = 1, sweep = false, className = "", children }: { i?: number; depth?: number; sweep?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`${sweep ? "ground-sweep" : "ground-reveal"} ground-depth ${className}`} style={{ "--i": i, "--depth": depth } as CSSProperties}>
      {children}
    </div>
  );
}

/** The panels' copy keeps the page margin (the outer box) and leaves the right edge to the HUD from md (the inner one). */
const copy = "container-x relative w-full py-14 md:py-16";
const room = "md:pr-28 xl:pr-32";

/**
 * On the ground as a descent (Leo, 2026-10-21: "something like junkbranding.com"; the earlier collage curtain and the badger
 * rows are gone from this page, and so are photographs behind the panels: Leo chose a drawn scene, the sea rising through
 * the screen and a silhouette per ground, over a pool of tinted light). One scene stuck under the header (GroundScene.tsx),
 * the panels stepping over it: the fifth on the summit with the cue to go down, then the three grounds the fifth goes to,
 * each opening on its altitude, with its figures, then the bottom with the sum put in so far, the charts, the rules, and
 * who we build with. The page leaves the white → black → grey → red cycle like /about does, but
 * still ends on red: the finale asks for the next place. Profit is defined on the page so the figure can be checked
 * against the accounts.
 */
export default function ConservationPage() {
  const bottomStage = grounds.length + 1;
  return (
    <>
      <GroundScene>
        {/* The summit: the fifth. */}
        <GroundPanel id="how-it-works" altitude={summit.altitude} stage={0} align="center" label="The fifth">
          <div className={copy}>
            <div className={`${room} grid grid-cols-12 gap-x-6 gap-y-0 md:gap-x-8`}>
              <Rise i={0} depth={0.6} className="col-span-12 md:col-span-8">
                <p className="eyebrow mb-5 !text-ink">On the ground · The fifth</p>
              </Rise>
              <Rise i={1} sweep className="col-span-12 md:col-span-9">
                <h1 className="display text-5xl md:text-6xl">
                  {pledgePercentLabel()} of profits goes to creating and sustaining the environments we love wearing the pieces in.
                </h1>
              </Rise>
              <Rise i={2} depth={1.3} className="col-span-12 md:col-span-6">
                <p className="mt-6 text-base leading-relaxed text-ink-2 md:text-lg">
                  The name is borrowed from nature, so the brand pays rent on it: a fifth of each year&apos;s profit after tax goes to the reef, the
                  native forest and the mangrove coast of the island the pieces are made on and worn in.
                </p>
              </Rise>
              {/* The cue: the way down, with the drop to the bottom. */}
              <Rise i={3} depth={1.4} className="col-span-12 mt-12">
                <a href={`#${grounds[0].id}`} className="eyebrow group inline-flex items-center gap-3 !text-ink">
                  <span className="ground-nod inline-block" aria-hidden="true">
                    ↓
                  </span>
                  <span className="link-underline">The way down · {summit.altitude - bottom.altitude} m to the bottom</span>
                </a>
              </Rise>
            </div>
          </div>
        </GroundPanel>

        {/* The three grounds, top to bottom: the forest, the shore, the reef. */}
        {grounds.map((g, i) => (
          <GroundPanel key={g.id} id={g.id} altitude={g.altitude} stage={i + 1} align="center" label={`${g.name}, ${g.place}`}>
            <div className={copy}>
              <div className={`${room} grid grid-cols-12 gap-x-6 gap-y-10 md:gap-x-8`}>
                <div className="col-span-12 md:col-span-6">
                  <Rise i={0} depth={0.6}>
                    <p className="eyebrow mb-4 !text-ink">
                      {g.numeral} · {g.place}
                    </p>
                  </Rise>
                  {/* The altitude first, huge and light, rolling in like the sums. */}
                  <Rise i={1} depth={0.8}>
                    <p className="display leading-none tabular-nums lining-nums text-[clamp(4.5rem,11vw,9rem)]">
                      {/* Non-breaking spaces: the roller sets each character in its own box, and a plain space would collapse. */}
                      <RollingNumber value={altitudeLabel(g.altitude).replace(/ /g, " ")} />
                    </p>
                  </Rise>
                  <Rise i={2} sweep>
                    <h2 className="display mt-4 text-4xl md:text-5xl">{g.name}</h2>
                  </Rise>
                  <Rise i={3} depth={1.3}>
                    <p className="mt-5 font-serif text-lg leading-snug md:text-xl">{g.title}</p>
                    <p className="mt-3 text-base leading-relaxed text-ink-2">{g.line}</p>
                  </Rise>
                </div>
                <div className="ground-depth col-span-12 md:col-span-5 md:col-start-8" style={{ "--depth": 1.5 } as CSSProperties}>
                  <GroundFigures ground={g} />
                </div>
              </div>
            </div>
          </GroundPanel>
        ))}

        {/* The bottom: the sum, then what it built. */}
        <GroundPanel id="impact" altitude={bottom.altitude} stage={bottomStage} align="start" label="Put in so far">
          <div className="container-x flex min-h-[calc(100svh-var(--hdr))] w-full items-center py-20 text-center md:py-28">
            <div className="w-full">
              <Rise i={0} depth={0.6}>
                <p className="eyebrow mx-auto flex w-fit items-center gap-2.5 bg-paper px-3 py-2">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
                  </span>
                  Put in so far
                </p>
              </Rise>
              <Rise i={1} depth={1.2}>
                <p className="display mt-6 font-semibold leading-none tracking-tight text-red lining-nums tabular-nums text-[clamp(6.5rem,24vw,18rem)]">
                  <RollingNumber value={formatPrice(site.pledgeRaisedCents)} />
                </p>
              </Rise>
            </div>
          </div>
          <div className="container-x pb-16 md:pb-24">
            <div className={room}>
              <BandHeading eyebrow="What it built" title="Counted, not claimed.">
                What the fifth has built so far, updated as the receipts come in.
                {impact.placeholder && <strong className="font-medium text-ink"> Every figure here is a placeholder until the first pieces ship and the first payment clears.</strong>}
              </BandHeading>
              <ImpactCharts />
              {/* The rules, under the charts (Leo, 2026-10-21: the fine print left the summit for the bottom). */}
              <div className="mt-16 grid gap-x-6 gap-y-8 border-t border-line pt-8 md:mt-24 md:grid-cols-3 md:gap-x-8">
                <div className="md:col-span-3">
                  <p className="eyebrow mb-3">The rules</p>
                </div>
                <div>
                  <h3 className="font-serif text-xl">How it is calculated</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    Profit means the company&apos;s net profit after tax for the financial year, as it appears in the annual accounts. The fifth is
                    worked out once the accounts are closed and paid out within three months of the year end.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl">What is published</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    The year&apos;s profit, the sum it produced, and who it went to, listed here with the receipts. The people we build with are
                    named before the first payment is made.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl">Why</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    Clothing made for the sea and the sun borrows everything from the places it is made and worn in. A swim short that never sees
                    clean water is a strange object. So: fewer pieces, made properly, and a fifth of what we earn put back.
                  </p>
                  <Link href="/made-to-order" className="eyebrow link-underline mt-4 inline-block !text-ink">
                    Made to order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </GroundPanel>

        {/* Who we build with, still at the bottom. */}
        <GroundPanel id="partners" altitude={bottom.altitude} stage={bottomStage} align="start" label="Who we build with" className="pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="container-x mb-10 md:mb-12">
            <div className={`${room} grid gap-10 md:grid-cols-12`}>
              <div className="md:col-span-5">
                <Rise i={0} depth={0.6}>
                  <p className="eyebrow mb-3">Where it goes</p>
                </Rise>
                <Rise i={1} sweep>
                  <h2 className="display text-4xl md:text-5xl">Where the fifth does the most.</h2>
                </Rise>
                <Rise i={2} depth={1.3}>
                  <p className="mt-5 text-sm leading-relaxed text-ink-2">
                    Not to the best-known name, and not spread so thin it changes nothing. It goes where each euro does the most, and everyone
                    we build with has to pass three tests.
                  </p>
                </Rise>
              </div>
              <ol className="divide-y divide-line border-y border-line md:col-span-6 md:col-start-7">
                {leverageTests.map((t, i) => (
                  <li key={t.title} className="ground-reveal grid grid-cols-[2.5rem_1fr] gap-x-4 py-5" style={{ "--i": i + 2 } as CSSProperties}>
                    <span className="eyebrow pt-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-serif text-2xl">{t.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{t.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <PartnerBand />
          <div className="container-x">
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
              The people we build with are established, audited organisations in each place, held to the same three tests. Names and
              agreements go up here before the first payment is made.
            </p>
          </div>
        </GroundPanel>
      </GroundScene>

      {/* The finale, red above the trust row: the letters, asked for the next place (Leo, 2026-10-21; it replaced the
          "Where next" block with its "Name a place" mail link). */}
      <div id="next" className="scroll-mt-24">
        <Newsletter context="ground" />
      </div>
    </>
  );
}
