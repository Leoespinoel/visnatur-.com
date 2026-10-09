"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/data/products";
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
}: {
  title: string;
  products: Product[];
  inventory?: Inventory;
  link?: { label: string; href: string };
  priorityCount?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

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
            <ProductCard product={p} priority={i < priorityCount} availability={inventory ? availabilityOf(p, inventory) : undefined} />
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
