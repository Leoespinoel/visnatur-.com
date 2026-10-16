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
    image: "/images/men/group-forecourt.jpg",
    alt: "Three men on the stone steps of a country house in the navy Mooring Stripe Crew, the navy Breakwater Rugby Shirt and the oat Riviera Linen Shirt",
    position: "62% 50%",
    plate: "/images/men/plate-forecourt.jpg",
    thumb: "/community/p10.jpg?v=3",
  },
  {
    key: "swim",
    label: "Swim",
    title: "Swim",
    text: "Cut for the lagoon, finished for the terrace after.",
    cta: { label: "Explore now", href: "/men/swim" },
    image: "/images/men/swim-hero.jpg",
    alt: "Three men on a rock platform above a deep blue cove, one diving in the red Tidal Swim Short, one in the navy Shore Swim Short and black Alizé Sunglasses, one in the sky Lido Stripe Swim Short",
    position: "45% 50%",
    plate: "/images/men/plate-cove.jpg",
    thumb: "/community/p6.jpg?v=2",
  },
  {
    key: "linen",
    label: "Shirts",
    title: "Shirts",
    text: "Washed linen that is allowed to crease.",
    cta: { label: "Explore now", href: "/men/shirts-trousers" },
    image: "/images/men/dj.jpg",
    alt: "A DJ at the turntables on a villa terrace above the sea in the sky Cabana Linen Shirt, oat Veranda Linen Trousers and black Alizé Sunglasses, with friends in the navy Harbour Quarter Zip and the red Mooring Stripe Crew",
    position: "50% 50%",
    plate: "/images/men/plate-terrace.jpg",
    thumb: "/community/p12.jpg?v=2",
  },
  {
    key: "knitwear",
    label: "Knitwear",
    title: "Knitwear",
    text: "For the hour the breeze turns.",
    cta: { label: "Explore now", href: "/men/polos-knitwear" },
    image: "/images/men/group-club.jpg",
    alt: "Three men in a wood-panelled club library in the navy Harbour Quarter Zip, the navy Regatta Cardigan with tortoiseshell reading glasses, and the oat Pavilion Cable Vest",
    position: "52% 50%",
    plate: "/images/men/plate-library.jpg",
    thumb: "/community/p3.jpg?v=2",
  },
];

const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

/**
 * Column order: Swim over Trousers, Shirts over Knitwear over Polo Shirts, Rugby Shirts over Tees over Shorts,
 * Accessories over Sunglasses.
 */
export const categoryTiles: MosaicTile[] = [
  { label: cat("swim").name, href: "/men/swim", image: "/images/men/sections/swim.jpg", alt: "A man on the edge of a villa pool below Le Morne in the navy Tidal Swim Short and black Alizé Sunglasses while a friend dives in the sky Lido Stripe Swim Short" },
  { label: cat("trousers").name, href: "/men/trousers", image: "/images/men/sections/trousers.jpg", alt: "Three men in the bar of a grand hotel in the stone Quayside Chino, the navy Esplanade Linen Trouser with reading glasses, and the oat Veranda Linen Trouser", position: "50% 25%" },
  { label: cat("shirts-trousers").name, href: "/men/shirts-trousers", image: "/images/men/sections/shirts.jpg", alt: "Three men on a villa terrace in the sky Riviera Linen Shirt, the navy Cabana Linen Shirt with tortoiseshell Alizé Sunglasses, and the oat Corniche Linen Shirt", position: "50% 15%" },
  { label: cat("polos-knitwear").name, href: "/men/polos-knitwear", image: "/images/men/group-club.jpg", alt: "Three men in a wood-panelled club library in the navy Harbour Quarter Zip, the navy Regatta Cardigan with tortoiseshell reading glasses, and the oat Pavilion Cable Vest", position: "52% 50%" },
  { label: cat("polo-shirts").name, href: "/men/polo-shirts", image: "/images/men/sections/polo.jpg", alt: "A man serving on a clay court in the navy Sett Polo and black Alizé Sunglasses, friends on the bench in the ecru Boathouse Tipped Polo", position: "50% 30%" },
  { label: cat("rugby-shirts").name, href: "/men/rugby-shirts", image: "/images/men/sections/rugby.jpg", alt: "Three men on the steps of a cricket pavilion in the red Touchline Rugby Shirt and the navy and red Breakwater Rugby Shirts", position: "50% 20%" },
  { label: cat("tees").name, href: "/men/tees", image: "/images/men/sections/tees.jpg", alt: "A man on the bow of a classic yacht in the white Sandbar Tee and black Alizé Sunglasses", position: "50% 30%" },
  { label: cat("shorts").name, href: "/men/shorts", image: "/images/men/sections/shorts.jpg", alt: "Two men stepping off a wooden speedboat onto a villa jetty at Grand Baie in the stone Quayside Chino Short with tortoiseshell Alizé Sunglasses and the oat Jetty Linen Short", position: "50% 25%" },
  { label: cat("outerwear-accessories").name, href: "/men/outerwear-accessories", image: "/images/men/sections/accessories.jpg", alt: "A man on the running board of a vintage car in the navy Sett Cap, black Alizé Sunglasses and white Burrow Socks", position: "50% 35%" },
  { label: cat("sunglasses").name, href: "/men/sunglasses", image: "/images/men/sections/sunglasses.jpg", alt: "A man in tortoiseshell Alizé Sunglasses and the navy Riviera Linen Shirt in the shade of a stone loggia" },
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
    { eyebrow: "Riviera · Cabana · Corniche", title: "The linen shop", href: "/men/shirts-trousers", image: "/images/men/story-linen.jpg", alt: "Three men in the stone loggia of a villa in linen shirts and the oat Harbour Quarter Zip, the one in the centre in black Alizé Sunglasses" },
    { eyebrow: "Harbour · Mooring · Regatta", title: "The knitwear shop", href: "/men/polos-knitwear", image: "/images/men/story-knitwear.jpg", alt: "Two men in a wood-panelled club library in the navy Regatta Cardigan and the navy Harbour Quarter Zip" },
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
    image: "/images/men/favourite-hoodie.jpg",
    alt: "A man on a stone terrace above the sea in the navy Cabana Hoodie, oat Veranda Linen Trousers and black Alizé Sunglasses",
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
    { title: "New in", href: "/men/all?filter=new", image: "/images/men/new-in.jpg", alt: "Three men on a tennis club terrace in the navy Sett Polo with black Alizé Sunglasses, the ecru Boathouse Tipped Polo and the oat Sundeck Knit Polo", cta: "Shop now" },
    { title: "Made to order", href: "/made-to-order", image: "/images/cutting-table.jpg?v=2", alt: "Hands cutting sky linen on the workshop table", cta: "Discover" },
    { title: "Conservation", href: "/conservation", image: "/images/day-reef.jpg", alt: "A snorkeller over the reef", cta: "Discover" },
    { title: "Our story", href: "/about", image: "/images/about.jpg", alt: "A man walking barefoot on basalt rocks in a sage linen shirt", cta: "Discover" },
    { title: "Measurements", href: "/made-to-order#measurements", image: "/images/numbered-label.jpg?v=2", alt: "Hands boxing a red knit", cta: "See the sheets" },
    { title: "For her", href: "/women", image: "/images/women/linen.jpg", alt: "A woman at a market in a striped linen shirt and white trousers", cta: "Shop now" },
  ],
};
