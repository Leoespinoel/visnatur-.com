"use client";

import { useCallback, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import { preload } from "react-dom";
import { site } from "@/data/site";
import { useShuffle } from "@/lib/use-shuffle";

const TEXT = "VIS NATURÆ";
export const INTRO_DONE_EVENT = "vn:intro-done";
const SKIP_GRACE_MS = 300;
const SHUFFLE_START_MS = 450;
const FALLBACK_END_MS = 6000;

/* The shuffle decelerates: each letter takes longer to lock than the one before,
   and the Æ gets an extra beat on its own. Times are ms after the shuffle starts. */
const LAST_SETTLE_MS = 2650;
const settleAt = (k: number, n: number) => {
  if (k === n - 1) return LAST_SETTLE_MS;
  const t = k / (n - 1);
  return 250 + 1700 * Math.pow(t, 1.7);
};
/* Frames start quick (45 ms) and ease out to a slow flicker (170 ms) by the end. */
const tick = (elapsed: number) => 45 + 125 * Math.min(1, Math.pow(elapsed / LAST_SETTLE_MS, 1.5));

/**
 * Red wipe intro. The panels are server-rendered and driven by CSS keyframes
 * (see .intro in globals.css) so they cover the page from first paint; JS adds the
 * letter shuffle, the skip, and removes the overlay when it has finished.
 */
export function IntroOverlay() {
  // White badger mask, fetched with the first HTML so it is ready when it rises in.
  preload("/brand/badger-mark-ink.png", { as: "image" });
  const [gone, setGone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const { letters, shuffle, settle } = useShuffle(TEXT, { settleAt, tick });
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setGone(true);
    document.documentElement.dataset.intro = "done";
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(finish, 0);
      return () => window.clearTimeout(t);
    }
    const mounted = performance.now();
    const shuffleTimer = window.setTimeout(shuffle, SHUFFLE_START_MS);
    const fallback = window.setTimeout(finish, FALLBACK_END_MS);
    const skip = () => {
      if (performance.now() - mounted < SKIP_GRACE_MS) return;
      settle();
      setSkipped(true);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.clearTimeout(shuffleTimer);
      window.clearTimeout(fallback);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [shuffle, settle, finish]);

  if (gone) return null;

  const onEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.animationName === "intro-fade") finish();
  };

  const last = letters.length - 1;

  return (
    <div className="intro" data-skip={skipped ? "" : undefined} aria-hidden="true" onAnimationEnd={onEnd}>
      <div className="intro-panel">
        <span className="intro-badger" aria-hidden="true" />
        <p className="intro-word font-serif font-medium uppercase tracking-[0.22em] leading-none">
          {letters.map((ch, i) => (
            <span
              key={i}
              className={`intro-letter ${i === last ? "intro-ae" : ""} ${ch === " " ? "intro-space" : ""}`}
              style={{ "--i": i } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </p>
        <p className="intro-tag eyebrow">
          {site.tagline}
        </p>
        <button type="button" className="intro-skip eyebrow" onClick={() => undefined}>
          Skip
        </button>
      </div>
    </div>
  );
}
