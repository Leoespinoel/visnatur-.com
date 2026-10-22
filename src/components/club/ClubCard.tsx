"use client";

import { useRef, useSyncExternalStore, type PointerEvent } from "react";
import type { ClubView } from "@/lib/club-ledger";
import { mediaStore, roomNo, roomOf, two } from "./format";

const tilts = mediaStore("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

/** The card's colour goes up with the rooms, in the brand's own: ecru, then red, then black. */
const finish: { card: string; muted: string }[] = [
  { card: "bg-[#f4f1ea] text-[#0a0a0a]", muted: "text-[#0a0a0a]/55" },
  // The red badger on the red card shows tone on tone, like the badger on the pieces.
  { card: "bg-[#c8102e] text-white", muted: "text-white/70" },
  { card: "bg-[#141414] text-white ring-1 ring-white/15", muted: "text-white/55" },
];

/**
 * The member's card, the page's answer to Nude Project's Nude Card: badger, name, room and year. It tilts towards the
 * pointer with a sheen that follows it; still on touch screens and for visitors who prefer reduced motion.
 */
export function ClubCard({ view }: { view: ClubView }) {
  const card = useRef<HTMLDivElement>(null);
  const tilt = useSyncExternalStore(tilts.subscribe, tilts.get, tilts.server);
  const f = finish[roomNo(view.room)];
  const room = roomOf(view.room);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!tilt || !el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    el.style.setProperty("--sx", `${x * 100}%`);
    el.style.setProperty("--sy", `${y * 100}%`);
    el.style.setProperty("--shine", "1");
  };
  const leave = () => {
    const el = card.current;
    if (!el) return;
    for (const p of ["--rx", "--ry"]) el.style.setProperty(p, "0deg");
    el.style.setProperty("--shine", "0");
  };

  return (
    <div className="mx-auto w-full max-w-[440px] [perspective:1000px]">
      <div
        ref={card}
        onPointerMove={move}
        onPointerLeave={leave}
        role="img"
        aria-label={`${view.firstName || "Your"} club card: ${room.name}, member since ${new Date(view.memberSince).getUTCFullYear()}`}
        className={`relative flex aspect-[1.586] w-full flex-col justify-between overflow-hidden rounded-[18px] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] md:p-7 ${f.card}`}
      >
        {/* Sheen, following the pointer. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--shine,0)] mix-blend-overlay transition-opacity duration-300"
          style={{ background: "radial-gradient(circle at var(--sx,50%) var(--sy,50%), rgba(255,255,255,0.7), transparent 55%)" }}
        />
        <div className="flex items-start justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/badger-mark.svg" alt="" className="h-auto w-24 md:w-28" />
          <span className={`text-[10px] uppercase tracking-[0.28em] ${f.muted}`}>The lineup</span>
        </div>
        <p className="font-serif text-4xl leading-none md:text-5xl">{view.firstName || "Member"}</p>
        <div className={`flex items-end justify-between text-[10px] uppercase tracking-[0.22em] ${f.muted}`}>
          <span>
            {room.name}
            <br />
            Room {two(roomNo(view.room) + 1)}
          </span>
          <span className="text-right">Since {new Date(view.memberSince).getUTCFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
