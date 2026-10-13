"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { editionLabel, editionKindLabel, isOneOfOne, productImages, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { pledgeCents } from "@/lib/pledge";
import { availabilityOf, isArchived, remainingLabel, type Inventory } from "@/lib/editions";

/**
 * Product tile in the style of a classic resort e-commerce grid: a flat studio tile with the
 * garment centred, a small label on the tile, then an uppercase name, the price and the colour dot.
 * Hovering swaps the front view for the on-model shot, or the detail view when there is none.
 * Hovering a colour dot shows that colourway on the tile, and the tile then links to it.
 */
export function ProductCard({
  product,
  priority = false,
  inventory,
  siblings,
}: {
  product: Product;
  priority?: boolean;
  /** When given, the tile shows live counts (remaining, sold out, closed) for the colour on show. */
  inventory?: Inventory;
  /** Other colourways of the same pattern (including `product`), shown as dots under the tile. */
  siblings?: Product[];
}) {
  const colours = siblings && siblings.length > 1 ? siblings : null;
  const [shownSlug, setShownSlug] = useState(product.slug);
  const shown = colours?.find((c) => c.slug === shownSlug) ?? product;
  const availability = inventory ? availabilityOf(shown, inventory) : undefined;
  const [front, hover] = productImages(shown);
  const done = availability ? isArchived(availability) : false;
  const corner = !availability || availability.state === "upcoming" ? editionKindLabel(shown) : remainingLabel(shown, availability);
  const urgent = done || (availability !== undefined && availability.remaining <= 3 && !isOneOfOne(shown));
  const foot = !availability || !done ? null : availability.state === "closed" ? `Closed at ${availability.sold} of ${availability.total}` : isOneOfOne(shown) ? "Made for its owner" : `All ${availability.total} made for their owners`;

  return (
    <article>
      <Link href={`/product/${shown.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
          <Image
            src={front}
            alt={`${shown.name} in ${shown.colour.name}`}
            fill
            unoptimized
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover transition-opacity duration-500 group-hover:opacity-0 ${done ? "grayscale" : ""}`}
          />
          <Image
            src={hover}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${done ? "grayscale" : ""}`}
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            <span className={`bg-paper px-2 py-1.5 text-[11px] leading-none ${urgent ? "text-red" : "text-ink"}`}>{corner}</span>
            {shown.badge && !done && <span className="bg-ink px-2 py-1.5 text-[11px] leading-none text-paper">{shown.badge}</span>}
          </div>
        </div>

        <div className="mt-3 space-y-1.5 px-0.5">
          <h3 className="font-sans text-[11px] font-medium uppercase leading-snug tracking-[0.06em] text-ink">{shown.name}</h3>
          <div className="flex items-baseline justify-between gap-3">
            <p className={`text-[12px] tabular-nums ${done ? "text-muted line-through" : "text-ink"}`}>{formatPrice(shown.price)}</p>
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">{editionLabel(shown)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-0.5">
            {colours ? (
              <span className="text-[11px] text-muted">{colours.length} colours</span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-muted" title={shown.colour.name}>
                <span className="h-3 w-3 shrink-0 rounded-full border border-line" style={{ backgroundColor: shown.colour.hex }} />
                <span className="hidden sm:inline">{shown.colour.name}</span>
              </span>
            )}
            <span className={`whitespace-nowrap text-[10px] ${foot ? "text-muted" : "text-red"}`}>{foot ?? `${formatPrice(pledgeCents(shown.price))} to conservation`}</span>
          </div>
        </div>
      </Link>
      {colours && (
        <ul className="mt-2 flex flex-wrap gap-1.5 px-0.5" aria-label={`${shown.name} colours`}>
          {colours.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/product/${c.slug}`}
                title={c.colour.name}
                aria-label={`${c.name} in ${c.colour.name}`}
                aria-current={c.slug === shown.slug ? "true" : undefined}
                onPointerEnter={() => setShownSlug(c.slug)}
                onFocus={() => setShownSlug(c.slug)}
                className={`block h-3.5 w-3.5 rounded-full border transition-transform hover:scale-125 ${c.slug === shown.slug ? "border-ink ring-1 ring-ink ring-offset-1 ring-offset-paper" : "border-line"}`}
                style={{ backgroundColor: c.colour.hex }}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
