"use client";

import { altitudeLabel, type Ground } from "@/data/ground";

/**
 * The readout at the edge of the screen while the scene is on it, after the season index and depth meter on
 * junkbranding.com: a rail standing for the whole descent (the summit at its head, the bottom at its foot), the three
 * grounds written beside it at the level the marker reaches when each is in view (Leo, 2026-10-21: "make the forest,
 * the shore, the reef at the same level of the level they are at on the scroll line"), the marker at `progress`, and the
 * altitude in metres under it. Down the right edge from `md`; one row bottom-right on phones, where the music button has
 * the left. Each ground is a button to its panel; the rail, the marker and the readout are decoration.
 */
export function GroundHud({ grounds, active, progress, altitude, shown }: { grounds: Ground[]; active: number; progress: number; altitude: number; shown: boolean }) {
  const go = (id: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  // The grounds sit between the summit (0) and the bottom (1), evenly, as the scenes do.
  const stops = grounds.length + 1;
  const at = (i: number) => `${(((i + 1) / stops) * 100).toFixed(1)}%`;
  const marker = `${(progress * 100).toFixed(1)}%`;
  const tone = (i: number) => (i === active ? "!text-red" : i < active ? "!text-ink" : "");

  return (
    <nav
      aria-label="The grounds"
      aria-hidden={!shown}
      className={`fixed right-4 bottom-5 z-30 flex items-center gap-4 rounded-full bg-black/60 px-4 py-2.5 backdrop-blur transition-opacity duration-700 md:top-1/2 md:right-6 md:bottom-auto md:flex-col md:items-end md:gap-5 md:-translate-y-1/2 md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Phones: the numerals along a short rail, the marker under them. */}
      <div className="relative h-px w-24 bg-white/25 md:hidden" aria-hidden="true">
        {grounds.map((g, i) => (
          <span key={g.id} className={`eyebrow absolute bottom-2 -translate-x-1/2 tabular-nums ${tone(i)}`} style={{ left: at(i) }}>
            {g.numeral}
          </span>
        ))}
        <span className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red" style={{ left: marker }} />
      </div>

      {/* From md: the rail down the edge, each ground written beside it at its level, the marker riding the rail. */}
      <div className="relative hidden h-64 w-px bg-white/25 md:block">
        <ol className="absolute inset-y-0 right-4">
          {grounds.map((g, i) => (
            <li key={g.id} className="absolute right-0 -translate-y-1/2 whitespace-nowrap" style={{ top: at(i) }}>
              <button type="button" onClick={() => go(g.id)} tabIndex={shown ? 0 : -1} aria-current={i === active ? "location" : undefined} className={`eyebrow flex items-baseline gap-2 py-1 transition-colors ${tone(i)}`}>
                <span className="tabular-nums">{g.numeral}</span>
                <span>{g.name}</span>
              </button>
            </li>
          ))}
        </ol>
        {grounds.map((g, i) => (
          <span key={g.id} className="absolute left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" style={{ top: at(i) }} aria-hidden="true" />
        ))}
        <span className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red transition-[top] duration-200" style={{ top: marker }} aria-hidden="true" />
      </div>

      {/* Phones keep the buttons for assistive technology and keyboards, visually the numerals above do the job. */}
      <ol className="sr-only md:hidden">
        {grounds.map((g, i) => (
          <li key={g.id}>
            <button type="button" onClick={() => go(g.id)} tabIndex={shown ? 0 : -1} aria-current={i === active ? "location" : undefined}>
              {g.name}
            </button>
          </li>
        ))}
      </ol>

      <p className="eyebrow !text-ink tabular-nums" aria-hidden="true">
        {altitudeLabel(altitude)}
      </p>
    </nav>
  );
}
