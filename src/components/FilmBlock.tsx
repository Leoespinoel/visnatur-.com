"use client";

import { useState } from "react";

/** Full-width film block: the poster with a play button; a click plays the film with sound. */
export function FilmBlock({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (!src) return null;
  return (
    <section className="relative aspect-[16/9] w-full overflow-hidden bg-[#0a0a0a] md:aspect-[21/10]" aria-label={title}>
      {playing ? (
        <video src={src} poster={poster} autoPlay controls playsInline className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play the film: ${title}`}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition-transform hover:scale-105"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
