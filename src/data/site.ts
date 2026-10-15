import type { Story } from "@/components/StoryCopy";

export const site = {
  name: "Vis Naturæ",
  nameAscii: "Vis Naturae",
  tagline: "Made once you order it.",
  description:
    "Vis Naturæ is a made-to-order clothing label for men and women. Every piece is cut and sewn by hand in Mauritius, in the size you choose. 10% of every sale goes to conservation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  currency: "EUR",
  locale: "en-IE",
  /** Share of every sale price that goes to conservation. */
  pledgeRate: 0.1,
  /** Manually updated running total (in cents). Leave at 0 until the first orders come in. */
  pledgeRaisedCents: 0,
  /**
   * Where the Support button beside the total on /conservation goes: a payment link
   * (Stripe, Shopify) or a partner's donation page. Empty: it opens an email to us.
   */
  donateUrl: "" as string,
  freeShippingThresholdCents: 15000,
  /** Express from Mauritius costs us around €35 a parcel; €15 is the most a buyer will carry. */
  flatShippingCents: 1500,
  /** Making time, counted from the day the piece is ordered. */
  leadTime: { minWeeks: 3, maxWeeks: 4 },
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
    url: "https://open.spotify.com/playlist/30TKfGSqvK2oTtI4a53hrJ" as string,
    /** Songs with their own small player under the playlist. url: Spotify → a song → Share → Copy song link. */
    tracks: [
      { title: "Five Star Hotels., RAYE and Mahalia", url: "https://open.spotify.com/track/0MI4U8nhdfJ1FPRAgYhXxC" },
      { title: "Neverender, Justice and Tame Impala", url: "https://open.spotify.com/track/3aQ9MHkMeL7Yu7jpyF62xn" },
      { title: "Knockout, Emanuel Satie, Maga and Mâhfoud", url: "https://open.spotify.com/track/27Vxc5UngiYQ3LbuOKqfa7" },
      { title: "Where You Really Come From, Tobiahs and VV-Ace", url: "https://open.spotify.com/track/3OYoAxiD88QHs4MzzA8cjn" },
      { title: "Time, Carlita", url: "https://open.spotify.com/track/0IAIsE9u9AYUH3wh7p77AE" },
      { title: "Navajo, Masego", url: "https://open.spotify.com/track/6zWU7YALeEDMcPGhKKZJhV" },
    ],
  },
} as const;

export const announcements = [
  "Made once you order it",
  "Cut and sewn in your size in Mauritius",
  "10% of every sale goes to conservation",
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
    scene: "/images/beach-surfer.jpg?v=2",
  },
  {
    slug: "polo-shirts",
    name: "Polo Shirts",
    short: "Polo Shirts",
    description: "Short-sleeved polos in cotton piqué, linen jersey, fine-gauge knit and terry towelling, cut for the heat.",
    image: "/products/promenade-knit-polo-navy.jpg?v=3",
    scene: "/community/w3.jpg",
  },
  {
    slug: "rugby-shirts",
    name: "Rugby Shirts",
    short: "Rugby Shirts",
    description: "Hooped and striped rugby shirts in heavy cotton jersey, with a woven twill collar and rubber buttons.",
    image: "/products/breakwater-rugby-shirt-navy-ecru.jpg?v=3",
    scene: "/images/shop/rugby.jpg",
  },
  {
    // The slug is from when polos and rugby shirts sat in here; kept so the links still work.
    slug: "polos-knitwear",
    name: "Knitwear",
    short: "Knitwear",
    description: "Cardigans, crew necks, vests, quarter zips and hoodies, knitted and sewn for the drive home.",
    image: "/products/harbour-quarter-zip-forest.jpg?v=2",
    scene: "/images/golf-green.jpg?v=2",
  },
  {
    slug: "shirts-trousers",
    name: "Shirts",
    short: "Shirts",
    description: "Linen shirts that are allowed to crease.",
    image: "/products/riviera-linen-shirt-sky.jpg?v=3",
    scene: "/images/summit.jpg?v=2",
  },
  {
    slug: "tees",
    name: "Tees",
    short: "Tees",
    description: "Plain and striped tees in dense cotton jersey, with the mark embroidered small on the chest.",
    image: "/products/mens-sandbar-tee-white.jpg?v=3",
    scene: "/images/shop/grid-shorts-tees.jpg",
  },
  {
    slug: "shorts",
    name: "Shorts",
    short: "Shorts",
    description: "Chino and linen shorts cut above the knee.",
    image: "/products/mens-quayside-chino-short-stone.jpg?v=3",
    scene: "/images/shop/shorts-tees.jpg",
  },
  {
    slug: "trousers",
    name: "Trousers",
    short: "Trousers",
    description: "Chinos and linen trousers, cut clean and sized by the waist.",
    image: "/products/quayside-chino-stone.jpg?v=3",
    scene: "/images/shop/trousers.jpg",
  },
  {
    slug: "outerwear-accessories",
    name: "Accessories",
    short: "Accessories",
    description: "Six-panel caps with the name embroidered in script, and ribbed cotton socks with the badger at the ankle.",
    image: "/products/marram-cap-ecru-pine.jpg?v=2",
    scene: "/images/caps-scene.jpg",
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    short: "Sunglasses",
    description: "Hand-polished acetate with a metal core through the arms and polarised lenses, cut for anyone.",
    image: "/products/alize-sunglasses-tortoise.jpg?v=3",
    scene: "/images/sunglasses-scene.jpg",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

/**
 * The story tile set into each category's listing grid, as ralphlauren.com sets stories into its
 * product grids. `women` marks the ones whose picture also suits the women's listing.
 */
export const categoryFeatures: Record<CategorySlug, Story & { women?: boolean }> = {
  swim: {
    eyebrow: "Made to order",
    title: "Cut once you order it",
    image: "/images/campaign-swim.jpg",
    alt: "A man in navy swim shorts walking out of the lagoon at dawn",
    links: [{ label: "How it works", href: "/made-to-order" }],
  },
  "polo-shirts": {
    eyebrow: "Sett · Promenade",
    title: "Lunch on the veranda",
    image: "/images/shop/polos.jpg",
    alt: "Two friends laughing on the veranda of a beach house at Blue Bay, he in the navy Sett Polo and stone chinos, she in the sky Promenade Knit Polo and white chino shorts",
    links: [{ label: "How it works", href: "/made-to-order" }],
    women: true,
  },
  "rugby-shirts": {
    eyebrow: "Breakwater & Touchline",
    title: "A game on the sand at dusk",
    image: "/images/shop/rugby.jpg",
    alt: "Friends playing touch rugby on the beach at dusk in the Breakwater and Touchline rugby shirts",
    links: [{ label: "Shop the edit", href: "/shop/edit/rugby" }],
  },
  "polos-knitwear": {
    eyebrow: "The Clubhouse",
    title: "Knits for the last nine",
    image: "/images/campaign-golf.jpg",
    alt: "Two golfers in Vis Naturæ knitwear on a seaside fairway at golden hour",
    links: [{ label: "Shop the edit", href: "/shop/edit/clubhouse" }],
  },
  "shirts-trousers": {
    eyebrow: "The Cabana Stripe",
    title: "One stripe, three ways",
    image: "/images/campaign-linen.jpg?v=9",
    alt: "Two men in linen shirts at the end of a long lunch by the lagoon",
    links: [{ label: "Shop the edit", href: "/shop/edit/cabana" }],
  },
  tees: {
    eyebrow: "Shorts",
    title: "For the walk up from the beach",
    image: "/images/shop/shorts-tees.jpg",
    alt: "A man walking along the lagoon at Trou aux Biches in the white Sandbar Tee and stone Quayside Chino Short",
    links: [{ label: "Shop shorts", href: "/shop/shorts" }],
  },
  shorts: {
    eyebrow: "Tees",
    title: "A mango on the harbour wall",
    image: "/images/shop/grid-shorts-tees.jpg",
    alt: "A man in the Cabana Stripe Tee and oat Jetty Linen Short on a harbour wall in Mauritius",
    links: [{ label: "Shop tees", href: "/shop/tees" }],
  },
  trousers: {
    eyebrow: "Shirts",
    title: "To go with them",
    image: "/images/shop/grid-trousers.jpg",
    alt: "A man in navy tailored linen trousers and the oat linen shirt on a terrace at Grand Baie",
    links: [{ label: "Shop shirts", href: "/shop/shirts-trousers" }],
  },
  "outerwear-accessories": {
    eyebrow: "Tone on tone",
    title: "The Badger",
    image: "/images/shop/grid-accessories.jpg",
    alt: "A woman in the ecru and navy cap and white ribbed socks on the steps of a veranda",
    links: [{ label: "Shop the edit", href: "/shop/edit/badger" }],
    women: true,
  },
  sunglasses: {
    eyebrow: "Alizé",
    title: "Named for the trade wind",
    image: "/images/shop/grid-sunglasses.jpg",
    alt: "A woman in the tortoiseshell Alizé sunglasses on the deck of a catamaran",
    links: [{ label: "How it works", href: "/made-to-order" }],
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
    lede: "Swim, polo shirts, rugby shirts, knitwear, shirts, tees, shorts, trousers, accessories and sunglasses. Every piece is made to order in Mauritius, in your size.",
    // The category scene is the women's Promenade, so his polo tile shows his own.
    scenes: { ...(Object.fromEntries(categories.map((c) => [c.slug, c.scene])) as Record<CategorySlug, string>), "polo-shirts": "/images/men/cat-polo.jpg" },
  },
  {
    slug: "women",
    name: "Women",
    explore: "Explore for her",
    lede: "Swimsuits, shirts, polo shirts, tees, shorts, trousers and knitwear cut for women, with the caps, socks and sunglasses cut for anyone. Every piece is made to order in Mauritius, in your size.",
    scenes: {
      swim: "/images/women/swim.jpg",
      "polo-shirts": "/community/w3.jpg",
      // No rugby shirt for her yet; never a man under Women, so the knitwear picture stands in.
      "rugby-shirts": "/images/women/landing/cat-knitwear.jpg",
      "polos-knitwear": "/images/women/landing/cat-knitwear.jpg",
      "shirts-trousers": "/images/women/linen.jpg",
      tees: "/community/w4.jpg",
      shorts: "/images/women/landing/cat-caps.jpg",
      trousers: "/images/women/trousers.jpg",
      "outerwear-accessories": "/images/women/accessories.jpg",
      sunglasses: "/images/women/sunglasses.jpg",
    },
    looks: {
      "cabana-hoodie": "/images/women/knitwear.jpg",
      "riviera-hoodie": "/images/women/riviera-hoodie.jpg",
      "marram-cap": "/images/women/accessories.jpg",
      "burrow-sock": "/images/women/burrow-sock.jpg",
      "alize-sunglasses": "/images/women/sunglasses.jpg",
    },
  },
];

/**
 * `logo` is the partner's own logo in public/partners/ (SVG or transparent PNG), shown in the partner band on /conservation.
 * Until it is set, the band draws a placeholder emblem from `mark`.
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
    name: "Ocean partner",
    focus: "Reef restoration and marine protection in the Indian Ocean around Mauritius",
    status: "Partnership in progress",
    mark: "ocean",
    leverage: {
      figure: "<1%",
      text: "of the ocean floor is coral reef, yet reefs support an estimated quarter of all known marine species. Protect a little reef and you protect a lot of sea.",
      source: { label: "NOAA", url: "https://floridakeys.noaa.gov/corals/biodiversity.html" },
    },
  },
  {
    name: "Forest partner",
    focus: "Native forest restoration and endemic species recovery in Mauritius",
    status: "Partnership in progress",
    mark: "forest",
    leverage: {
      figure: "2%",
      text: "of Mauritius is still native forest. Small sums here have already pulled the kestrel, the pink pigeon and the echo parakeet back from extinction.",
      source: { label: "Convention on Biological Diversity", url: "https://www.cbd.int/countries/profile?country=mu" },
    },
  },
  {
    name: "Coastlines partner",
    focus: "Mangrove restoration and coastal habitat around Mauritius",
    status: "Partnership in progress",
    mark: "coast",
    leverage: {
      figure: "Up to 4×",
      text: "more carbon per hectare is held in mangrove forests than in most other tropical forests. Replant a little shoreline and you lock away a lot of carbon.",
      source: { label: "USDA Forest Service", url: "https://www.sciencedaily.com/releases/2011/04/110404173247.htm" },
    },
  },
];

/**
 * The impact charts on /conservation: four counters, money to the work by month, invested by partner, and partner targets.
 * Every figure is the real count (all zero until the first sale); set `placeholder` to true to label them as placeholders.
 * "Sent to the work" is the sum of `months`; the coral and tree counters read the first two targets.
 * "Invested to date" in the middle of the pie is the sum of `invested`.
 */
export const impact = {
  placeholder: false,
  piecesMade: 0,
  /** Euros sent to the work, oldest month first. */
  months: [
    { month: "Oct", cents: 0 },
    { month: "Nov", cents: 0 },
    { month: "Dec", cents: 0 },
    { month: "Jan", cents: 0 },
    { month: "Feb", cents: 0 },
    { month: "Mar", cents: 0 },
    { month: "Apr", cents: 0 },
    { month: "May", cents: 0 },
    { month: "Jun", cents: 0 },
    { month: "Jul", cents: 0 },
    { month: "Aug", cents: 0 },
    { month: "Sep", cents: 0 },
  ],
  /** Euros transferred to each partner since the first transfer, in the order of `partners`; drawn as the pie. */
  invested: [
    { partner: "Ocean partner", cents: 0 },
    { partner: "Forest partner", cents: 0 },
    { partner: "Coastlines partner", cents: 0 },
  ],
  /** Progress towards each partner's year-end goal. */
  targets: [
    { label: "Coral fragments planted", partner: "Ocean partner", value: 0, goal: 500, unit: "" },
    { label: "Native trees planted", partner: "Forest partner", value: 0, goal: 1000, unit: "" },
    { label: "Mangroves planted", partner: "Coastlines partner", value: 0, goal: 2000, unit: "" },
  ],
};

export const nav = {
  /** Each opens its mega menu (built in menu.ts); Men and Women are the shop, the rest the brand pages. */
  primary: [
    { label: "Men", href: "/men", mega: "men" },
    { label: "Women", href: "/women", mega: "women" },
    { label: "Made to order", href: "/made-to-order", mega: "made-to-order" },
    { label: "Conservation", href: "/conservation", mega: "conservation" },
    { label: "Community", href: "/stories", mega: "stories" },
    { label: "Origins", href: "/about", mega: "about" },
  ] as const,
  footer: {
    shop: [
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "All pieces", href: "/shop/all" },
      ...categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}` })),
    ],
    brand: [
      { label: "Origins", href: "/about" },
      { label: "Made to order", href: "/made-to-order" },
      { label: "Conservation", href: "/conservation" },
      { label: "Community", href: "/stories" },
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
