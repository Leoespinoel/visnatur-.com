"use client";

import { Children, useRef, type ReactNode } from "react";
import { ChevronIcon } from "./Icons";

const round = "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-paper";

const square = "flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink transition-colors hover:bg-ink hover:text-paper";

/**
 * Horizontal snap carousel for large tiles. Arrows sit over the bottom-right corner
 * (as on the reference homepage), as round buttons halfway down each side with `arrows="sides"`
 * (the ralphlauren.com mega menu), at the right of a `header` row above the track with `arrows="top"`
 * ("More to Explore" on ralphlauren.com/men), or not at all. Either way they page by the visible width.
 */
export function Carousel({
  children,
  itemClassName,
  ariaLabel,
  gap = "gap-1.5 md:gap-2",
  arrows = "corner",
  header,
}: {
  children: ReactNode;
  itemClassName: string;
  ariaLabel: string;
  gap?: string;
  arrows?: "corner" | "sides" | "top" | "none";
  /** With `arrows="top"`: what sits left of the arrows, usually the section title */
  header?: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
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
        {Children.map(children, (child) => (
          <div className={`shrink-0 snap-start ${itemClassName}`}>{child}</div>
        ))}
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
