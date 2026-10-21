"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { wildCollage } from "@/data/wild-collage";

/** Extra lift each column gets on top of the page's own scroll (vh over the curtain's travel), so they leave at different speeds. */
const SPEEDS = [0, 30, 12, 45];

/**
 * The curtain over The fifth (Leo, 2026-10-21): a full-screen collage of the places and the models in the clothes that
 * sits on top of the section and scrolls away with the page, uncovering the section pinned beneath it (`.wild-under`,
 * conservation/page.tsx). As it travels, each column gets its own extra lift (`--drift-p` × `--speed`), so the pictures
 * leave at different speeds. Four columns from `lg`, three from `md`, two on phones. Decorative, so hidden from assistive
 * technology; under reduced motion the collage still scrolls away (that is layout) but the columns keep together.
 */
export function WildCurtain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr")) || 0;
      // 0 while the curtain's top sits under the header, 1 once it has travelled its own height past it.
      const p = Math.min(1, Math.max(0, (hdr - rect.top) / rect.height));
      el.style.setProperty("--drift-p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="wild-curtain relative z-[2] overflow-hidden bg-black" aria-hidden="true">
      <div className="flex h-full w-full gap-1">
        {wildCollage.map((column, i) => (
          <div
            key={i}
            className={`wild-curtain-col flex min-w-0 flex-1 flex-col gap-1 ${i === 2 ? "hidden md:flex" : i === 3 ? "hidden lg:flex" : ""}`}
            style={{ "--speed": `${SPEEDS[i]}vh` } as CSSProperties}
          >
            {column.map((p, j) => (
              <div key={p.image} className="relative w-full shrink-0 bg-paper-2" style={{ aspectRatio: p.aspect }}>
                <Image
                  src={p.image}
                  alt=""
                  fill
                  unoptimized
                  priority={j === 0}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* A faint scrim under the header so the nav stays legible over bright water. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}
