"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useReducedMotion } from "./landing/SlideProgress";

export type HeroStory = {
  key: string;
  title: string;
  dek: string;
  image: string;
  alt: string;
  /** CSS object-position, for where a wide picture is cropped on phones. */
  position?: string;
  href: string;
  cta: string;
  /** Shown after the button, joined with dots: "Journal · 2 min read". */
  meta: string[];
};

const MS = 6500;

/**
 * The top of /stories after redbull.com: a full-bleed picture per story, the header floating over it
 * (Header.tsx), title, line, a red button and the meta bottom-left (centred on phones), and dots that
 * fill over one slide's time and then move on. The page beneath slides up over its bottom edge.
 */
export function StoriesHero({ slides }: { slides: HeroStory[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotion();
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const stopped = paused || held;

  return (
    <section
      className="relative isolate h-[88svh] min-h-[560px] overflow-hidden bg-[#0a0a0a] text-white"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onFocus={() => setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.key}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          inert={i !== index}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
        >
          <Link href={s.href} tabIndex={-1} aria-hidden className="absolute inset-0">
            <Image
              src={s.image}
              alt={s.alt}
              fill
              unoptimized
              preload={i === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[7000ms] ease-out ${i === index && !reduced ? "scale-[1.04]" : "scale-100"}`}
              style={s.position ? { objectPosition: s.position } : undefined}
            />
          </Link>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25 md:bg-gradient-to-tr md:from-black/70 md:via-black/15 md:to-black/10" />

          <div className="container-x pointer-events-none absolute inset-x-0 bottom-0 pb-24 text-center md:pb-28 md:text-left">
            <h2 className="display mx-auto max-w-2xl text-[2.5rem] md:mx-0 md:text-6xl">{s.title}</h2>
            <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-white/85 md:mx-0 md:text-sm">{s.dek}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
              <Link
                href={s.href}
                className="pointer-events-auto inline-flex h-10 items-center rounded-full bg-red px-6 text-[13px] font-medium text-white transition-colors hover:bg-red-2"
              >
                {s.cta}
              </Link>
              <p className="text-[12px] text-white/80">{s.meta.join(" · ")}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Dots: the current one is a pill that fills over the slide's time; when it is full the next slide shows. */}
      <div className="container-x absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-11 md:justify-start md:pb-14">
        <div role="tablist" aria-label="Choose a story" className="flex items-center">
          {slides.map((s, i) => (
            <button key={s.key} type="button" role="tab" aria-selected={i === index} aria-label={s.title} onClick={() => setIndex(i)} className="group p-1.5">
              <span
                className={`relative block h-1.5 overflow-hidden rounded-full bg-white/45 transition-[width,background-color] duration-300 group-hover:bg-white/70 ${
                  i === index ? "w-8" : "w-1.5"
                }`}
              >
                {i === index &&
                  (reduced ? (
                    <span className="absolute inset-0 bg-white" />
                  ) : (
                    <span
                      key={index}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      style={{ animation: `slide-progress ${MS}ms linear forwards`, animationPlayState: stopped ? "paused" : "running" }}
                      onAnimationEnd={next}
                    />
                  ))}
              </span>
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slides" : "Pause slides"}
            className="flex h-7 w-7 items-center justify-center text-white/80 transition-opacity hover:opacity-70"
          >
            {paused ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M2.5 1v10l8-5z" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                <path d="M2.5 1h2.5v10H2.5zM7 1h2.5v10H7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
