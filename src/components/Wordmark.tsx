"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { useShuffle } from "@/lib/use-shuffle";
import { INTRO_DONE_EVENT } from "./IntroOverlay";

const TEXT = "VIS NATURÆ";

/**
 * Wordmark: VIS NATUR + Æ. The final Æ is the logo, in brand red.
 * Letters shuffle through random capitals (Æ included) and settle left to right
 * once the intro has finished, and again on hover or focus.
 *
 * With `swapOnScroll` (the header), the words give way to the badger while the
 * page is scrolling and come back once it has been still for a moment.
 */
export function Wordmark({
  className = "",
  size = "md",
  swapOnScroll = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  swapOnScroll?: boolean;
}) {
  const text = { sm: "text-lg", md: "text-[21px] md:text-2xl", lg: "text-4xl md:text-5xl" };
  const mark = { sm: "text-[22px]", md: "text-[26px] md:text-[30px]", lg: "text-5xl md:text-6xl" };

  const { letters, shuffle } = useShuffle(TEXT);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const ref = useRef<HTMLSpanElement>(null);

  // Lock the rendered width of the settled wordmark so shuffling never shifts the header.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Shuffle as the page is revealed: right after the intro, or on mount when there is none.
  useEffect(() => {
    if (!site.intro || document.documentElement.dataset.intro === "done") {
      const t = window.setTimeout(shuffle, 150);
      return () => window.clearTimeout(t);
    }
    const onDone = () => shuffle();
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
  }, [shuffle]);

  const scrolling = useScrolling(swapOnScroll);
  const last = letters.length - 1;
  const fade = "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] motion-reduce:transition-none";

  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      onMouseEnter={shuffle}
      onFocus={shuffle}
      className={`relative inline-flex items-baseline justify-center whitespace-nowrap font-serif font-medium uppercase tracking-[0.22em] leading-none ${text[size]} ${className}`}
      style={width ? { width } : undefined}
    >
      {/* Hidden, static copy used only for measuring the settled width. */}
      <span ref={ref} aria-hidden="true" className="absolute invisible inline-flex items-baseline whitespace-nowrap">
        <span>VIS NATUR</span>
        <span className={`-ml-[0.08em] tracking-normal ${mark[size]}`}>Æ</span>
      </span>
      <span aria-hidden="true" className={`inline-flex items-baseline ${fade} ${scrolling ? "scale-[0.97] opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0"}`}>
        {letters.map((ch, i) =>
          i === last ? (
            <span key={i} className={`-ml-[0.08em] tracking-normal text-red ${mark[size]}`}>
              {ch}
            </span>
          ) : (
            <span key={i} className={ch === " " ? "inline-block w-[0.5em]" : ""}>
              {ch}
            </span>
          ),
        )}
      </span>
      {swapOnScroll && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center ${fade} ${scrolling ? "scale-100 opacity-100 blur-0" : "scale-[0.96] opacity-0 blur-[2px]"}`}
        >
          <Image src="/brand/badger-mark.png" alt="" width={852} height={300} unoptimized className="h-9 w-auto max-w-none -translate-y-1 md:h-11" />
        </span>
      )}
    </Link>
  );
}

/** True while the page is scrolling, false again after `idle` ms without a scroll event. */
function useScrolling(enabled: boolean, idle = 400) {
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let timer = 0;
    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrolling(false), idle);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [enabled, idle]);
  return scrolling;
}
