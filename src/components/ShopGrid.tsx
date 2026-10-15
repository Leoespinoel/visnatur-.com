"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { groupByFamily, type Product } from "@/data/products";
import { categories, type CategorySlug } from "@/data/site";
import { ProductCard } from "./ProductCard";
import { StoryTile } from "./StoryPair";
import type { Story } from "./StoryCopy";
import { CloseIcon, FilterIcon } from "./Icons";

type Sort = "featured" | "new" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New in" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

/** The story tile goes in after this many products, or after the last one in a shorter grid. */
const FEATURE_AFTER = 6;

/**
 * Listing in the ralphlauren.com manner: a row of quick-filter chips, then the count and a
 * FILTER & SORT button that opens a drawer, then the grid with a story tile set into it.
 * On "all" pages the chips are links to the categories; on a category or an edit they pick
 * designs in place, kept in the URL as ?design=, so a filtered listing can be shared.
 */
export function ShopGrid({
  products,
  fixedCategory,
  base = "/shop",
  allHref,
  chips = fixedCategory ? "designs" : "categories",
  feature,
  filters = true,
}: {
  products: Product[];
  fixedCategory?: CategorySlug;
  /** Where the category chips point: /shop (everything), /men or /women. */
  base?: string;
  /** The "All pieces" chip; defaults to /shop/all, or `base` for /men and /women. */
  allHref?: string;
  chips?: "categories" | "designs";
  /** A story set into the grid. */
  feature?: Story;
  /** False leaves out the chips, the count and Filter & Sort, for a page that leads with its own way in. */
  filters?: boolean;
}) {
  const params = useSearchParams();
  const [sort, setSort] = useState<Sort>("featured");
  const [sizes, setSizes] = useState<string[]>([]);
  const [newOnly, setNewOnly] = useState(params.get("filter") === "new");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const families = useMemo(() => groupByFamily(products).map((g) => ({ family: g[0].family, name: g[0].name })), [products]);
  // Chosen designs live in the URL (window.history keeps useSearchParams in step without a navigation).
  const designParam = params.get("design") ?? "";
  const designs = useMemo(() => designParam.split(",").filter((f) => families.some((x) => x.family === f)), [designParam, families]);
  const setDesigns = (next: string[]) => {
    const q = new URLSearchParams(params.toString());
    if (next.length) q.set("design", next.join(","));
    else q.delete("design");
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  };

  const allSizes = useMemo(() => {
    const order = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "EU 39–42", "EU 43–46", "One size"];
    const set = new Set(products.flatMap((p) => p.sizes));
    return order.filter((s) => set.has(s));
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter(
      (p) => (designs.length === 0 || designs.includes(p.family)) && (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) && (!newOnly || p.badge === "New"),
    );
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "new":
        list = [...list].sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
        break;
      default:
        list = [...list].sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));
    }
    return list;
  }, [products, designs, sizes, newOnly, sort]);

  const groups = useMemo(() => groupByFamily(visible), [visible]);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const activeCount = sizes.length + (newOnly ? 1 : 0) + designs.length;
  const clearAll = () => {
    setSizes([]);
    setNewOnly(false);
    setDesigns([]);
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const featureAt = Math.min(FEATURE_AFTER, groups.length) - 1;

  return (
    <div>
      {filters && (
        <>
          {/* Quick filters: category links, or the designs in this listing */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-4 md:mx-0 md:flex-wrap md:px-0">
            {chips === "categories" ? (
              <>
                <Chip href={allHref ?? (base === "/shop" ? "/shop/all" : base)} active={!fixedCategory}>
                  All pieces
                </Chip>
                {/* Only the categories with pieces in this listing (no women's rugby shirt yet). */}
                {categories
                  .filter((c) => products.some((p) => p.category === c.slug))
                  .map((c) => (
                    <Chip key={c.slug} href={`${base}/${c.slug}`} active={fixedCategory === c.slug}>
                      {c.short}
                    </Chip>
                  ))}
                {base !== "/shop" && (
                  <Chip href={`${base}/outfits`} active={false}>
                    Outfits
                  </Chip>
                )}
              </>
            ) : (
              families.length > 1 && (
                <>
                  <Chip active={designs.length === 0} onClick={() => setDesigns([])}>
                    All
                  </Chip>
                  {families.map((f) => (
                    <Chip key={f.family} active={designs.includes(f.family)} onClick={() => setDesigns(designs.length === 1 && designs[0] === f.family ? [] : [f.family])}>
                      {f.name}
                    </Chip>
                  ))}
                </>
              )
            )}
          </div>
    
          {/* Count, clear and the Filter & Sort button */}
          <div className="mb-6 flex items-center justify-between gap-4 border-y border-line py-3">
            {/* One line on phones: the colourway count gives way to the buttons. */}
            <p className="whitespace-nowrap text-xs text-muted">
              {groups.length} design{groups.length === 1 ? "" : "s"}
              <span className="hidden sm:inline">
                {" "}
                · {visible.length} colourway{visible.length === 1 ? "" : "s"}
              </span>
            </p>
            <div className="flex items-center gap-4 sm:gap-5">
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="eyebrow link-underline whitespace-nowrap !text-ink">
                  Clear all
                </button>
              )}
              <button type="button" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-controls="filter-drawer" className="inline-flex items-center gap-2.5 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-ink">
                <FilterIcon width={14} height={14} />
                Filter &amp; Sort{activeCount ? ` (${activeCount})` : ""}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Grid, with the story set in after the sixth design */}
      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">Nothing matches those filters yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 md:gap-x-2 md:gap-y-12 lg:grid-cols-4">
          {groups.map((group, i) => (
            <Fragment key={group[0].slug}>
              <ProductCard product={group[0]} siblings={group} priority={i < 4} gallery />
              {feature && i === featureAt && (
                <div className="col-span-2 self-start">
                  <StoryTile story={feature} aspect="aspect-[8/5]" size="sm" sizes="(min-width: 1024px) 50vw, 100vw" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}

      {/* Filter & Sort drawer */}
      {filters && (
        <div className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
          <button
            type="button"
            aria-label="Close filters"
            tabIndex={drawerOpen ? 0 : -1}
            onClick={() => setDrawerOpen(false)}
            className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          />
          <aside
            id="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort"
            inert={!drawerOpen}
            className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper text-ink shadow-2xl transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-6">
              <h2 className="eyebrow !text-ink">Filter &amp; Sort</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="-mr-2 p-2">
                <CloseIcon />
              </button>
            </div>
  
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <fieldset>
                <legend className="eyebrow mb-3">Sort by</legend>
                <div className="space-y-2.5">
                  {SORTS.map((s) => (
                    <label key={s.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 hover:text-ink">
                      <input type="radio" name="sort" value={s.value} checked={sort === s.value} onChange={() => setSort(s.value)} className="h-3.5 w-3.5 accent-[var(--red)]" />
                      {s.label}
                    </label>
                  ))}
                </div>
              </fieldset>
  
              {families.length > 1 && (
                <fieldset>
                  <legend className="eyebrow mb-3">Design</legend>
                  <div className="space-y-2.5">
                    {families.map((f) => (
                      <label key={f.family} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 hover:text-ink">
                        <input type="checkbox" checked={designs.includes(f.family)} onChange={() => setDesigns(toggle(designs, f.family))} className="h-3.5 w-3.5 accent-[var(--red)]" />
                        {f.name}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
  
              <fieldset>
                <legend className="eyebrow mb-3">Size</legend>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={sizes.includes(s)}
                      onClick={() => setSizes((v) => toggle(v, s))}
                      className={`min-w-10 border px-2.5 py-1.5 text-xs transition-colors ${sizes.includes(s) ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
  
              <fieldset>
                <legend className="eyebrow mb-3">Collection</legend>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 hover:text-ink">
                  <input type="checkbox" checked={newOnly} onChange={() => setNewOnly((v) => !v)} className="h-3.5 w-3.5 accent-[var(--red)]" />
                  New in only
                </label>
              </fieldset>
            </div>
  
            <div className="grid grid-cols-2 gap-2 border-t border-line px-6 py-4">
              <button type="button" onClick={clearAll} disabled={activeCount === 0} className="btn btn-outline">
                Clear all
              </button>
              <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-primary">
                Show {groups.length} design{groups.length === 1 ? "" : "s"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Chip({ href, active, onClick, children }: { href?: string; active: boolean; onClick?: () => void; children: React.ReactNode }) {
  const className = `inline-flex h-10 shrink-0 items-center whitespace-nowrap border px-4 text-[11px] uppercase tracking-[0.08em] transition-colors ${active ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`;
  return href ? (
    <Link href={href} aria-current={active ? "page" : undefined} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" aria-pressed={active} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
