import type { CategorySlug } from "./site";
import type { LookbookImage } from "@/components/LookbookRow";

/**
 * Homepage campaigns under the film, in order, modelled on kith.com: a full-bleed image with a
 * title and two buttons, then either a product carousel or a row of four lookbook images.
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
  /** What sits under the image. `featured` = the current drop's featured pieces. */
  row: { kind: "featured" } | { kind: "category"; category: CategorySlug } | { kind: "lookbook"; images: LookbookImage[] };
};

export const campaigns: Campaign[] = [
  {
    key: "drop",
    title: "Drop I",
    text: "Every design released once, in a numbered edition of twelve, and made in Mauritius after orders close.",
    image: "/images/campaign-drop.jpg?v=2",
    alt: "Four friends on a basalt harbour wall in Mauritius in a navy quarter zip, oat linen shirt, red striped knit and saffron striped swim shorts",
    primary: { label: "Shop now", href: "/shop" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "featured" },
  },
  {
    key: "swim",
    title: "Swim",
    text: "Swim shorts in solid colours and colour-block, cut for long days by the water.",
    image: "/images/campaign-swim.jpg?v=2",
    alt: "A man walking out of the lagoon at Le Morne in navy swim shorts",
    primary: { label: "Shop now", href: "/shop/swim" },
    secondary: { label: "All pieces", href: "/shop/all" },
    row: {
      kind: "lookbook",
      images: [
        { image: "/community/p4.jpg?v=2", alt: "A surfer in an open sky linen shirt and lagoon swim shorts", href: "/shop/swim" },
        { image: "/community/a4.jpg", alt: "A surfer inside a barrel wave", href: "/shop/swim" },
        { image: "/community/p5.jpg?v=2", alt: "A kitesurfer in an oat linen shirt and pine and ecru swim shorts", href: "/shop/swim" },
        { image: "/community/a5.jpg", alt: "A kitesurfer in the air", href: "/shop/swim" },
      ],
    },
  },
  {
    key: "linen",
    title: "Linen Shirts",
    text: "Linen shirts that are allowed to crease, in six colours.",
    image: "/images/campaign-linen.jpg?v=2",
    alt: "Lunch on the sand under a sea almond tree, in sky and clementine linen shirts",
    primary: { label: "Shop now", href: "/shop/shirts-trousers" },
    secondary: { label: "A closer look", href: "/made-to-order" },
    row: { kind: "category", category: "shirts-trousers" },
  },
  {
    key: "knitwear",
    title: "Knitwear",
    text: "Cardigans, stripe crews, rugby shirts and quarter zips, for the back nine and the drive home.",
    image: "/images/campaign-golf.jpg?v=2",
    alt: "A golfer in a navy striped knit crewneck teeing off by the sea, his partner in a sand knitted jacket",
    primary: { label: "Shop now", href: "/shop/polos-knitwear" },
    row: { kind: "category", category: "polos-knitwear" },
  },
];
