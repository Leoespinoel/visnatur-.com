"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "@/data/site";
import { groupByFamily, productImages, products, type Product } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { formatPrice } from "@/lib/format";
import type { MenuTile } from "@/data/menu";
import { ComingSoon } from "./ComingSoon";
import { MegaTile } from "./MegaTile";
import { CloseIcon, SearchIcon } from "./Icons";

const POPULAR = ["Linen shirt", "Chinos", "Knitwear", "Cap", "Swim shorts", "Rugby"];

const RECOMMENDED: MenuTile[] = [
  { label: "Men", href: "/men", image: "/images/home/men-hero.jpg" },
  { label: "Women", href: "/women", image: "/images/home/women-hero.jpg" },
  { label: "New in", href: "/shop/all?filter=new", image: "/images/shop/hero.jpg" },
  { label: "Accessories", href: "/shop/outerwear-accessories", image: "/images/caps-scene.jpg" },
];

/** Everything a piece can be found by, lower-cased once. */
const INDEX = products.map((p) => ({
  p,
  text: [p.name, p.family.replace(/-/g, " "), p.colour.name, categories.find((c) => c.slug === p.category)?.name, p.garment.replace(/-/g, " "), p.fabric, p.audience ?? ""]
    .join(" ")
    .toLowerCase(),
}));

/** One result per design: the first colourway that matches every word, with how many colourways matched. */
function search(query: string): { p: Product; colours: number }[] {
  // Plurals find the singular names too ("chinos" → Quayside Chino, "swim shorts" → Tidal Swim Short).
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));
  if (!words.length) return [];
  const hits = INDEX.filter((x) => words.every((w) => x.text.includes(w))).map((x) => x.p);
  const byName = (p: Product) => (p.name.toLowerCase().includes(words[0]) ? 0 : 1);
  return groupByFamily(hits)
    .map((g) => ({ p: g[0], colours: g.length }))
    .sort((a, b) => byName(a.p) - byName(b.p))
    .slice(0, 24);
}

/**
 * The header's search, as on nude-project.com: a panel under the header with the field, live results by
 * design, popular searches and four recommended tiles. Closes on Esc, a click outside or a route change (Header).
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // Visible at once on open (only the opacity fades in), so the field can take focus straight away;
  // on close the visibility waits for the fade.
  return (
    <div
      className={`absolute inset-x-0 top-full h-[calc(100svh-100%)] overflow-y-auto border-b border-line bg-paper text-ink duration-200 md:h-auto md:max-h-[calc(100svh-100%)] ${
        open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      aria-hidden={!open}
    >
      <div className="container-x py-8 md:py-10">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-4 border-b border-ink pb-3">
          <SearchIcon width={22} height={22} />
          <label htmlFor="site-search" className="sr-only">
            Search the collection
          </label>
          <input
            ref={input}
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent font-serif text-2xl placeholder:text-muted focus:outline-none md:text-4xl"
          />
          <button type="button" onClick={onClose} className="-mr-2 p-2" aria-label="Close search">
            <CloseIcon />
          </button>
        </form>

        {query.trim() ? (
          <div className="mt-8">
            <p className="eyebrow mb-5">{results.length ? `${results.length} design${results.length === 1 ? "" : "s"}` : `Nothing for “${query.trim()}” yet`}</p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {results.map(({ p, colours }) => (
                <li key={p.family}>
                  <Link href={`/product/${p.slug}`} onClick={onClose} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden border border-line bg-white">
                      <Image src={productImages(p)[0]} alt="" fill unoptimized sizes="(min-width: 1024px) 16vw, 50vw" className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]" />
                      {!isAvailable(p) && <ComingSoon />}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.08em]">{p.name}</p>
                    <p className="mt-1 text-[13px] text-ink-2">
                      {formatPrice(p.price)} · {colours > 1 ? `${colours} colours` : p.colour.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-[minmax(180px,22%)_1fr]">
            <div>
              <p className="eyebrow mb-4">Popular searches</p>
              <ul className="space-y-3">
                {POPULAR.map((q) => (
                  <li key={q}>
                    <button type="button" onClick={() => setQuery(q)} className="font-serif text-xl text-ink-2 hover:text-ink">
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Recommended</p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {RECOMMENDED.map((t) => (
                  <MegaTile key={t.label} tile={t} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
