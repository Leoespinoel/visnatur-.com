"use client";

import { useWishlist } from "@/lib/wishlist";
import { HeartIcon } from "./Icons";

/** The heart that saves a colourway to the wishlist (/wishlist), and takes it off again. */
export function WishlistButton({ slug, name, className = "", size = 20 }: { slug: string; name: string; className?: string; size?: number }) {
  const { has, toggle } = useWishlist();
  const saved = has(slug);
  return (
    <button type="button" onClick={() => toggle(slug)} aria-pressed={saved} aria-label={`Save ${name} to your wishlist`} className={className}>
      <HeartIcon filled={saved} width={size} height={size} />
    </button>
  );
}
