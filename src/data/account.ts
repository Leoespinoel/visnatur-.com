import { menuFor, type MenuTile } from "./menu";

/** The store's id at Shopify, in its customer account addresses. */
export const SHOPIFY_SHOP_ID = "82438520983";

/**
 * Sign-in on the site itself (src/lib/customer-account.ts): Shopify's customer accounts (an emailed code, no password),
 * with the orders, profile, sizes and wishlist shown in the site's own pages and kept on Shopify.
 */
export const signInHref = "/account/login";
export const ordersHref = "/account/orders";
export const profileHref = "/account/profile";
/** Signing in or joining from the club comes back to /members, the member's own page. */
export const clubSignInHref = "/account/login?return=%2Fmembers";

/** The menu across the top of the account pages (/account, /wishlist), as on nudeproject.com. */
export const accountLinks = [
  { label: "Orders", href: ordersHref },
  { label: "Profile", href: profileHref },
  { label: "My sizes", href: "/account/sizes" },
  { label: "The lineup", href: "/members" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "Returns", href: "/legal/returns" },
  // The homepage, as on Nude Project (Leo, 2026-10-20).
  { label: "Back to Shop", href: "/" },
];

/** The five studio pictures under the account pages, each into a part of the shop. */
export function accountTiles(): MenuTile[] {
  const kinds = menuFor("men").find((i) => i.key === "all")!.tiles;
  const kind = (label: string) => kinds.find((t) => t.label === label)?.href ?? "/men/all";
  return [
    { label: "New in", href: "/men/all?filter=new", image: "/products/boathouse-tipped-polo-ecru-model.jpg" },
    { label: "Women", href: "/women", image: "/products/womens-cabana-linen-shirt-clementine-model.jpg" },
    { label: "Polo Shirts", href: kind("Polo Shirts"), image: "/products/cabana-stripe-polo-navy-model.jpg" },
    { label: "Hoodies", href: kind("Hoodies"), image: "/products/cabana-hoodie-black-model.jpg" },
    { label: "Knitwear", href: kind("Knitwear"), image: "/products/mooring-stripe-crew-black-ecru-model.jpg" },
  ];
}
