"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Sizes an element's text so it runs on exactly one line across the element's full width, from the `md` breakpoint up
 * (below it the text wraps at its own size). The element's first child must be the line itself, an inline-block span that
 * does not wrap. Text width scales with font size, so one measurement sets the size; it is taken again when the element's
 * width changes and once the web fonts have loaded. Used on Origins, where a headline and a quote run from the left edge of
 * the grid to the right edge of the paragraphs (Leo, 2026-10-21), each at its own size. The size is set straight on the
 * element, not through React, so re-renders leave it alone.
 */
export function useFitLine(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    const line = el?.firstElementChild as HTMLElement | null;
    if (!el || !line) return;
    const wide = window.matchMedia("(min-width: 768px)");

    const fit = () => {
      el.style.fontSize = "";
      if (!wide.matches) return;
      const base = parseFloat(getComputedStyle(el).fontSize);
      const width = line.getBoundingClientRect().width;
      if (width > 0) el.style.fontSize = `${(base * el.clientWidth) / width}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    // Only a change of width calls for a new size: the fit itself changes the element's height, which must not refit.
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      fit();
    });
    ro.observe(el);
    wide.addEventListener("change", fit);
    return () => {
      ro.disconnect();
      wide.removeEventListener("change", fit);
      el.style.fontSize = "";
    };
  }, [ref]);
}
