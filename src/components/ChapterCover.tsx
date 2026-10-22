"use client";

import { useRef } from "react";
import { useCoverProgress } from "@/lib/use-cover-progress";
import { useRevealOnce } from "@/lib/use-reveal";
import { BadgerRows } from "./BadgerRows";

/**
 * A chapter's title card on Origins (Leo, 2026-10-21: "a transition animation by section, so it is told like a story"): a
 * full-screen white card under the header (Leo, 2026-10-22: white covers, black chapters; it was black) with "Chapter", then the numeral in red and the chapter's name beside it on one line, over the footer's drifting badger rows. It sticks in place
 * while the chapter's own content slides up over it; as it is covered, its text sinks back and fades (`--cover-p`, the share
 * covered, read by `.chapter-cover-text` in globals.css). The text rises in the first time the card is seen. Under reduced
 * motion the card still sticks (that is layout, not motion) but its text stays put.
 *
 * The card's `top` and height follow the header's real height, measured into `--hdr` on the root (a CSS default stands in
 * before scripts run) by useCoverProgress, which also writes `--cover-p`. The section holding the card is the scroll
 * reference, so the card must be its first child.
 */
export function ChapterCover({ numeral, name, as: Heading = "h2" }: { numeral: string; name: React.ReactNode; as?: "h1" | "h2" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [riseRef, shown] = useRevealOnce<HTMLDivElement>(0.2);

  useCoverProgress(ref);

  return (
    <div ref={ref} className="chapter-cover theme-light sticky flex items-center overflow-hidden">
      {/* The drifting badgers from the footer, behind the title (Leo, 2026-10-21). Enough rows to fill a tall screen; the rest is clipped. */}
      <BadgerRows rows={24} />
      <div className="chapter-cover-text container-x relative w-full">
        <div ref={riseRef} className={`rise ${shown ? "is-shown" : ""}`}>
          <p className="eyebrow">Chapter</p>
          {/* The numeral in red and the name beside it, both at one size, like the chapter heads (Leo, 2026-10-21: "next to the numbers, not below"). */}
          <Heading className="display mt-4 text-balance text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95]">
            <span aria-hidden="true" className="mr-[0.3em] text-red">
              {numeral}
            </span>
            <span className="sr-only">Chapter {numeral}: </span>
            {name}
          </Heading>
        </div>
      </div>
    </div>
  );
}
