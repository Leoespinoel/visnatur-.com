"use client";

import { useRef, useState } from "react";

const TRACK = "/audio/where-you-really-come-from.mp4"; // .mp4, not .m4a: Hostinger serves .m4a as text/plain // Tobiahs, VV-Ace – Where You Really Come From

/**
 * Site soundtrack. Silent until the visitor clicks the small button bottom-left, then plays once,
 * start to finish; the same button pauses and resumes it. It lives in the root layout, so it keeps
 * playing while visitors move between pages. The button disappears when the song has finished.
 */
export function SiteMusic() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  };

  return (
    <>
      <audio
        ref={ref}
        src={TRACK}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
      />
      {!ended && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          data-site-music=""
          aria-pressed={playing}
          aria-label={playing ? "Turn music off" : "Turn music on"}
          className="fixed bottom-6 left-6 z-50 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
        >
          <SoundIcon on={playing} />
        </button>
      )}
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
