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

/* ---------- Paid units: a sales ledger on each product, plus recent orders ---------- */

/**
 * Shopify only lets this app read the last 60 days of orders, but an edition's count and a
 * one-of-one's "sold" must last for ever. So every order webhook (which carries the whole order,
 * however old) records that order's units in a JSON metafield on each product it touches:
 * { "<order gid>": { name, at, sizes[] } }. Reads merge that ledger with the orders still
 * visible, so a missed webhook inside 60 days is covered too.
 */
const LEDGER = { namespace: "vis_naturae", key: "sold" } as const;

export type PaidUnit = { slug: string; size: string; orderId: string; orderName: string; paidAt: string };
type LedgerEntry = { name: string; at: string; sizes: string[] };
type Ledger = Record<string, LedgerEntry>;

const parseLedger = (value: string | null | undefined): Ledger => {
  try {
    const v = value ? (JSON.parse(value) as unknown) : {};
    return v && typeof v === "object" ? (v as Ledger) : {};
  } catch {
    return {};
  }
};

/** Order as it arrives in an orders/* webhook (REST shape). */
export type OrderPayload = {
  admin_graphql_api_id?: string;
  name?: string;
  processed_at?: string;
  created_at?: string;
  financial_status?: string | null;
  cancelled_at?: string | null;
  line_items?: { product_id: number | null; variant_title?: string | null; quantity: number; current_quantity?: number }[];
};

const PAID = new Set(["paid", "partially_refunded", "partially_paid"]);

/**
 * Writes this order's current units into the ledger of every product on it (removes it if
 * cancelled or unpaid). Returns the handles of the products it touched.
 */
export async function recordOrder(order: OrderPayload): Promise<string[]> {
  const id = order.admin_graphql_api_id;
  if (!id || !order.line_items?.length) return [];
  const counts = PAID.has(order.financial_status ?? "") && !order.cancelled_at;

  const sizesByProduct = new Map<string, string[]>();
  for (const line of order.line_items) {
    if (!line.product_id) continue;
    const gid = `gid://shopify/Product/${line.product_id}`;
    const sizes = sizesByProduct.get(gid) ?? [];
    const qty = counts ? (line.current_quantity ?? line.quantity) : 0;
    for (let i = 0; i < qty; i++) sizes.push(line.variant_title ?? "");
    sizesByProduct.set(gid, sizes);
  }
  if (!sizesByProduct.size) return [];

  const data = await admin<{ nodes: ({ id: string; handle: string; metafield: { value: string } | null } | null)[] }>(
    /* GraphQL */ `
      query Ledgers($ids: [ID!]!) {
        nodes(ids: $ids) { ... on Product { id handle metafield(namespace: "${LEDGER.namespace}", key: "${LEDGER.key}") { value } } }
      }
    `,
    { ids: [...sizesByProduct.keys()] },
  );

  const metafields = [];
  for (const product of data.nodes) {
    if (!product?.id) continue;
    const ledger = parseLedger(product.metafield?.value);
    const sizes = sizesByProduct.get(product.id) ?? [];
    if (sizes.length) ledger[id] = { name: order.name ?? "", at: order.processed_at ?? order.created_at ?? new Date().toISOString(), sizes };
    else delete ledger[id];
    metafields.push({ ownerId: product.id, ...LEDGER, type: "json", value: JSON.stringify(ledger) });
  }
  if (!metafields.length) return [];
  const handles = data.nodes.flatMap((n) => (n?.handle ? [n.handle] : []));

  const res = await admin<{ metafieldsSet: { userErrors: { message: string }[] } }>(
    /* GraphQL */ `
      mutation Save($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) { userErrors { message } }
      }
    `,
    { metafields },
  );
  if (res.metafieldsSet.userErrors.length) throw new Error(res.metafieldsSet.userErrors.map((e) => e.message).join("; "));

  // Reads can trail a write by a moment. Wait (briefly) until Shopify returns what was written,
  // so the page refresh that follows this webhook doesn't cache the old count.
  const expected = new Map(metafields.map((m) => [m.ownerId, m.value]));
  for (let attempt = 0; attempt < 6; attempt++) {
    const check = await admin<{ nodes: ({ id: string; metafield: { value: string } | null } | null)[] }>(
      /* GraphQL */ `
        query Check($ids: [ID!]!) {
          nodes(ids: $ids) { ... on Product { id metafield(namespace: "${LEDGER.namespace}", key: "${LEDGER.key}") { value } } }
        }
      `,
      { ids: [...expected.keys()] },
    );
    if (check.nodes.every((n) => !n || n.metafield?.value === expected.get(n.id))) break;
    await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
  }
  return handles;
}

type ProductsPage = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: { id: string; handle: string }[];
  };
};

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

// The products list is served from a search index that lags writes by a few seconds, so it is
// only used for ids; ledgers are then read by direct lookup, which is always current.
const PRODUCTS_QUERY = /* GraphQL */ `
  query ProductIds($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      nodes { id handle }
    }
  }
`;

const LEDGERS_QUERY = /* GraphQL */ `
  query Ledgers($ids: [ID!]!) {
    nodes(ids: $ids) { ... on Product { handle metafield(namespace: "${LEDGER.namespace}", key: "${LEDGER.key}") { value } } }
  }
`;

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
 * Every unit still paid for, oldest first, so the nth unit of a design is its number "n of 12".
 * Ledger entries cover all time; orders from the last 60 days are re-read and win where both exist.
 */
export async function paidUnits(): Promise<PaidUnit[]> {
  // slug → order gid → units
  const byProduct = new Map<string, Map<string, PaidUnit[]>>();
  const put = (slug: string, orderId: string, units: PaidUnit[]) => {
    const orders = byProduct.get(slug) ?? new Map<string, PaidUnit[]>();
    orders.set(orderId, units);
    byProduct.set(slug, orders);
  };

  const ids: string[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 20; page++) {
    const data: ProductsPage = await admin<ProductsPage>(PRODUCTS_QUERY, { cursor });
    ids.push(...data.products.nodes.map((p) => p.id));
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  for (let i = 0; i < ids.length; i += 100) {
    type Node = { handle?: string; metafield?: { value: string } | null } | null;
    const data = await admin<{ nodes: Node[] }>(LEDGERS_QUERY, { ids: ids.slice(i, i + 100) });
    for (const p of data.nodes) {
      if (!p?.handle) continue;
      for (const [orderId, e] of Object.entries(parseLedger(p.metafield?.value))) {
        put(p.handle, orderId, e.sizes.map((size) => ({ slug: p.handle!, size, orderId, orderName: e.name, paidAt: e.at })));
      }
    }
  }

  // Recent orders override the ledger for the same order (covers webhooks that never arrived).
  const recent = new Map<string, Map<string, PaidUnit[]>>();
  cursor = null;
  for (let page = 0; page < 50; page++) {
    const data: OrdersPage = await admin<OrdersPage>(ORDERS_QUERY, { cursor });
    for (const order of data.orders.nodes) {
      for (const line of order.lineItems.nodes) {
        if (!line.product) continue;
        const size = line.variant?.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value ?? "";
        const orders = recent.get(line.product.handle) ?? new Map<string, PaidUnit[]>();
        const units = orders.get(order.id) ?? [];
        for (let i = 0; i < line.currentQuantity; i++) {
          units.push({ slug: line.product.handle, size, orderId: order.id, orderName: order.name, paidAt: order.processedAt });
        }
        orders.set(order.id, units);
        recent.set(line.product.handle, orders);
      }
    }
    if (!data.orders.pageInfo.hasNextPage) break;
    cursor = data.orders.pageInfo.endCursor;
  }
  for (const [slug, orders] of recent) for (const [orderId, units] of orders) put(slug, orderId, units);

  const all: PaidUnit[] = [];
  for (const orders of byProduct.values()) for (const units of orders.values()) all.push(...units);
  return all.sort((a, b) => a.paidAt.localeCompare(b.paidAt) || a.orderId.localeCompare(b.orderId));
}
