"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlideProgress, useReducedMotion } from "./landing/SlideProgress";

/** One slide of the events stage: an event, or one of the kinds of day we plan until the first is agreed. */
export type OrbitSlide = {
  key: string;
  /** The small line over the title: the sport, or the kind of day. */
  eyebrow: string;
  title: string;
  dek?: string;
  /** Under the title for an event: its dates and place. */
  meta?: string;
  image: string;
  alt: string;
  cta: { label: string; href: string };
};

const MS = 6500;
/** How far a drag has to go, in px, before it turns the stage; shorter ones count as clicks. */
const SWIPE = 40;
/** Past this, in px, a press is a drag: the stage takes the pointer and the release is no click. */
const SLOP = 6;
/** How far a sideways scroll (trackpad, shift + wheel) has to go, in px, to turn the stage once. */
const SCROLL = 90;
/** After a scroll turns it, further sideways deltas are ignored this long, so trackpad momentum doesn't turn it twice. */
const SCROLL_LOCK = 600;

/**
 * The events stage, edge to edge across the viewport (Leo, 2026-10-21: "make this fill the white space"), after the hero on forceofnature.org.in/store (Leo, 2026-10-21: "a rotating slide show where you see the next
 * slides / events in the background"): the current slide sits in front at full size, the ones either side of it stand behind,
 * smaller, turned a little and dimmed, like windows on a ring. It turns on its own every few seconds (the line underneath shows
 * the time left, as on the landing sliders), and by hand: click a slide behind, drag or swipe, scroll sideways, or use the arrow keys. It holds
 * still while the pointer is over it. The one in front links to its page; nothing moves on its own under reduced motion.
 */
export function EventsOrbit({ slides, label }: { slides: OrbitSlide[]; label: string }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  // The pointer's travel since the press, in px, while a drag is on; null between drags.
  const [dragX, setDragX] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const press = useRef<{ x: number; moved: number; id: number } | null>(null);
  const lastMoved = useRef(0);
  const stage = useRef<HTMLDivElement>(null);

  const go = useCallback((to: number) => setIndex(((to % n) + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  // Arrow keys turn it while focus is on the stage.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // A sideways scroll turns it too (Leo, 2026-10-21: "it rotates when I scroll from side to side"): the ring follows the
  // scroll live, like a drag, and turns once the scroll has gone far enough; a scroll that stops short settles back. Up and
  // down scrolling is left to the page. Attached by hand because the browser's own back/forward swipe has to be cancelled,
  // which React's passive wheel listener can't do.
  useEffect(() => {
    const el = stage.current;
    if (!el || n < 2) return;
    let travel = 0;
    let lockedUntil = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      travel += e.deltaX;
      clearTimeout(settle);
      if (Math.abs(travel) >= SCROLL) {
        if (travel > 0) next(); else prev();
        travel = 0;
        lockedUntil = now + SCROLL_LOCK;
        setDragX(null);
        return;
      }
      setDragX(-travel);
      settle = setTimeout(() => { travel = 0; setDragX(null); }, 150);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(settle); };
  }, [n, next, prev]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || n < 2) return;
    press.current = { x: e.clientX, moved: 0, id: e.pointerId };
    lastMoved.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    p.moved = Math.max(p.moved, Math.abs(dx));
    if (p.moved <= SLOP) return;
    // Once it reads as a drag, the stage takes the pointer so the link underneath doesn't fire on release.
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    setDragX(dx);
  };
  const endPress = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p || p.id !== e.pointerId) return;
    press.current = null;
    lastMoved.current = p.moved;
    const dx = e.clientX - p.x;
    setDragX(null);
    if (dx <= -SWIPE) next();
    else if (dx >= SWIPE) prev();
  };
  // The click that ends a drag must not follow the link or turn to the slide it landed on.
  const onClickCapture = (e: React.MouseEvent) => {
    if (lastMoved.current <= SLOP) return;
    lastMoved.current = 0;
    e.preventDefault();
    e.stopPropagation();
  };

  const dragging = dragX !== null;
  const paused = stopped || hovered || dragging;

  return (
    <div>
      <div
        ref={stage}
        tabIndex={-1}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false); }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPress}
        onPointerCancel={endPress}
        onClickCapture={onClickCapture}
        className={`relative overflow-hidden outline-none select-none ${n > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
        style={{ perspective: "1800px", touchAction: "pan-y" }}
      >
        {/* The stage is as tall as the slide in front; the slides are laid over it. */}
        <div className="mx-auto aspect-[4/5] w-[78%] sm:aspect-[3/2] md:aspect-[2/1] md:w-[64%]" aria-hidden />
        {slides.map((s, i) => {
          // Where this slide stands on the ring: 0 in front, ±1 either side, further ones out of sight.
          let o = (((i - index) % n) + n) % n;
          if (o > n / 2) o -= n;
          const front = o === 0;
          const side = Math.abs(o) === 1;
          const shown = front || side;
          const scale = front ? 1 : side ? 0.84 : 0.7;
          const transform = `translateX(calc(-50% + ${o * 62}% + ${dragX ?? 0}px)) rotateY(${-o * 7}deg) scale(${scale})`;
          return (
            <div
              key={s.key}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${s.title}`}
              aria-hidden={!shown}
              className={`absolute inset-y-0 left-1/2 w-[78%] md:w-[64%] ${dragging ? "" : "transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)]"} ${
                shown ? "" : "pointer-events-none opacity-0"
              }`}
              style={{ zIndex: front ? 3 : side ? 2 : 1, transform }}
            >
              <article className="relative h-full w-full overflow-hidden bg-paper-2 text-white">
                <Link
                  href={s.cta.href}
                  aria-label={`${s.title}: ${s.cta.label}`}
                  tabIndex={front ? 0 : -1}
                  draggable={false}
                  className="group absolute inset-0"
                  onDragStart={(e) => e.preventDefault()}
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    unoptimized
                    draggable={false}
                    sizes="(min-width: 768px) 64vw, 78vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                {/* The slide's number, top-left, like the windows on the Force of Nature ring. */}
                <p className="pointer-events-none absolute left-5 top-5 text-[11px] font-semibold tabular-nums tracking-[0.18em] text-white/85 md:left-8 md:top-7" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </p>
                {/* The copy belongs to the slide in front; behind, only the picture and its number show, so no half-hidden titles peek out. */}
                <div className={`pointer-events-none absolute inset-x-0 bottom-0 p-5 transition-opacity duration-500 md:p-8 ${front ? "opacity-100" : "opacity-0"}`} inert={!front}>
                  <div className="max-w-xl">
                    <p className="eyebrow mb-3 !text-white/85">{s.eyebrow}</p>
                    <h3 className="display text-3xl md:text-5xl">{s.title}</h3>
                    {s.meta && <p className="mt-3 text-[13px] text-white/85">{s.meta}</p>}
                    {s.dek && <p className={`${s.meta ? "mt-1.5" : "mt-3"} max-w-md text-[13px] leading-relaxed text-white/85`}>{s.dek}</p>}
                    <div className="pointer-events-auto mt-5">
                      <Link
                        href={s.cta.href}
                        tabIndex={front ? 0 : -1}
                        className="border-b border-white pb-1 text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
                      >
                        {s.cta.label}
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Behind: a veil over the whole slide, and the slide itself a button that brings it to the front. */}
                {!front && (
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show ${s.title}`}
                    className="absolute inset-0 bg-black/45 transition-colors hover:bg-black/30 focus-visible:bg-black/30"
                  />
                )}
              </article>
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <div className="mx-auto mt-5 w-[78%] md:mt-6 md:w-[64%]">
          <SlideProgress index={index} count={n} ms={MS} paused={paused} reduced={reduced} onDone={next} onToggle={() => setStopped((p) => !p)} tone="ink" />
        </div>
      )}
    </div>
  );
}
