"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { comingSoon } from "@/data/availability";
import { locationOf } from "@/data/locations";
import { setHeroCoords } from "@/lib/hero-location";
import { ComingSoon } from "../ComingSoon";
import { SlideProgress, useReducedMotion } from "./SlideProgress";

export type HeroSlide = {
  key: string;
  /** Chip label under the card */
  label: string;
  /** Spaced capitals under the wordmark, like "Purple Label" on ralphlauren.com */
  title: string;
  text: string;
  cta: { label: string; href: string };
  /** Campaign photo inside the card */
  image: string;
  alt: string;
  /** CSS object-position for the card photo when it is cropped tall on phones */
  position?: string;
  /** Empty landscape filling the screen behind the card */
  plate: string;
  /** Portrait for the round chip thumbnail */
  thumb: string;
};

const MS = 7000;

/**
 * Full-screen hero after ralphlauren.com/men: a landscape fills the screen and a campaign card sits in
 * the middle with the wordmark, a line and a button. Chips under the card switch slides; the line at
 * the bottom shows the time left on the slide. The header floats over it (see Header.tsx).
 */
export function HeroSlider({ slides, label }: { slides: HeroSlide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const next = () => setIndex((i) => (i + 1) % slides.length);

  // The header shows the slide's coordinates under the wordmark too.
  useEffect(() => {
    setHeroCoords(locationOf(slides[index].image)?.coords);
    return () => setHeroCoords(undefined);
  }, [slides, index]);

  return (
    <section className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-[#0a0a0a] text-white" aria-roledescription="carousel" aria-label={label}>
      {slides.map((s, i) => (
        <div key={s.key} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden>
          <Image src={s.plate} alt="" fill unoptimized preload={i === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center px-4 pb-4 pt-[72px] md:px-0 md:pb-5 md:pt-[104px]">
        <div className="relative w-full flex-1 overflow-hidden bg-black/30 md:w-[68%]">
          {slides.map((s, i) => (
            <div
              key={s.key}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
              inert={i !== index}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}: ${s.label}`}
            >
              <Link href={s.cta.href} aria-label={`${s.title}: ${s.cta.label}`} className="group absolute inset-0">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  unoptimized
                  preload={i === 0}
                  sizes="(min-width: 768px) 68vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
                  style={s.position ? { objectPosition: s.position } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
                {comingSoon(s.cta.href) && <ComingSoon />}
              </Link>
              {/* Lower in the card than on RL: our campaigns have faces where their close-ups have calm. */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 text-center md:pb-14">
                <p className="font-serif text-[clamp(26px,4.2vw,56px)] font-medium uppercase leading-none tracking-[0.24em]">
                  Vis Natur<span className="tracking-normal text-red">æ</span>
                </p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.5em] md:mt-4 md:text-[13px]">{s.title}</p>
                <p className="mt-5 max-w-md font-serif text-lg leading-snug md:mt-7 md:text-xl">{s.text}</p>
                <Link href={s.cta.href} className="btn btn-ghost pointer-events-auto mt-6 min-w-[160px] md:mt-8">
                  {s.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div role="tablist" aria-label="Choose a slide" className="no-scrollbar mt-3 flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/25 bg-black/35 p-1 backdrop-blur md:mt-4">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-4 font-serif text-[15px] transition-colors md:text-[17px] ${
                i === index ? "bg-white text-black" : "text-white/85 hover:bg-white/10"
              }`}
            >
              <span className="relative h-7 w-7 overflow-hidden rounded-full md:h-8 md:w-8">
                <Image src={s.thumb} alt="" fill unoptimized sizes="32px" className="object-cover object-[50%_25%]" />
              </span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="container-x mt-2 w-full md:mt-3">
          <SlideProgress
            index={index}
            count={slides.length}
            ms={MS}
            paused={paused}
            reduced={reduced}
            onDone={next}
            onToggle={() => setPaused((p) => !p)}
          />
        </div>
      </div>
    </section>
  );
}
