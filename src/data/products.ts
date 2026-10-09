import { site, type CategorySlug, type DropNumber } from "./site";

export type Garment =
  | "swim-short"
  | "rashguard"
  | "polo"
  | "tee"
  | "rugby"
  | "knit"
  | "shirt"
  | "short"
  | "trouser"
  | "jacket"
  | "overshirt"
  | "cap"
  | "towel"
  | "tote";

export type Colour = { name: string; hex: string };

/**
 * How many of a design exist.
 * - `edition`: released once in a numbered run (default 12, accessories 24). Orders are
 *   taken during the drop's window, then the whole run is made as one batch.
 * - `one-of-one`: a single garment, already made in one size, photographed and sold as is.
 */
export type Edition = { kind: "edition"; size?: number } | { kind: "one-of-one" };

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  garment: Garment;
  /** Design number shown as "No. 001". Each design is released once. */
  number: number;
  /** Which release this design belongs to; see `drops` in site.ts. */
  drop: DropNumber;
  edition: Edition;
  /** Price in euro cents. */
  price: number;
  /** The single colourway this piece exists in. */
  colour: Colour;
  /**
   * Sizes it can be made in; the buyer picks one and their unit is cut to it.
   * A one-of-one piece lists the single size it was made in.
   */
  sizes: string[];
  fabric: string;
  description: string;
  details: string[];
  care: string;
  badge?: "New" | "Collection I" | "Signature";
  /** Hero / featured ordering; lower comes first. */
  featured?: number;
};

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WAIST_SIZES = ["28", "30", "32", "34", "36", "38"];
const ONE_SIZE = ["One size"];

const EDITION: Edition = { kind: "edition" };
const ACCESSORY_EDITION: Edition = { kind: "edition", size: site.editionSize.accessories };
const ONE_OF_ONE: Edition = { kind: "one-of-one" };

export const products: Product[] = [
  {
    slug: "tidal-swim-short",
    number: 1,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Reef Navy", hex: "#1f3a4d" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description:
      "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist and a drawcord that disappears into the band. Lined in recycled mesh so it dries on the walk back from the water.",
    details: [
      "Mid-length, 15 cm inseam",
      "Elasticated waist with internal drawcord",
      "Two side pockets and a back pocket with drain eyelet",
      "Recycled mesh lining",
      "Woven Vis Naturæ label at the hem",
    ],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    badge: "Signature",
    featured: 1,
  },
  {
    slug: "atoll-print-swim-short",
    number: 2,
    drop: 1,
    edition: EDITION,
    name: "Atoll Print Swim Short",
    category: "swim",
    garment: "swim-short",
    price: 18500,
    colour: { name: "Fern Print", hex: "#3d6b4f" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, printed with water-based inks",
    description:
      "The Tidal cut in a hand-drawn botanical print. Every pair is printed, cut and sewn only after you order it, so the pattern placement is unique to your pair.",
    details: [
      "Mid-length, 15 cm inseam",
      "Hand-drawn print, placed individually on each pair",
      "Elasticated waist with internal drawcord",
      "Recycled mesh lining",
    ],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    badge: "New",
    featured: 2,
  },
  {
    slug: "lagoon-long-swim-short",
    number: 3,
    drop: 2,
    edition: EDITION,
    name: "Lagoon Long Swim Short",
    category: "swim",
    garment: "swim-short",
    price: 17500,
    colour: { name: "Ink", hex: "#15201b" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide with a touch of stretch",
    description:
      "A longer, straighter swim short that moves easily from the beach to lunch. Slightly heavier fabric with four-way stretch.",
    details: [
      "Longer length, 19 cm inseam",
      "Four-way stretch",
      "Elasticated waist with external drawcord",
      "Side seam pockets",
    ],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    featured: 6,
  },
  {
    slug: "current-rashguard",
    number: 4,
    drop: 2,
    edition: EDITION,
    name: "Current Rashguard",
    category: "swim",
    garment: "rashguard",
    price: 12000,
    colour: { name: "Ink", hex: "#15201b" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide and elastane, UPF 50+",
    description:
      "A long-sleeve rashguard for long sessions in the sun. Flatlock seams, a slightly relaxed fit, and UPF 50+ protection.",
    details: ["UPF 50+", "Flatlock seams", "Relaxed fit", "Thumb loops"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "meridian-pique-polo",
    number: 5,
    drop: 1,
    edition: EDITION,
    name: "Meridian Piqué Polo",
    category: "polos-knitwear",
    garment: "polo",
    price: 12500,
    colour: { name: "Pine", hex: "#23402f" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton piqué, 220 gsm",
    description:
      "A heavyweight piqué polo with a two-button placket and a collar that holds its shape. Cut a touch longer in the body so it sits well untucked.",
    details: [
      "220 gsm organic cotton piqué",
      "Two-button placket, mother-of-pearl buttons",
      "Ribbed collar and cuffs",
      "Split hem with a slightly longer back",
    ],
    care: "Machine wash cold, reshape and dry flat.",
    badge: "Signature",
    featured: 3,
  },
  {
    slug: "canopy-tee",
    number: 6,
    drop: 1,
    edition: EDITION,
    name: "Canopy Tee",
    category: "polos-knitwear",
    garment: "tee",
    price: 8500,
    colour: { name: "Bone", hex: "#f4f1ea" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton jersey, 240 gsm",
    description:
      "The tee we wear most. Heavyweight organic cotton, a slightly boxy cut and a ribbed neck that won't stretch out.",
    details: ["240 gsm organic cotton", "Boxy fit", "Ribbed neckline", "Garment dyed"],
    care: "Machine wash cold, line dry.",
    featured: 8,
  },
  {
    slug: "harbour-rugby-shirt",
    number: 7,
    drop: 2,
    edition: EDITION,
    name: "Harbour Rugby Shirt",
    category: "polos-knitwear",
    garment: "rugby",
    price: 16000,
    colour: { name: "Navy / Bone", hex: "#1f3a4d" },
    sizes: APPAREL_SIZES,
    fabric: "Heavyweight organic cotton jersey, 320 gsm",
    description:
      "A proper rugby shirt: heavy jersey, a reinforced twill collar and a rubber-button placket. Blocked stripes, not printed.",
    details: [
      "320 gsm organic cotton",
      "Twill collar and rubber buttons",
      "Blocked stripe panels",
      "Relaxed fit",
    ],
    care: "Machine wash cold, line dry.",
    badge: "New",
    featured: 5,
  },
  {
    slug: "dune-knit-polo",
    number: 8,
    drop: 2,
    edition: EDITION,
    name: "Dune Knit Polo",
    category: "polos-knitwear",
    garment: "polo",
    price: 19000,
    colour: { name: "Oat", hex: "#d8cbb3" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, fully fashioned knit",
    description:
      "A fine-gauge knitted polo in linen and cotton. Open collar, short sleeves, and a hem that sits clean over trousers or swim shorts.",
    details: ["Linen / cotton blend", "Fully fashioned", "Open collar, two buttons", "Regular fit"],
    care: "Hand wash cold, dry flat.",
    featured: 7,
  },
  {
    slug: "estuary-cable-knit",
    number: 9,
    drop: 2,
    edition: ONE_OF_ONE,
    name: "Estuary Cable Knit",
    category: "polos-knitwear",
    garment: "knit",
    price: 42000,
    colour: { name: "Oat", hex: "#d8cbb3" },
    sizes: ["L"],
    fabric: "Undyed and low-impact dyed merino wool",
    description:
      "A crew-neck cable knit in merino wool, knitted once, in one size, and never again. Made to be worn for decades and repaired when needed.",
    details: ["100% merino wool", "Hand-finished cables", "Ribbed hem and cuffs", "Free repairs for life"],
    care: "Hand wash cold, dry flat. We repair it when it needs it.",
    featured: 9,
  },
  {
    slug: "riviera-camp-shirt",
    number: 10,
    drop: 1,
    edition: EDITION,
    name: "Riviera Camp Shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Bone", hex: "#f4f1ea" },
    sizes: APPAREL_SIZES,
    fabric: "European linen, 180 gsm",
    description:
      "A camp-collar shirt in washed European linen. Loose through the body, short sleeves, and a single chest pocket.",
    details: ["180 gsm European linen", "Camp collar", "Corozo buttons", "Relaxed fit"],
    care: "Machine wash cold, line dry. Creases are part of it.",
    badge: "Collection I",
    featured: 4,
  },
  {
    slug: "terrace-oxford-shirt",
    number: 11,
    drop: 2,
    edition: EDITION,
    name: "Terrace Oxford Shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 15000,
    colour: { name: "Bone", hex: "#f4f1ea" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton oxford cloth",
    description:
      "A long-sleeve oxford with a soft button-down collar. Washed for a broken-in hand from the first wear.",
    details: ["Organic cotton oxford", "Button-down collar", "Rounded hem", "Regular fit"],
    care: "Machine wash cold, line dry.",
  },
  {
    slug: "cove-linen-short",
    number: 12,
    drop: 1,
    edition: EDITION,
    name: "Cove Linen Short",
    category: "shirts-trousers",
    garment: "short",
    price: 13500,
    colour: { name: "Sand", hex: "#d8cbb3" },
    sizes: WAIST_SIZES,
    fabric: "Linen and organic cotton twill",
    description:
      "A single-pleat short with a slightly tapered leg. Drawcord waist, hidden button fly, and a 20 cm inseam.",
    details: ["Linen / cotton twill", "Single pleat", "Drawcord waist with belt loops", "20 cm inseam"],
    care: "Machine wash cold, line dry.",
    featured: 10,
  },
  {
    slug: "delta-pleated-trouser",
    number: 13,
    drop: 2,
    edition: EDITION,
    name: "Delta Pleated Trouser",
    category: "shirts-trousers",
    garment: "trouser",
    price: 21000,
    colour: { name: "Oat", hex: "#d8cbb3" },
    sizes: WAIST_SIZES,
    fabric: "Organic cotton and linen gabardine",
    description:
      "A double-pleat trouser with a high rise and a wide, straight leg. Cut to your inseam at no extra cost.",
    details: ["Cotton / linen gabardine", "Double pleat, high rise", "Side adjusters", "Hemmed to your inseam"],
    care: "Dry clean or hand wash cold.",
    badge: "Collection I",
  },
  {
    slug: "headland-field-jacket",
    number: 14,
    drop: 1,
    edition: ONE_OF_ONE,
    name: "Headland Field Jacket",
    category: "outerwear-accessories",
    garment: "jacket",
    price: 55000,
    colour: { name: "Olive", hex: "#5d6b4e" },
    sizes: ["L"],
    fabric: "Waxed organic cotton, 10 oz",
    description:
      "A four-pocket field jacket in waxed organic cotton. Corozo buttons, a throat latch, and a lining in recycled cotton. Re-wax it every few years and it will outlast you.",
    details: ["10 oz waxed organic cotton", "Four bellows pockets", "Throat latch", "Free re-waxing service"],
    care: "Do not wash. Brush clean and re-wax annually.",
    badge: "Collection I",
    featured: 11,
  },
  {
    slug: "groundswell-overshirt",
    number: 15,
    drop: 2,
    edition: ONE_OF_ONE,
    name: "Groundswell Overshirt",
    category: "outerwear-accessories",
    garment: "overshirt",
    price: 45000,
    colour: { name: "Forest", hex: "#23402f" },
    sizes: ["M"],
    fabric: "Brushed organic cotton twill",
    description:
      "A relaxed overshirt in brushed cotton twill. Two chest pockets, a straight hem, and enough room for a knit underneath.",
    details: ["Brushed organic cotton twill", "Two chest pockets", "Corozo buttons", "Relaxed fit"],
    care: "Machine wash cold, line dry.",
    badge: "New",
    featured: 12,
  },
  {
    slug: "marram-cap",
    number: 16,
    drop: 1,
    edition: ACCESSORY_EDITION,
    name: "Marram Cap",
    category: "outerwear-accessories",
    garment: "cap",
    price: 7500,
    colour: { name: "Sand", hex: "#d8cbb3" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton twill",
    description: "A six-panel cap with a soft, unstructured crown and a brass slider at the back.",
    details: ["Six panel, unstructured", "Brass slider", "Embroidered wordmark"],
    care: "Spot clean.",
  },
  {
    slug: "tidepool-beach-towel",
    number: 17,
    drop: 2,
    edition: ACCESSORY_EDITION,
    name: "Tidepool Beach Towel",
    category: "outerwear-accessories",
    garment: "towel",
    price: 9500,
    colour: { name: "Ocean Stripe", hex: "#1f3a4d" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton terry, 100 × 180 cm",
    description: "A generous terry towel with a woven stripe. Thick enough to lie on, light enough to carry.",
    details: ["100 × 180 cm", "Organic cotton terry", "Woven, not printed"],
    care: "Machine wash warm, tumble dry low.",
  },
  {
    slug: "drift-tote",
    number: 18,
    drop: 2,
    edition: ACCESSORY_EDITION,
    name: "Drift Tote",
    category: "outerwear-accessories",
    garment: "tote",
    price: 14000,
    colour: { name: "Natural", hex: "#d8cbb3" },
    sizes: ONE_SIZE,
    fabric: "Heavyweight organic cotton canvas, 18 oz",
    description: "A heavyweight canvas tote with an internal pocket and handles long enough for the shoulder.",
    details: ["18 oz organic cotton canvas", "Internal zip pocket", "Shoulder-length handles"],
    care: "Spot clean or hand wash cold.",
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function productsInCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function featuredProducts(limit = 8): Product[] {
  return products
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99))
    .slice(0, limit);
}

export function newProducts(): Product[] {
  return products.filter((p) => p.badge === "New");
}

/** Design number, e.g. "No. 004". */
export function editionLabel(p: Product): string {
  return `No. ${String(p.number).padStart(3, "0")}`;
}

/** How many units of this design will ever exist. */
export function editionTotal(p: Product): number {
  if (p.edition.kind === "one-of-one") return 1;
  return p.edition.size ?? site.editionSize.core;
}

export function isOneOfOne(p: Product): boolean {
  return p.edition.kind === "one-of-one";
}

/** "One of one" or "Edition of 12". */
export function editionKindLabel(p: Product): string {
  return isOneOfOne(p) ? "One of one" : `Edition of ${editionTotal(p)}`;
}

export function productImages(p: Product): string[] {
  return [`/products/${p.slug}.svg`, `/products/${p.slug}-detail.svg`];
}
