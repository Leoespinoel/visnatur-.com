"use client";

import { useEffect, type RefObject } from "react";

/**
 * Scroll progress for a sticky cover (ChapterCover on Origins, WildCover on The scene). The cover must be the first child
 * of the section that is its scroll reference. The header's real height is measured into `--hdr` on the root (a CSS
 * default stands in before scripts run), then on every scroll two custom properties are written on the cover:
 *
 * - `--drift-p`: 0 → 1 while the runway (the spacer between the cover and the sheet that follows it) scrolls past.
 *   Without a runway it is 1 as soon as the sheet starts to cover.
 * - `--cover-p`: 0 → 1 while the sheet covers the stuck cover; the share of it already covered.
 *
 * Under reduced motion nothing is written, so the cover still sticks (that is layout) but nothing moves.
 */
export function useCoverProgress(ref: RefObject<HTMLElement | null>, runway?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;
    const header = document.querySelector("header");
    const measure = () => header && document.documentElement.style.setProperty("--hdr", `${header.offsetHeight}px`);
    measure();
    window.addEventListener("resize", measure);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => window.removeEventListener("resize", measure);

    let raf = 0;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const update = () => {
      raf = 0;
      // How far the section has scrolled on under the stuck cover.
      const offset = el.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const run = runway?.current?.offsetHeight ?? 0;
      const drift = run > 0 ? clamp(offset / run) : offset > 0 ? 1 : 0;
      const cover = clamp((offset - run) / el.offsetHeight);
      el.style.setProperty("--drift-p", drift.toFixed(3));
      el.style.setProperty("--cover-p", cover.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, runway]);
}
