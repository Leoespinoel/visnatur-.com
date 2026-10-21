"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { CollagePicture } from "@/data/collage";
import { Pin, Tape } from "./Board";

/** How many Polaroids the board shows: the cells left around the sheet on a six-column grid, and on a two-column one. */
const COUNT = { desktop: 26, phone: 12 };

type Fixing = "pin" | "tape";
type Placed = { picture: CollagePicture; tilt: number; fixing: Fixing; pinX: number };

/** A random order, a random tilt each, a red pin (most) or a strip of tape, the first `count` of the pool. */
function deal(pool: CollagePicture[], count: number): Placed[] {
  const cards = pool.map((picture) => ({ picture, key: Math.random() }));
  cards.sort((a, b) => a.key - b.key);
  return cards.slice(0, count).map(({ picture }) => ({
    picture,
    tilt: Math.round((Math.random() * 14 - 7) * 10) / 10,
    fixing: Math.random() < 0.7 ? "pin" : "tape",
    pinX: Math.round(40 + Math.random() * 20),
  }));
}

/**
 * The Origins inspiration as a mood board (Leo, 2026-10-21): a sheet of cream paper in the middle of a cork board
 * (`.theme-cork`, globals.css) with the passage on it, and Polaroids all round it, each at its own small tilt, held by a red
 * push-pin or a strip of tape, each with a short caption. Which pictures show, where, and how they are held is dealt afresh on
 * every visit: the server renders the pool's own order, pinned and straight, so the HTML matches, then one effect shuffles it
 * before the section scrolls into view. Still, by design: nothing animates, so reduced motion needs nothing.
 */
export function PolaroidCollage({ pool, children }: { pool: CollagePicture[]; children: ReactNode }) {
  const [cards, setCards] = useState<Placed[]>(() => pool.slice(0, COUNT.desktop).map((picture) => ({ picture, tilt: 0, fixing: "pin", pinX: 50 })));

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const redeal = () => setCards(deal(pool, phone.matches ? COUNT.phone : COUNT.desktop));
    redeal();
    phone.addEventListener("change", redeal);
    return () => phone.removeEventListener("change", redeal);
  }, [pool]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-5 [grid-auto-flow:dense]">
      {/* The sheet, in the middle: after six Polaroids on phones, inside the ring on bigger screens. Pinned at both top corners. */}
      <div className="relative col-span-2 row-start-4 rotate-[-0.6deg] bg-surface p-6 text-ink shadow-[0_14px_30px_-12px_rgb(40_20_5/0.7)] md:col-span-4 md:col-start-2 md:row-span-4 md:row-start-2 md:flex md:flex-col md:justify-center md:p-10">
        <Pin x={5} />
        <Pin x={95} />
        {children}
      </div>
      {cards.map(({ picture, tilt, fixing, pinX }, i) => (
        <figure
          key={picture.image}
          className="relative self-start bg-white p-[6%] pb-[5%] shadow-[0_10px_24px_-10px_rgb(40_20_5/0.7)]"
          style={{ transform: `rotate(${tilt}deg)`, zIndex: i % 3 }}
        >
          {fixing === "pin" ? <Pin x={pinX} /> : <Tape tilt={tilt >= 0 ? -4 : 4} />}
          <div className="image-frame aspect-square">
            <Image src={picture.image} alt={picture.alt} fill unoptimized sizes="(min-width: 768px) 15vw, 45vw" className="object-cover" />
          </div>
          <figcaption className="mt-[7%] truncate font-serif text-[13px] italic leading-none text-neutral-500 md:text-sm">{picture.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
