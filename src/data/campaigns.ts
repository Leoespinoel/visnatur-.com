import type { CategorySlug } from "./site";
import type { LookbookImage } from "@/components/LookbookRow";

/**
 * Homepage campaigns under the film, in order, modelled on kith.com: a full-bleed image with a
 * title and two buttons, then either a product carousel or a row of four lookbook images.
 *
 * The wide images are frames from the approved film takes (720p). Swap in real photography under
 * the same file names when it exists.
 */
export type Campaign = {
  key: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** What sits under the image. `featured` = the current drop's featured pieces. */
  row: { kind: "featured" } | { kind: "category"; category: CategorySlug } | { kind: "lookbook"; images: LookbookImage[] };
};

export const campaigns: Campaign[] = [
  {
    key: "drop",
    title: "Drop I",
    text: "Every design released once, in a numbered edition of twelve, and made in Mauritius after orders close.",
    image: "/images/campaign-drop.jpg",
    alt: "A man in a knitted shirt and pleated trousers on a sea cliff at sunset",
    primary: { label: "Shop now", href: "/shop" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "featured" },
  },
  {
    key: "swim",
    title: "Swim",
    text: "Swim shorts in solid colours and colour-block, cut for long days by the water.",
    image: "/images/campaign-swim.jpg",
    alt: "A man in navy swim shorts on a wooden pier at dawn",
    primary: { label: "Shop now", href: "/shop/swim" },
    secondary: { label: "All pieces", href: "/shop/all" },
    row: {
      kind: "lookbook",
      images: [
        { image: "/community/p4.jpg", alt: "A surfer in an open shirt and blue swim shorts", href: "/shop/swim" },
        { image: "/community/a4.jpg", alt: "A surfer inside a barrel wave", href: "/shop/swim" },
        { image: "/community/p5.jpg", alt: "A man in a linen shirt and green print swim shorts on a beach", href: "/shop/swim" },
        { image: "/community/a5.jpg", alt: "A kitesurfer in the air", href: "/shop/swim" },
      ],
    },
  },
  {
    key: "linen",
    title: "Linen Shirts",
    text: "Linen shirts that are allowed to crease, in six colours.",
    image: "/images/campaign-linen.jpg",
    alt: "A man in a short-sleeved shirt on a summit above the clouds",
    primary: { label: "Shop now", href: "/shop/shirts-trousers" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "category", category: "shirts-trousers" },
  },
  {
    key: "knitwear",
    title: "Knitwear",
    text: "Cardigans, stripe crews, rugby shirts and quarter zips, for the back nine and the drive home.",
    image: "/images/campaign-golf.jpg",
    alt: "A golfer in a knitted shirt on a green at sunset",
    primary: { label: "Shop now", href: "/shop/polos-knitwear" },
    row: { kind: "category", category: "polos-knitwear" },
  },
];
