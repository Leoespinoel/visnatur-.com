"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { designNumber, productImages, type Product } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { sectionOf, v2Href } from "@/data/v2";
import { formatPrice } from "@/lib/format";
import { Sticker, Tape } from "./Sticker";

/** Colour dots before the rest collapse into "+N". */
const MAX_DOTS = 7;

/**
 * One design in the V2 contact-sheet grid: a white cell with the packshot (the on-model shot on hover), taped
 * "Coming soon" when it can't be ordered yet, then number and garment, name, price and the colourways.
 * Hovering a dot shows that colourway and the tile then links to it.
 */
export function V2ProductTile({ group, priority = false }: { group: Product[]; priority?: boolean }) {
  const [shownSlug, setShownSlug] = useState(group[0].slug);
  const shown = group.find((p) => p.slug === shownSlug) ?? group[0];
  const [front, hover] = productImages(shown);
  const available = isAvailable(shown);
  const href = v2Href.product(shown.slug);
  const kind = sectionOf(shown)?.one;

  return (
    <article className="group relative flex flex-col bg-white">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden" aria-label={`${shown.name}, ${shown.colour.name}`}>
        <Image src={front} alt="" fill unoptimized priority={priority} sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-cover" />
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-150 group-hover:opacity-100 [@media(hover:none)]:hidden"
          />
        )}
        {available ? (
          <Sticker tone="red" tilt={-6} className="absolute left-3 top-3 text-[0.65rem]">
            Order now
          </Sticker>
        ) : (
          <Tape tilt={-4} className="absolute left-2 top-3 !text-[0.6rem] md:left-3 md:!text-[0.66rem]">
            Coming soon
          </Tape>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 border-t-[1.5px] border-ink p-3 md:p-4">
        <div className="v2-mono flex justify-between gap-2 text-muted">
          <span>
            {designNumber(shown)}
            {kind ? ` · ${kind}` : ""}
          </span>
          <span className="text-ink">{formatPrice(shown.price)}</span>
        </div>
        <h3 className="v2-wide text-[0.8rem] leading-tight md:text-[0.9rem]">
          <Link href={href} className="hover:text-red">
            {shown.name}
          </Link>
        </h3>
        {group.length > 1 ? (
          <ul className="mt-auto flex flex-wrap items-center gap-1 pt-1" aria-label={`${group.length} colours`}>
            {group.slice(0, MAX_DOTS).map((c) => (
              <li key={c.slug}>
                <Link
                  href={v2Href.product(c.slug)}
                  title={c.colour.name}
                  aria-label={c.colour.name}
                  onMouseEnter={() => setShownSlug(c.slug)}
                  onFocus={() => setShownSlug(c.slug)}
                  className={`block h-3.5 w-3.5 border-[1.5px] ${c.slug === shown.slug ? "border-ink" : "border-ink/25"}`}
                  style={{ backgroundColor: c.colour.hex }}
                />
              </li>
            ))}
            {group.length > MAX_DOTS && <li className="v2-mono ml-1 text-muted">+{group.length - MAX_DOTS}</li>}
          </ul>
        ) : (
          <p className="v2-mono mt-auto pt-1 text-muted">{shown.colour.name}</p>
        )}
      </div>
    </article>
  );
}

/** The bordered contact sheet: one tile per design. */
export function V2Grid({ groups, priorityCount = 4 }: { groups: Product[][]; priorityCount?: number }) {
  return (
    <div className="v2-cells grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {groups.map((g, i) => (
        <V2ProductTile key={g[0].family} group={g} priority={i < priorityCount} />
      ))}
    </div>
  );
}
