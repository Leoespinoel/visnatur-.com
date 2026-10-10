"use client";

import Link from "next/link";
import { useRef } from "react";
import { siblingsOf, type Product } from "@/data/products";
import { availabilityOf, type Inventory } from "@/lib/editions";
import { ProductCard } from "./ProductCard";
import { ArrowIcon, ChevronIcon } from "./Icons";

/**
 * Four-up product carousel with arrows, as on the homepage of the resort brands we follow.
 * Tiles snap as you swipe; the arrows page by the visible width.
 */
export function ProductCarousel({
  title,
  products,
  inventory,
  link,
  priorityCount = 0,
  variant = "default",
}: {
  title: string;
  products: Product[];
  inventory?: Inventory;
  link?: { label: string; href: string };
  priorityCount?: number;
  /** `kith`: no headline, five across, arrows at the sides and a centred "Shop all" button under the row. */
  variant?: "default" | "kith";
}) {
  const track = useRef<HTMLDivElement>(null);
  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  if (variant === "kith") {
    const arrow = "absolute top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-paper md:flex";
    return (
      <div role="region" aria-label={title}>
        <div className="relative">
          <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto md:gap-2">
            {products.map((p, i) => (
              <div key={p.slug} className="w-[calc((100%-0.375rem)/2)] shrink-0 snap-start md:w-[calc((100%-2rem)/5)]">
                <ProductCard product={p} siblings={siblingsOf(p)} priority={i < priorityCount} availability={inventory ? availabilityOf(p, inventory) : undefined} />
              </div>
            ))}
          </div>
          {products.length > 5 && (
            <>
              <button type="button" onClick={() => page(-1)} aria-label="Previous" className={`${arrow} left-3`}>
                <ChevronIcon className="rotate-90" width={16} height={16} />
              </button>
              <button type="button" onClick={() => page(1)} aria-label="Next" className={`${arrow} right-3`}>
                <ChevronIcon className="-rotate-90" width={16} height={16} />
              </button>
            </>
          )}
        </div>
        {link && (
          <div className="mt-8 text-center">
            <Link href={link.href} className="btn btn-outline min-w-[180px]">
              {link.label}
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4 md:mb-6">
        <h2 className="headline text-3xl md:text-5xl">{title}</h2>
        <div className="flex items-center gap-4">
          {link && (
            <Link href={link.href} className="eyebrow !text-ink link-underline hidden items-center gap-2 md:inline-flex">
              {link.label}
              <ArrowIcon width={14} height={14} />
            </Link>
          )}
          <div className="flex gap-1.5">
            <button type="button" onClick={() => page(-1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-ink">
              <ChevronIcon className="rotate-90" width={16} height={16} />
            </button>
            <button type="button" onClick={() => page(1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-ink">
              <ChevronIcon className="-rotate-90" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
      <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto md:gap-2">
        {products.map((p, i) => (
          <div key={p.slug} className="w-[calc((100%-0.375rem)/2)] shrink-0 snap-start md:w-[calc((100%-1.5rem)/4)]">
            <ProductCard product={p} siblings={siblingsOf(p)} priority={i < priorityCount} availability={inventory ? availabilityOf(p, inventory) : undefined} />
          </div>
        ))}
      </div>
      {link && (
        <Link href={link.href} className="eyebrow !text-ink link-underline mt-6 inline-flex items-center gap-2 md:hidden">
          {link.label}
          <ArrowIcon width={14} height={14} />
        </Link>
      )}
    </div>
  );
}
