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
    image: `${IMG}/campaign-collection.jpg`,
    alt: "Two friends on the end of a jetty at Grand Baie in the navy Cabana Hoodie and cap and the sage Riviera Hoodie",
    plate: `${IMG}/plate-collection.jpg`,
    thumb: "/images/women/knitwear.jpg",
  },
  {
    key: "hoodies",
    label: "Hoodies",
    title: "Hoodies",
    text: "Linen and cotton loopback, striped or plain, in nine colours.",
    cta: { label: "Explore now", href: "/women/polos-knitwear" },
    image: `${IMG}/campaign-hoodies.jpg`,
    alt: "A woman with silver hair on the harbour wall at Mahébourg at dusk in the red Riviera Hoodie",
    plate: `${IMG}/plate-hoodies.jpg`,
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
    image: "/images/shop/grid-sunglasses.jpg",
    alt: "A woman on the deck of a catamaran in the tortoiseshell Alizé sunglasses and an oat linen shirt",
    position: "55% 50%",
    plate: `${IMG}/plate-sunglasses.jpg`,
    thumb: "/images/women/sunglasses.jpg",
  },
];

/** Column order: Swim over Shirts, Polo Shirts over Tees, Shorts over Sunglasses, Knitwear over Trousers. */
export const categoryTiles: MosaicTile[] = [
  { label: "Swim", href: "/women/swim", image: "/images/women/swim.jpg", alt: "A woman walking up a white sand beach in an oat linen shirt over a swimsuit" },
  { label: "Shirts", href: "/women/shirts-trousers", image: "/images/women/linen.jpg", alt: "A woman at a market in Port Louis in the pink Cabana Linen Shirt" },
  { label: "Polo Shirts", href: "/women/polo-shirts", image: "/community/w3.jpg", alt: "A golfer on a seaside fairway in the navy Promenade Knit Polo and white Quayside Chino Shorts" },
  { label: "Tees", href: "/women/tees", image: "/community/w4.jpg", alt: "A trail runner on a ridge above the Black River Gorges in the red Cabana Stripe Tee and stone Quayside Chino Shorts" },
  { label: "Shorts", href: "/women/shorts", image: `${IMG}/cat-caps.jpg`, alt: "A woman on the Port Louis waterfront in a white tee, white linen shorts and the clementine Cabana Cap", position: "50% 45%" },
  { label: "Sunglasses", href: "/women/sunglasses", image: `${IMG}/cat-sunglasses.jpg`, alt: "A woman on the basalt rocks at Gris Gris in the olive Alizé sunglasses and oat Riviera Hoodie", position: "50% 20%" },
  { label: "Knitwear", href: "/women/polos-knitwear", image: `${IMG}/cat-knitwear.jpg`, alt: "A red-haired woman standing in the misty Bois Chéri tea fields in the navy and ecru Women’s Mooring Stripe Crew and oat Veranda linen trousers" },
  { label: "Trousers", href: "/women/trousers", image: "/images/women/trousers.jpg", alt: "A woman on a wooden jetty in white drawstring linen trousers and a white tee" },
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
    { eyebrow: "Alizé", title: "After the trade wind", href: "/women/sunglasses", image: "/images/women/sunglasses.jpg", alt: "A woman by a rock pool in the Alizé sunglasses" },
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
    image: `${IMG}/edit-hoodie.jpg`,
    alt: "A woman on an upturned pirogue on Île aux Cerfs in the pink Cabana Hoodie",
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
    { title: "For him", href: "/men", image: "/images/men/edit-hoodie.jpg", alt: "A man on a harbour quay at dusk in the navy Cabana Hoodie", cta: "Shop now" },
  ],
};
