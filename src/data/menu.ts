import { audiences, categories, site, type AudienceSlug, type CategorySlug } from "./site";
import { groupByFamily, isFor, productImages, products, type Garment, type Product } from "./products";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { articleHref, articles, instagramHandle } from "./stories";
import { outfitsFor } from "./outfits";

/** `packshot` tiles show the garment on white with the label in ink; the rest are photos with the label over them. */
export type MenuTile = { label: string; href: string; image: string; packshot?: boolean };

/**
 * One line down the side of a mega menu and what the right of the panel shows while it is hovered: a
 * heading and a row of tiles, or one tile and a note (as on ralphlauren.com, where each side link swaps
 * the panel). With `grid` the tiles wrap into rows of four instead of a carousel. The item keyed "all"
 * is what a panel opens on.
 */
export type MenuItem = { key: string; label: string; href: string; heading: string; tiles: MenuTile[]; note?: string; grid?: boolean };

/** The header items that open a mega menu, in nav order. */
export type MenuKey = AudienceSlug | "made-to-order" | "conservation" | "stories" | "about";

/**
 * One tile per design: the section's lookbook image for it if there is one, else its first colourway's
 * on-model shot (under Women only for the women's line, since the other models are men), else the packshot.
 */
function familyTiles(list: Product[], audience: AudienceSlug, looks: Record<string, string> = {}): MenuTile[] {
  return groupByFamily(list).map((g) => {
    const p = g.find((x) => productImages(x).length === 3) ?? g[0];
    const base = { label: p.name, href: `/product/${p.slug}` };
    if (looks[p.family]) return { ...base, image: looks[p.family] };
    const images = productImages(p);
    // Men's model shots are men; under Women only the women's line has its own model shots.
    const model = audience === "men" || p.audience === "women" ? images.find((i) => i.includes("-model.")) : undefined;
    return model ? { ...base, image: model } : { ...base, image: images[0], packshot: true };
  });
}

/** The kinds of garment that open the "All pieces" panel, one tile each: tops first, then bottoms. */
const KINDS: { label: string; garment: Garment }[] = [
  { label: "Polo Shirts", garment: "polo" },
  { label: "Knitwear", garment: "knit" },
  { label: "Hoodies", garment: "hoodie" },
  { label: "Shirts", garment: "shirt" },
  { label: "Tees", garment: "tee" },
  { label: "Rugby Shirts", garment: "rugby" },
  { label: "Trousers", garment: "trouser" },
  { label: "Shorts", garment: "short" },
  { label: "Swim Shorts", garment: "swim-short" },
];

/** A kind's picture is its category's scene, except the hoodies, which share Knitwear's category. */
const KIND_IMAGES: Record<AudienceSlug, Partial<Record<Garment, string>>> = {
  men: { hoodie: "/images/men/edit-hoodie.jpg" },
  women: { hoodie: "/images/women/riviera-hoodie.jpg" },
};

/**
 * A kind of garment's listing: its category, narrowed to its designs (?design=) when the category holds
 * other kinds too, as Knitwear does with the hoodies. Each kind sits in one category.
 */
function kindHref(kind: Product[], cut: Product[], audience: AudienceSlug): string {
  const cat = kind[0].category;
  const families = [...new Set(kind.map((p) => p.family))];
  const whole = cut.every((p) => p.category !== cat || families.includes(p.family));
  return `/${audience}/${cat}${whole ? "" : `?design=${families.join(",")}`}`;
}

export function menuFor(audience: AudienceSlug): MenuItem[] {
  const a = audiences.find((x) => x.slug === audience)!;
  const them = audience === "men" ? "him" : "her";
  const cut = products.filter((p) => isFor(p, audience));
  // Under Women the women's line comes before the pieces cut for anyone.
  const mine = audience === "women" ? [...cut.filter((p) => p.audience === "women"), ...cut.filter((p) => p.audience !== "women")] : cut;
  // /men and /women are landing pages; their listings are one level down.
  const listing = `/${audience}/all`;
  const kinds = KINDS.map((k) => ({ ...k, pieces: cut.filter((p) => p.garment === k.garment) })).filter((k) => k.pieces.length);
  const category = (slug: CategorySlug): MenuItem => {
    const c = categories.find((x) => x.slug === slug)!;
    const tiles = familyTiles(mine.filter((p) => p.category === c.slug), audience, a.looks);
    const base = { key: c.slug, label: c.name, href: `/${audience}/${c.slug}`, heading: `${c.name} for ${them}` };
    return tiles.length
      ? { ...base, tiles }
      : { ...base, tiles: [{ label: c.name, href: base.href, image: a.scenes[c.slug] }], note: audience === "women" ? "More pieces for her are on the way." : "New designs are coming." };
  };
  return [
    { key: "new", label: "New in", href: `${listing}?filter=new`, heading: `New in for ${them}`, tiles: familyTiles(mine.filter((p) => p.badge === "New"), audience, a.looks) },
    {
      key: "all",
      label: "All pieces",
      href: listing,
      heading: a.explore,
      grid: true,
      // Tops, then bottoms, then the categories no kind has covered (Swim for her, Accessories, Sunglasses).
      // Kinds and categories with nothing cut for this audience are left out (no women's rugby shirt yet).
      tiles: [
        ...kinds.map((k) => ({ label: k.label, href: kindHref(k.pieces, cut, audience), image: KIND_IMAGES[audience][k.garment] ?? a.scenes[k.pieces[0].category] })),
        ...categories
          .filter((c) => mine.some((p) => p.category === c.slug) && !kinds.some((k) => k.pieces[0].category === c.slug))
          .map((c) => ({ label: c.name, href: `/${audience}/${c.slug}`, image: a.scenes[c.slug] })),
      ],
    },
    category("swim"),
    category("outerwear-accessories"),
    category("sunglasses"),
    {
      key: "outfits",
      label: "Outfits",
      href: `/${audience}/outfits`,
      heading: `Outfits for ${them}`,
      tiles: outfitsFor(audience).map((o) => ({ label: o.title, href: `/${audience}/outfits#${o.slug}`, image: o.image })),
    },
  ];
}

const IMG = {
  cutting: "/images/cutting-table.jpg?v=2",
  label: "/images/numbered-label.jpg?v=2",
  atelier: "/images/campaign-atelier.jpg",
  sizing: "/products/riviera-linen-shirt-navy-model.jpg?v=3",
  cliff: "/images/sea-cliff-wide.jpg?v=2",
  summit: "/images/summit.jpg?v=2",
  swim: "/images/campaign-swim.jpg",
  about: "/images/about.jpg",
};
const badger: MenuTile = { label: "The badger", href: "/about#the-mark", image: "/brand/logo-badger.png", packshot: true };
const contact = {
  key: "contact",
  label: "Contact",
  href: "/contact",
  heading: "Write to us",
  tiles: [{ label: "Contact", href: "/contact", image: IMG.about }],
  note: "Sizing questions, order updates, repairs, or just to say hello. We answer within two working days.",
};

function madeToOrder(): MenuItem[] {
  const tile = (label: string, hash: string, image: string): MenuTile => ({ label, href: `/made-to-order#${hash}`, image });
  return [
    {
      key: "all",
      label: "How it works",
      href: "/made-to-order#how-it-works",
      heading: "Made once you order it.",
      tiles: [tile("How it works", "how-it-works", IMG.cutting), tile("Shipping", "shipping", IMG.atelier), tile("Sizing", "sizing", IMG.sizing), tile("Questions", "questions", IMG.label)],
    },
    {
      key: "shipping",
      label: "Shipping & lead times",
      href: "/made-to-order#shipping",
      heading: "Shipping & lead times",
      tiles: [tile("Shipping", "shipping", IMG.atelier)],
      note: `Cut and sewn in Mauritius after you order, ready ${leadTimeLabel()} later, then express to Europe in 4–7 working days. Free over ${formatPrice(site.freeShippingThresholdCents)}.`,
    },
    {
      key: "sizing",
      label: "Sizing",
      href: "/made-to-order#sizing",
      heading: "Sizing",
      tiles: [tile("Sizing", "sizing", IMG.sizing)],
      note: "Measure a shirt you like and match it to the chart. Every piece is cut to the size you choose.",
    },
    {
      key: "questions",
      label: "Questions",
      href: "/made-to-order#questions",
      heading: "Asked often",
      tiles: [tile("Questions", "questions", IMG.label)],
      note: "What happens after you order, when your piece is cut, cancelling, returns and repairs.",
    },
    contact,
  ];
}

function conservation(): MenuItem[] {
  const tile = (label: string, hash: string, image: string): MenuTile => ({ label, href: `/conservation${hash}`, image });
  return [
    {
      key: "all",
      label: "The pledge",
      href: "/conservation",
      heading: `${pledgePercentLabel()} of every sale goes to conservation`,
      tiles: [tile("The pledge", "", IMG.cliff), tile("How it is counted", "#how-it-works", IMG.summit), tile("Where it goes", "#partners", IMG.swim)],
    },
    {
      key: "how-it-works",
      label: "How it is counted",
      href: "/conservation#how-it-works",
      heading: "Simple on purpose",
      tiles: [tile("How it is counted", "#how-it-works", IMG.summit)],
      note: "Of the price, not the profit. Worked out on every order before shipping and tax, shown on every product page, reported every season.",
    },
    {
      key: "partners",
      label: "Where it goes",
      href: "/conservation#partners",
      heading: "Highest leverage, not highest profile",
      tiles: [tile("Where it goes", "#partners", IMG.swim)],
      note: "Where each euro changes the most: the reef around Mauritius, its last native forest, and its mangrove coast. Partnerships in progress.",
    },
  ];
}

function stories(): MenuItem[] {
  const tile = (label: string, hash: string, image: string): MenuTile => ({ label, href: `/stories#${hash}`, image });
  const toTile = (a: (typeof articles)[number]): MenuTile => ({ label: a.title.replace(/\.$/, ""), href: articleHref(a), image: a.image });
  const interviews = tile("In conversation", "interviews", IMG.atelier);
  const community = tile("Community", "community", "/community/p4.jpg?v=2");
  const letters = tile("Newsletter", "letters", "/images/campaign-linen.jpg");
  return [
    {
      key: "all",
      label: "All stories",
      href: "/stories",
      heading: "Told, not sold",
      tiles: [tile("Latest", "latest", articles[0].image), tile("Events", "events", "/images/campaign-drop.jpg?v=3"), community, interviews],
    },
    { key: "latest", label: "Latest", href: "/stories#latest", heading: "Latest stories", tiles: articles.slice(0, 4).map(toTile) },
    {
      key: "events",
      label: "Events",
      href: "/stories#events",
      heading: "Events",
      tiles: [tile("Events", "events", "/images/campaign-drop.jpg?v=3")],
      note: "Days on the water, on the course and on the trail, hosted or backed by Vis Naturæ. The first are being planned.",
    },
    {
      key: "interviews",
      label: "Interviews",
      href: "/stories#interviews",
      heading: "In conversation",
      tiles: [interviews],
      note: "The workshop that makes every piece and the partners the ten percent goes to, in their own words. Each goes up once the agreement behind it is signed.",
    },
    {
      key: "community",
      label: "Community & Instagram",
      href: "/stories#community",
      heading: "In the pieces, out in the world",
      tiles: [community],
      note: `Tag @${instagramHandle} to be featured. We always ask before we share.`,
    },
    {
      key: "sponsorship",
      label: "Sponsorship",
      href: "/stories#sponsorship",
      heading: "We back people who go all in",
      tiles: [tile("Sponsorship", "sponsorship", "/community/surf-still.jpg")],
      note: "Athletes and ambassadors, artists, and clubs, teams and events. Tell us what you go all in at.",
    },
    {
      key: "letters",
      label: "Newsletter",
      href: "/stories#letters",
      heading: "First to know",
      tiles: [letters],
      note: "Behind the scenes, written rarely. Sign up and you hear first.",
    },
  ];
}

function about(): MenuItem[] {
  return [
    {
      key: "all",
      label: "Our story",
      href: "/about",
      heading: "Explore Vis Naturæ",
      tiles: [
        { label: "Our story", href: "/about", image: IMG.about },
        badger,
        { label: "Made in Mauritius", href: "/made-to-order", image: IMG.cutting },
        { label: `${pledgePercentLabel()} to conservation`, href: "/conservation", image: IMG.cliff },
      ],
    },
    {
      key: "the-mark",
      label: "The badger",
      href: "/about#the-mark",
      heading: "Most animals survive by knowing when to run",
      tiles: [badger],
      note: "The honey badger survives because it simply refuses to. Ours is caught asleep on its back: go all in, then rest like you mean it.",
    },
    contact,
  ];
}

export function menus(): Record<MenuKey, MenuItem[]> {
  return { men: menuFor("men"), women: menuFor("women"), "made-to-order": madeToOrder(), conservation: conservation(), stories: stories(), about: about() };
}
