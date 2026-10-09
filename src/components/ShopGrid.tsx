"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { categories, type CategorySlug } from "@/data/site";
import { availabilityOf, currentDrop, windowLabel, type Inventory } from "@/lib/editions";
import { ProductCard } from "./ProductCard";
import { CloseIcon, FilterIcon } from "./Icons";

type Sort = "featured" | "new" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New in" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

/**
 * Listing: a row of family chips, the count and a FILTER button that opens a panel above the grid.
 * Families are links, so the chip row doubles as navigation between /shop and /shop/<family>.
 */
export function ShopGrid({ products, inventory, fixedCategory }: { products: Product[]; inventory: Inventory; fixedCategory?: CategorySlug }) {
  const params = useSearchParams();
  const drop = currentDrop(inventory.now);
  const [sort, setSort] = useState<Sort>("featured");
  const [sizes, setSizes] = useState<string[]>([]);
  const [newOnly, setNewOnly] = useState(params.get("filter") === "new");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allSizes = useMemo(() => {
    const order = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "One size"];
    const set = new Set(products.flatMap((p) => p.sizes));
    return order.filter((s) => set.has(s));
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) && (!newOnly || p.badge === "New"));
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
  }, [products, sizes, newOnly, sort]);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const activeCount = sizes.length + (newOnly ? 1 : 0);

  return (
    <div>
      {/* Family chips, count and the filter button */}
      <div className="flex flex-wrap items-center gap-2 pb-4">
        <Chip href="/shop" active={!fixedCategory}>
          All pieces
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} href={`/shop/${c.slug}`} active={fixedCategory === c.slug}>
            {c.short}
          </Chip>
        ))}
        <div className="ml-auto flex items-center gap-4">
          <p className="text-xs text-muted">
            {visible.length} design{visible.length === 1 ? "" : "s"}
            {drop ? <span className="hidden md:inline"> · {windowLabel(drop, inventory.now)}</span> : null}
          </p>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className={`btn h-10 gap-2.5 px-4 ${filtersOpen ? "btn-outline" : "btn-primary"}`}
          >
            {filtersOpen ? "Close" : `Filter${activeCount ? ` (${activeCount})` : ""}`}
            {filtersOpen ? <CloseIcon width={14} height={14} /> : <FilterIcon width={14} height={14} />}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="mb-6 grid gap-8 border-y border-line py-6 md:grid-cols-3">
          <div>
            <p className="eyebrow mb-3">Size</p>
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
          </div>
          <div>
            <p className="eyebrow mb-3">Collection</p>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 hover:text-ink">
              <input type="checkbox" checked={newOnly} onChange={() => setNewOnly((v) => !v)} className="h-3.5 w-3.5 accent-[var(--red)]" />
              New in only
            </label>
          </div>
          <div>
            <p className="eyebrow mb-3">Sort</p>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="w-full max-w-xs border border-line bg-transparent px-3 py-2 text-xs text-ink focus:outline-none">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {activeCount > 0 && (
              <button
                type="button"
                className="eyebrow link-underline mt-4 !text-ink"
                onClick={() => {
                  setSizes([]);
                  setNewOnly(false);
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">Nothing matches those filters yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 md:gap-x-2 md:gap-y-12 lg:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} availability={availabilityOf(p, inventory)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-10 items-center border px-4 text-[11px] uppercase tracking-[0.08em] transition-colors ${active ? "border-ink bg-ink text-paper" : "border-line text-ink hover:border-ink"}`}
    >
      {children}
    </Link>
  );
}
