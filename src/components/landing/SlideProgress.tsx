"use client";

import { useSyncExternalStore } from "react";
import { ChevronIcon } from "../Icons";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** True when the visitor asked for less motion: sliders then stay put until a chip or the next button is clicked. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

/**
 * The ralphlauren.com slider footer: "2 | 4", a line that fills over one slide's time and a pause button.
 * The line's animation drives the slider: when it ends, `onDone` moves to the next slide.
 */
export function SlideProgress({
  index,
  count,
  ms,
  paused,
  reduced,
  onDone,
  onToggle,
}: {
  index: number;
  count: number;
  ms: number;
  paused: boolean;
  reduced: boolean;
  onDone: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 text-white">
      <p className="flex shrink-0 items-center gap-2.5 text-[11px] font-semibold tabular-nums" aria-label={`Slide ${index + 1} of ${count}`}>
        <span>{index + 1}</span>
        <span className="h-3 w-px bg-white/60" aria-hidden />
        <span>{count}</span>
      </p>
      <div className="relative h-px flex-1 bg-white/30" aria-hidden>
        {reduced ? (
          <div className="absolute inset-0 origin-left bg-white" style={{ transform: `scaleX(${(index + 1) / count})` }} />
        ) : (
          <div
            key={index}
            className="absolute inset-0 origin-left bg-white"
            style={{ animation: `slide-progress ${ms}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }}
            onAnimationEnd={onDone}
          />
        )}
      </div>
      {reduced ? (
        // Nothing advances on its own, so the button steps through instead.
        <button type="button" onClick={onDone} aria-label="Next slide" className="flex h-8 w-8 shrink-0 items-center justify-center transition-opacity hover:opacity-70">
          <ChevronIcon className="-rotate-90" width={14} height={14} />
        </button>
      ) : (
        <button type="button" onClick={onToggle} aria-label={paused ? "Play slides" : "Pause slides"} className="flex h-8 w-8 shrink-0 items-center justify-center transition-opacity hover:opacity-70">
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <path d="M2.5 1v10l8-5z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <path d="M2.5 1h2.5v10H2.5zM7 1h2.5v10H7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
