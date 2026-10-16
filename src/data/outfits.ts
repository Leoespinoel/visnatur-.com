import type { AudienceSlug } from "./site";
import { productBySlug, type Product } from "./products";

/**
 * Whole looks for /men/outfits and /women/outfits, the last item in each section's menu. Each is a
 * lifestyle still whose pieces are known (the `wear` list of its shot in scripts/stills-shots.mjs), so
 * every piece in the picture can be bought from under it. Things in the picture we don't make (sandals,
 * a tote) are left out.
 */
export type Outfit = {
  slug: string;
  audience: AudienceSlug;
  /** Where it was shot. */
  title: string;
  image: string;
  alt: string;
  /** Product slugs, top to bottom. */
  pieces: string[];
  /** object-position, for pictures that are not 4:5. */
  position?: string;
};

export const outfits: Outfit[] = [
  {
    slug: "trou-aux-biches",
    audience: "men",
    title: "Trou aux Biches",
    image: "/images/shop/shorts-tees.jpg",
    alt: "A man walking barefoot along the lagoon at Trou aux Biches with his sandals in hand, in a white tee and stone chino shorts",
    pieces: ["mens-sandbar-tee-white", "mens-quayside-chino-short-stone"],
  },
  {
    slug: "the-jetty",
    audience: "men",
    title: "The jetty",
    image: "/images/men/cat-linen.jpg",
    alt: "A man walking barefoot along a wooden jetty over the lagoon in a sky linen shirt and white drawstring linen trousers",
    pieces: ["riviera-linen-shirt-clementine", "veranda-linen-trouser-white"],
    position: "50% 40%",
  },
  {
    slug: "after-the-surf",
    audience: "men",
    title: "After the surf",
    image: "/community/p4.jpg?v=2",
    alt: "A surfer holding his board in the sky Riviera Linen Shirt worn open over lagoon Tidal Swim Shorts",
    pieces: ["riviera-linen-shirt-sky", "tidal-swim-short-lagoon"],
  },
  {
    slug: "the-plantation-house",
    audience: "men",
    title: "The plantation house",
    image: "/images/men/cat-knitwear.jpg",
    alt: "A man leaning on green shutters on the veranda of a plantation house in a cream cable-knit cricket jumper with navy and red tipping over a white shirt, stone chinos and brown loafers",
    pieces: ["harbour-quarter-zip-navy", "quayside-chino-stone"],
    position: "50% 45%",
  },
  {
    slug: "mahebourg",
    audience: "men",
    title: "Mahébourg",
    image: "/images/shop/grid-shorts-tees.jpg",
    alt: "A man peeling a mango on a harbour wall at Mahébourg in a white linen shirt and oat linen shorts",
    pieces: ["mens-cabana-stripe-tee-navy", "mens-jetty-linen-short-oat"],
    position: "55% 50%",
  },
  {
    slug: "the-harbour-at-dusk",
    audience: "men",
    title: "The harbour at dusk",
    image: "/images/men/edit-hoodie.jpg",
    alt: "A man sitting on the edge of a stone quay at dusk, fishing boats behind, in a navy hoodie with the name in script and oat linen trousers",
    pieces: ["cabana-hoodie-navy", "veranda-linen-trouser-oat"],
  },
  {
    slug: "after-the-kite",
    audience: "men",
    title: "After the kite",
    image: "/community/p5.jpg?v=2",
    alt: "A kitesurfer on a windy beach in the oat Riviera Linen Shirt worn open over pine and ecru Shore Swim Shorts",
    pieces: ["riviera-linen-shirt-oat", "shore-swim-short-pine-ecru"],
  },
  {
    slug: "the-pirogue",
    audience: "men",
    title: "The pirogue",
    image: "/images/shop/badger.jpg",
    alt: "A man coiling a rope on a wooden fishing boat in an oat linen shirt and oat linen trousers",
    pieces: ["sett-cap-navy", "corniche-linen-shirt-oat"],
  },

  {
    slug: "the-fairway",
    audience: "women",
    title: "The fairway",
    image: "/community/w3.jpg",
    alt: "A golfer on a seaside fairway in the navy Promenade Knit Polo tucked into white Quayside Chino Shorts",
    pieces: ["promenade-knit-polo-navy", "quayside-chino-short-white"],
  },
  {
    slug: "black-river-gorges",
    audience: "women",
    title: "Black River Gorges",
    image: "/community/w4.jpg",
    alt: "A trail runner on a ridge above the Black River Gorges in the red Cabana Stripe Tee and stone Quayside Chino Shorts",
    pieces: ["cabana-stripe-tee-red", "quayside-chino-short-stone"],
  },
  {
    slug: "pamplemousses",
    audience: "women",
    title: "Pamplemousses",
    image: "/images/women/landing/story-badger.jpg",
    alt: "A woman walking by the giant water lily pond at Pamplemousses in a cream cable-knit cricket jumper with navy and red tipping and oat linen trousers",
    pieces: ["sett-cap-navy", "riviera-hoodie-navy", "burrow-sock-white"],
  },
  {
    slug: "grand-baie",
    audience: "women",
    title: "Grand Baie",
    image: "/community/w5.jpg",
    alt: "A sailor on a pontoon at Grand Baie in the navy and ecru Mooring Stripe Crew and white Esplanade Linen Shorts",
    pieces: ["womens-mooring-stripe-crew-navy-ecru", "esplanade-linen-short-white"],
  },
  {
    slug: "tamarin",
    audience: "women",
    title: "Tamarin",
    image: "/community/w1.jpg",
    alt: "A surfer at Tamarin in the sky Riviera Linen Shirt worn open over the navy Tidal Swimsuit",
    pieces: ["womens-riviera-linen-shirt-sky", "tidal-swimsuit-navy"],
  },
  {
    slug: "gris-gris",
    audience: "women",
    title: "Gris Gris",
    image: "/images/women/landing/cat-sunglasses.jpg",
    alt: "A woman on the basalt rocks at Gris Gris in tortoiseshell sunglasses, a cream knit and white shorts",
    pieces: ["alize-sunglasses-olive", "riviera-hoodie-oat"],
    position: "50% 35%",
  },
  {
    slug: "trou-d-eau-douce",
    audience: "women",
    title: "Trou d’Eau Douce",
    image: "/images/women/landing/new.jpg",
    alt: "A woman with a coffee at a café table on the sand at Trou d’Eau Douce in a cream cable-knit cricket jumper and stone trousers",
    pieces: ["marram-cap-ecru-sky", "riviera-hoodie-sky"],
  },
];

export function outfitsFor(audience: AudienceSlug): Outfit[] {
  return outfits.filter((o) => o.audience === audience);
}

export function outfitPieces(o: Outfit): Product[] {
  return o.pieces.map((slug) => productBySlug.get(slug)!);
}
