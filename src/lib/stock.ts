import "server-only";
import { cacheLife } from "next/cache";
import { storefront, storefrontConfigured } from "./shopify";

/**
 * Stock (Leo, 2026-10-20): Signature and Limited edition pieces are held in stock, tracked in Shopify. A size is sold out when
 * Shopify reports its variant as not available for sale (tracked stock at 0). Untracked variants are always available,
 * so until `npm run shopify:sync -- --track-stock` is run, nothing shows as sold out. Cached for a few minutes.
 */
export async function soldOutSizes(slug: string): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  if (!storefrontConfigured()) return [];
  type Data = { product: { variants: { nodes: { availableForSale: boolean; selectedOptions: { name: string; value: string }[] }[] } } | null };
  try {
    const data = await storefront<Data>(
      `query Stock($handle: String!) { product(handle: $handle) { variants(first: 50) { nodes { availableForSale selectedOptions { name value } } } } }`,
      { handle: slug },
    );
    return (data.product?.variants.nodes ?? [])
      .filter((v) => !v.availableForSale)
      .map((v) => v.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ?? "")
      .filter(Boolean);
  } catch (err) {
    // Stock is a nicety on the page; checkout checks it again. Never break the product page over it.
    console.error("Stock lookup failed", slug, err);
    return [];
  }
}
