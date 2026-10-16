import type { Metadata } from "next";
import { categories } from "@/data/site";
import { getProduct, type Product } from "@/data/products";
import { favouriteSlugs } from "@/data/favourites";
import { editStory } from "@/data/edits";
import { exploreStories, heroStory } from "@/data/campaigns";
import { pledgePercentLabel } from "@/lib/pledge";
import { ProductCarousel } from "@/components/ProductCarousel";
import { StoryBanner } from "@/components/StoryBanner";
import { StoryPair } from "@/components/StoryPair";
import { StoryCarousel } from "@/components/StoryCarousel";
import { CategoryTiles } from "@/components/CategoryTiles";
import type { Story } from "@/components/StoryCopy";

export const metadata: Metadata = {
  title: "Shop",
  description: "Every Vis Naturæ piece is made to order in Mauritius, in your size. Swim, hoodies and knitwear, linen shirts, chinos, linen trousers, caps and socks.",
};

/**
 * Shop landing, laid out like the ralphlauren.com homepage: a full-bleed campaign with a way in for
 * men and women, the categories, a 50/50 pair of stories, new pieces, a full-bleed banner, and a
 * carousel of everything else to explore.
 */
export default function ShopLandingPage() {
  const picks = favouriteSlugs.map(getProduct).filter((p): p is Product => Boolean(p));

  const conservation: Story = {
    eyebrow: `${pledgePercentLabel()} of every sale`,
    title: "Back to the reef",
    dek: "Of the price, not the profit: for the coral around Mauritius, its last native forest and its mangrove coast.",
    image: "/images/shop/reef.jpg",
    alt: "A free-diver in navy swim shorts gliding over a coral garden, sunlight falling through the water",
    links: [{ label: "Explore now", href: "/conservation" }],
  };

  return (
    <>
      <h1 className="sr-only">Shop</h1>

      {/* 1. Full-bleed campaign with the way in for men and women */}
      <StoryBanner story={heroStory} hero preload />

      {/* 2. Categories */}
      <CategoryTiles title="The collection" tiles={categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}`, image: c.scene }))} />

      {/* 3. Two stories side by side */}
      <StoryPair stories={[editStory("cabana"), editStory("badger")]} />

      {/* 4. New pieces */}
      <div className="container-x py-14 md:py-20">
        <ProductCarousel title="New in" products={picks} link={{ label: "Shop all", href: "/shop/all" }} />
      </div>

      {/* 5. Full-bleed banner */}
      <StoryBanner story={conservation} />

      {/* 6. Everything else to explore */}
      <StoryCarousel title="Around the island." dek="Lines, edits and the workshop behind them." stories={exploreStories} />
    </>
  );
}
