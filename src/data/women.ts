/**
 * The /women landing page, built like /men (src/data/men.ts) after ralphlauren.com/men: hero slider,
 * the pieces, the stories, a full-bleed banner, our favourites, more to explore. The women's line
 * (swimsuits, shirts, shorts and tees, the Veranda trouser, knitwear; Nos. 235–295) sits alongside the
 * pieces cut for anyone (hoodies, caps, socks, sunglasses). Every women's piece is at /women/all.
 * The lifestyle pictures still show the pieces cut for anyone until the women's line is photographed.
 */
import type { BannerSlide } from "@/components/landing/BannerSlider";
import type { MosaicTile } from "@/components/landing/CategoryMosaic";
import type { ExploreTile } from "@/components/landing/ExploreCarousel";
import type { HeroSlide } from "@/components/landing/HeroSlider";
import type { StoryCard } from "@/components/landing/StoryBand";
import { getProduct, productImages, type Product } from "./products";
import { categories } from "./site";

const IMG = "/images/women/landing";
/** A women's listing narrowed to some designs (ShopGrid reads ?design=). */
const designs = (...families: string[]) => `/women/all?design=${families.join(",")}`;

/** Our lines in the place of RL's Polo, Purple Label, Double RL and RLX. */
export const heroSlides: HeroSlide[] = [
  {
    key: "collection",
    label: "Collection I",
    title: "Collection I",
    text: "Swimsuits, linen, shorts, tees and knitwear, made in Mauritius once you order them.",
    cta: { label: "Explore now", href: "/women/all" },
    image: `${IMG}/group-hall.jpg`,
    alt: "Three women in the marble hall of a villa in the navy Women’s Mooring Stripe Crew, the burgundy Women’s Regatta Cardigan and the sky Women’s Riviera Linen Shirt",
    position: "45% 50%",
    plate: `${IMG}/plate-hall.jpg`,
    thumb: "/images/women/knitwear.jpg",
  },
  {
    key: "hoodies",
    label: "Hoodies",
    title: "Hoodies",
    text: "Linen and cotton loopback, striped or plain, in nine colours.",
    cta: { label: "Explore now", href: "/women/polos-knitwear" },
    image: `${IMG}/dj.jpg`,
    alt: "A DJ at the turntables in a villa courtyard in the clementine Cabana Hoodie, white Esplanade Linen Shorts and tortoiseshell Alizé Sunglasses, with friends in the sky Women’s Riviera Linen Shirt and the pink Women’s Mooring Stripe Crew",
    position: "53% 50%",
    plate: `${IMG}/plate-courtyard.jpg`,
    thumb: "/images/women/riviera-hoodie.jpg",
  },
  {
    key: "caps",
    label: "Caps",
    title: "Caps",
    text: "Three six-panel caps: the script, the badger and the stripe.",
    cta: { label: "Explore now", href: "/women/outerwear-accessories" },
    image: "/images/shop/grid-accessories.jpg",
    alt: "A woman on the steps of a veranda in the pink Sett Cap and white Burrow Socks",
    position: "38% 50%",
    plate: `${IMG}/plate-caps.jpg`,
    thumb: "/images/women/accessories.jpg",
  },
  {
    key: "sunglasses",
    label: "Sunglasses",
    title: "Sunglasses",
    text: "Alizé, the slim oval, named after the island’s trade wind.",
    cta: { label: "Explore now", href: "/women/sunglasses" },
    image: `${IMG}/group-pool.jpg`,
    alt: "Three women by a villa pool in the clementine Promenade Knit Polo, the pink Women’s Mooring Stripe Crew with olive Alizé Sunglasses, and the navy Women’s Cabana Linen Shirt",
    position: "70% 50%",
    plate: `${IMG}/plate-pool.jpg`,
    thumb: "/images/women/sunglasses.jpg",
  },
];

/** Column order: Swim over Shirts, Polo Shirts over Tees, Shorts over Sunglasses, Knitwear over Trousers. */
export const categoryTiles: MosaicTile[] = [
  { label: "Swim", href: "/women/swim", image: `${IMG}/sections/swim.jpg`, alt: "Three women on the sea steps of a villa in the turquoise Tidal Swimsuit with black Alizé Sunglasses, the red Lido Stripe Swimsuit and the oat Women’s Riviera Linen Shirt" },
  { label: "Shirts", href: "/women/shirts-trousers", image: `${IMG}/sections/shirts.jpg`, alt: "A woman reading on the veranda of a colonial sugar-estate house in the pink Women’s Cabana Linen Shirt and reading glasses, a friend behind her in the sky Women’s Riviera Linen Shirt", position: "50% 30%" },
  { label: "Polo Shirts", href: "/women/polo-shirts", image: `${IMG}/sections/polo.jpg`, alt: "A woman playing a forehand on a clay court in the navy Promenade Knit Polo, white Quayside Chino Shorts and tortoiseshell Alizé Sunglasses", position: "50% 30%" },
  { label: "Tees", href: "/women/tees", image: `${IMG}/sections/tees.jpg`, alt: "Four women lounging on a catamaran below Le Morne in the Sandbar Tee and the red Cabana Stripe Tee, one in black Alizé Sunglasses", position: "50% 40%" },
  { label: "Shorts", href: "/women/shorts", image: `${IMG}/sections/shorts.jpg`, alt: "Two women walking between yew hedges in the white Esplanade Linen Short with tortoiseshell Alizé Sunglasses and the navy Quayside Chino Short", position: "50% 30%" },
  { label: "Sunglasses", href: "/women/sunglasses", image: `${IMG}/group-pool.jpg`, alt: "Three women by a villa pool in the clementine Promenade Knit Polo, the pink Women’s Mooring Stripe Crew with olive Alizé Sunglasses, and the navy Women’s Cabana Linen Shirt", position: "70% 50%" },
  { label: "Knitwear", href: "/women/polos-knitwear", image: `${IMG}/group-hall.jpg`, alt: "Three women in the marble hall of a villa in the navy Women’s Mooring Stripe Crew, the burgundy Women’s Regatta Cardigan and the sky Women’s Riviera Linen Shirt", position: "45% 50%" },
  { label: "Trousers", href: "/women/trousers", image: `${IMG}/sections/trousers.jpg`, alt: "A woman walking down a villa gallery in the oat Women’s Veranda Linen Trouser and black Alizé Sunglasses" },
];

/** Curated edits, RL's "The Stories". */
export const stories: { title: string; text: string; feature: StoryCard; cards: StoryCard[] } = {
  title: "The stories",
  text: "Edits, and the island they are made on.",
  feature: {
    eyebrow: "Shirt · Tee · Hoodie · Cap",
    title: "The Cabana Stripe",
    href: designs("womens-cabana-linen-shirt", "cabana-stripe-tee", "cabana-hoodie", "cabana-cap"),
    image: "/images/shop/cabana.jpg",
    alt: "A woman in the sky Cabana Hoodie and cap on a sun lounger in front of striped beach cabanas",
  },
  cards: [
    { eyebrow: "Tone on tone", title: "The Badger", href: designs("riviera-hoodie", "sett-cap", "burrow-sock"), image: `${IMG}/story-badger.jpg`, alt: "A woman by the water lily pond at Pamplemousses in the navy Riviera Hoodie, navy Sett Cap and white Burrow Socks" },
    { eyebrow: "Alizé", title: "After the trade wind", href: "/women/sunglasses", image: `${IMG}/story-alize.jpg`, alt: "Three women in a formal garden between yew hedges, the one in the centre in tortoiseshell Alizé Sunglasses and the white Esplanade Linen Short" },
    { eyebrow: "Collection I", title: "A walk at Le Morne", href: "/shop", image: "/images/shop/hero.jpg", alt: "Two friends walking along a jetty at Le Morne in the Cabana Hoodie and the Riviera linen shirt" },
  ],
};

/** RL's collaboration banner: the pledge and the workshop. */
export const bannerSlides: BannerSlide[] = [
  {
    key: "pledge",
    image: "/images/shop/reef.jpg",
    alt: "A free-diver gliding over a coral garden in a Mauritian lagoon",
    lockup: { badger: true },
    text: "Ten percent of every sale price goes to the island’s reef and forests.",
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

const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

/** One card per women's design: the on-model shot for the women's line, else the packshot (the unisex pieces' models are men). */
function favouriteCard(slug: string): StoryCard {
  const p = getProduct(slug) as Product;
  const images = productImages(p);
  const image = (p.audience === "women" && images.find((i) => i.includes("-model."))) || images[0];
  return { eyebrow: cat(p.category).name, title: p.name, href: `/product/${p.slug}`, image, alt: `${p.name} in ${p.colour.name}` };
}

/** RL's "Gifts for Her": the feature, then one card per design. */
export const favourites: { title: string; text: string; feature: StoryCard; cards: StoryCard[] } = {
  title: "Our favourites",
  text: "The pieces we reach for first.",
  feature: {
    eyebrow: "Cabana Hoodie",
    title: "The hoodie",
    href: "/product/cabana-hoodie-pink",
    image: `${IMG}/favourite-hoodie.jpg`,
    alt: "A woman on a rattan daybed on the veranda of a colonial villa in Mauritius in the pink Cabana Hoodie, white Esplanade Linen Shorts and tortoiseshell Alizé Sunglasses",
  },
  cards: ["tidal-swimsuit-lagoon", "womens-riviera-linen-shirt-pink", "esplanade-linen-short-white", "sandbar-tee-white", "womens-mooring-stripe-crew-pink-ecru", "alize-sunglasses-tortoise"].map(favouriteCard),
};

export const explore: { title: string; text: string; tiles: ExploreTile[] } = {
  title: "More to explore",
  text: "The workshop, the pledge, and the rest of the house.",
  tiles: [
    { title: "New in", href: "/women/all?filter=new", image: `${IMG}/new.jpg`, alt: "A woman laughing over coffee at Trou d’Eau Douce in the sky Riviera Hoodie and cap", cta: "Shop now" },
    { title: "Made to order", href: "/made-to-order", image: "/images/cutting-table.jpg?v=2", alt: "Hands cutting sky linen on the workshop table", cta: "Discover" },
    { title: "Conservation", href: "/conservation", image: "/images/day-reef.jpg", alt: "A snorkeller over the reef", cta: "Discover" },
    { title: "Our story", href: "/about", image: "/images/about.jpg", alt: "A man walking barefoot on basalt rocks in a sage linen shirt", cta: "Discover" },
    { title: "Measurements", href: "/made-to-order#measurements", image: "/images/numbered-label.jpg?v=2", alt: "Hands boxing a red knit", cta: "See the sheets" },
    { title: "For him", href: "/men", image: `${IMG}/for-him.jpg`, alt: "Three men on the deck of a classic yacht in the white Sandbar Tee with black Alizé Sunglasses, the navy Cabana Stripe Tee and the navy Badger Tee", cta: "Shop now" },
  ],
};
