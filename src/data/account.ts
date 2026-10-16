import { menuFor, type MenuTile } from "./menu";

/**
 * Shopify's own customer accounts: sign in with an emailed code (no password), then orders and profile.
 * https://<store>.myshopify.com/account redirects here.
 */
const SHOPIFY_ACCOUNT = "https://shopify.com/82438520983/account";

export const signInHref = SHOPIFY_ACCOUNT;

/** The menu across the top of the account pages (/account, /wishlist), as on nudeproject.com. */
export const accountLinks = [
  { label: "Orders", href: `${SHOPIFY_ACCOUNT}/orders` },
  { label: "Profile", href: `${SHOPIFY_ACCOUNT}/profile` },
  { label: "The VN Club", href: "/members" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "Returns", href: "/legal/returns" },
  { label: "Back to Shop", href: "/shop" },
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
