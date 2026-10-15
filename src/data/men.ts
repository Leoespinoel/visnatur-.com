/**
 * The /men landing page, laid out after ralphlauren.com/men (Leo, 2026-10-14): hero slider,
 * categories, the stories, a full-bleed banner, our favourites, more to explore. The full grid of
 * men's pieces lives one click deeper, at /men/all. Copy, links and pictures are all edited here.
 */
import type { BannerSlide } from "@/components/landing/BannerSlider";
import type { MosaicTile } from "@/components/landing/CategoryMosaic";
import type { ExploreTile } from "@/components/landing/ExploreCarousel";
import type { HeroSlide } from "@/components/landing/HeroSlider";
import type { StoryCard } from "@/components/landing/StoryBand";
import { favouriteSlugs } from "./favourites";
import { getProduct, groupByFamily, isFor, productImages, type Product } from "./products";
import { categories } from "./site";

/** Our lines in the place of RL's Polo, Purple Label, Double RL and RLX. */
export const heroSlides: HeroSlide[] = [
  {
    key: "collection",
    label: "Collection I",
    title: "Collection I",
    text: "Made in Mauritius, in your size, once you order it.",
    cta: { label: "Explore now", href: "/men/all" },
    image: "/images/campaign-drop.jpg?v=3",
    alt: "Four friends on a basalt harbour wall in Mauritius in a navy quarter zip, oat linen shirt, red striped knit and saffron striped swim shorts",
    plate: "/images/men/plate-collection.jpg",
    thumb: "/community/p10.jpg?v=3",
  },
  {
    key: "swim",
    label: "Swim",
    title: "Swim",
    text: "Cut for the lagoon, finished for the terrace after.",
    cta: { label: "Explore now", href: "/men/swim" },
    image: "/images/campaign-swim.jpg?v=2",
    alt: "A man walking out of the lagoon at Le Morne in navy swim shorts",
    position: "50% 40%",
    plate: "/images/men/plate-swim.jpg",
    thumb: "/community/p6.jpg?v=2",
  },
  {
    key: "linen",
    label: "Shirts",
    title: "Shirts",
    text: "Washed linen that is allowed to crease.",
    cta: { label: "Explore now", href: "/men/shirts-trousers" },
    image: "/images/campaign-linen.jpg?v=9",
    alt: "Lunch on the sand under a sea almond tree by the lagoon, wine poured in sky and clementine linen shirts",
    position: "62% 50%",
    plate: "/images/men/plate-linen.jpg",
    thumb: "/community/p12.jpg?v=2",
  },
  {
    key: "knitwear",
    label: "Knitwear",
    title: "Knitwear",
    text: "For the hour the breeze turns.",
    cta: { label: "Explore now", href: "/men/polos-knitwear" },
    image: "/images/campaign-golf.jpg?v=2",
    alt: "A golfer by the sea in a navy and ecru striped knit",
    position: "60% 50%",
    plate: "/images/men/plate-knit.jpg",
    thumb: "/community/p3.jpg?v=2",
  },
];

const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

/**
 * Column order: Swim over Trousers, Shirts over Knitwear over Polo Shirts, Rugby Shirts over Tees over Shorts,
 * Accessories over Sunglasses.
 */
export const categoryTiles: MosaicTile[] = [
  { label: cat("swim").name, href: "/men/swim", image: "/images/beach-surfer.jpg?v=2", alt: "A surfer on the beach at sunset in sky striped swim shorts and an oat linen shirt" },
  { label: cat("trousers").name, href: "/men/trousers", image: "/images/men/cat-trousers.jpg", alt: "A stack of folded chinos in seven colours on a teak table" },
  { label: cat("shirts-trousers").name, href: "/men/shirts-trousers", image: "/images/men/cat-linen.jpg", alt: "A man on a wooden jetty in a clementine linen shirt and white linen trousers" },
  { label: cat("polos-knitwear").name, href: "/men/polos-knitwear", image: "/images/men/cat-knitwear.jpg", alt: "A man in a plantation house doorway in a navy quarter zip and stone chinos" },
  { label: cat("polo-shirts").name, href: "/men/polo-shirts", image: "/images/men/cat-polo.jpg", alt: "A man on a bench by a clay tennis court at Bel Ombre in the sky Cabana Stripe Polo and navy tailored shorts" },
  { label: cat("rugby-shirts").name, href: "/men/rugby-shirts", image: "/images/shop/rugby.jpg", alt: "Friends playing touch rugby on the beach at dusk in the Breakwater and Touchline rugby shirts" },
  { label: cat("tees").name, href: "/men/tees", image: "/images/shop/grid-shorts-tees.jpg", alt: "A man in the navy Cabana Stripe Tee peeling a mango on a harbour wall at Mahébourg" },
  { label: cat("shorts").name, href: "/men/shorts", image: "/images/shop/shorts-tees.jpg", alt: "A man in the white Sandbar Tee and stone Quayside Chino Short by the lagoon" },
  { label: cat("outerwear-accessories").name, href: "/men/outerwear-accessories", image: "/images/caps-scene.jpg", alt: "A man on a jetty in an ecru and pine cap and a navy quarter zip" },
  { label: cat("sunglasses").name, href: "/men/sunglasses", image: "/images/sunglasses-scene.jpg", alt: "A man in sunglasses and a sky linen shirt in a boat below Le Morne" },
];

/** Curated edits, RL's "The Stories". */
export const stories: { title: string; text: string; feature: StoryCard; cards: StoryCard[] } = {
  title: "The stories",
  text: "Seasonal edits, and the island they are made on.",
  feature: {
    eyebrow: "Collection I",
    title: "A day at Le Morne",
    href: "/men/all",
    image: "/images/day-kite.jpg",
    alt: "Three friends with their kites on the beach below Le Morne",
  },
  cards: [
    { eyebrow: "Tidal · Shore · Lido", title: "The swim shop", href: "/men/swim", image: "/community/surf-still.jpg", alt: "A surfer coming out of a barrel wave" },
    { eyebrow: "Riviera · Cabana · Corniche", title: "The linen shop", href: "/men/shirts-trousers", image: "/images/summit.jpg?v=2", alt: "A man on a summit above the clouds in a navy linen shirt" },
    { eyebrow: "Harbour · Mooring · Regatta", title: "The knitwear shop", href: "/men/polos-knitwear", image: "/images/golf-green.jpg?v=2", alt: "A golfer reading a putt in a forest quarter zip" },
    { eyebrow: "Cabana Linen Shirt", title: "The stripe", href: "/product/cabana-linen-shirt-sky", image: "/images/day-catamaran.jpg", alt: "Friends on a catamaran net with dolphins at the bow, one in a sky striped linen shirt" },
  ],
};

/** RL's collaboration banner: the pledge and the workshop. */
export const bannerSlides: BannerSlide[] = [
  {
    key: "pledge",
    image: "/images/sea-cliff-wide.jpg?v=2",
    alt: "Green sea cliffs in Mauritius, a man in a black knit gilet looking out",
    lockup: { badger: true },
    text: "Ten percent of every sale price goes to the island’s coast and forests.",
    cta: { label: "Discover", href: "/conservation" },
  },
  {
    key: "atelier",
    image: "/images/campaign-atelier.jpg?v=2",
    alt: "A seamstress beside a rail of finished pieces in the Port Louis workshop",
    lockup: { text: "Atelier" },
    text: "Cut and sewn by hand in Mauritius, once you order it.",
    cta: { label: "Made to order", href: "/made-to-order" },
  },
];

/** One card per design among the shop's favourites, on model where there is a model shot. */
function favouriteCard(p: Product): StoryCard {
  const images = productImages(p);
  return {
    eyebrow: cat(p.category).name,
    title: p.name,
    href: `/product/${p.slug}`,
    image: images.find((i) => i.includes("-model.")) ?? images[0],
    alt: `${p.name} in ${p.colour.name}`,
  };
}

/** RL's "Gifts for Him": the feature, then the favourites (one per design, the hoodie left to the feature). */
export const favourites: { title: string; text: string; feature: StoryCard; cards: StoryCard[] } = {
  title: "Our favourites",
  text: "The pieces we reach for first.",
  feature: {
    eyebrow: "Cabana Hoodie",
    title: "The hoodie",
    href: "/product/cabana-hoodie-navy",
    image: "/images/men/edit-hoodie.jpg",
    alt: "A man on a harbour quay at dusk in the navy Cabana Hoodie",
  },
  cards: groupByFamily(favouriteSlugs.map(getProduct).filter((p): p is Product => !!p && isFor(p, "men")))
    .map((g) => g[0])
    .filter((p) => p.family !== "cabana-hoodie")
    .map(favouriteCard),
};

export const explore: { title: string; text: string; tiles: ExploreTile[] } = {
  title: "More to explore",
  text: "The workshop, the pledge, and the rest of the house.",
  tiles: [
    { title: "New in", href: "/men/all?filter=new", image: "/community/p11.jpg?v=2", alt: "A man on a sea cliff in a navy cable knit vest", cta: "Shop now" },
    { title: "Made to order", href: "/made-to-order", image: "/images/cutting-table.jpg?v=2", alt: "Hands cutting sky linen on the workshop table", cta: "Discover" },
    { title: "Conservation", href: "/conservation", image: "/images/day-reef.jpg", alt: "A snorkeller over the reef", cta: "Discover" },
    { title: "Our story", href: "/about", image: "/images/about.jpg", alt: "A man walking barefoot on basalt rocks in a sage linen shirt", cta: "Discover" },
    { title: "Measurements", href: "/made-to-order#measurements", image: "/images/numbered-label.jpg?v=2", alt: "Hands boxing a red knit", cta: "See the sheets" },
    { title: "For her", href: "/women", image: "/images/women/linen.jpg", alt: "A woman at a market in a striped linen shirt and white trousers", cta: "Shop now" },
  ],
};
