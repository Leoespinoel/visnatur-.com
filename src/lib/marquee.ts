"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * One speed for every band that slides across the site, in CSS pixels per second: the pace of the announcement bar above the
 * menu (Leo, 2026-10-21: "make all the bands move at the same speed, the same speed as the top one above the menu"). The
 * marquee keyframes move a track by half its width per cycle, so a band's duration has to follow its width for the speed
 * to be the same; `useMarqueeSpeed` measures the track and sets `--marquee-duration` accordingly.
 */
export const MARQUEE_PX_PER_S = 65;

/** Sets the track's `--marquee-duration` from its width so it slides at MARQUEE_PX_PER_S, again when fonts load or the width changes. */
export function useMarqueeSpeed(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => el.style.setProperty("--marquee-duration", `${(el.scrollWidth / 2 / MARQUEE_PX_PER_S).toFixed(1)}s`);
    set();
    document.fonts?.ready.then(set);
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}
