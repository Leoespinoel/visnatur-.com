"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { CollagePicture } from "@/data/collage";
import { MARQUEE_PX_PER_S } from "@/lib/marquee";

/** A fixed run of small tilts, so the frames sit a touch off straight without the band changing between visits. */
const TILTS = [-3, 2.5, -1.5, 3.5, -2.5, 1.5, -3.5, 2];

/** The track holds the pictures this many times over, so it can wrap around in either direction without a visible jump. */
const COPIES = 3;

/** How long after the last swipe, wheel or touch the band waits before drifting again. */
const RESUME_AFTER_MS = 2500;

/**
 * A band of badger Polaroids drifting across the page (`reverse` sends it the other way), each in a white frame with its
 * caption, at its own small tilt, drifting at the site's one marquee speed (lib/marquee.ts). Two of them bracket the inspiration passage on Origins (Leo, 2026-10-21: "a moving band
 * above and one below the text in opposite directions"). The band is a real horizontal scroller, so a sideways swipe or
 * wheel browses through the frames (Leo, 2026-10-21): the drift stops while the pointer is over it or a swipe is under way
 * and picks up again a moment after. The track wraps around at both ends, so there is no edge to hit. Decorative, so hidden
 * from assistive technology; under reduced motion the band stands still until scrolled.
 */
export function PolaroidBand({ pictures, reverse = false, className = "" }: { pictures: CollagePicture[]; reverse?: boolean; className?: string }) {
  const scroller = useRef<HTMLUListElement>(null);
  const count = pictures.length;

  useEffect(() => {
    const el = scroller.current;
    if (!el || count === 0) return;

    /** Width of one run of the pictures, including the gap after it: the distance the track can jump without anything moving. */
    const period = () => {
      const items = el.children;
      return items.length > count ? (items[count] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft : 0;
    };

    // Start in the middle copy, so there is room to scroll back as well as forward.
    let pos = period();
    el.scrollLeft = pos;

    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovering = false;
    let lastTouch = 0;
    let visible = true;
    let frame = 0;
    let lastTime = 0;

    /** Keeps the scroll offset inside the middle copy; the eye cannot tell, since every copy looks the same. */
    const wrap = () => {
      const w = period();
      if (w === 0) return;
      if (pos >= 2 * w) pos -= w;
      else if (pos < w) pos += w;
      el.scrollLeft = pos;
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const dt = lastTime ? Math.min(time - lastTime, 100) / 1000 : 0;
      lastTime = time;
      const w = period();
      const idle = time - lastTouch > RESUME_AFTER_MS;
      if (stillness.matches || hovering || !idle || !visible || w === 0) return;
      pos += (reverse ? -MARQUEE_PX_PER_S : MARQUEE_PX_PER_S) * dt;
      wrap();
    };

    const touched = () => {
      lastTouch = performance.now();
    };
    const onScroll = () => {
      // A scroll we did not cause is the reader browsing: take their position, wrap it, and hold the drift for a moment.
      if (Math.abs(el.scrollLeft - pos) > 1) {
        pos = el.scrollLeft;
        touched();
        wrap();
      }
    };
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", touched, { passive: true });
    el.addEventListener("touchstart", touched, { passive: true });
    el.addEventListener("touchmove", touched, { passive: true });
    el.addEventListener("pointerdown", touched);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", touched);
      el.removeEventListener("touchstart", touched);
      el.removeEventListener("touchmove", touched);
      el.removeEventListener("pointerdown", touched);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [count, reverse]);

  const items = Array.from({ length: COPIES }, () => pictures).flat();
  return (
    <div className={`py-4 ${className}`} aria-hidden="true">
      <ul ref={scroller} className="no-scrollbar flex gap-4 overflow-x-auto overscroll-x-contain px-4 py-2 md:gap-6" tabIndex={-1}>
        {items.map((p, i) => (
          <li key={i} className="w-[44vw] shrink-0 bg-white p-[2.6vw] pb-[2.2vw] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35)] md:w-[15vw] md:p-[0.9vw] md:pb-[0.75vw]" style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}>
            <div className="image-frame aspect-square">
              <Image src={p.image} alt="" fill unoptimized sizes="(min-width: 768px) 15vw, 44vw" className="object-cover" />
            </div>
            <p className="mt-[1.4vw] truncate font-serif text-[13px] italic leading-none text-neutral-500 md:mt-[0.5vw] md:text-sm">{p.caption}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
