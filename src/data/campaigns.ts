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
    group: "Signature",
    label: "Men",
    title: "Signature · Men",
    text: "The permanent line, cut for men: linen, knitwear, swim and tailoring, in stock.",
    cta: { label: "Explore for him", href: "/men" },
    image: "/images/home/men-hero.jpg?v=r1016",
    alt: "Three men on the deck of a classic yacht below Le Morne, in a sky striped knit with stone shorts, an open navy linen shirt over a white tee with stone trousers and sunglasses, and navy swim shorts with a navy cap",
    plate: "/images/home/plate-yacht.jpg",
    thumb: "/images/thumbs/home-men.jpg",
  },
  {
    key: "women",
    group: "Signature",
    label: "Women",
    title: "Signature · Women",
    text: "The permanent line, cut for women: linen, knitwear, swim and tailoring, in stock.",
    cta: { label: "Explore for her", href: "/women" },
    image: "/images/home/women-hero.jpg?v=r1016",
    alt: "Three women on a villa pool terrace, in a navy varsity jacket with a red cursive VN over cream linen trousers and sunglasses, a sky striped linen shirt with stone trousers, and a cream cricket jumper with a white pleated skirt",
    position: "75% 50%",
    plate: "/images/home/plate-pool.jpg",
    thumb: "/images/thumbs/home-women.jpg",
  },
  {
    key: "diva",
    group: "Collections",
    label: "DIVA",
    title: "Collections · DIVA",
    text: "The first collection: limited units, released on a date, then gone. On its way.",
    cta: { label: "Be first to know", href: "/collections" },
    image: "/images/moments/dj-night.jpg",
    alt: "A DJ alone at the decks on a stone terrace above the sea at night, candles along the balustrade and a friend in the background",
    plate: "/images/men/plate-terrace.jpg",
    thumb: "/images/thumbs/home-collections.jpg",
  },
];

/** The full-bleed campaign that opens /shop, with the way in for men and women. */
export const heroStory: Story = {
  eyebrow: "Signature · Made in Mauritius",
  title: "Signature, always. Collections, once.",
  dek: `The Signature line in stock, collections in limited numbers, and ${pledgePercentLabel()} of every price going to conservation.`,
  image: "/images/shop/hero.jpg?v=r1016",
  alt: "Four friends, two men and two women, walking back along a jetty below Le Morne in linen shirts, a navy knit, a cream cricket jumper and cream trousers, one woman carrying her loafers",
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
    image: "/images/home/explore-swim.jpg?v=r1016",
    alt: "Three men by an infinity pool above the sea in navy, red and cream swim shorts, one in a navy cap, the one in front in black sunglasses",
    links: [{ label: "Shop swim", href: "/shop/swim" }],
  },
  {
    eyebrow: "Shirts",
    title: "Allowed to crease",
    image: "/images/women/linen.jpg?v=r1016",
    alt: "Two friends on the teak deck of a sailing boat after a swim, in creased white and pale-blue linen shirts with linen trousers",
    links: [{ label: "Shop shirts", href: "/shop/shirts-trousers" }],
  },
  editStory("clubhouse"),
  editStory("rugby"),
  {
    eyebrow: "Sunglasses",
    title: "Alizé",
    image: "/images/home/explore-sunglasses.jpg?v=r1016",
    alt: "Two women in the long gallery of a villa, one in black sunglasses, a cream knit and oat drawstring linen trousers, the other by the window in a white linen shirt and white linen trousers",
    links: [{ label: "Shop sunglasses", href: "/shop/sunglasses" }],
  },
  {
    eyebrow: "Made to order",
    title: "Cut to fit",
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
    image: "/images/moments/surf-lineup.jpg",
    alt: "Two friends sitting on their longboards far apart in the sea at sunset, waiting for the next wave, a headland behind",
    links: [{ label: "Discover more", href: "/stories#community" }],
  },
  {
    eyebrow: "Membership",
    title: "The VN Club",
    dek: "Free to join: points, three rooms and rewards. Members Only adds a subscription that goes entirely to conservation.",
    image: "/images/moments/rooftop.jpg",
    alt: "Two friends on a London rooftop at blue hour, one in a navy varsity jacket with a red cursive VN, the other in a cream half-zip and chinos",
    links: [{ label: "Join now", href: "/members" }],
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
    title: "Signature",
    text: "The permanent line, always in stock and made by hand in Mauritius. Any piece can be made to order, adjusted to fit.",
    image: "/images/campaign-drop.jpg?v=r1016",
    alt: "Two men on a basalt harbour wall with fishing boats behind, one in a cream cable-knit cricket jumper with navy and red tipping and cream trousers, the other in an open sand linen shirt over a navy knit vest and navy trousers",
    primary: { label: "Shop now", href: "/shop" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "featured" },
  },
  {
    key: "women",
    title: "Women",
    text: "Swimsuits, linen, shorts, tees and knitwear, cut for women and made by hand in Mauritius.",
    image: "/images/campaign-women.jpg?v=r1016",
    alt: "Two women walking on the sand beside a blue wooden boat, one barefoot in a cream cable-knit cricket jumper with navy and red tipping and cream wide-leg trousers, the other in a sand linen shirt over a white tee with stone trousers",
    primary: { label: "Shop women", href: "/women" },
    secondary: { label: "All pieces", href: "/women/all" },
    row: { kind: "audience", audience: "women" },
  },
  {
    key: "men",
    title: "Men",
    text: "Swim shorts, linen, shorts, tees and knitwear, cut for men and made by hand in Mauritius.",
    image: "/images/home/men-pair.jpg?v=r1016",
    alt: "Three men on a stone quay beside a wooden speedboat, in an open white linen shirt with cream shorts, a sky striped linen shirt over a white tee with sand chinos and sunglasses, and a navy knit polo with navy shorts",
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
    image: "/images/campaign-linen.jpg?v=r1016",
    alt: "Two men at lunch on the sand under a sea almond tree by the lagoon, one seated in a white linen shirt, the other pouring wine in a sky linen shirt and cream trousers",
    primary: { label: "Shop now", href: "/shop/shirts-trousers" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "category", category: "shirts-trousers" },
  },
  {
    key: "knitwear",
    title: "Knitwear",
    text: "Striped hoodies, cardigans, stripe crews, rugby shirts and quarter zips, for the back nine and the drive home.",
    image: "/images/campaign-golf.jpg?v=r1016",
    alt: "A golfer teeing off by the sea in a white polo and white shorts, his partner in a navy knit polo and stone trousers holding a leather golf bag",
    primary: { label: "Shop now", href: "/shop/polos-knitwear" },
    row: { kind: "category", category: "polos-knitwear" },
  },
];
