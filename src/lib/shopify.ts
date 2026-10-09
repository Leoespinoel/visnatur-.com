import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Shopify, server side only. Two APIs:
 *
 * - Storefront API (carts → Shopify checkout). Token from the Headless sales channel.
 * - Admin API (orders, for edition counts; tagging paid orders with their numbers).
 *   Token from a Dev Dashboard app via the client-credentials grant; it lasts 24 hours,
 *   so it is fetched on demand and cached in memory.
 *
 * Env: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET.
 * Without them the site runs with checkout off and every unit available.
 */

export const SHOPIFY_API_VERSION = "2026-07";

const domain = () =>
  (process.env.SHOPIFY_STORE_DOMAIN ?? "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

export function storefrontConfigured(): boolean {
  return Boolean(domain() && process.env.SHOPIFY_STOREFRONT_TOKEN);
}

export function adminConfigured(): boolean {
  return Boolean(domain() && process.env.SHOPIFY_CLIENT_ID && process.env.SHOPIFY_CLIENT_SECRET);
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

let adminToken: { value: string; expiresAt: number } | null = null;

async function getAdminToken(): Promise<string> {
  if (adminToken && Date.now() < adminToken.expiresAt - 60_000) return adminToken.value;
  const res = await fetch(`https://${domain()}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_CLIENT_ID ?? "",
      client_secret: process.env.SHOPIFY_CLIENT_SECRET ?? "",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify token ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  adminToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return adminToken.value;
}

/** Admin API call. */
export async function admin<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = await getAdminToken();
  return graphql<T>(`https://${domain()}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, { "X-Shopify-Access-Token": token }, query, variables);
}

/** Verifies a webhook body against Shopify's X-Shopify-Hmac-Sha256 header (signed with the app's client secret). */
export function verifyWebhook(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_CLIENT_SECRET;
  if (!secret || !hmacHeader) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody, "utf8").digest("base64"));
  const given = Buffer.from(hmacHeader);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/* ---------- Paid units, from orders ---------- */

export type PaidUnit = { slug: string; size: string; orderId: string; orderName: string; paidAt: string };

type OrdersPage = {
  orders: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: {
      id: string;
      name: string;
      processedAt: string;
      lineItems: {
        nodes: {
          currentQuantity: number;
          product: { handle: string } | null;
          variant: { selectedOptions: { name: string; value: string }[] } | null;
        }[];
      };
    }[];
  };
};

const ORDERS_QUERY = /* GraphQL */ `
  query PaidOrders($cursor: String) {
    orders(first: 100, after: $cursor, sortKey: PROCESSED_AT, query: "financial_status:paid OR financial_status:partially_refunded OR financial_status:partially_paid -status:cancelled") {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        name
        processedAt
        lineItems(first: 50) {
          nodes {
            currentQuantity
            product { handle }
            variant { selectedOptions { name value } }
          }
        }
      }
    }
  }
`;

/**
 * Every unit still paid for (refunded and removed units drop out via currentQuantity),
 * oldest first, so the nth unit of a design is its number "n of 12".
 */
export async function paidUnits(): Promise<PaidUnit[]> {
  const units: PaidUnit[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 50; page++) {
    const data: OrdersPage = await admin<OrdersPage>(ORDERS_QUERY, { cursor });
    for (const order of data.orders.nodes) {
      for (const line of order.lineItems.nodes) {
        if (!line.product) continue;
        const size = line.variant?.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ?? "";
        for (let i = 0; i < line.currentQuantity; i++) {
          units.push({ slug: line.product.handle, size, orderId: order.id, orderName: order.name, paidAt: order.processedAt });
        }
      }
    }
    if (!data.orders.pageInfo.hasNextPage) break;
    cursor = data.orders.pageInfo.endCursor;
  }
  return units;
}
