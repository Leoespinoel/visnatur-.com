import type { Story } from "@/components/StoryCopy";

export const site = {
  name: "Vis Naturæ",
  nameAscii: "Vis Naturae",
  /** Draft (2026-10-20): Signature is always on, collections (first called drops) come once. */
  tagline: "Signature, always. Collections, once.",
  description:
    "Vis Naturæ is a clothing label for men and women, made by hand in Mauritius: the Signature line, always in stock, collections in limited numbers, and any Signature piece made to order with adjustments. 1/5 of profits goes to creating and sustaining the environments we love wearing the pieces in.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  currency: "EUR",
  locale: "en-IE",
  /**
   * Share of each year's profit after tax that goes to conservation (Leo, 2026-10-21: "10% of profits", then "20% of profits, call it the fifth" the same day, replacing the
   * 10%-of-sale-price pledge withdrawn earlier that day). Published with the accounts each year.
   */
  pledgeRate: 0.2,
  freeShippingThresholdCents: 15000,
  /** Express from Mauritius costs us around €35 a parcel; €15 is the most a buyer will carry. */
  flatShippingCents: 1500,
  /**
   * Signature and collection pieces are held in stock in Mauritius: dispatched within `dispatchDays`, then express to Europe in
   * `transitDays` (working days). Made to order (a Signature piece adjusted to fit) is made after the order, in `madeToOrder`,
   * for a flat surcharge per piece (Leo, 2026-10-20; the amount is a draft).
   */
  delivery: {
    dispatchDays: { min: 1, max: 2 },
    transitDays: { min: 4, max: 7 },
    madeToOrder: { minWeeks: 3, maxWeeks: 4 },
    madeToOrderSurchargeCents: 2500,
  },
  email: "hello@visnaturae.com",
  instagram: "https://instagram.com/visnaturae.world",
  foundedYear: 2026,
  /** Play the red-wipe intro on every full page load. */
  intro: true,
  /**
   * The Spotify playlist band on the homepage, above the newsletter. url: Spotify → Share → Copy link to playlist.
   * Empty: the band is hidden.
   */
  playlist: {
    title: "Vis Naturæ",
    url: "https://open.spotify.com/playlist/2KTVrBS5RpvW0tPy6zW5OZ" as string,
    /** Songs with their own small player under the playlist. url: Spotify → a song → Share → Copy song link. */
    tracks: [
      { title: "Give It To Me 2025, Adriatique, Notre Dame, Timbaland and Nelly Furtado", url: "https://open.spotify.com/track/2SXIxc92q42M6lMCfQ8hKL" },
      { title: "I See U, HotLap", url: "https://open.spotify.com/track/2MPt7xLRfjNeN3qqNuGnfS" },
      { title: "Groove, Eze Ramirez", url: "https://open.spotify.com/track/08czhby0shpWgYzjz7KW6a" },
      { title: "Keep Moving, Knorst", url: "https://open.spotify.com/track/3etpVoJvsNwq0YaVaNf34v" },
      { title: "You & Me, Max Styler", url: "https://open.spotify.com/track/6atTrGB6eK8NOT6nniI237" },
      { title: "Taking Everything, Humans Musik and ANDRÉ (IT)", url: "https://open.spotify.com/track/4n51GN3MyMlRwJbOiEsNMr" },
    ],
  },
} as const;

export const announcements = [
  "Signature, always in stock",
  "Made to order: any Signature piece, adjusted to fit",
  "1/5 of profits goes to creating and sustaining the environments we love wearing the pieces in",
  "Free shipping across Europe over €150",
  "Free repairs for life",
];

export const categories = [
  {
    slug: "swim",
    name: "Swim",
    short: "Swim",
    description: "Swim shorts in solid colours and colour-block, cut for long days by the water.",
    image: "/products/tidal-swim-short-navy.jpg?v=2",
    /** Lifestyle image for category tiles on the shop landing. */
    scene: "/images/men/sections/swim.jpg?v=r1016",
  },
  {
    slug: "polo-shirts",
    name: "Polo Shirts",
    short: "Polo Shirts",
    description: "Short-sleeved polos in cotton piqué, linen jersey, fine-gauge knit and terry towelling, cut for the heat.",
    image: "/products/promenade-knit-polo-navy.jpg?v=3",
    scene: "/images/women/landing/sections/polo.jpg?v=r1016",
  },
  {
    slug: "rugby-shirts",
    name: "Rugby Shirts",
    short: "Rugby Shirts",
    description: "Hooped and striped rugby shirts in heavy cotton jersey, with a woven twill collar and rubber buttons.",
    image: "/products/breakwater-rugby-shirt-navy-ecru.jpg?v=3",
    scene: "/images/men/sections/rugby.jpg?v=r1016",
  },
  {
    // The slug is from when polos and rugby shirts sat in here; kept so the links still work.
    slug: "polos-knitwear",
    name: "Knitwear",
    short: "Knitwear",
    description: "Cardigans, crew necks, vests, quarter zips and hoodies, knitted and sewn for the drive home.",
    image: "/products/harbour-quarter-zip-forest.jpg?v=2",
    scene: "/images/men/group-club.jpg?v=r1016",
  },
  {
    slug: "shirts-trousers",
    name: "Shirts",
    short: "Shirts",
    description: "Linen shirts that are allowed to crease.",
    image: "/products/riviera-linen-shirt-sky.jpg?v=3",
    scene: "/images/men/sections/shirts.jpg?v=r1016",
  },
  {
    slug: "tees",
    name: "Tees",
    short: "Tees",
    description: "Plain and striped tees in dense cotton jersey, with the mark embroidered small on the chest.",
    image: "/products/mens-sandbar-tee-white.jpg?v=3",
    scene: "/images/men/sections/tees.jpg?v=r1016",
  },
  {
    slug: "shorts",
    name: "Shorts",
    short: "Shorts",
    description: "Chino and linen shorts cut above the knee.",
    image: "/products/mens-quayside-chino-short-stone.jpg?v=3",
    scene: "/images/men/sections/shorts.jpg?v=r1016",
  },
  {
    slug: "trousers",
    name: "Trousers",
    short: "Trousers",
    description: "Chinos and linen trousers, cut clean and sized by the waist.",
    image: "/products/quayside-chino-stone.jpg?v=3",
    scene: "/images/men/sections/trousers.jpg?v=r1016",
  },
  {
    slug: "outerwear-accessories",
    name: "Accessories",
    short: "Accessories",
    description: "Six-panel caps with the name embroidered in script, and ribbed cotton socks with the badger at the ankle.",
    image: "/products/marram-cap-ecru-pine.jpg?v=2",
    scene: "/images/men/sections/accessories.jpg?v=r1016",
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    short: "Sunglasses",
    description: "Hand-polished acetate with a metal core through the arms and polarised lenses, cut for anyone.",
    image: "/products/alize-sunglasses-tortoise.jpg?v=3",
    scene: "/images/men/sections/sunglasses.jpg?v=r1016",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

/**
 * The story tile set into each category's listing grid, as ralphlauren.com sets stories into its
 * product grids. `women` marks the ones whose picture also suits the women's listing.
 */
export const categoryFeatures: Record<CategorySlug, Story & { women?: boolean }> = {
  swim: {
    eyebrow: "Tidal · Lido · Shore",
    title: "Out past the break",
    image: "/images/men/swim-hero.jpg?v=r1016",
    alt: "Two men on a rock platform above the sea, one in sunglasses and an open cream linen shirt over navy and cream swim shorts, the other sitting on the rocks in sky striped swim shorts",
    links: [{ label: "Made to order", href: "/made-to-order" }],
  },
  "polo-shirts": {
    eyebrow: "Sett · Promenade",
    title: "Lunch on the veranda",
    image: "/images/shop/polos.jpg?v=r1016",
    alt: "A man and a woman on the veranda of a beach house by a table laid for lunch, he in a navy knit polo and stone chinos, she in a cream polo and white shorts",
    links: [{ label: "Made to order", href: "/made-to-order" }],
    women: true,
  },
  "rugby-shirts": {
    eyebrow: "Breakwater & Touchline",
    title: "A game on the sand at dusk",
    image: "/images/shop/rugby.jpg?v=r1016",
    alt: "Two young men walking off the beach after a game of touch rugby, in navy and cream and red and navy hooped rugby shirts, one with the ball",
    links: [{ label: "Shop the edit", href: "/shop/edit/rugby" }],
  },
  "polos-knitwear": {
    eyebrow: "The Clubhouse",
    title: "Knits for the last nine",
    image: "/images/shop/feature-knitwear.jpg?v=r1016",
    alt: "Two men in a wood-panelled club library, one in a leather armchair in a cream cable-knit cricket jumper with navy and red tipping, the other in a cream quarter-zip knit, both in stone chinos",
    links: [{ label: "Shop the edit", href: "/shop/edit/clubhouse" }],
  },
  "shirts-trousers": {
    eyebrow: "The Cabana Stripe",
    title: "One stripe, three ways",
    image: "/images/campaign-linen.jpg?v=r1016",
    alt: "Two men at a long lunch on the sand by the lagoon, one in a white linen shirt, the other pouring wine in a sky linen shirt",
    links: [{ label: "Shop the edit", href: "/shop/edit/cabana" }],
  },
  tees: {
    eyebrow: "Shorts",
    title: "For the walk up from the beach",
    image: "/images/shop/shorts-tees.jpg?v=r1016",
    alt: "A man walking barefoot along the lagoon with his sandals in hand, in a white tee and stone chino shorts",
    links: [{ label: "Shop shorts", href: "/shop/shorts" }],
  },
  shorts: {
    eyebrow: "Tees",
    title: "A mango on the harbour wall",
    image: "/images/shop/grid-shorts-tees.jpg?v=r1016",
    alt: "A man peeling a mango on a basalt harbour wall in a white linen shirt and oat linen shorts, fishing boats behind",
    links: [{ label: "Shop tees", href: "/shop/tees" }],
  },
  trousers: {
    eyebrow: "Shirts",
    title: "To go with them",
    image: "/images/shop/grid-trousers.jpg?v=r1016",
    alt: "A man on a waterside restaurant terrace at dusk in a sand linen shirt and cream pleated trousers",
    links: [{ label: "Shop shirts", href: "/shop/shirts-trousers" }],
  },
  "outerwear-accessories": {
    eyebrow: "Tone on tone",
    title: "The Badger",
    image: "/images/shop/grid-accessories.jpg?v=r1016",
    alt: "A woman in a grey cap, white ribbed socks and brown loafers on the steps of a veranda under pink bougainvillea",
    links: [{ label: "Shop the edit", href: "/shop/edit/badger" }],
    women: true,
  },
  sunglasses: {
    eyebrow: "Alizé",
    title: "Named for the trade wind",
    image: "/images/shop/grid-sunglasses.jpg?v=r1016",
    alt: "A woman on the deck of a catamaran in tortoiseshell sunglasses and an open sand linen shirt over a black swimsuit",
    links: [{ label: "Made to order", href: "/made-to-order" }],
    women: true,
  },
};

export type AudienceSlug = "men" | "women";

/**
 * Top-level shop sections, as on ralphlauren.com: Men and Women each open a mega menu with the same
 * categories down the side and a row of category tiles under "Explore for him / her" (the panels are
 * built in menu.ts). Which pieces show in each is decided by `isFor()` in products.ts.
 */
export const audiences: {
  slug: AudienceSlug;
  name: string;
  explore: string;
  lede: string;
  /** Lifestyle image per category, for the "Explore for him / her" tiles. */
  scenes: Record<CategorySlug, string>;
  /** Lookbook image per design family, for its tile in this section's menu (else the on-model shot, never a man under Women). */
  looks?: Record<string, string>;
}[] = [
  {
    slug: "men",
    name: "Men",
    explore: "Explore for him",
    lede: "Swim, polo shirts, rugby shirts, knitwear, shirts, tees, shorts, trousers, accessories and sunglasses. Made by hand in Mauritius; any Signature piece can be made to order.",
    // The category scene is the women's Promenade, so his polo tile shows his own.
    scenes: { ...(Object.fromEntries(categories.map((c) => [c.slug, c.scene])) as Record<CategorySlug, string>), "polo-shirts": "/images/men/sections/polo.jpg?v=r1016" },
  },
  {
    slug: "women",
    name: "Women",
    explore: "Explore for her",
    lede: "Swimsuits, shirts, polo shirts, tees, shorts, trousers and knitwear cut for women, with the caps, socks and sunglasses cut for anyone. Made by hand in Mauritius; any Signature piece can be made to order.",
    scenes: {
      swim: "/images/women/landing/sections/swim.jpg?v=r1016",
      "polo-shirts": "/images/women/landing/sections/polo.jpg?v=r1016",
      // No rugby shirt for her yet; never a man under Women, so the knitwear picture stands in.
      "rugby-shirts": "/images/women/landing/group-hall.jpg?v=r1016",
      "polos-knitwear": "/images/women/landing/group-hall.jpg?v=r1016",
      "shirts-trousers": "/images/women/landing/sections/shirts.jpg?v=r1016",
      tees: "/images/women/landing/sections/tees.jpg?v=r1016",
      shorts: "/images/women/landing/sections/shorts.jpg?v=r1016",
      trousers: "/images/women/landing/sections/trousers.jpg?v=r1016",
      "outerwear-accessories": "/images/women/accessories.jpg?v=r1016",
      sunglasses: "/images/women/landing/group-pool.jpg?v=r1016",
    },
    looks: {
      "cabana-hoodie": "/images/women/knitwear.jpg?v=r1016",
      "riviera-hoodie": "/images/women/riviera-hoodie.jpg?v=r1016",
      "marram-cap": "/images/women/accessories.jpg?v=r1016",
      "burrow-sock": "/images/women/burrow-sock.jpg?v=r1016",
      "alize-sunglasses": "/images/women/sunglasses.jpg?v=r1016",
    },
  },
];

/**
 * `logo` is the partner's own logo in public/partners/ (SVG or transparent PNG); `mark` names the placeholder emblem
 * drawn until it is set. Listed under "In conversation" on /stories as interviews to come.
 */
export const partners: {
  name: string;
  focus: string;
  status: string;
  mark: "ocean" | "forest" | "coast";
  logo?: string;
  /** Why a euro goes far here: one sourced figure, shown on the partner's card. */
  leverage: { figure: string; text: string; source: { label: string; url: string } };
}[] = [
  {
    name: "On the reef",
    focus: "Coral put back on the reef around Mauritius, and the water over it kept clear",
    status: "Being set up",
    mark: "ocean",
    leverage: {
      figure: "<1%",
      text: "of the ocean floor is coral reef, yet reefs support an estimated quarter of all known marine species. Protect a little reef and you protect a lot of sea.",
      source: { label: "NOAA", url: "https://floridakeys.noaa.gov/corals/biodiversity.html" },
    },
  },
  {
    name: "Mauritian Wildlife Foundation",
    focus: "Trees put back in the island's last native forest, and the birds that only live there",
    status: "Being set up",
    mark: "forest",
    logo: "/partners/mauritian-wildlife-foundation.png",
    leverage: {
      figure: "2%",
      text: "of Mauritius is still native forest. Small sums here have already pulled the kestrel, the pink pigeon and the echo parakeet back from extinction.",
      source: { label: "Convention on Biological Diversity", url: "https://www.cbd.int/countries/profile?country=mu" },
    },
  },
  {
    name: "On the shore",
    focus: "Mangroves put back along the shore, holding the sand where it is",
    status: "Being set up",
    mark: "coast",
    leverage: {
      figure: "Up to 4×",
      text: "more carbon per hectare is held in mangrove forests than in most other tropical forests. Replant a little shoreline and you lock away a lot of carbon.",
      source: { label: "USDA Forest Service", url: "https://www.sciencedaily.com/releases/2011/04/110404173247.htm" },
    },
  },
];


export const nav = {
  /**
   * The header's two menus (Leo, 2026-10-16: no burger, "separated into the VN world and shop"). Each primary item
   * belongs to one: under Shop it opens its own mega panel (built in menu.ts), under The VN World its picture.
   */
  groups: [
    { key: "shop", label: "Shop", short: "Shop" },
    { key: "world", label: "The VN World", short: "World" },
  ] as const,
  primary: [
    /** Men and Women sit inside Signature (Leo, 2026-10-20); their panels stay in menus() for the mobile menu. */
    { label: "Collections", href: "/collections", mega: "collections", group: "shop" },
    { label: "Signature", href: "/shop/signature", mega: "signature", group: "shop" },
    { label: "Made to order", href: "/made-to-order", mega: "made-to-order", group: "shop" },
    { label: "In the wild", href: "/stories", mega: "stories", group: "world" },
    { label: "Members only", href: "/members", mega: "members", group: "world" },
  ] as const,
  /** Plain links beside the two menus (Leo, 2026-10-16: Origins out of The VN World, next to Shop and The VN World). */
  links: [{ label: "Origins", href: "/about" }] as const,
  footer: {
    /** The three lines in header order, then the two audiences and everything; the categories live in the Shop menu. */
    shop: [
      { label: "Collections", href: "/collections" },
      { label: "Signature", href: "/shop/signature" },
      { label: "Made to order", href: "/made-to-order" },
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "All pieces", href: "/shop/all" },
    ],
    /** The VN World column. */
    brand: [
      { label: "In the wild", href: "/stories" },
      { label: "Members only", href: "/members" },
      { label: "Origins", href: "/about" },
      { label: "Stores", href: "/stores" },
      /** Static page in public/pitch.html, served at /pitch; `plain` renders an <a> instead of a Link. */
      { label: "Partners & press", href: "/pitch", plain: true },
    ],
    /** Terms and Privacy sit in the bottom bar only. */
    help: [
      { label: "Shipping & delivery", href: "/made-to-order#shipping" },
      { label: "Sizing", href: "/made-to-order#sizing" },
      { label: "Returns", href: "/legal/returns" },
      { label: "Contact", href: "/contact" },
    ],
  },
};

/** EU + EEA + CH + UK: where we ship. Set the same countries in Shopify under Settings → Shipping and delivery. */
export const shippingCountries = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "NO", "IS", "LI", "CH", "GB",
] as const;
