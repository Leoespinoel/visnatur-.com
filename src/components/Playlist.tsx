"use client";

import { useEffect } from "react";
import { site } from "@/data/site";

const SPOTIFY = "https://open.spotify.com";
const ALLOW = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

/** Any open.spotify.com playlist, album or track link (?si=… and /intl-xx/ included) → Spotify's embed player in its dark theme. */
function embedSrc(url: string) {
  const match = url.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track)\/([A-Za-z0-9]+)/);
  return match ? `${SPOTIFY}/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0` : null;
}

/**
 * The playlist band on the homepage: Spotify's own player on black, with a few songs (its own or others) in small
 * players underneath. Visitors signed in to Spotify in that browser hear whole tracks; everyone else
 * hears 30-second previews. Hidden while site.playlist.url is empty.
 */
export function Playlist() {
  const { title, url, tracks } = site.playlist;
  const src = url ? embedSrc(url) : null;

  // One sound at a time. Every Spotify player posts its state to this window (the messages Spotify's
  // iFrame API is built on): when one starts, pause the other players and the site soundtrack
  // (SiteMusic); when the soundtrack starts, pause them all.
  useEffect(() => {
    const playing = new Map<Window, boolean>();
    // Only players that are playing: one that has never played throws ("no list was loaded").
    const pause = (except?: Window) =>
      playing.forEach((on, player) => {
        if (on && player !== except) player.postMessage({ command: "pause" }, SPOTIFY);
      });
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== SPOTIFY || !e.source) return;
      const player = e.source as Window;
      if (e.data?.type === "ready") player.postMessage({ command: "load_complete_ack" }, SPOTIFY);
      if (e.data?.type !== "playback_update") return;
      const now = e.data.payload?.isPaused === false;
      if (now && !playing.get(player)) {
        pause(player);
        window.dispatchEvent(new Event("vn:music-stop"));
      }
      playing.set(player, now);
    };
    const onSoundtrack = () => pause();
    window.addEventListener("message", onMessage);
    window.addEventListener("vn:music-play", onSoundtrack);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("vn:music-play", onSoundtrack);
    };
  }, []);

  if (!src) return null;

  return (
    <section id="playlist" aria-labelledby="playlist-title" className="theme-dark scroll-mt-16">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-4">
            <p className="eyebrow mb-3">Playlist</p>
            <h2 id="playlist-title" className="display text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-2">Press play here, or follow it on Spotify.</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8 w-fit">
              Open in Spotify
            </a>
          </div>
          <div className="md:col-span-8">
            <iframe
              title={`${title}, a playlist on Spotify`}
              src={src}
              height={352}
              loading="lazy"
              allow={ALLOW}
              className="block h-[352px] w-full rounded-xl border-0"
            />
          </div>
        </div>

        {tracks.length > 0 && (
          <div className="mt-12 md:mt-16">
            <p className="eyebrow mb-5">On repeat</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((t) => {
                const trackSrc = embedSrc(t.url);
                return (
                  trackSrc && (
                    <li key={t.url}>
                      <iframe
                        title={`${t.title}, on Spotify`}
                        src={trackSrc}
                        height={80}
                        loading="lazy"
                        allow={ALLOW}
                        className="block h-20 w-full rounded-xl border-0"
                      />
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
