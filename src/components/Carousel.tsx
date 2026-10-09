"use client";

import { Children, useRef, type ReactNode } from "react";
import { ChevronIcon } from "./Icons";

/**
 * Horizontal snap carousel for large tiles. Arrows sit over the bottom-right corner
 * (as on the reference homepage) and page by the visible width.
 */
export function Carousel({ children, itemClassName, ariaLabel, gap = "gap-1.5 md:gap-2" }: { children: ReactNode; itemClassName: string; ariaLabel: string; gap?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  return (
    <div className="relative" role="region" aria-label={ariaLabel}>
      <div ref={track} className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto ${gap}`}>
        {Children.map(children, (child) => (
          <div className={`shrink-0 snap-start ${itemClassName}`}>{child}</div>
        ))}
      </div>
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        <button type="button" onClick={() => page(-1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink transition-colors hover:bg-ink hover:text-paper">
          <ChevronIcon className="rotate-90" width={16} height={16} />
        </button>
        <button type="button" onClick={() => page(1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center border border-line bg-paper text-ink transition-colors hover:bg-ink hover:text-paper">
          <ChevronIcon className="-rotate-90" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
