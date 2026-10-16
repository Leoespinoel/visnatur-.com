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
    image: `${IMG}/group-hall.jpg?v=r1016`,
    alt: "Three women in the chequered marble hall of a villa, in a navy and cream hooped rugby shirt with a white pleated skirt, a brown suede jacket with cream trousers, and a cream cricket jumper over a striped shirt",
    position: "45% 50%",
    plate: `${IMG}/plate-hall.jpg`,
    thumb: "/images/women/knitwear.jpg?v=r1016",
  },
  {
    key: "hoodies",
    label: "Hoodies",
    title: "Hoodies",
    text: "Linen and cotton loopback, striped or plain, in nine colours.",
    cta: { label: "Explore now", href: "/women/polos-knitwear" },
    image: `${IMG}/dj.jpg?v=r1016`,
    alt: "A DJ at the decks on a terrace with green shutters, in a green and cream striped cardigan, pinstripe trousers and sunglasses, between a friend in a sky linen shirt and one in a navy cardigan and stone chinos",
    position: "53% 50%",
    plate: `${IMG}/plate-courtyard.jpg`,
    thumb: "/images/women/riviera-hoodie.jpg?v=r1016",
  },
  {
    key: "caps",
    label: "Caps",
    title: "Caps",
    text: "Three six-panel caps: the script, the badger and the stripe.",
    cta: { label: "Explore now", href: "/women/outerwear-accessories" },
    image: "/images/shop/grid-accessories.jpg?v=r1016",
    alt: "A woman on the wooden steps of a veranda under pink bougainvillea in a grey cap, a cream linen shirt and shorts, white socks and brown loafers",
    position: "38% 50%",
    plate: `${IMG}/plate-caps.jpg`,
    thumb: "/images/women/accessories.jpg?v=r1016",
  },
  {
    key: "sunglasses",
    label: "Sunglasses",
    title: "Sunglasses",
    text: "Alizé, the slim oval, named after the island’s trade wind.",
    cta: { label: "Explore now", href: "/women/sunglasses" },
    image: `${IMG}/group-pool.jpg?v=r1016`,
    alt: "Two women on a villa pool terrace, one standing in a cream cable-knit cricket jumper with navy and red tipping and white shorts, the other seated in a navy knit and cream trousers",
    position: "70% 50%",
    plate: `${IMG}/plate-pool.jpg`,
    thumb: "/images/women/sunglasses.jpg?v=r1016",
  },
];

/** Column order: Swim over Shirts, Polo Shirts over Tees, Shorts over Sunglasses, Knitwear over Trousers. */
export const categoryTiles: MosaicTile[] = [
  { label: "Swim", href: "/women/swim", image: `${IMG}/sections/swim.jpg?v=r1016`, alt: "Two women on the stone sea steps of a villa, one in a navy swimsuit, the other in a cream swimsuit under an open pale pink linen shirt" },
  { label: "Shirts", href: "/women/shirts-trousers", image: `${IMG}/sections/shirts.jpg?v=r1016`, alt: "A woman reading in a rattan chair on the veranda of a colonial house in reading glasses, a pink striped shirt and white linen trousers, a friend behind her in a sky linen shirt", position: "50% 30%" },
  { label: "Polo Shirts", href: "/women/polo-shirts", image: `${IMG}/sections/polo.jpg?v=r1016`, alt: "A woman playing a forehand on a clay court in sunglasses, a navy knit polo with cream tipping and white shorts", position: "50% 30%" },
  { label: "Tees", href: "/women/tees", image: `${IMG}/sections/tees.jpg?v=r1016`, alt: "Two women lounging on a catamaran below Le Morne, one in a navy tee and stone trousers, the other on the net in a cream tee and stone shorts", position: "50% 40%" },
  { label: "Shorts", href: "/women/shorts", image: `${IMG}/sections/shorts.jpg?v=r1016`, alt: "Two women walking between yew hedges, one in tortoiseshell sunglasses, a white linen shirt and cream pleated shorts, the other in a white tee and navy shorts", position: "50% 30%" },
  { label: "Sunglasses", href: "/women/sunglasses", image: `${IMG}/group-pool.jpg?v=r1016`, alt: "Two women on a villa pool terrace, one standing in a cream cable-knit cricket jumper with navy and red tipping and white shorts, the other seated in a navy knit and cream trousers", position: "70% 50%" },
  { label: "Knitwear", href: "/women/polos-knitwear", image: `${IMG}/group-hall.jpg?v=r1016`, alt: "Three women in the chequered marble hall of a villa, in a navy and cream hooped rugby shirt with a white pleated skirt, a brown suede jacket with cream trousers, and a cream cricket jumper over a striped shirt", position: "45% 50%" },
  { label: "Trousers", href: "/women/trousers", image: `${IMG}/sections/trousers.jpg?v=r1016`, alt: "A woman walking down a villa gallery in black sunglasses, a white tee and cream pleated trousers" },
];

/** Curated edits, RL's "The Stories". */
export const stories: { title: string; text: string; feature: StoryCard; cards: StoryCard[] } = {
  title: "The stories",
  text: "Edits, and the island they are made on.",
  feature: {
    eyebrow: "Shirt · Tee · Hoodie · Cap",
    title: "The Cabana Stripe",
    href: designs("womens-cabana-linen-shirt", "cabana-stripe-tee", "cabana-hoodie", "cabana-cap"),
    image: "/images/shop/cabana.jpg?v=r1016",
    alt: "A woman with a coffee on a sun lounger in front of striped beach cabanas, in a sky striped linen shirt and white shorts",
  },
  cards: [
    { eyebrow: "Tone on tone", title: "The Badger", href: designs("riviera-hoodie", "sett-cap", "burrow-sock"), image: `${IMG}/story-badger.jpg?v=r1016`, alt: "A woman walking by the giant water lily pond at Pamplemousses in a cream cable-knit cricket jumper with navy and red tipping and oat linen trousers" },
    { eyebrow: "Alizé", title: "After the trade wind", href: "/women/sunglasses", image: `${IMG}/story-alize.jpg`, alt: "Three women in a formal garden between yew hedges, the one in the centre in tortoiseshell Alizé Sunglasses and the white Esplanade Linen Short" },
    { eyebrow: "Collection I", title: "A walk at Le Morne", href: "/shop", image: "/images/shop/hero.jpg?v=r1016", alt: "Four friends, two men and two women, walking back along a jetty below Le Morne in linen shirts, a navy knit, a cream cricket jumper and cream trousers, one woman carrying her loafers" },
  ],
};

/** RL's collaboration banner: the pledge and the workshop. */
export const bannerSlides: BannerSlide[] = [
  {
    key: "pledge",
    image: "/images/shop/reef.jpg?v=r1016",
    alt: "A free-diver in navy swim shorts gliding over a coral garden, sunlight falling through the water",
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
    { title: "New in", href: "/women/all?filter=new", image: `${IMG}/new.jpg?v=r1016`, alt: "A woman with a coffee at a café table on the sand under the palms, in a cream cable-knit cricket jumper with navy and red tipping and stone trousers", cta: "Shop now" },
    { title: "Made to order", href: "/made-to-order", image: "/images/cutting-table.jpg?v=2", alt: "Hands cutting sky linen on the workshop table", cta: "Discover" },
    { title: "Conservation", href: "/conservation", image: "/images/day-reef.jpg?v=r1016", alt: "A swimmer in red swim shorts over a coral reef", cta: "Discover" },
    { title: "Our story", href: "/about", image: "/images/about.jpg?v=r1016", alt: "A man walking barefoot over basalt rocks by the surf in a white linen shirt and navy trousers", cta: "Discover" },
    { title: "Measurements", href: "/made-to-order#measurements", image: "/images/numbered-label.jpg?v=2", alt: "Hands boxing a red knit", cta: "See the sheets" },
    { title: "For him", href: "/men", image: `${IMG}/for-him.jpg`, alt: "Three men on the deck of a classic yacht in the white Sandbar Tee with black Alizé Sunglasses, the navy Cabana Stripe Tee and the navy Badger Tee", cta: "Shop now" },
  ],
};
