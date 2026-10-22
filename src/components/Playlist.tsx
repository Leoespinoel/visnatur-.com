"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const SPOTIFY = "https://open.spotify.com";
const ALLOW = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

/** Any open.spotify.com playlist, album or track link (?si=… and /intl-xx/ included) → Spotify's embed player in its dark theme. */
function embedSrc(url: string) {
  const match = url.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track)\/([A-Za-z0-9]+)/);
  return match ? `${SPOTIFY}/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0` : null;
}

/** The playlists with a link Spotify can embed, in the order of site.playlist.lists. */
const LISTS = site.playlist.lists.flatMap((l) => {
  const src = embedSrc(l.url);
  return src ? [{ ...l, src }] : [];
});

/**
 * The playlist band on the homepage: a slideshow of Spotify's own players on black (Leo, 2026-10-22: "multiple playlists …
 * like a slide show"), with a few songs (its own or others) in small players underneath. The playlist in front sits at full
 * size with the next one peeking in, dimmed, at the side; swipe or scroll sideways, click the one peeking in, or pick a name
 * on the left to bring another forward. The heading and the Open in Spotify link follow the one in front, and a player moved
 * to the back keeps playing until another starts. Visitors signed in to Spotify in that browser hear whole tracks; everyone
 * else hears 30-second previews. Hidden while site.playlist.lists is empty.
 */
export function Playlist() {
  const { tracks } = site.playlist;
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const many = LISTS.length > 1;

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

  // The playlist in front is the slide nearest the track's left edge (at the end of the track, the last one, with the one
  // before it peeking in on the left).
  useEffect(() => {
    const el = track.current;
    if (!el || !many) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = Array.from(el.children) as HTMLElement[];
        const dist = slides.map((s) => Math.abs(s.offsetLeft - el.scrollLeft));
        setIndex(dist.indexOf(Math.min(...dist)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [many]);

  const go = (i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    setIndex(i);
    el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  if (LISTS.length === 0) return null;
  const front = LISTS[index] ?? LISTS[0];

  return (
    <section id="playlist" aria-label={many ? "Playlists" : "Playlist"} className="theme-dark scroll-mt-16">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-4">
            <p className="eyebrow mb-3">{many ? "Playlists" : "Playlist"}</p>
            <h2 className="display text-4xl md:text-5xl">{front.title}</h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-2">Press play here, or follow it on Spotify.</p>
            {many && (
              <ol className="mt-8 max-w-xs border-t border-line">
                {LISTS.map((l, i) => (
                  <li key={l.url} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={i === index ? "true" : undefined}
                      className={`flex w-full items-baseline gap-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] transition-opacity ${
                        i === index ? "" : "opacity-45 hover:opacity-100"
                      }`}
                    >
                      <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {l.title}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <a href={front.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8 w-fit">
              Open in Spotify
            </a>
          </div>
          <div className="min-w-0 md:col-span-8">
            <ul ref={track} className="no-scrollbar relative flex snap-x snap-mandatory gap-2 overflow-x-auto">
              {LISTS.map((l, i) => (
                <li key={l.url} className={`relative shrink-0 snap-start ${many ? "w-[86%]" : "w-full"}`}>
                  <iframe
                    title={`${l.title}, a playlist on Spotify`}
                    src={l.src}
                    height={352}
                    loading="lazy"
                    allow={ALLOW}
                    className="block h-[352px] w-full rounded-xl border-0"
                  />
                  {/* The ones behind are dimmed, and a click brings them forward rather than playing them unseen. */}
                  {i !== index && (
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show ${l.title}`}
                      className="absolute inset-0 rounded-xl bg-black/55 transition-colors hover:bg-black/30"
                    />
                  )}
                </li>
              ))}
            </ul>
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
