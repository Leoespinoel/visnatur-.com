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
  /**
   * Garments that share a pattern and differ only in colour. Each colourway is still its own
   * numbered design (own slug, number and edition); the family only groups them in the shop.
   */
  family: string;
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
    slug: "marram-cap-beige",
    number: 1,
    drop: 1,
    edition: ACCESSORY_EDITION,
    name: "Marram Cap",
    family: "marram-cap",
    category: "outerwear-accessories",
    garment: "cap",
    price: 7500,
    colour: { name: "Beige", hex: "#d9cdb5" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton twill, garment-washed",
    description: "A six-panel cap with a soft, unstructured crown, a curved visor and a brass slider at the back. The name is embroidered in script across the front, tone on tone.",
    details: ["Six panel, unstructured crown", "Curved visor, four rows of stitching", "Brass slider and tuck strap", "Script embroidery, tone on tone", "Woven label inside the band"],
    care: "Spot clean. Reshape the crown by hand and dry away from direct heat.",
  },
  {
    slug: "marram-cap-ecru-pine",
    number: 2,
    drop: 1,
    edition: ACCESSORY_EDITION,
    name: "Marram Cap",
    family: "marram-cap",
    category: "outerwear-accessories",
    garment: "cap",
    price: 7500,
    colour: { name: "Ecru / Pine", hex: "#1f4d3a" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton twill, garment-washed",
    description: "A six-panel cap with a soft, unstructured crown, a curved visor and a brass slider at the back. The name is embroidered in script across the front, tone on tone.",
    details: ["Six panel, unstructured crown", "Curved visor, four rows of stitching", "Brass slider and tuck strap", "Script embroidery, tone on tone", "Woven label inside the band"],
    care: "Spot clean. Reshape the crown by hand and dry away from direct heat.",
    badge: "Signature",
    featured: 2,
  },
  {
    slug: "marram-cap-ecru-red",
    number: 3,
    drop: 1,
    edition: ACCESSORY_EDITION,
    name: "Marram Cap",
    family: "marram-cap",
    category: "outerwear-accessories",
    garment: "cap",
    price: 7500,
    colour: { name: "Ecru / Red", hex: "#c8102e" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton twill, garment-washed",
    description: "A six-panel cap with a soft, unstructured crown, a curved visor and a brass slider at the back. The name is embroidered in script across the front, tone on tone.",
    details: ["Six panel, unstructured crown", "Curved visor, four rows of stitching", "Brass slider and tuck strap", "Script embroidery, tone on tone", "Woven label inside the band"],
    care: "Spot clean. Reshape the crown by hand and dry away from direct heat.",
  },
  {
    slug: "marram-cap-red",
    number: 4,
    drop: 1,
    edition: ACCESSORY_EDITION,
    name: "Marram Cap",
    family: "marram-cap",
    category: "outerwear-accessories",
    garment: "cap",
    price: 7500,
    colour: { name: "Red", hex: "#c8302a" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton twill, garment-washed",
    description: "A six-panel cap with a soft, unstructured crown, a curved visor and a brass slider at the back. The name is embroidered in script across the front, tone on tone.",
    details: ["Six panel, unstructured crown", "Curved visor, four rows of stitching", "Brass slider and tuck strap", "Script embroidery, tone on tone", "Woven label inside the band"],
    care: "Spot clean. Reshape the crown by hand and dry away from direct heat.",
  },
  {
    slug: "marram-cap-mustard-navy",
    number: 5,
    drop: 1,
    edition: ACCESSORY_EDITION,
    name: "Marram Cap",
    family: "marram-cap",
    category: "outerwear-accessories",
    garment: "cap",
    price: 7500,
    colour: { name: "Mustard / Navy", hex: "#1f3a5f" },
    sizes: ONE_SIZE,
    fabric: "Organic cotton twill, garment-washed",
    description: "A six-panel cap with a soft, unstructured crown, a curved visor and a brass slider at the back. The name is embroidered in script across the front, tone on tone.",
    details: ["Six panel, unstructured crown", "Curved visor, four rows of stitching", "Brass slider and tuck strap", "Script embroidery, tone on tone", "Woven label inside the band"],
    care: "Spot clean. Reshape the crown by hand and dry away from direct heat.",
  },
  {
    slug: "tidal-swim-short-navy",
    number: 6,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Navy", hex: "#1c2a56" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    badge: "Signature",
    featured: 1,
  },
  {
    slug: "tidal-swim-short-saffron",
    number: 7,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Saffron", hex: "#e59a2c" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "tidal-swim-short-red",
    number: 8,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Red", hex: "#c4332c" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "tidal-swim-short-hibiscus",
    number: 9,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Hibiscus", hex: "#e05a9a" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "tidal-swim-short-lagoon",
    number: 10,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Lagoon", hex: "#4fc3d4" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "tidal-swim-short-palm",
    number: 11,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Palm", hex: "#2f6b3a" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "tidal-swim-short-papaya",
    number: 12,
    drop: 1,
    edition: EDITION,
    name: "Tidal Swim Short",
    family: "tidal-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 16500,
    colour: { name: "Papaya", hex: "#e8762a" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "Our mid-length swim short. A clean, unfussy cut with a soft elasticated waist, a braided drawcord with metal tips, and a small VN monogram at the hem. Lined in recycled mesh so it dries on the walk back from the water.",
    details: ["Mid-length, 15 cm inseam", "Elasticated waist with braided drawcord", "Two side pockets and a back pocket with drain eyelet", "Recycled mesh lining", "VN monogram embroidered at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
  },
  {
    slug: "shore-swim-short-pine-ecru",
    number: 13,
    drop: 1,
    edition: EDITION,
    name: "Shore Swim Short",
    family: "shore-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 17500,
    colour: { name: "Pine / Ecru", hex: "#2f6b3a" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "The Tidal cut split at the thigh into two colours, with a contrast drawcord and the name in script at the hem. The seam sits where the water usually does.",
    details: ["Mid-length, 15 cm inseam", "Two-tone panel construction, seam at mid-thigh", "Elasticated waist with contrast braided drawcord", "Recycled mesh lining", "Script embroidery at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    badge: "New",
    featured: 6,
  },
  {
    slug: "shore-swim-short-navy-saffron",
    number: 14,
    drop: 1,
    edition: EDITION,
    name: "Shore Swim Short",
    family: "shore-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 17500,
    colour: { name: "Navy / Saffron", hex: "#1c2a56" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "The Tidal cut split at the thigh into two colours, with a contrast drawcord and the name in script at the hem. The seam sits where the water usually does.",
    details: ["Mid-length, 15 cm inseam", "Two-tone panel construction, seam at mid-thigh", "Elasticated waist with contrast braided drawcord", "Recycled mesh lining", "Script embroidery at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    badge: "New",
  },
  {
    slug: "shore-swim-short-red-ecru",
    number: 15,
    drop: 1,
    edition: EDITION,
    name: "Shore Swim Short",
    family: "shore-swim-short",
    category: "swim",
    garment: "swim-short",
    price: 17500,
    colour: { name: "Red / Ecru", hex: "#b3302a" },
    sizes: APPAREL_SIZES,
    fabric: "Recycled polyamide, quick-dry, made from reclaimed fishing nets",
    description: "The Tidal cut split at the thigh into two colours, with a contrast drawcord and the name in script at the hem. The seam sits where the water usually does.",
    details: ["Mid-length, 15 cm inseam", "Two-tone panel construction, seam at mid-thigh", "Elasticated waist with contrast braided drawcord", "Recycled mesh lining", "Script embroidery at the hem", "Unit number sewn inside the waistband"],
    care: "Rinse in fresh water after swimming. Machine wash cold, line dry.",
    badge: "New",
  },
  {
    slug: "riviera-linen-shirt-oat",
    number: 16,
    drop: 1,
    edition: EDITION,
    name: "Riviera Linen Shirt",
    family: "riviera-linen-shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Oat", hex: "#d8cbb3" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, 60/40, yarn-dyed",
    description: "A straight-collar shirt in a linen and cotton weave that is allowed to crease. The badger is embroidered small on the chest, in a thread one shade off the cloth. Cut a touch longer so it tucks or sits out.",
    details: ["Linen and cotton, yarn-dyed", "Straight collar, single-button cuffs", "Corozo buttons", "Badger embroidery at the chest, tone on tone", "Curved hem, side gussets", "Unit number sewn inside the placket"],
    care: "Machine wash cold, line dry. Iron damp if you must.",
    featured: 4,
  },
  {
    slug: "riviera-linen-shirt-sky",
    number: 17,
    drop: 1,
    edition: EDITION,
    name: "Riviera Linen Shirt",
    family: "riviera-linen-shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Sky", hex: "#9fbfe0" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, 60/40, yarn-dyed",
    description: "A straight-collar shirt in a linen and cotton weave that is allowed to crease. The badger is embroidered small on the chest, in a thread one shade off the cloth. Cut a touch longer so it tucks or sits out.",
    details: ["Linen and cotton, yarn-dyed", "Straight collar, single-button cuffs", "Corozo buttons", "Badger embroidery at the chest, tone on tone", "Curved hem, side gussets", "Unit number sewn inside the placket"],
    care: "Machine wash cold, line dry. Iron damp if you must.",
  },
  {
    slug: "riviera-linen-shirt-navy",
    number: 18,
    drop: 1,
    edition: EDITION,
    name: "Riviera Linen Shirt",
    family: "riviera-linen-shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Navy", hex: "#1f2f6b" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, 60/40, yarn-dyed",
    description: "A straight-collar shirt in a linen and cotton weave that is allowed to crease. The badger is embroidered small on the chest, in a thread one shade off the cloth. Cut a touch longer so it tucks or sits out.",
    details: ["Linen and cotton, yarn-dyed", "Straight collar, single-button cuffs", "Corozo buttons", "Badger embroidery at the chest, tone on tone", "Curved hem, side gussets", "Unit number sewn inside the placket"],
    care: "Machine wash cold, line dry. Iron damp if you must.",
  },
  {
    slug: "riviera-linen-shirt-sage",
    number: 19,
    drop: 1,
    edition: EDITION,
    name: "Riviera Linen Shirt",
    family: "riviera-linen-shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Sage", hex: "#7a9a74" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, 60/40, yarn-dyed",
    description: "A straight-collar shirt in a linen and cotton weave that is allowed to crease. The badger is embroidered small on the chest, in a thread one shade off the cloth. Cut a touch longer so it tucks or sits out.",
    details: ["Linen and cotton, yarn-dyed", "Straight collar, single-button cuffs", "Corozo buttons", "Badger embroidery at the chest, tone on tone", "Curved hem, side gussets", "Unit number sewn inside the placket"],
    care: "Machine wash cold, line dry. Iron damp if you must.",
  },
  {
    slug: "riviera-linen-shirt-red",
    number: 20,
    drop: 1,
    edition: EDITION,
    name: "Riviera Linen Shirt",
    family: "riviera-linen-shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Red", hex: "#c8402e" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, 60/40, yarn-dyed",
    description: "A straight-collar shirt in a linen and cotton weave that is allowed to crease. The badger is embroidered small on the chest, in a thread one shade off the cloth. Cut a touch longer so it tucks or sits out.",
    details: ["Linen and cotton, yarn-dyed", "Straight collar, single-button cuffs", "Corozo buttons", "Badger embroidery at the chest, tone on tone", "Curved hem, side gussets", "Unit number sewn inside the placket"],
    care: "Machine wash cold, line dry. Iron damp if you must.",
  },
  {
    slug: "riviera-linen-shirt-clementine",
    number: 21,
    drop: 1,
    edition: EDITION,
    name: "Riviera Linen Shirt",
    family: "riviera-linen-shirt",
    category: "shirts-trousers",
    garment: "shirt",
    price: 16500,
    colour: { name: "Clementine", hex: "#e08a3a" },
    sizes: APPAREL_SIZES,
    fabric: "Linen and organic cotton, 60/40, yarn-dyed",
    description: "A straight-collar shirt in a linen and cotton weave that is allowed to crease. The badger is embroidered small on the chest, in a thread one shade off the cloth. Cut a touch longer so it tucks or sits out.",
    details: ["Linen and cotton, yarn-dyed", "Straight collar, single-button cuffs", "Corozo buttons", "Badger embroidery at the chest, tone on tone", "Curved hem, side gussets", "Unit number sewn inside the placket"],
    care: "Machine wash cold, line dry. Iron damp if you must.",
  },
  {
    slug: "harbour-quarter-zip-navy",
    number: 22,
    drop: 1,
    edition: EDITION,
    name: "Harbour Quarter Zip",
    family: "harbour-quarter-zip",
    category: "polos-knitwear",
    garment: "knit",
    price: 18500,
    colour: { name: "Navy", hex: "#1b2a4a" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton loopback, 420 gsm, brushed inside",
    description: "A heavyweight quarter-zip in brushed loopback cotton. A stand collar, a metal zip with a leather pull, ribbed hem and cuffs, and the badger embroidered small on the chest. The piece for the drive home.",
    details: ["420 gsm organic cotton loopback, brushed inside", "Stand collar, metal quarter zip", "Ribbed hem and cuffs", "Badger embroidery at the chest", "Relaxed fit, dropped shoulder", "Unit number sewn inside the collar"],
    care: "Machine wash cold, inside out. Dry flat.",
    badge: "New",
    featured: 5,
  },
  {
    slug: "harbour-quarter-zip-forest",
    number: 23,
    drop: 1,
    edition: EDITION,
    name: "Harbour Quarter Zip",
    family: "harbour-quarter-zip",
    category: "polos-knitwear",
    garment: "knit",
    price: 18500,
    colour: { name: "Forest", hex: "#1f4d35" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton loopback, 420 gsm, brushed inside",
    description: "A heavyweight quarter-zip in brushed loopback cotton. A stand collar, a metal zip with a leather pull, ribbed hem and cuffs, and the badger embroidered small on the chest. The piece for the drive home.",
    details: ["420 gsm organic cotton loopback, brushed inside", "Stand collar, metal quarter zip", "Ribbed hem and cuffs", "Badger embroidery at the chest", "Relaxed fit, dropped shoulder", "Unit number sewn inside the collar"],
    care: "Machine wash cold, inside out. Dry flat.",
    badge: "New",
  },
  {
    slug: "harbour-quarter-zip-red",
    number: 24,
    drop: 1,
    edition: EDITION,
    name: "Harbour Quarter Zip",
    family: "harbour-quarter-zip",
    category: "polos-knitwear",
    garment: "knit",
    price: 18500,
    colour: { name: "Red", hex: "#c23a2e" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton loopback, 420 gsm, brushed inside",
    description: "A heavyweight quarter-zip in brushed loopback cotton. A stand collar, a metal zip with a leather pull, ribbed hem and cuffs, and the badger embroidered small on the chest. The piece for the drive home.",
    details: ["420 gsm organic cotton loopback, brushed inside", "Stand collar, metal quarter zip", "Ribbed hem and cuffs", "Badger embroidery at the chest", "Relaxed fit, dropped shoulder", "Unit number sewn inside the collar"],
    care: "Machine wash cold, inside out. Dry flat.",
    badge: "New",
  },
  {
    slug: "harbour-quarter-zip-mustard",
    number: 25,
    drop: 1,
    edition: EDITION,
    name: "Harbour Quarter Zip",
    family: "harbour-quarter-zip",
    category: "polos-knitwear",
    garment: "knit",
    price: 18500,
    colour: { name: "Mustard", hex: "#e2b43a" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton loopback, 420 gsm, brushed inside",
    description: "A heavyweight quarter-zip in brushed loopback cotton. A stand collar, a metal zip with a leather pull, ribbed hem and cuffs, and the badger embroidered small on the chest. The piece for the drive home.",
    details: ["420 gsm organic cotton loopback, brushed inside", "Stand collar, metal quarter zip", "Ribbed hem and cuffs", "Badger embroidery at the chest", "Relaxed fit, dropped shoulder", "Unit number sewn inside the collar"],
    care: "Machine wash cold, inside out. Dry flat.",
    badge: "New",
  },
  {
    slug: "harbour-quarter-zip-sky",
    number: 26,
    drop: 1,
    edition: EDITION,
    name: "Harbour Quarter Zip",
    family: "harbour-quarter-zip",
    category: "polos-knitwear",
    garment: "knit",
    price: 18500,
    colour: { name: "Sky", hex: "#a9c6e6" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton loopback, 420 gsm, brushed inside",
    description: "A heavyweight quarter-zip in brushed loopback cotton. A stand collar, a metal zip with a leather pull, ribbed hem and cuffs, and the badger embroidered small on the chest. The piece for the drive home.",
    details: ["420 gsm organic cotton loopback, brushed inside", "Stand collar, metal quarter zip", "Ribbed hem and cuffs", "Badger embroidery at the chest", "Relaxed fit, dropped shoulder", "Unit number sewn inside the collar"],
    care: "Machine wash cold, inside out. Dry flat.",
    badge: "New",
  },
  {
    slug: "harbour-quarter-zip-orange",
    number: 27,
    drop: 1,
    edition: EDITION,
    name: "Harbour Quarter Zip",
    family: "harbour-quarter-zip",
    category: "polos-knitwear",
    garment: "knit",
    price: 18500,
    colour: { name: "Orange", hex: "#e38a2e" },
    sizes: APPAREL_SIZES,
    fabric: "Organic cotton loopback, 420 gsm, brushed inside",
    description: "A heavyweight quarter-zip in brushed loopback cotton. A stand collar, a metal zip with a leather pull, ribbed hem and cuffs, and the badger embroidered small on the chest. The piece for the drive home.",
    details: ["420 gsm organic cotton loopback, brushed inside", "Stand collar, metal quarter zip", "Ribbed hem and cuffs", "Badger embroidery at the chest", "Relaxed fit, dropped shoulder", "Unit number sewn inside the collar"],
    care: "Machine wash cold, inside out. Dry flat.",
    badge: "New",
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
  return [`/products/${p.slug}.jpg`, `/products/${p.slug}-detail.jpg`];
}

/** Every colourway of the same pattern, in catalogue order, including `p` itself. */
export function siblingsOf(p: Product): Product[] {
  return products.filter((q) => q.family === p.family);
}

/**
 * Groups a list into families, keeping the order of first appearance. Each group holds the
 * colourways present in `list`, so a filtered or sorted list groups consistently.
 */
export function groupByFamily(list: Product[]): Product[][] {
  const groups = new Map<string, Product[]>();
  for (const p of list) {
    const g = groups.get(p.family);
    if (g) g.push(p);
    else groups.set(p.family, [p]);
  }
  return [...groups.values()];
}
