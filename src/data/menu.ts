import { audiences, categories, site, type AudienceSlug } from "./site";
import { groupByFamily, isFor, productImages, products, type Product } from "./products";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";

/** `packshot` tiles show the garment on white with the label in ink; the rest are photos with the label over them. */
export type MenuTile = { label: string; href: string; image: string; packshot?: boolean };

/**
 * One line down the side of a mega menu and what the right of the panel shows while it is hovered: a
 * heading and a row of tiles, or one tile and a note (as on ralphlauren.com, where each side link swaps
 * the panel). The item keyed "all" is what a panel opens on.
 */
export type MenuItem = { key: string; label: string; href: string; heading: string; tiles: MenuTile[]; note?: string };

/** The header items that open a mega menu, in nav order. */
export type MenuKey = AudienceSlug | "made-to-order" | "conservation" | "about";

/**
 * One tile per design: the section's lookbook image for it if there is one, else its first colourway's
 * on-model shot (Men only, since those models are men), else the packshot.
 */
function familyTiles(list: Product[], audience: AudienceSlug, looks: Record<string, string> = {}): MenuTile[] {
  return groupByFamily(list).map((g) => {
    const p = g.find((x) => productImages(x).length === 3) ?? g[0];
    const base = { label: p.name, href: `/product/${p.slug}` };
    if (looks[p.family]) return { ...base, image: looks[p.family] };
    const images = productImages(p);
    const model = audience === "men" ? images.find((i) => i.includes("-model.")) : undefined;
    return model ? { ...base, image: model } : { ...base, image: images[0], packshot: true };
  });
}

export function menuFor(audience: AudienceSlug): MenuItem[] {
  const a = audiences.find((x) => x.slug === audience)!;
  const them = audience === "men" ? "him" : "her";
  const mine = products.filter((p) => isFor(p, audience));
  return [
    { key: "new", label: "New in", href: `/${audience}?filter=new`, heading: `New in for ${them}`, tiles: familyTiles(mine.filter((p) => p.badge === "New"), audience, a.looks) },
    {
      key: "all",
      label: "All pieces",
      href: `/${audience}`,
      heading: a.explore,
      tiles: categories.map((c) => ({ label: c.name, href: `/${audience}/${c.slug}`, image: a.scenes[c.slug] })),
    },
    ...categories.map((c): MenuItem => {
      const tiles = familyTiles(mine.filter((p) => p.category === c.slug), audience, a.looks);
      const base = { key: c.slug, label: c.name, href: `/${audience}/${c.slug}`, heading: `${c.name} for ${them}` };
      return tiles.length
        ? { ...base, tiles }
        : { ...base, tiles: [{ label: c.name, href: base.href, image: a.scenes[c.slug] }], note: "Nothing here is cut for women yet. The first women’s pieces follow in the next collection." };
    }),
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
      note: "Where each euro changes the most: the reef around Mauritius, its last native forest, and rivers and wetlands in Europe. Partnerships in progress.",
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
  return { men: menuFor("men"), women: menuFor("women"), "made-to-order": madeToOrder(), conservation: conservation(), about: about() };
}
