import "server-only";
import { domain } from "./shopify";

/**
 * Shopify's Admin API, server side only, for the club (reading a member's orders, keeping their club record and
 * making reward codes). Same app and sign-in as scripts/shopify-sync.mts: the Dev Dashboard app's client credentials,
 * swapped for a token that lasts a day and is kept in memory until shortly before it runs out.
 *
 * Env: SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET. The app needs read_customers, write_customers,
 * read_discounts, write_discounts, read_orders and read_all_orders (npm run club:setup checks them).
 */

const API_VERSION = "2026-07";

let cached: { token: string; expires: number } | null = null;

export function adminConfigured(): boolean {
  return Boolean(domain() && process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET);
}

async function token(fresh = false): Promise<string> {
  if (!fresh && cached && cached.expires - Date.now() > 5 * 60_000) return cached.token;
  const res = await fetch(`https://${domain()}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.SHOPIFY_CLIENT_ID!, client_secret: process.env.SHOPIFY_CLIENT_SECRET! }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Admin token ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { access_token: string; expires_in?: number };
  cached = { token: json.access_token, expires: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cached.token;
}

/** An Admin GraphQL call. A refused token is swapped for a fresh one once. */
export async function admin<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  for (const fresh of [false, true]) {
    const res = await fetch(`https://${domain()}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await token(fresh) },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
    if (res.status === 401 && !fresh) continue;
    if (!res.ok) throw new Error(`Admin API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
    if (json.errors?.length) throw new Error(`Admin API: ${json.errors.map((e) => e.message).join("; ")}`);
    if (!json.data) throw new Error("Admin API: empty response");
    return json.data;
  }
  throw new Error("Admin API: token refused");
}
