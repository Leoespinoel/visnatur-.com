import { products, type Product } from "./products";
import type { Story } from "@/components/StoryCopy";

/**
 * Curated edits across categories, like ralphlauren.com's story listings ("Linen Shop", "Wimbledon
 * Collection"): each is a set of designs with its own listing at /shop/edit/<slug>.
 */
export type Edit = { slug: string; eyebrow: string; title: string; dek: string; image: string; alt: string; families: string[] };

export const edits: Edit[] = [
  {
    slug: "cabana",
    eyebrow: "Linen · terry · twill",
    title: "The Cabana Stripe",
    dek: "One wide deckchair stripe on a washed linen shirt, a loopback hoodie and a six-panel cap.",
    image: "/images/shop/cabana.jpg",
    alt: "A woman with a coffee on a sun lounger in front of striped beach cabanas, in a sky striped linen shirt and white shorts",
    families: ["cabana-linen-shirt", "cabana-hoodie", "cabana-cap"],
  },
  {
    slug: "badger",
    eyebrow: "Tone on tone",
    title: "The Badger",
    dek: "Ours sleeps on its back, stitched in the colour of the cloth.",
    image: "/images/shop/badger-edit.jpg",
    alt: "A man on the stone steps of a colonial house with green shutters, in a sand linen shirt with a cursive VN and cream linen trousers",
    families: ["corniche-linen-shirt", "riviera-hoodie", "sett-cap", "burrow-sock"],
  },
  {
    slug: "clubhouse",
    eyebrow: "Knitwear",
    title: "The Clubhouse",
    dek: "Knits for the last nine holes and the long drink after.",
    image: "/images/shop/clubhouse.jpg",
    alt: "A young man and woman on a tennis club veranda at dusk, he in a cream cable-knit cricket jumper with navy and red tipping, she in a navy knit",
    families: ["harbour-quarter-zip", "mooring-stripe-crew", "clubhouse-knit-jacket", "pavilion-cable-vest", "regatta-cardigan"],
  },
  {
    slug: "rugby",
    eyebrow: "Rugby",
    title: "Breakwater & Touchline",
    dek: "Two rugby shirts in heavy cotton, for a game on the sand at dusk.",
    image: "/images/shop/rugby.jpg",
    alt: "Two young men walking off the beach after a game of touch rugby, in navy and cream and red and navy hooped rugby shirts, one with the ball",
    families: ["breakwater-rugby-shirt", "touchline-rugby-shirt"],
  },
];

export const editHref = (e: Edit) => `/shop/edit/${e.slug}`;

export function getEdit(slug: string): Edit | undefined {
  return edits.find((e) => e.slug === slug);
}

/** An edit as a story tile, linking to its listing. */
export function editStory(slug: string): Story {
  const e = getEdit(slug) as Edit;
  return { eyebrow: e.eyebrow, title: e.title, dek: e.dek, image: e.image, alt: e.alt, links: [{ label: "Shop the edit", href: editHref(e) }] };
}

/** The edit's pieces, its designs in the order the edit lists them. */
export function productsInEdit(e: Edit): Product[] {
  return e.families.flatMap((f) => products.filter((p) => p.family === f));
}
