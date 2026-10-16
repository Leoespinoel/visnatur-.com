"use client";

import Link from "next/link";
import { getProduct, type Product } from "@/data/products";
import { useWishlist } from "@/lib/wishlist";
import { AccountIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

/** The wishlist page's body: what the hearts saved, or the empty state with a way into the shop. */
export function WishlistView() {
  const { slugs, hydrated } = useWishlist();
  const saved = slugs.map(getProduct).filter((p): p is Product => !!p);

  return (
    <section className="container-x pb-16 md:pb-24">
      <div className="flex items-center justify-between py-5">
        <p className="eyebrow !text-ink">
          My Wishlist <span className="tabular-nums">({saved.length})</span>
        </p>
        <Link href="/account" className="eyebrow link-underline flex items-center gap-2 !text-ink">
          <AccountIcon width={16} height={16} />
          Your account
        </Link>
      </div>

      {/* Nothing until the browser's list has been read, so a full list never flashes the empty state. */}
      {!hydrated ? (
        <div className="min-h-[40svh]" />
      ) : saved.length === 0 ? (
        <div className="py-16 text-center md:py-24">
          <h1 className="display text-5xl md:text-7xl">Your wishlist is empty</h1>
          <p className="mx-auto mt-5 max-w-md text-ink-2 md:text-lg">Tap the heart on any piece to keep it here.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/men" className="pill">
              Shop Men
            </Link>
            <Link href="/women" className="pill">
              Shop Women
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1 className="display py-10 text-center text-5xl md:py-14 md:text-7xl">Your wishlist</h1>
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 md:gap-x-2 md:gap-y-12 lg:grid-cols-4">
            {saved.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <p className="mt-12 text-center text-xs text-muted">Saved in this browser.</p>
        </>
      )}
    </section>
  );
}
