"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { designNumber, productImages, type Product } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { formatPrice } from "@/lib/format";
import { pledgeCents } from "@/lib/pledge";
import { ChevronIcon } from "./Icons";
import { ComingSoon } from "./ComingSoon";

/** Colour dots shown before the rest collapse into "+N". */
const MAX_DOTS = 6;

const arrow =
  "absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 shadow-sm transition-opacity hover:bg-ink hover:text-paper focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:hidden";

/**
 * Product tile in the style of a classic resort e-commerce grid: a flat studio tile with the
 * garment centred, a small label on the tile, then an uppercase name, the price and the colour dot.
 * Hovering swaps the front view for the on-model shot, or the detail view when there is none.
 * Hovering a colour dot shows that colourway on the tile, and the tile then links to it.
 * With `gallery` (the listings, as on ralphlauren.com) arrows and a swipe step through every image.
 * Pieces not on sale yet carry the grey "Coming soon" veil.
 */
export function ProductCard({
  product,
  priority = false,
  siblings,
  gallery = false,
}: {
  product: Product;
  priority?: boolean;
  /** Other colourways of the same pattern (including `product`), shown as dots under the tile. */
  siblings?: Product[];
  gallery?: boolean;
}) {
  const colours = siblings && siblings.length > 1 ? siblings : null;
  const [shownSlug, setShownSlug] = useState(product.slug);
  const shown = colours?.find((c) => c.slug === shownSlug) ?? product;
  const images = productImages(shown);
  const [index, setIndex] = useState(0);
  // A mouse over the tile shows the second image until the arrows are used, as the plain tile does.
  const [peek, setPeek] = useState(false);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const n = images.length;
  const active = Math.min(peek && index === 0 && n > 1 ? 1 : index, n - 1);
  const href = `/product/${shown.slug}`;

  const step = (dir: -1 | 1) => {
    setPeek(false);
    setIndex((active + dir + n) % n);
  };
  const showColour = (slug: string) => {
    setShownSlug(slug);
    setIndex(0);
  };

  return (
    <article>
      {/* The picture and the name hover together; the colour dots below do not. */}
      <div className="group">
        <div
          className="relative aspect-[4/5] overflow-hidden bg-paper-2 touch-pan-y"
          onPointerEnter={(e) => gallery && e.pointerType === "mouse" && setPeek(true)}
          onPointerLeave={() => setPeek(false)}
          onPointerDown={(e) => {
            if (gallery && e.pointerType !== "mouse") swipe.current = { x: e.clientX, moved: false };
          }}
          onPointerUp={(e) => {
            const s = swipe.current;
            if (!s) return;
            const dx = e.clientX - s.x;
            if (Math.abs(dx) > 30 && n > 1) {
              s.moved = true;
              step(dx < 0 ? 1 : -1);
            }
          }}
        >
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden
            className="absolute inset-0"
            onClick={(e) => {
              // A swipe ends in a tap on the link; keep it from opening the product.
              if (swipe.current?.moved) e.preventDefault();
              swipe.current = null;
            }}
          >
            {gallery ? (
              images.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={i === 0 ? `${shown.name} in ${shown.colour.name}` : ""}
                  fill
                  unoptimized
                  priority={priority && i === 0}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
                />
              ))
            ) : (
              <>
                <Image
                  src={images[0]}
                  alt={`${shown.name} in ${shown.colour.name}`}
                  fill
                  unoptimized
                  priority={priority}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image
                  src={images[1]}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </>
            )}
          </Link>
          {!isAvailable(shown) && <ComingSoon />}
          {shown.badge && <span className="pointer-events-none absolute left-2 top-2 bg-ink px-2 py-1.5 text-[11px] leading-none text-paper">{shown.badge}</span>}
          {gallery && n > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label={`Previous image of ${shown.name}`} className={`${arrow} left-2`}>
                <ChevronIcon className="rotate-90" width={14} height={14} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label={`Next image of ${shown.name}`} className={`${arrow} right-2`}>
                <ChevronIcon className="-rotate-90" width={14} height={14} />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5" aria-hidden>
                {images.map((src, i) => (
                  <span key={src} className={`h-1 w-1 rounded-full transition-colors ${i === active ? "bg-ink" : "bg-ink/25"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <Link href={href} className="block">
          <div className="mt-3 space-y-1.5 px-0.5">
            <h3 className="font-sans text-[11px] font-medium uppercase leading-snug tracking-[0.06em] text-ink">{shown.name}</h3>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[12px] tabular-nums text-ink">{formatPrice(shown.price)}</p>
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted">{designNumber(shown)}</span>
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
              <span className="whitespace-nowrap text-[10px] text-red">{formatPrice(pledgeCents(shown.price))} to conservation</span>
            </div>
          </div>
        </Link>
      </div>
      {colours && (
        <ul className="mt-2 flex flex-wrap items-center gap-1.5 px-0.5" aria-label={`${shown.name} colours`}>
          {colours.slice(0, MAX_DOTS).map((c) => (
            <li key={c.slug}>
              <Link
                href={`/product/${c.slug}`}
                title={c.colour.name}
                aria-label={`${c.name} in ${c.colour.name}`}
                aria-current={c.slug === shown.slug ? "true" : undefined}
                onPointerEnter={() => showColour(c.slug)}
                onFocus={() => showColour(c.slug)}
                className={`block h-3.5 w-3.5 rounded-full border transition-transform hover:scale-125 ${c.slug === shown.slug ? "border-ink ring-1 ring-ink ring-offset-1 ring-offset-paper" : "border-line"}`}
                style={{ backgroundColor: c.colour.hex }}
              />
            </li>
          ))}
          {colours.length > MAX_DOTS && (
            <li>
              <Link href={href} className="text-[11px] leading-none text-muted hover:text-ink" aria-label={`${colours.length - MAX_DOTS} more colours`}>
                +{colours.length - MAX_DOTS}
              </Link>
            </li>
          )}
        </ul>
      )}
    </article>
  );
}
