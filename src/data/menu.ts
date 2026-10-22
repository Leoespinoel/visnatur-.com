import { audiences, categories, site, type AudienceSlug, type CategorySlug } from "./site";
import { groupByFamily, isFor, productImages, products, type Garment, type Product } from "./products";
import { dispatchLabel, formatPrice, madeToOrderLabel, transitLabel } from "@/lib/format";
import { outfitsFor } from "./outfits";
import { drops } from "./drops";

/** `packshot` tiles show the garment on white with the label in ink; the rest are photos with the label over them. */
export type MenuTile = { label: string; href: string; image: string; packshot?: boolean };

/**
 * One line down the side of a mega menu and what the right of the panel shows while it is hovered: a
 * heading and a row of tiles, or one tile and a note (as on ralphlauren.com, where each side link swaps
 * the panel). With `grid` the tiles wrap into rows of four instead of a carousel. The item keyed "all"
 * is what a panel opens on.
 */
export type MenuItem = { key: string; label: string; href: string; heading: string; tiles: MenuTile[]; note?: string; grid?: boolean };

/** The Shop menu's sections, each opening a mega panel, in nav order. */
export type MenuKey = "new" | AudienceSlug | "signature" | "collections" | "made-to-order";

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
  men: { hoodie: "/images/men/edit-hoodie.jpg?v=r1016" },
  women: { hoodie: "/images/women/riviera-hoodie.jpg?v=r1016" },
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
  about: "/images/about.jpg?v=r1016",
};
const contact = {
  key: "contact",
  label: "Contact",
  href: "/contact",
  heading: "Write to us",
  tiles: [{ label: "Contact", href: "/contact", image: IMG.about }],
  note: "Sizing questions, order updates, repairs, or just to say hello. We answer within two working days.",
};

/**
 * Signature (Leo, 2026-10-20): the permanent line, always in stock. Men and Women sit inside it (Leo: "the men and women
 * section inside the signature section"), each showing its garment grid; New in brings the latest pieces of both.
 */
function signature(): MenuItem[] {
  const men = menuFor("men");
  const women = menuFor("women");
  const part = (items: MenuItem[], key: string) => items.find((i) => i.key === key)!;
  return [
    {
      key: "all",
      label: "All Signature",
      href: "/shop/signature",
      heading: "The permanent line, always in stock",
      tiles: [
        { label: "Signature", href: "/shop/signature", image: "/images/shop/hero.jpg?v=r1016" },
        { label: "Men", href: "/men", image: "/images/home/men-hero.jpg?v=r1016" },
        { label: "Women", href: "/women", image: "/images/home/women-hero.jpg?v=r1016" },
        { label: "Made to order", href: "/made-to-order", image: "/images/atelier/hands.jpg" },
      ],
    },
    { key: "men", label: "Men", href: "/men", heading: "Signature for him", tiles: part(men, "all").tiles, grid: true },
    { key: "women", label: "Women", href: "/women", heading: "Signature for her", tiles: part(women, "all").tiles, grid: true },
    {
      key: "new",
      label: "New in",
      href: "/shop/all?filter=new",
      heading: "New in",
      tiles: [...part(men, "new").tiles.slice(0, 4), ...part(women, "new").tiles.slice(0, 4)],
    },
  ];
}

/**
 * New in, the first section of the desktop Collections menu (Leo, 2026-10-22: "New in, Men, Women, DIVA soon"): the latest
 * pieces of both, then his and hers, each the "new" panel of that audience's menu.
 */
function newIn(): MenuItem[] {
  const latest = (audience: AudienceSlug) => menuFor(audience).find((i) => i.key === "new")!;
  const men = latest("men");
  const women = latest("women");
  return [
    { key: "all", label: "All new", href: "/shop/all?filter=new", heading: "New in", tiles: [...men.tiles.slice(0, 4), ...women.tiles.slice(0, 4)] },
    { ...men, key: "men", label: "For him" },
    { ...women, key: "women", label: "For her" },
  ];
}

/** Limited edition (Leo, 2026-10-20: drops are called collections; 2026-10-21: off menu, reserve, then hors série; 2026-10-22: limited edition): limited units, then gone. One tile each once there are any. */
function collections(): MenuItem[] {
  const tiles: MenuTile[] = drops.length
    ? drops.map((d) => ({ label: d.name, href: `/collections#${d.id}`, image: d.image ?? "/images/moments/dj-night.jpg" }))
    : [{ label: "Limited edition", href: "/collections", image: "/images/moments/dj-night.jpg" }];
  return [
    {
      key: "all",
      label: "Limited edition",
      href: "/collections",
      heading: "Limited units, then gone",
      tiles,
      ...(drops.length ? {} : { note: "DIVA, the first Limited edition, is on its way. Members of the club hear first." }),
    },
  ];
}

function madeToOrder(): MenuItem[] {
  const tile = (label: string, hash: string, image: string): MenuTile => ({ label, href: `/made-to-order#${hash}`, image });
  return [
    {
      key: "all",
      label: "Made to order",
      href: "/made-to-order",
      heading: "A Signature piece, made to fit",
      tiles: [
        tile("How it works", "how-it-works", "/images/atelier/hands.jpg"),
        tile("What can be adjusted", "adjustments", "/images/atelier/press.jpg"),
        tile("Shipping", "shipping", IMG.atelier),
        tile("Sizing", "sizing", IMG.sizing),
      ],
    },
    {
      key: "shipping",
      label: "Shipping & delivery",
      href: "/made-to-order#shipping",
      heading: "Shipping & delivery",
      tiles: [tile("Shipping", "shipping", IMG.atelier)],
      note: `Signature and Limited edition pieces leave Mauritius within ${dispatchLabel()}, then ${transitLabel()} express to Europe. Made to order takes ${madeToOrderLabel()}. Free shipping over ${formatPrice(site.freeShippingThresholdCents)}.`,
    },
    {
      key: "sizing",
      label: "Sizing",
      href: "/made-to-order#sizing",
      heading: "Sizing",
      tiles: [tile("Sizing", "sizing", IMG.sizing)],
      note: "Measure a shirt you like and match it to the chart, or have a Signature piece made to order to your measurements.",
    },
    {
      key: "questions",
      label: "Questions",
      href: "/made-to-order#questions",
      heading: "Asked often",
      tiles: [tile("Questions", "questions", IMG.label)],
      note: "Made to order, delivery, cancelling, returns and repairs.",
    },
    contact,
  ];
}

/** The Shop menu: each section and the mega panel it opens. */
export function menus(): Record<MenuKey, MenuItem[]> {
  return {
    new: newIn(),
    men: menuFor("men"),
    women: menuFor("women"),
    signature: signature(),
    collections: collections(),
    "made-to-order": madeToOrder(),
  };
}

/** The pages under The VN World. */
export type WorldKey = "stories" | "members";

/**
 * The VN World menu (Leo, 2026-10-16, after nudeproject.com's Universe): no side links, one tall picture per page,
 * side by side, with the page's name over it.
 */
export const worldPanels: Record<WorldKey, { image: string; position?: string }> = {
  stories: { image: "/images/run-club.jpg?v=r1016" },
  members: { image: "/images/moments/home-for-dinner.jpg" },
};
