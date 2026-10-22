"use client";

import { useEffect, useRef, useState } from "react";

// .mp4, not .m4a: Hostinger serves .m4a as text/plain. Harry Styles – Sign of the Times (Leo, 2026-10-22; before that
// Tobiahs, VV-Ace – Where You Really Come From, still in public/audio).
const TRACK = "/audio/sign-of-the-times.mp4";

/** Set once the visitor pauses the song or it finishes, so later page loads in the same visit don't start it again. */
const QUIET_KEY = "vn-music-quiet";
function isQuiet() {
  try {
    return window.sessionStorage.getItem(QUIET_KEY) === "1";
  } catch {
    return false;
  }
}
function setQuiet() {
  try {
    window.sessionStorage.setItem(QUIET_KEY, "1");
  } catch {
    // Storage unavailable: the song may start again on the next full page load, nothing worse.
  }
}

/** The first touches of the page that let a browser start sound. */
const GESTURES = ["pointerdown", "keydown", "touchend"] as const;

/**
 * Site soundtrack. It starts as the page first loads (Leo, 2026-10-22); browsers refuse sound before the visitor has touched
 * the page, so where they do it starts on the first click, tap or key press instead. It plays once, start to finish; the
 * small button bottom-left pauses and resumes it, and a pause (or the end of the song) keeps it quiet for the rest of the
 * visit. It lives in the root layout, so it keeps playing while visitors move between pages. The button disappears when
 * the song has finished.
 */
export function SiteMusic() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  // True while the song is still waiting for the visitor's first touch; the music button switches it off.
  const armed = useRef(false);

  useEffect(() => {
    const audio = ref.current;
    if (!audio || isQuiet()) return;
    const start = (e: Event) => {
      // The music button handles its own clicks.
      if ((e.target as Element | null)?.closest?.("[data-site-music]")) return;
      disarm();
      if (armed.current) void audio.play().catch(() => undefined);
      armed.current = false;
    };
    const disarm = () => GESTURES.forEach((t) => window.removeEventListener(t, start, true));
    audio.play().catch(() => {
      armed.current = true;
      GESTURES.forEach((t) => window.addEventListener(t, start, true));
    });
    return disarm;
  }, []);

  // The Spotify players on the homepage (Playlist) and the soundtrack never play together: they ask it
  // to stop with "vn:music-stop", and it tells them it has started with "vn:music-play".
  useEffect(() => {
    // A Spotify track started is a choice of music: the soundtrack stays quiet, and doesn't wait for a touch to start any more.
    const stop = () => {
      armed.current = false;
      ref.current?.pause();
      setQuiet();
    };
    window.addEventListener("vn:music-stop", stop);
    return () => window.removeEventListener("vn:music-stop", stop);
  }, []);

  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    armed.current = false;
    if (audio.paused) void audio.play().catch(() => undefined);
    else {
      audio.pause();
      setQuiet();
    }
  };

  return (
    <>
      <audio
        ref={ref}
        src={TRACK}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          window.dispatchEvent(new Event("vn:music-play"));
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          setQuiet();
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
          className="fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center md:bottom-6 md:left-6 md:h-12 md:w-12 justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
        >
          <SoundIcon on={playing} />
        </button>
      )}
    </>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
