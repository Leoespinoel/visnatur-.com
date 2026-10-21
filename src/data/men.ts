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
    label: "Signature",
    title: "Signature",
    text: "The permanent line, made by hand in Mauritius.",
    cta: { label: "Explore now", href: "/men/all" },
    image: "/images/men/group-forecourt.jpg?v=r1016",
    alt: "Two men on the stone steps of a country house, one sitting in a cream cable-knit cricket jumper with navy and red tipping and stone chinos, the other standing in a sand linen shirt over a white tee and cream trousers",
    position: "62% 50%",
    plate: "/images/men/plate-forecourt.jpg",
    thumb: "/images/thumbs/men-collection.jpg",
  },
  {
    key: "swim",
    label: "Swim",
    title: "Swim",
    text: "Cut for the lagoon, finished for the terrace after.",
    cta: { label: "Explore now", href: "/men/swim" },
    image: "/images/men/swim-hero.jpg?v=r1016",
    alt: "Two men on a rock platform above the sea, one in sunglasses and an open cream linen shirt over navy and cream swim shorts, the other sitting on the rocks in sky striped swim shorts",
    position: "45% 50%",
    plate: "/images/men/plate-cove.jpg",
    thumb: "/images/thumbs/men-swim.jpg",
  },
  {
    key: "linen",
    label: "Shirts",
    title: "Shirts",
    text: "Washed linen that is allowed to crease.",
    cta: { label: "Explore now", href: "/men/shirts-trousers" },
    image: "/images/men/dj.jpg?v=r1016",
    alt: "A man in black sunglasses and an open white linen shirt over a white tee with cream trousers beside the turntables on a terrace above the sea, a friend on the balustrade in a cream cable-knit cricket jumper and stone chinos",
    position: "50% 50%",
    plate: "/images/men/plate-terrace.jpg",
    thumb: "/images/thumbs/men-shirts.jpg",
  },
  {
    key: "knitwear",
    label: "Knitwear",
    title: "Knitwear",
    text: "For the hour the breeze turns.",
    cta: { label: "Explore now", href: "/men/polos-knitwear" },
    image: "/images/men/group-club.jpg?v=r1016",
    alt: "Three men in a wood-panelled club library, in a navy knit over a striped shirt with grey pinstripe trousers, an ecru quarter zip with stone chinos, and a navy and cream hooped rugby shirt",
    position: "52% 50%",
    plate: "/images/men/plate-library.jpg",
    thumb: "/images/thumbs/men-knitwear.jpg",
  },
];

const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

/**
 * Column order: Swim over Trousers, Shirts over Knitwear over Polo Shirts, Rugby Shirts over Tees over Shorts,
 * Accessories over Sunglasses.
 */
export const categoryTiles: MosaicTile[] = [
  { label: cat("swim").name, href: "/men/swim", image: "/images/men/sections/swim.jpg?v=r1016", alt: "A man in black sunglasses and navy swim shorts on the edge of a pool below Le Morne while a friend dives in behind him in sky swim shorts" },
  { label: cat("trousers").name, href: "/men/trousers", image: "/images/men/sections/trousers.jpg?v=r1016", alt: "Three men at the bar of a grand hotel, in a cream knit with oat drawstring linen trousers, a white shirt with stone chinos and reading glasses, and a charcoal knit with grey pinstripe trousers", position: "50% 25%" },
  { label: cat("shirts-trousers").name, href: "/men/shirts-trousers", image: "/images/men/sections/shirts.jpg?v=r1016", alt: "Two men in a stone courtyard under a vine, one in sunglasses and a navy and white striped shirt, the other in a sky linen shirt, both in cream trousers", position: "50% 15%" },
  { label: cat("polos-knitwear").name, href: "/men/polos-knitwear", image: "/images/men/group-club.jpg?v=r1016", alt: "Three men in a wood-panelled club library, in a navy knit over a striped shirt with grey pinstripe trousers, an ecru quarter zip with stone chinos, and a navy and cream hooped rugby shirt", position: "52% 50%" },
  { label: cat("polo-shirts").name, href: "/men/polo-shirts", image: "/images/men/sections/polo.jpg?v=r1016", alt: "A man serving on a clay court in a navy polo, white shorts and sunglasses, a friend on the bench in a white polo", position: "50% 30%" },
  { label: cat("rugby-shirts").name, href: "/men/rugby-shirts", image: "/images/men/sections/rugby.jpg?v=r1016", alt: "Three men on the steps of a cricket pavilion, the one in front in a red and navy hooped rugby shirt, the two behind in navy and cream hooped rugby shirts, all in stone chinos", position: "50% 20%" },
  { label: cat("tees").name, href: "/men/tees", image: "/images/men/sections/tees.jpg?v=r1016", alt: "A man in black sunglasses on the bow of a classic wooden yacht in a stone harbour, in a white tee and stone shorts", position: "50% 30%" },
  { label: cat("shorts").name, href: "/men/shorts", image: "/images/men/sections/shorts.jpg?v=r1016", alt: "Two men walking barefoot along a jetty beside a wooden speedboat, one in tortoiseshell sunglasses, a white linen shirt and stone shorts, the other in a white tee and navy shorts", position: "50% 25%" },
  { label: cat("outerwear-accessories").name, href: "/men/outerwear-accessories", image: "/images/men/sections/accessories.jpg?v=r1016", alt: "A man on the running board of a vintage green car in a navy cap, black sunglasses, a white tee, stone chinos and white ribbed socks", position: "50% 35%" },
  { label: cat("sunglasses").name, href: "/men/sunglasses", image: "/images/men/sections/sunglasses.jpg?v=r1016", alt: "A man in tortoiseshell sunglasses and a navy linen shirt in the shade of a stone arcade" },
];

/** Curated edits, RL's "The Stories". */
export const stories: { title: string; text: string; feature: StoryCard; cards: StoryCard[] } = {
  title: "The stories",
  text: "Seasonal edits, and the island they are made on.",
  feature: {
    eyebrow: "Signature",
    title: "A day at Le Morne",
    href: "/men/all",
    image: "/images/day-kite.jpg?v=r1016",
    alt: "Two friends with their kites on the beach below Le Morne, one in navy swim shorts, the other in an open oat linen shirt over cream swim shorts",
  },
  cards: [
    { eyebrow: "Tidal · Shore · Lido", title: "The swim shop", href: "/men/swim", image: "/community/surf-still.jpg", alt: "A surfer coming out of a barrel wave" },
    { eyebrow: "Riviera · Cabana · Corniche", title: "The linen shop", href: "/men/shirts-trousers", image: "/images/men/story-linen.jpg?v=r1016", alt: "Three men in the arched loggia of a villa, in a brown houndstooth jacket with cream trousers, a brown shirt with charcoal pinstripe trousers and sunglasses, and a green and cream striped cardigan with stone chinos" },
    { eyebrow: "Harbour · Mooring · Regatta", title: "The knitwear shop", href: "/men/polos-knitwear", image: "/images/men/story-knitwear.jpg?v=r1016", alt: "Two men in a wood-panelled club room, one in a leather armchair in a cream cable-knit cricket jumper with navy and red tipping, the other in a navy collared knit over a white shirt, both in stone chinos" },
    { eyebrow: "Cabana Linen Shirt", title: "The stripe", href: "/product/cabana-linen-shirt-sky", image: "/images/day-catamaran.jpg?v=r1016b", alt: "Two men on a catamaran net as dolphins leap off the bow, one in an open sky striped linen shirt and navy swim shorts" },
  ],
};

/** RL's collaboration banner: the wild and the workshop. */
export const bannerSlides: BannerSlide[] = [
  {
    key: "fifth",
    image: "/images/sea-cliff-wide.jpg?v=r1016",
    alt: "Green sea cliffs in golden light, a man in a cream quarter-zip knit looking out",
    lockup: { badger: true },
    text: "1/5 of profits goes to creating and sustaining the environments we love wearing the pieces in.",
    cta: { label: "Origins", href: "/about" },
  },
  {
    key: "atelier",
    image: "/images/campaign-atelier.jpg?v=2",
    alt: "A seamstress beside a rail of finished pieces in the Port Louis workshop",
    lockup: { text: "Atelier" },
    text: "Cut and sewn by hand in Mauritius. Any Signature piece, made to order to fit.",
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
    image: "/images/men/favourite-hoodie.jpg?v=r1016",
    alt: "A man in black sunglasses on a stone terrace wall above the sea in an oat hoodie with the name in script and stone trousers",
  },
  cards: groupByFamily(favouriteSlugs.map(getProduct).filter((p): p is Product => !!p && isFor(p, "men")))
    .map((g) => g[0])
    .filter((p) => p.family !== "cabana-hoodie")
    .map(favouriteCard),
};

export const explore: { title: string; text: string; tiles: ExploreTile[] } = {
  title: "More to explore",
  text: "The workshop, the wild, and the rest of the house.",
  tiles: [
    { title: "New in", href: "/men/all?filter=new", image: "/images/men/new-in.jpg?v=r1016", alt: "Three men outside a tennis clubhouse, in a cream cricket jumper with white shorts, a navy varsity jacket with a red cursive VN and sunglasses, and a sage linen shirt", cta: "Shop now" },
    { title: "Made to order", href: "/made-to-order", image: "/images/cutting-table.jpg?v=2", alt: "Hands cutting sky linen on the workshop table", cta: "Discover" },
    { title: "Our story", href: "/about", image: "/images/about.jpg?v=r1016", alt: "A man walking barefoot over basalt rocks by the surf in a white linen shirt and navy trousers", cta: "Discover" },
    { title: "Measurements", href: "/made-to-order#measurements", image: "/images/numbered-label.jpg?v=2", alt: "Hands boxing a red knit", cta: "See the sheets" },
    { title: "For her", href: "/women", image: "/images/women/linen.jpg?v=r1016", alt: "Two friends on the teak deck of a sailing boat after a swim, in creased white and pale-blue linen shirts with linen trousers", cta: "Shop now" },
  ],
};
