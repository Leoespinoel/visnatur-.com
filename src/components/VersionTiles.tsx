"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { versions } from "@/data/versions";

const subscribeNever = () => () => {};
const isLocal = () => window.location.hostname === "localhost";

/**
 * One tile per version of the site: its first screen, its letter and a way in, opening in a new tab so the page stays open to
 * compare. Four tiles, two across from md. On localhost the tiles lead to the copies running on this Mac.
 */
export function VersionTiles() {
  // False on the server and on the live site; true once hydrated on localhost.
  const local = useSyncExternalStore(subscribeNever, isLocal, () => false);

  return (
    <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
      {versions.map((v, i) => (
        <li key={v.letter}>
          <a href={local ? v.local : v.href} target="_blank" rel="noopener" className="group block">
            <div className="relative aspect-[16/10] overflow-hidden border border-line bg-paper-2">
              <Image
                src={v.image}
                alt={`The first screen of version ${v.letter}`}
                fill
                unoptimized
                loading={i < 2 ? "eager" : "lazy"}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-medium tracking-tight">Version {v.letter}</h2>
              <span className="link-underline text-[11px] uppercase tracking-[0.18em]">
                Open<span className="sr-only"> version {v.letter} in a new tab</span>
                <span aria-hidden> ↗</span>
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
