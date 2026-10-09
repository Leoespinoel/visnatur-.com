"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { film, hasFilm } from "@/data/film";
import { HiggsField } from "./HiggsField";

/**
 * Homepage opener, modelled on Aimé Leon Dore's: a full-screen muted film that
 * loops silently under the site soundtrack (see SiteMusic), and the whole thing is one link to the shop.
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

  // The film is always silent: the site's soundtrack (SiteMusic) plays over it. Autoplay can still
  // be blocked until the first interaction on some browsers, so nudge it then.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const nudge = () => void video.play().catch(() => undefined);
    nudge();
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, nudge, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, nudge));
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
    <video
      key={src}
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
      aria-label={film.title}
    />
  );
}
