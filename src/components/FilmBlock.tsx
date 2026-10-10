"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Full-width film block styled as a campaign: the poster with the title bottom-left and a
 * "Play film" button (plus an optional link) bottom-right; play starts the film with sound.
 */
export function FilmBlock({ src, poster, title, text, link }: { src: string; poster?: string; title: string; text?: string; link?: { label: string; href: string } }) {
  const [playing, setPlaying] = useState(false);
  if (!src) return null;
  return (
    <section className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a] text-white sm:aspect-[16/9] md:aspect-[16/7]" aria-label={title}>
      {playing ? (
        <video src={src} poster={poster} autoPlay controls playsInline className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
          <div className="container-x absolute inset-x-0 bottom-0 flex flex-col gap-5 pb-7 md:flex-row md:items-end md:justify-between md:pb-10">
            <div className="max-w-xl">
              <h2 className="display text-4xl md:text-5xl">{title}</h2>
              {text && <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/80">{text}</p>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPlaying(true)} aria-label={`Play the film: ${title}`} className="btn btn-ghost min-w-[140px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play film
              </button>
              {link && (
                <Link href={link.href} className="btn btn-ghost min-w-[140px]">
                  {link.label}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
