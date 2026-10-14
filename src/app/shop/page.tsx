import type { Metadata } from "next";
import { categories } from "@/data/site";
import { getProduct, type Product } from "@/data/products";
import { favouriteSlugs } from "@/data/favourites";
import { editHref, getEdit, type Edit } from "@/data/edits";
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

const editStory = (slug: string): Story => {
  const e = getEdit(slug) as Edit;
  return { eyebrow: e.eyebrow, title: e.title, dek: e.dek, image: e.image, alt: e.alt, links: [{ label: "Shop the edit", href: editHref(e) }] };
};

/**
 * Shop landing, laid out like the ralphlauren.com homepage: a full-bleed campaign with a way in for
 * men and women, the categories, a 50/50 pair of stories, new pieces, a full-bleed banner, and a
 * carousel of everything else to explore.
 */
export default function ShopLandingPage() {
  const picks = favouriteSlugs.map(getProduct).filter((p): p is Product => Boolean(p));

  const hero: Story = {
    eyebrow: "Collection I · Made in Mauritius",
    title: "Made once you order it.",
    dek: `Cut and sewn in your size after you order, with ${pledgePercentLabel()} of the price going to conservation.`,
    image: "/images/shop/hero.jpg",
    alt: "A woman in the clementine Cabana hoodie and cap and a man in the sky Riviera linen shirt walking along a jetty at Le Morne",
    links: [
      { label: "Shop men", href: "/men" },
      { label: "Shop women", href: "/women" },
      { label: "Shop all", href: "/shop/all" },
    ],
  };

  const conservation: Story = {
    eyebrow: `${pledgePercentLabel()} of every sale`,
    title: "Back to the reef",
    dek: "Of the price, not the profit: for the coral around Mauritius, its last native forest and Europe’s rivers.",
    image: "/images/shop/reef.jpg",
    alt: "A free-diver gliding over a coral garden in a Mauritian lagoon",
    links: [{ label: "Explore now", href: "/conservation" }],
  };

  const explore: Story[] = [
    {
      eyebrow: "Swim",
      title: "Tidal, Shore & Lido",
      image: "/community/p6.jpg?v=2",
      alt: "A wakeboarder on a jetty in the red Lido stripe swim shorts",
      links: [{ label: "Shop swim", href: "/shop/swim" }],
    },
    {
      eyebrow: "Linen",
      title: "Allowed to crease",
      image: "/images/women/linen.jpg",
      alt: "A woman in a pink striped linen shirt and white linen trousers at a market",
      links: [{ label: "Shop linen", href: "/shop/shirts-trousers" }],
    },
    editStory("clubhouse"),
    editStory("rugby"),
    {
      eyebrow: "Sunglasses",
      title: "Alizé",
      image: "/images/women/sunglasses.jpg",
      alt: "A woman in the Alizé sunglasses sitting by a rock pool",
      links: [{ label: "Shop sunglasses", href: "/shop/sunglasses" }],
    },
    {
      eyebrow: "Made in Mauritius",
      title: "Cut after you order",
      image: "/images/cutting-table.jpg?v=2",
      alt: "Hands cutting sky blue linen on a workshop table",
      links: [{ label: "A closer look", href: "/made-to-order" }],
    },
  ];

  return (
    <>
      <h1 className="sr-only">Shop</h1>

      {/* 1. Full-bleed campaign with the way in for men and women */}
      <StoryBanner story={hero} hero preload />

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
      <StoryCarousel title="Around the island." dek="Lines, edits and the workshop behind them." stories={explore} />
    </>
  );
}
