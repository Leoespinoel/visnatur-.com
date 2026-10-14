"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SlideProgress, useReducedMotion } from "./SlideProgress";

export type BannerSlide = {
  key: string;
  image: string;
  alt: string;
  /** Right of the wordmark in the lockup: the badger, or a word in spaced capitals */
  lockup: { badger: true } | { text: string };
  text: string;
  cta: { label: string; href: string };
};

const MS = 8000;

/**
 * Full-bleed banner after the ralphlauren.com/men collaboration block: the copy sits centred in the
 * left half (a wordmark lockup, two lines and an underlined link), with the same slide line as the hero.
 */
export function BannerSlider({ slides, label }: { slides: BannerSlide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a] text-white sm:aspect-[16/10] md:aspect-[16/8]" aria-roledescription="carousel" aria-label={label}>
      {slides.map((s, i) => (
        <div
          key={s.key}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          inert={i !== index}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
        >
          <Link href={s.cta.href} aria-label={s.cta.label} className="absolute inset-0">
            <Image src={s.image} alt={s.alt} fill unoptimized sizes="100vw" className="object-cover" />
          </Link>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/25" />
          <div className="pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center px-6 text-center md:inset-y-0 md:bottom-auto md:right-auto md:w-1/2 md:justify-center">
            <div className="flex items-center gap-5 md:gap-7">
              <p className="font-serif text-[clamp(20px,2.4vw,34px)] font-medium uppercase leading-[1.05] tracking-[0.22em]">
                Vis
                <br />
                Natur<span className="tracking-normal text-red">æ</span>
              </p>
              <span className="h-16 w-px bg-white/70 md:h-24" aria-hidden />
              {"badger" in s.lockup ? (
                <Image src="/brand/badger-mark.png" alt="The Vis Naturæ badger" width={852} height={300} unoptimized className="h-auto w-[clamp(110px,12vw,180px)]" />
              ) : (
                <p className="font-serif text-[clamp(20px,2.4vw,34px)] font-medium uppercase leading-[1.05] tracking-[0.22em]">{s.lockup.text}</p>
              )}
            </div>
            <p className="mt-6 max-w-md font-serif text-lg leading-snug md:mt-8 md:text-[22px]">{s.text}</p>
            <Link href={s.cta.href} className="pointer-events-auto mt-6 border-b border-white pb-1 text-[12px] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-70 md:mt-8">
              {s.cta.label}
            </Link>
          </div>
        </div>
      ))}
      <div className="container-x absolute inset-x-0 bottom-3 md:bottom-5">
        <SlideProgress
          index={index}
          count={slides.length}
          ms={MS}
          paused={paused}
          reduced={reduced}
          onDone={() => setIndex((i) => (i + 1) % slides.length)}
          onToggle={() => setPaused((p) => !p)}
        />
      </div>
    </section>
  );
}
