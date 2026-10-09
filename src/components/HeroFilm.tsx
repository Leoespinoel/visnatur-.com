"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { film, hasFilm } from "@/data/film";
import { HiggsField } from "./HiggsField";

/**
 * Homepage opener, modelled on Aimé Leon Dore's: a full-screen muted film that
 * plays once with sound then loops silently, a sound button bottom-left, and the whole thing is one link to the shop.
 * Subtitles are burnt into the film itself (see scripts/assemble-film.mjs), so
 * nothing is drawn over it. Until a film exists the Higgs field stands in.
 */
export function HeroFilm() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Always open on the film: stop the browser restoring a previous scroll position.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };
  }, []);

  return (
    <section className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-[#0a0a0a] text-white">
      {hasFilm ? <Film reduced={reduced} /> : <HiggsField className="absolute inset-0" still={reduced} />}
      <Link href="/shop" aria-label="Shop the collection" className="absolute inset-0 z-10" />
    </section>
  );
}

function Film({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [portrait, setPortrait] = useState(false);

  // Portrait source on phones, when there is one.
  useEffect(() => {
    if (!film.sources.portrait) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const src = portrait && film.sources.portrait ? film.sources.portrait : film.sources.landscape;
  const poster = portrait && film.poster.portrait ? film.poster.portrait : film.poster.landscape || undefined;

  // Sound on by default. Browsers only allow silent autoplay before the visitor has interacted,
  // so: try to play with sound; if refused, play silent and switch the sound on at the first
  // click, tap or key press anywhere on the page (the intro's skip counts).
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    let cancelled = false;
    const unmute = () => {
      if (cancelled) return;
      video.muted = false;
      void video.play().then(() => setMuted(false)).catch(() => undefined);
    };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const onInteract = () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      unmute();
    };
    video.muted = false;
    video
      .play()
      .then(() => setMuted(false))
      .catch(() => {
        // Refused with sound: fall back to silent autoplay and wait for a gesture.
        video.muted = true;
        setMuted(true);
        void video.play().catch(() => undefined);
        events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
      });
    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };
  }, [src, reduced]);

  if (reduced) {
    return poster ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
    ) : (
      <div className="absolute inset-0 bg-[#0a0a0a]" />
    );
  }

  return (
    <>
      <video
        key={src}
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        onEnded={(e) => {
          // The song plays once: after the first full play the film keeps looping, silently.
          const v = e.currentTarget;
          v.muted = true;
          setMuted(true);
          v.loop = true;
          void v.play().catch(() => undefined);
        }}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        aria-label={film.title}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        aria-pressed={!muted}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className="absolute bottom-6 left-6 z-30 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
      >
        <SoundIcon on={!muted} />
      </button>
    </>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6L8 10H4z" />
      {on ? (
        <>
          <path d="M16 9a4 4 0 0 1 0 6" />
          <path d="M18.5 6.5a8 8 0 0 1 0 11" />
        </>
      ) : (
        <path d="M17 9l4 6M21 9l-4 6" />
      )}
    </svg>
  );
}
