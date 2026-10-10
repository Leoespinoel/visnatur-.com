export const site = {
  name: "Vis Naturæ",
  nameAscii: "Vis Naturae",
  tagline: "Numbered editions. Made once you order it.",
  description:
    "Vis Naturæ is a made-to-order menswear and resort label. Each design is released once, in a numbered edition of twelve, made for the people who ordered it, then retired. Outerwear is one of one. 10% of every sale goes to conservation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  currency: "EUR",
  locale: "en-IE",
  /** Share of every sale price that goes to conservation. */
  pledgeRate: 0.1,
  /** Manually updated running total (in cents). Leave at 0 until the first orders come in. */
  pledgeRaisedCents: 0,
  freeShippingThresholdCents: 15000,
  /** Express from Mauritius costs us around €35 a parcel; €15 is the most a buyer will carry. */
  flatShippingCents: 1500,
  /** Making time for an edition, counted from the day its order window closes. */
  leadTime: { minWeeks: 3, maxWeeks: 4 },
  /** One-of-one pieces already exist: working days from payment to dispatch. */
  oneOfOneDispatchDays: 3,
  /** Default edition sizes by tier. Individual products can override with `edition.size`. */
  editionSize: { core: 12, accessories: 24 },
  email: "hello@visnaturae.com",
  instagram: "https://instagram.com/visnaturae",
  foundedYear: 2026,
  /** Play the red-wipe intro on every full page load. */
  intro: true,
  /** Minutes a checkout session holds a piece before it is released. */
  reservationMinutes: 30,
  /**
   * Pieces sold outside the site (in person, by email). Add the slug here and
   * redeploy and it disappears from the shop like an online sale would.
   */
  soldOffline: [] as string[],
} as const;

/**
 * Release calendar. A drop is an order window: editions in it can be claimed
 * between `opens` and `closes` (inclusive, UTC dates), then the batch is made.
 * One-of-one pieces in a drop go live on `opens` and stay until sold.
 * Dates are placeholders until the Mauritius maker confirms a schedule.
 */
export const drops = [
  { number: 1, name: "Drop I", opens: "2026-10-08", closes: "2026-10-29" },
  { number: 2, name: "Drop II", opens: "2026-12-01", closes: "2026-12-22" },
] as const;

export type DropNumber = (typeof drops)[number]["number"];

export const announcements = [
  "Numbered editions of twelve",
  "Made once you order it",
  "10% of every sale goes to conservation",
  "Free shipping across Europe over €150",
  "Drop I closes 29 October",
];

export const categories = [
  {
    slug: "swim",
    name: "Swim",
    short: "Swim",
    description: "Swim shorts in solid colours and colour-block, cut for long days by the water.",
    image: "/products/tidal-swim-short-navy.jpg",
    /** Lifestyle image for category tiles on the shop landing. */
    scene: "/images/beach-surfer.jpg",
  },
  {
    slug: "polos-knitwear",
    name: "Knitwear",
    short: "Knitwear",
    description: "Cardigans, crew necks, vests, quarter zips and rugby shirts, knitted and sewn for the drive home.",
    image: "/products/harbour-quarter-zip-forest.jpg",
    scene: "/images/golf-green.jpg",
  },
  {
    slug: "shirts-trousers",
    name: "Linen Shirts",
    short: "Shirts",
    description: "Linen shirts that are allowed to crease, in six colours.",
    image: "/products/riviera-linen-shirt-sky.jpg",
    scene: "/images/summit.jpg",
  },
  {
    slug: "outerwear-accessories",
    name: "Caps",
    short: "Caps",
    description: "Six-panel caps with the name embroidered in script.",
    image: "/products/marram-cap-ecru-pine.jpg",
    scene: "/images/caps-scene.jpg",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const partners = [
  {
    name: "Ocean partner",
    focus: "Reef restoration and marine protection in the Indian Ocean around Mauritius",
    status: "Partnership in progress",
  },
  {
    name: "Forest partner",
    focus: "Native forest restoration and endemic species recovery in Mauritius",
    status: "Partnership in progress",
  },
  {
    name: "Rivers & wetlands partner",
    focus: "Freshwater habitat and migratory species, Europe and beyond",
    status: "Partnership in progress",
  },
];

export const nav = {
  primary: [
    { label: "Shop", href: "/shop", mega: true },
    { label: "Made to order", href: "/made-to-order" },
    { label: "Conservation", href: "/conservation" },
    { label: "About", href: "/about" },
  ],
  shop: [
    { label: "All pieces", href: "/shop/all" },
    { label: "New in", href: "/shop/all?filter=new" },
    { label: "Archive", href: "/archive" },
    ...categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}` })),
  ],
  footer: {
    shop: [
      { label: "All pieces", href: "/shop/all" },
      ...categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}` })),
      { label: "Archive", href: "/archive" },
    ],
    brand: [
      { label: "About", href: "/about" },
      { label: "Made to order", href: "/made-to-order" },
      { label: "Conservation", href: "/conservation" },
      { label: "Contact", href: "/contact" },
      /** Static page in public/pitch.html, served at /pitch; `plain` renders an <a> instead of a Link. */
      { label: "Partners & press", href: "/pitch", plain: true },
    ],
    help: [
      { label: "Shipping & lead times", href: "/made-to-order#shipping" },
      { label: "Sizing", href: "/made-to-order#sizing" },
      { label: "Returns", href: "/legal/returns" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
};

/** EU + EEA + CH + UK: where we ship. Set the same countries in Shopify under Settings → Shipping and delivery. */
export const shippingCountries = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "NO", "IS", "LI", "CH", "GB",
] as const;
