"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { useMarqueeSpeed } from "@/lib/marquee";
import { INTRO_DONE_EVENT } from "./IntroOverlay";

/** How long one glitch runs, and the least time between two scroll-triggered ones. */
const GLITCH_MS = 800;
const GLITCH_GAP_MS = 1600;

/**
 * The glitch from forceofnature.org.in/store: two coloured copies of the text (`.gl::before/::after`, globals.css) show
 * through random horizontal slices and jitter sideways, the jitter dying away over `dur` ms. Nothing moves under reduced motion.
 */
function glitch(el: HTMLElement, dur = GLITCH_MS) {
  if (el.classList.contains("is-glitch")) return;
  el.classList.add("is-glitch");
  const t0 = performance.now();
  const step = () => {
    const p = (performance.now() - t0) / dur;
    if (p >= 1) {
      el.classList.remove("is-glitch");
      for (const k of ["--t1", "--b1", "--x1", "--t2", "--b2", "--x2"]) el.style.removeProperty(k);
      return;
    }
    const amp = (1 - p) ** 2;
    const t1 = Math.random() * 80;
    const t2 = Math.random() * 80;
    el.style.setProperty("--t1", `${t1}%`);
    el.style.setProperty("--b1", `${100 - t1 - 6 - Math.random() * 18}%`);
    el.style.setProperty("--t2", `${t2}%`);
    el.style.setProperty("--b2", `${100 - t2 - 6 - Math.random() * 18}%`);
    el.style.setProperty("--x1", `${(Math.random() - 0.5) * 28 * amp}px`);
    el.style.setProperty("--x2", `${(Math.random() - 0.5) * 28 * amp}px`);
    window.setTimeout(step, 40);
  };
  step();
}

/**
 * A line of serif type running across the page on the site's marquee, at the site's one speed, giant as a page title or, with `size="band"`, as a slim
 * strip (Leo, 2026-10-21: the Stories strip "as wide as the Follow band below it"). A phrase equal to the brand
 * name is set like the logo: tracked capitals with the red Æ, in Wordmark's proportions, but static and not a link.
 *
 * The phrases glitch like the collection names on forceofnature.org.in/store: once the page is revealed, again whenever the
 * reader scrolls with the band on screen (at most every 1.6 s), and under the pointer. It is decorative, so the page keeps a
 * real heading; under reduced motion it stands still (globals.css), shows the start of the line and never glitches.
 */
/**
 * `giant` is the page-title size, with padding that keeps the descenders (the g in "First light") inside the clipped strip; `band`
 * runs the line at the announcement bar's 11px above the menu (Leo, 2026-10-21), and there the wordmark is set at the full line
 * size rather than the 80% it takes in the giant line, so it matches the other bands' type.
 */
const sizes = { giant: "pb-[0.14em] pt-[0.04em] text-[17vw] md:text-[10vw]", band: "text-[11px] leading-none" };

export function WordTicker({ phrases, size = "giant", className = "" }: { phrases: string[]; size?: keyof typeof sizes; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // The track slides by half its width, so each half holds every phrase once: at this size that is already wider than the screen.
  const items = [...phrases, ...phrases];
  // The line slides at the site's one marquee speed (lib/marquee.ts), measured from the track's width.
  const track = useRef<HTMLParagraphElement>(null);
  useMarqueeSpeed(track);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>(".gl"));
    let last = 0;
    let onScreen = false;
    // Only the phrases currently on screen, with the ones further along starting a beat later.
    const all = () => {
      const now = performance.now();
      if (now - last < GLITCH_GAP_MS) return;
      last = now;
      const w = window.innerWidth;
      words
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.right > 0 && r.left < w;
        })
        .forEach((el, i) => window.setTimeout(() => glitch(el), i * 60));
    };

    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting), { threshold: 0.2 });
    io.observe(root);
    const onScroll = () => onScreen && all();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The first glitch as the page is revealed: right after the intro, or on mount when there is none.
    let timer = 0;
    const reveal = () => {
      timer = window.setTimeout(all, 200);
    };
    const waiting = site.intro && document.documentElement.dataset.intro !== "done";
    if (waiting) window.addEventListener(INTRO_DONE_EVENT, reveal);
    else reveal();

    const hovers = words.map((el) => {
      const on = () => glitch(el);
      el.addEventListener("pointerenter", on);
      return () => el.removeEventListener("pointerenter", on);
    });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(INTRO_DONE_EVENT, reveal);
      window.clearTimeout(timer);
      hovers.forEach((off) => off());
    };
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-hidden="true">
      <p ref={track} className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className={`display flex shrink-0 items-baseline whitespace-nowrap ${sizes[size]}`}>
            {t === site.name ? (
              <span className={`gl inline-flex items-baseline font-serif font-medium uppercase tracking-[0.22em] ${size === "band" ? "" : "text-[0.8em]"}`} data-text="VIS NATURÆ">
                VIS<span className="inline-block w-[0.5em]" />NATUR
                <span className="-ml-[0.08em] text-[1.24em] tracking-normal text-red">Æ</span>
              </span>
            ) : (
              <span className="gl" data-text={t}>
                {t}
              </span>
            )}
            {/* In the band, the dot sits as far from the names as the follow line's dot from its text (Leo, 2026-10-21). */}
            <span className={`text-red ${size === "band" ? "px-5 md:px-7" : "px-[0.3em]"}`}>·</span>
          </span>
        ))}
      </p>
    </div>
  );
}
