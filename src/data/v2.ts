import { isAvailable } from "./availability";
import { getProduct, groupByFamily, isFor, products, type Garment, type Product } from "./products";
import { site, type AudienceSlug } from "./site";
import { dispatchLabel, formatPrice } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";

/**
 * V2: the raw, graphic streetwear version of the site at /v2 (Leo, 2026-10-15: "cooler … a street wear brand for
 * the same clothing … geared to younger people", 20–40). Same products, slugs, bag and checkout as the classic
 * site; only the presentation differs. The shop is split by garment (Hoodies, Tees, Caps…) instead of the classic
 * categories, street staples first. Nothing here writes to the shared data.
 */

export const v2Href = {
  home: "/v2",
  shop: "/v2/shop",
  lookbook: "/v2/lookbook",
  product: (slug: string) => `/v2/product/${slug}`,
  section: (slug: string) => `/v2/shop/${slug}`,
};

export type Section = {
  slug: string;
  label: string;
  /** Singular, for the tile line: "No. 112 · Hoodie". */
  one: string;
  garments: Garment[];
  /** One blunt line under the section's headline. */
  line: string;
  /** Shown behind the row on hover in the section index. */
  image: string;
};

/** Street staples first; the order also ranks pieces on /v2/shop. Empty sections are left out. */
const allSections: Section[] = [
  { slug: "hoodies", label: "Hoodies", one: "Hoodie", garments: ["hoodie"], line: "Linen-cotton loopback. Badger or stripe.", image: "/products/riviera-hoodie-black-model.jpg?v=5" },
  { slug: "tees", label: "Tees", one: "Tee", garments: ["tee"], line: "Plain, stripe or badger.", image: "/products/badger-tee-navy-model.jpg?v=5" },
  { slug: "caps", label: "Caps", one: "Cap", garments: ["cap"], line: "Six panels. Script, stripe or badger.", image: "/products/sett-cap-black-model.jpg?v=5" },
  { slug: "rugby", label: "Rugby", one: "Rugby", garments: ["rugby"], line: "Built for the pitch. Worn everywhere else.", image: "/products/touchline-rugby-shirt-red-navy-model.jpg?v=5" },
  { slug: "knits", label: "Knits", one: "Knit", garments: ["knit"], line: "Quarter zips, gilets, jackets, crews.", image: "/products/ridge-knit-gilet-black-model.jpg?v=5" },
  { slug: "trousers", label: "Trousers", one: "Trouser", garments: ["trouser"], line: "Chinos and linen. Your inseam, made to order.", image: "/products/quayside-chino-black-model.jpg?v=5" },
  { slug: "shorts", label: "Shorts", one: "Short", garments: ["short"], line: "Chino and linen.", image: "/products/mens-quayside-chino-short-stone-model.jpg?v=5" },
  { slug: "polos", label: "Polos", one: "Polo", garments: ["polo"], line: "Piqué, terry, knit, tipped.", image: "/products/sett-polo-navy-model.jpg?v=5" },
  { slug: "socks", label: "Socks", one: "Sock", garments: ["sock"], line: "Thick rib, badger stitched tone on tone.", image: "/products/burrow-sock-black-model.jpg?v=5" },
  { slug: "eyewear", label: "Eyewear", one: "Shades", garments: ["sunglasses"], line: "Slim oval. Four colours.", image: "/products/alize-sunglasses-black-model.jpg?v=5" },
  { slug: "shirts", label: "Shirts", one: "Shirt", garments: ["shirt", "overshirt", "jacket"], line: "Washed linen, nine colours.", image: "/products/corniche-linen-shirt-black-model.jpg?v=5" },
  { slug: "swim", label: "Swim", one: "Swim", garments: ["swim-short", "swimsuit", "rashguard"], line: "For the sea, the lake, the canal.", image: "/products/lido-stripe-swim-short-black-model.jpg?v=5" },
];

export const sections = allSections.filter((s) => products.some((p) => s.garments.includes(p.garment)));

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export function sectionOf(p: Product): Section | undefined {
  return sections.find((s) => s.garments.includes(p.garment));
}

export function productsIn(section: Section): Product[] {
  return products.filter((p) => section.garments.includes(p.garment));
}

/** Whether anything in this list can be ordered now (the rest is "coming soon"). */
export const anyAvailable = (list: Product[]) => list.some(isAvailable);

/** V2 order: what can be ordered now first, then by section (street staples first), catalogue order within. */
export function streetOrder(list: Product[]): Product[] {
  const rank = (p: Product) => (isAvailable(p) ? -1 : sections.findIndex((s) => s.garments.includes(p.garment)));
  return [...list].sort((a, b) => rank(a) - rank(b));
}

/** One group per design (all its colourways), in street order, for one audience or everyone. */
export function streetFamilies(list: Product[], audience?: AudienceSlug): Product[][] {
  return groupByFamily(streetOrder(audience ? list.filter((p) => isFor(p, audience)) : list));
}

/** The pieces behind a list of slugs, skipping any that no longer exist. */
export const piecesOf = (slugs: string[]) => slugs.map(getProduct).filter((p): p is Product => !!p);

/** The scrolling ticker over the header. Plain facts only: no drop is announced yet, so no drop lines and no scarcity. */
export const tickerLines = [
  "Signature, always on",
  `${pledgePercentLabel()} of profits to the wild`,
  "Cut & sewn in Mauritius",
  `Ships in ${dispatchLabel()}`,
  `Free shipping in Europe over ${formatPrice(site.freeShippingThresholdCents)}`,
  "Free repairs for life",
];

/** The piece that can be ordered today leads the homepage. */
export const onNowFamily = "marram-cap";

/** "Fresh" rail on the homepage: one colourway per design, street staples. */
export const freshSlugs = [
  "riviera-hoodie-black",
  "touchline-rugby-shirt-red-navy",
  "badger-tee-navy",
  "sett-cap-black",
  "cabana-hoodie-red",
  "quayside-chino-black",
  "ridge-knit-gilet-black",
  "breakwater-rugby-shirt-black-ecru",
  "sandbar-tee-black",
  "burrow-sock-olive",
];

export type Look = {
  slug: string;
  image: string;
  alt: string;
  /** Mono caption: where, when. */
  caption: string;
  /** What the person in the picture is wearing (the shot's `wear` list in scripts/stills-shots.mjs). */
  pieces: string[];
  /** CSS object-position for crops. */
  position?: string;
};

/**
 * The lookbook: the street stills (images/street/, shots `street-*` in scripts/stills-shots.mjs) first, then the
 * existing pictures that already read street (harbour walls, quays, the skate bowl) until more street stills replace them.
 */
export const looks: Look[] = [
  {
    slug: "laundromat",
    image: "/images/street/laundromat.jpg",
    alt: "A woman in a pink hoodie and stone chino shorts sitting on a washing machine in a laundromat at night",
    caption: "Marseille · 23:40",
    pieces: ["riviera-hoodie-pink", "quayside-chino-short-stone", "burrow-sock-white"],
  },
  {
    slug: "caps",
    image: "/images/street/caps.jpg",
    alt: "Four ecru caps with black, red, green and navy visors on the bonnet of a car at night",
    caption: "Parked · 01:15",
    pieces: ["marram-cap-ecru-black", "marram-cap-ecru-red", "marram-cap-ecru-pine", "marram-cap-ecru-navy"],
  },
  {
    slug: "harbour-wall",
    image: "/images/women/landing/campaign-hoodies.jpg?v=r1016",
    alt: "A woman in a coral red hoodie and white linen trousers on a harbour wall at dusk, a mug in her hands",
    caption: "Mahébourg · 18:40",
    pieces: ["riviera-hoodie-red"],
    position: "50% 40%",
  },
  {
    slug: "skate-bowl",
    image: "/community/p7.jpg",
    alt: "A skater in a red and navy rugby shirt in a concrete bowl",
    caption: "The bowl · 07:15",
    pieces: ["touchline-rugby-shirt-red-navy"],
  },
  {
    slug: "the-quay",
    image: "/images/shop/trousers.jpg?v=r1016",
    alt: "A man carrying bread along a stone quay by old warehouses in a navy long-sleeved knit polo and cream pleated trousers",
    caption: "Port Louis · 10:05",
    pieces: ["harbour-quarter-zip-navy", "quayside-chino-stone"],
  },
  {
    slug: "fishing-quay",
    image: "/images/men/edit-hoodie.jpg?v=r1016",
    alt: "A man in a navy hoodie and oat linen trousers on the edge of a fishing quay at dusk",
    caption: "Fishing quay · 18:10",
    pieces: ["cabana-hoodie-navy", "veranda-linen-trouser-oat"],
  },
  {
    slug: "the-pitch",
    image: "/community/p1.jpg",
    alt: "A rugby player in a red and ecru rugby shirt on the pitch",
    caption: "Training · 06:30",
    pieces: ["breakwater-rugby-shirt-red-ecru"],
  },
  {
    slug: "the-rocks",
    image: "/images/women/landing/cat-sunglasses.jpg?v=r1016",
    alt: "A woman in tortoiseshell sunglasses, a cream knit and white shorts on black basalt rocks by the surf",
    caption: "Gris Gris · 16:20",
    pieces: ["riviera-hoodie-oat", "alize-sunglasses-olive"],
    position: "50% 30%",
  },
  {
    slug: "trail",
    image: "/community/w4.jpg",
    alt: "A trail runner in a red stripe tee and stone chino shorts",
    caption: "Trail · 05:50",
    pieces: ["cabana-stripe-tee-red", "quayside-chino-short-stone"],
  },
  {
    slug: "waterfront",
    image: "/images/women/landing/cat-caps.jpg?v=r1016",
    alt: "A woman walking along a palm-lined waterfront in a cream cap, a white tee and white linen trousers, a canvas tote on her shoulder",
    caption: "Waterfront · 12:00",
    pieces: ["cabana-cap-clementine"],
    position: "50% 25%",
  },
];

/** The homepage hero picture (replaced by the street hero still once approved). */
export const hero = {
  image: "/images/street/hero.jpg",
  alt: "A man in a black hoodie, black chinos and an ecru and black cap against a shuttered shop front at night",
  position: "62% 40%",
};

/** The action film from the classic site (the grind, before the calm), looped silent on the homepage. */
export const actionFilm = { src: "/film/hero-landscape.mp4", poster: "/film/poster-landscape.jpg" };
