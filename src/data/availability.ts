import { getEdit, productsInEdit } from "./edits";
import { outfitPieces, outfitsFor } from "./outfits";
import { getProduct, isFor, products, type Product } from "./products";

/**
 * The designs that can be ordered now. Every other piece is shown, but under a grey veil marked
 * "Coming soon", and can't be added to the bag (Leo, 2026-10-15: only the Marram Cap to start).
 */
const AVAILABLE_FAMILIES = ["marram-cap"];

export function isAvailable(p: Product): boolean {
  return AVAILABLE_FAMILIES.includes(p.family);
}

/** The pieces a shop link leads to (a product, a listing, an edit or a look), or null for a page that isn't the shop. */
function piecesBehind(href: string): Product[] | null {
  const url = new URL(href, "https://x");
  const [root, sub, slug] = url.pathname.split("/").filter(Boolean);
  if (root === "product") {
    const p = getProduct(sub);
    return p ? [p] : [];
  }
  if (root !== "shop" && root !== "men" && root !== "women") return null;
  let list = root === "shop" ? products : products.filter((p) => isFor(p, root));
  if (sub === "edit") {
    const e = getEdit(slug);
    list = e ? productsInEdit(e) : [];
  } else if (sub === "outfits") {
    const looks = root === "shop" ? [] : outfitsFor(root).filter((o) => !url.hash || `#${o.slug}` === url.hash);
    list = looks.flatMap(outfitPieces);
  } else if (sub && sub !== "all") {
    list = list.filter((p) => p.category === sub);
  }
  const design = url.searchParams.get("design");
  if (design) list = list.filter((p) => design.split(",").includes(p.family));
  if (url.searchParams.get("filter") === "new") list = list.filter((p) => p.badge === "New");
  return list;
}

/**
 * Whether a tile linking to `href` is coming soon: it leads into the shop and nothing behind it can be
 * ordered yet. A tile that leads to a Marram Cap (Accessories, Men, Women, All pieces) stays clear.
 */
export function comingSoon(href: string): boolean {
  const pieces = piecesBehind(href);
  return pieces !== null && !pieces.some(isAvailable);
}
