"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { rooms, type Room } from "@/data/members";
import type { ClubView } from "@/lib/club-ledger";
import { mediaStore, monthYear, roomNo, two } from "./format";

const phone = mediaStore("(max-width: 767px)");
const still = mediaStore("(prefers-reduced-motion: reduce)");

/**
 * The room's film, edge to edge: a brass room key turning in the room (scripts/generate-room-films.mjs). Until Leo
 * approves a film, the room's picture with a slow zoom; the poster alone for visitors who prefer reduced motion.
 */
function RoomFilm({ room }: { room: Room }) {
  const portrait = useSyncExternalStore(phone.subscribe, phone.get, phone.server);
  const reduce = useSyncExternalStore(still.subscribe, still.get, still.server);
  if (room.film) {
    const poster = portrait ? room.film.posterPortrait : room.film.poster;
    if (reduce) return <Image src={poster} alt={room.alt} fill unoptimized priority sizes="100vw" className="object-cover" />;
    const src = portrait ? room.film.portrait : room.film.landscape;
    return (
      <video key={src} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-label={room.alt} className="absolute inset-0 h-full w-full object-cover" />
    );
  }
  return (
    <Image
      src={room.image}
      alt={room.alt}
      fill
      unoptimized
      priority
      sizes="100vw"
      className="object-cover animate-[club-zoom_24s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
    />
  );
}

/**
 * The top of the member page, as on nude-project.com's: a hello, the member's room in huge type standing on the top
 * edge of the film, then the room itself.
 */
export function ClubHero({ view }: { view: ClubView }) {
  const i = roomNo(view.room);
  const room = rooms[i];
  return (
    <section aria-labelledby="club-room" className="overflow-hidden">
      <div className="container-x pt-12 text-center md:pt-16">
        <p className="eyebrow">Members only · Member since {monthYear(view.memberSince)}</p>
        <p className="mt-5 font-serif text-2xl md:text-3xl">
          {view.firstName ? `Hello, ${view.firstName}.` : "Hello."} <em className="italic">You&rsquo;re in</em>
        </p>
        <h1 id="club-room" className="display mt-3 pb-[0.06em] text-[15.5vw] leading-none md:text-[10.5vw]">
          {room.name}
        </h1>
      </div>
      <div className="relative h-[72svh] min-h-[420px] bg-[#0a0a0a] md:h-[calc(100svh-7rem)]">
        <RoomFilm room={room} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-6 text-white md:pb-8">
          <p className="eyebrow !text-white/90">
            Room {two(i + 1)} of {two(rooms.length)}
          </p>
          <p className="eyebrow text-right !text-white/90">{room.rate}</p>
        </div>
      </div>
    </section>
  );
}
