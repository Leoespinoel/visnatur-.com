"use client";

import { useEffect, useRef, useState } from "react";
import { LoopVideo } from "./LoopVideo";

/** How long the mouse must stay still over a playing film before its title and controls are made to hide. */
const IDLE_MS = 1000;

/** The slice of YouTube's player API this component uses (https://developers.google.com/youtube/iframe_api_reference). */
type YTPlayer = { pauseVideo: () => void; destroy: () => void };
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: { onStateChange?: (e: { data: number }) => void };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number };
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Loads YouTube's player script once and resolves with the namespace. */
function loadYouTube(): Promise<YTNamespace> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
}

/**
 * The full film in YouTube's player (youtube-nocookie, so no tracking cookies until the viewer presses play), with sound and its
 * own time bar. Opened from a click, which is the gesture browsers need before a video may make a sound, so where the browser
 * allows it the film starts at once; Safari shows YouTube's play button first.
 *
 * YouTube shows the title and the controls over the picture while the mouse moves and hides them a few seconds after it stops; that
 * timing is YouTube's and cannot be set from outside. So, while the film is playing and the mouse has been still for IDLE_MS, a
 * clear layer takes the pointer and the player, seeing the mouse leave, hides them at once (Leo, 2026-10-21: "disappear faster when
 * the mouse stops moving"). The next movement lifts the layer; a click on it pauses the film, as a click on the picture does in any
 * player. The layer is never up while the film is paused or has not started, so YouTube's own play button always takes the click.
 */
function Player({ videoId, title }: { videoId: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [idle, setIdle] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    const el = host.current;
    if (!el) return;
    loadYouTube().then((YT) => {
      if (cancelled || !host.current) return;
      player.current = new YT.Player(el, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
        events: { onStateChange: (e) => setPlaying(e.data === YT.PlayerState.PLAYING) },
      });
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer.current);
      player.current?.destroy();
      player.current = null;
    };
  }, [videoId]);

  const stir = () => {
    setIdle(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  };
  const armed = playing && idle;

  return (
    <div className="absolute inset-0" onMouseMove={stir} onMouseLeave={() => window.clearTimeout(timer.current)}>
      {/* The API replaces this element with the player's iframe. */}
      <div ref={host} title={title} className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
      <div
        aria-hidden="true"
        onClick={() => {
          player.current?.pauseVideo();
          stir();
        }}
        className={`absolute inset-0 ${armed ? "cursor-none" : "pointer-events-none"}`}
      />
    </div>
  );
}

/**
 * The film slot at the head of /stories (data/film.ts `kiteFilm`): the silent loop on tablets and desktops, a play ring and a line on
 * phones, and, when a YouTube ID is set, a "Watch the film" button that swaps the slot for the player above. Once open, the player
 * stays (Leo, 2026-10-21: no close cross over the video); a reload brings the loop back.
 */
export function FilmHero({ loop, poster, youtubeId, title }: { loop: string; poster: string; youtubeId?: string; title: string }) {
  const [open, setOpen] = useState(false);

  if (open && youtubeId) return <Player videoId={youtubeId} title={title} />;

  return (
    <>
      <LoopVideo src={loop} poster={poster} className="absolute inset-0 hidden h-full w-full object-cover md:block" />
      <div className="relative flex flex-col items-center gap-6 text-center">
        {youtubeId ? (
          <button type="button" onClick={() => setOpen(true)} className="group flex flex-col items-center gap-5 text-paper">
            <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/60 bg-black/30 backdrop-blur transition-colors group-hover:bg-paper group-hover:text-ink md:h-20 md:w-20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
                <path d="M7 4.5v15l12-7.5z" />
              </svg>
            </span>
            <span className="eyebrow !text-paper/85">Watch the film</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6 md:hidden">
            <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/40">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
                <path d="M7 4.5v15l12-7.5z" />
              </svg>
            </span>
            <p className="eyebrow !text-paper/70">The film · Coming soon</p>
          </div>
        )}
      </div>
    </>
  );
}
