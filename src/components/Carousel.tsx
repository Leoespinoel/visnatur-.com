"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { ChevronIcon } from "./Icons";

const round = "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-paper";

const square = "flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink transition-colors hover:bg-ink hover:text-paper";

/** With `loop`: the width of one copy of the `count` tiles, gap included, which is the distance the track can jump without anything moving. */
function period(el: HTMLDivElement, count: number) {
  const items = el.children;
  return items.length > count ? (items[count] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft : 0;
}

/**
 * Horizontal snap carousel for large tiles. Arrows sit over the bottom-right corner
 * (as on the reference homepage), as round buttons halfway down each side with `arrows="sides"`
 * (the ralphlauren.com mega menu), at the right of a `header` row above the track with `arrows="top"`
 * ("More to Explore" on ralphlauren.com/men), or not at all. Either way they page by the visible width.
 *
 * With `loop`, the row has no ends: the tiles are laid out three times over and the track starts on the middle copy, so
 * scrolling far enough either way jumps silently by one copy, onto the same picture, and carries on (Leo, 2026-10-21: "it
 * just restarts whichever direction you go in"). The arrows jump first, if their page would cross the edge, then scroll.
 */
export function Carousel({
  children,
  itemClassName,
  ariaLabel,
  gap = "gap-1.5 md:gap-2",
  arrows = "corner",
  header,
  loop = false,
}: {
  children: ReactNode;
  itemClassName: string;
  ariaLabel: string;
  gap?: string;
  arrows?: "corner" | "sides" | "top" | "none";
  /** With `arrows="top"`: what sits left of the arrows, usually the section title */
  header?: ReactNode;
  /** Endless in both directions (see above). */
  loop?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const count = Children.count(children);

  useEffect(() => {
    const el = track.current;
    if (!el || !loop) return;
    // Start on the middle copy, then keep the offset within half a copy of it: a jump of one copy lands on the same tile.
    el.scrollLeft = period(el, count);
    const onScroll = () => {
      const w = period(el, count);
      if (w === 0) return;
      if (el.scrollLeft < 0.35 * w) el.scrollLeft += w;
      else if (el.scrollLeft > 1.65 * w) el.scrollLeft -= w;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [loop, count]);

  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const step = dir * el.clientWidth * 0.9;
    if (loop) {
      // Jump a copy first if this page would run past the band the scroll handler keeps the offset in, so the smooth scroll is never cut short.
      const w = period(el, count);
      const target = el.scrollLeft + step;
      if (w > 0 && target > 1.5 * w) el.scrollLeft -= w;
      else if (w > 0 && target < 0.5 * w) el.scrollLeft += w;
    }
    el.scrollBy({ left: step, behavior: "smooth" });
  };
  const copies = loop ? [0, 1, 2] : [0];
  return (
    <div className="relative" role="region" aria-label={ariaLabel}>
      {arrows === "top" && (
        <div className="mb-6 flex items-end justify-between gap-6 md:mb-8">
          <div className="min-w-0">{header}</div>
          <div className="flex shrink-0 gap-1.5">
            <button type="button" onClick={() => page(-1)} aria-label="Previous" className={square}>
              <ChevronIcon className="rotate-90" width={16} height={16} />
            </button>
            <button type="button" onClick={() => page(1)} aria-label="Next" className={square}>
              <ChevronIcon className="-rotate-90" width={16} height={16} />
            </button>
          </div>
        </div>
      )}
      <div ref={track} className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto ${gap}`}>
        {copies.map((copy) =>
          Children.map(children, (child, i) => (
            <div key={`${copy}-${i}`} className={`shrink-0 snap-start ${itemClassName}`} aria-hidden={loop && copy !== 1 ? true : undefined}>
              {child}
            </div>
          )),
        )}
      </div>
      {arrows === "none" || arrows === "top" ? null : arrows === "sides" ? (
        <>
          <button type="button" onClick={() => page(-1)} aria-label="Previous" className={`${round} left-4`}>
            <ChevronIcon className="rotate-90" width={16} height={16} />
          </button>
          <button type="button" onClick={() => page(1)} aria-label="Next" className={`${round} right-4`}>
            <ChevronIcon className="-rotate-90" width={16} height={16} />
          </button>
        </>
      ) : (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          <button type="button" onClick={() => page(-1)} aria-label="Previous" className={square}>
            <ChevronIcon className="rotate-90" width={16} height={16} />
          </button>
          <button type="button" onClick={() => page(1)} aria-label="Next" className={square}>
            <ChevronIcon className="-rotate-90" width={16} height={16} />
          </button>
        </div>
      )}
    </div>
  );
}
