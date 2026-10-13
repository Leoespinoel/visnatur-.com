import "server-only";

/**
 * Shopify, server side only: the Storefront API (carts → Shopify checkout), with the token from
 * the Headless sales channel. Every piece is made to order, so the site never reads orders or stock.
 *
 * Env: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN. Without them the site runs with checkout off.
 */

const SHOPIFY_API_VERSION = "2026-07";

const domain = () =>
  (process.env.SHOPIFY_STORE_DOMAIN ?? "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

export function storefrontConfigured(): boolean {
  return Boolean(domain() && process.env.SHOPIFY_STOREFRONT_TOKEN);
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function graphql<T>(url: string, headers: Record<string, string>, query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(`Shopify: ${json.errors.map((e) => e.message).join("; ")}`);
  if (!json.data) throw new Error("Shopify: empty response");
  return json.data;
}

/** Storefront API call. The Headless channel's private token is meant for server-side use like this. */
export function storefront<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";
  // Headless private tokens start with "shpat_"; public ones don't. Send whichever header fits.
  const header = token.startsWith("shpat_") ? "Shopify-Storefront-Private-Token" : "X-Shopify-Storefront-Access-Token";
  return graphql<T>(`https://${domain()}/api/${SHOPIFY_API_VERSION}/graphql.json`, { [header]: token }, query, variables);
}
