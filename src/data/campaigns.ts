import type { AudienceSlug, CategorySlug } from "./site";
import type { LookbookImage } from "@/components/LookbookRow";
import type { Story } from "@/components/StoryCopy";
import type { HeroSlide } from "@/components/landing/HeroSlider";
import { pledgePercentLabel } from "@/lib/pledge";
import { editStory } from "./edits";

/**
 * The homepage's full-screen hero, built like /men's and /women's: a card per slide over an empty landscape.
 * Its pictures differ from the Women and Men pair further down the page.
 */
export const homeSlides: HeroSlide[] = [
  {
    key: "men",
    label: "Men",
    title: "Men",
    text: "Swim shorts, linen, tees and knitwear, cut for men.",
    cta: { label: "Explore now", href: "/men" },
    image: "/images/home/men-hero.jpg",
    alt: "Three men on the deck of a classic yacht below Le Morne in the clementine Riviera Linen Shirt with olive Alizé Sunglasses, the sky Mooring Stripe Crew and the saffron Lido Stripe Swim Short",
    plate: "/images/home/plate-yacht.jpg",
    thumb: "/community/p10.jpg?v=3",
  },
  {
    key: "women",
    label: "Women",
    title: "Women",
    text: "Swimsuits, linen, tees and knitwear, cut for women.",
    cta: { label: "Explore now", href: "/women" },
    image: "/images/home/women-hero.jpg",
    alt: "Three women by a villa pool in the clementine Promenade Knit Polo with tortoiseshell Alizé Sunglasses, the pink Women’s Mooring Stripe Crew and the navy Women’s Cabana Linen Shirt",
    position: "75% 50%",
    plate: "/images/home/plate-pool.jpg",
    thumb: "/images/women/knitwear.jpg",
  },
  {
    key: "new",
    label: "New in",
    title: "New in",
    text: "The latest pieces, made in Mauritius once you order them.",
    cta: { label: "Shop new in", href: "/shop/all?filter=new" },
    image: "/images/shop/hero.jpg",
    alt: "A woman in the clementine Cabana hoodie and cap and a man in the sky Riviera linen shirt walking along a jetty at Le Morne",
    plate: "/images/men/plate-swim.jpg",
    thumb: "/images/women/landing/cat-caps.jpg",
  },
];

/** The full-bleed campaign that opens /shop, with the way in for men and women. */
export const heroStory: Story = {
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

/** The "Around the island." carousel of lines, edits and the workshop, on both the homepage and /shop. */
export const exploreStories: Story[] = [
  {
    eyebrow: "Swim",
    title: "Tidal, Shore & Lido",
    image: "/images/home/explore-swim.jpg",
    alt: "Three men by a villa pool above the sea in the navy Tidal Swim Short with black Alizé Sunglasses, the sky Lido Stripe Swim Short and the navy Shore Swim Short",
    links: [{ label: "Shop swim", href: "/shop/swim" }],
  },
  {
    eyebrow: "Shirts",
    title: "Allowed to crease",
    image: "/images/women/linen.jpg",
    alt: "A woman in a pink striped linen shirt and white linen trousers at a market",
    links: [{ label: "Shop shirts", href: "/shop/shirts-trousers" }],
  },
  editStory("clubhouse"),
  editStory("rugby"),
  {
    eyebrow: "Sunglasses",
    title: "Alizé",
    image: "/images/home/explore-sunglasses.jpg",
    alt: "Three women in the long gallery of a villa in the Women’s Veranda Linen Trouser, the one in the centre in black Alizé Sunglasses",
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

/** The homepage's community section, split in two: the people in the pieces, and the loyalty programme. */
export const communityStories: [Story, Story] = [
  {
    eyebrow: "Stories",
    title: "The Community",
    dek: "The people in the pieces, out in the world.",
    image: "/images/run-club.jpg",
    alt: "A run club of seven on a stone seafront promenade at sunrise in the white Sandbar Tee, the navy Cabana Stripe Tee and navy Tidal Swim Shorts, the runner in front in black Alizé Sunglasses",
    links: [{ label: "Discover more", href: "/stories#community" }],
  },
  {
    eyebrow: "Subscription",
    title: "Members Only",
    dek: "A subscription that goes entirely to conservation. In return, members get discounts at partner clubs and events.",
    image: "/images/women/landing/dj.jpg",
    alt: "A DJ at the turntables in a villa courtyard in the clementine Cabana Hoodie and tortoiseshell Alizé Sunglasses, two friends apart in a linen shirt and a striped knit",
    links: [{ label: "Join now", href: "/stories#members" }],
  },
];

/**
 * Campaigns: a picture with a title, a line and two links. The homepage shows Women and Men as a
 * 50/50 pair; the rows under them (a product carousel or four lookbook images) are from the earlier,
 * kith.com-style homepage that stacked every campaign full-bleed.
 *
 * The images are AI-generated with Nano Banana Pro (scripts/stills-shots.mjs), the models wearing the
 * real pieces. Swap in real photography under the same file names when it exists.
 */
export type Campaign = {
  key: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /**
   * What sits under the image. `featured` = the featured pieces (see `featured` in products.ts); `audience` = the
   * pieces cut for that audience only, not the ones for anyone.
   */
  row:
    | { kind: "featured" }
    | { kind: "category"; category: CategorySlug }
    | { kind: "audience"; audience: AudienceSlug }
    | { kind: "lookbook"; images: LookbookImage[] };
};

export const campaigns: Campaign[] = [
  {
    key: "collection",
    title: "Collection I",
    text: "Every piece made to order in Mauritius, in your size, once you order it.",
    image: "/images/campaign-drop.jpg?v=3",
    alt: "Four friends on a basalt harbour wall in Mauritius in a navy quarter zip, oat linen shirt, red striped knit and saffron striped swim shorts",
    primary: { label: "Shop now", href: "/shop" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "featured" },
  },
  {
    key: "women",
    title: "Women",
    text: "Swimsuits, linen, shorts, tees and knitwear, cut for women and made to order in Mauritius.",
    image: "/images/campaign-women.jpg",
    alt: "Three friends walking barefoot along the waterline at Pointe d’Esny in a navy awning-stripe linen shirt with white shorts, a lagoon swimsuit under an open oat linen shirt, and a pink striped cropped knit with white linen trousers",
    primary: { label: "Shop women", href: "/women" },
    secondary: { label: "All pieces", href: "/women/all" },
    row: { kind: "audience", audience: "women" },
  },
  {
    key: "men",
    title: "Men",
    text: "Swim shorts, linen, shorts, tees and knitwear, cut for men and made to order in Mauritius.",
    image: "/images/home/men-pair.jpg",
    alt: "Three men on a villa boat landing in a white linen shirt with black Alizé Sunglasses, a white tee and a navy tee, in the Quayside Chino Short, Jetty Linen Short and Esplanade Linen Short",
    primary: { label: "Shop men", href: "/men" },
    secondary: { label: "All pieces", href: "/men/all" },
    row: {
      kind: "lookbook",
      images: [
        { image: "/community/p4.jpg?v=2", alt: "A surfer in an open sky linen shirt and lagoon swim shorts", href: "/men/swim" },
        { image: "/community/surf-still.jpg", alt: "A surfer coming out of a barrel wave", href: "/men/swim" },
        { image: "/community/p5.jpg?v=2", alt: "A kitesurfer in an oat linen shirt and pine and ecru swim shorts", href: "/men/swim" },
        { image: "/community/kite-still.jpg", alt: "A kitesurfer upside down in the air beside his kite", href: "/men/swim" },
      ],
    },
  },
  {
    key: "linen",
    title: "Shirts",
    text: "Linen shirts that are allowed to crease.",
    image: "/images/campaign-linen.jpg?v=9",
    alt: "Lunch on the sand under a sea almond tree by the lagoon, wine poured in sky and clementine linen shirts",
    primary: { label: "Shop now", href: "/shop/shirts-trousers" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "category", category: "shirts-trousers" },
  },
  {
    key: "knitwear",
    title: "Knitwear",
    text: "Striped hoodies, cardigans, stripe crews, rugby shirts and quarter zips, for the back nine and the drive home.",
    image: "/images/campaign-golf.jpg?v=2",
    alt: "A golfer in a navy striped knit crewneck teeing off by the sea, his partner in a sand knitted jacket",
    primary: { label: "Shop now", href: "/shop/polos-knitwear" },
    row: { kind: "category", category: "polos-knitwear" },
  },
];
