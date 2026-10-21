import "server-only";
import { drops, piecesInDrop } from "@/data/drops";
import { club, type Reward } from "@/data/members";
import { emptyStore, leagueName, parseStore, type ClubStore, type LeagueMember, type LedgerOrder } from "./club-ledger";
import { admin } from "./shopify-admin";

/**
 * The club's record on each member (customer metafield custom.club, JSON), and the reward codes, through the Admin
 * API only. The metafield's definition gives customer accounts no access (npm run club:setup), so members can't read or
 * write it with their own sign-in: the only way to change it is through /api/account/club, which checks every claim.
 * Saves carry the version they read (compareDigest), so two claims at once can't both spend the same points.
 */

const NAMESPACE = "custom";
const KEY = "club";

type Money = { shopMoney: { amount: string } } | null;
type OrderNode = {
  id: string;
  name: string;
  processedAt: string;
  cancelledAt: string | null;
  test: boolean;
  displayFinancialStatus: string | null;
  displayFulfillmentStatus: string;
  discountCodes: string[];
  subtotalPriceSet: Money;
  currentSubtotalPriceSet: Money;
  refunds: { createdAt: string }[];
  fulfillments: { createdAt: string }[];
  lineItems?: { nodes: { product: { handle: string } | null; discountedTotalSet: Money }[] };
};

/** Which drop each product handle (= site slug) belongs to, for the leaderboard's drop table. */
const dropOf = new Map<string, string>();
for (const d of drops) for (const p of piecesInDrop(d)) dropOf.set(p.slug, d.id);

/** The line items are only asked for once there is a drop to apportion points to; the query stays cheap until then. */
const ORDER_FIELDS = /* GraphQL */ `
  id name processedAt cancelledAt test
  displayFinancialStatus displayFulfillmentStatus discountCodes
  subtotalPriceSet { shopMoney { amount } }
  currentSubtotalPriceSet { shopMoney { amount } }
  refunds(first: 5) { createdAt }
  fulfillments(first: 3) { createdAt }
  ${dropOf.size ? "lineItems(first: 20) { nodes { product { handle } discountedTotalSet { shopMoney { amount } } } }" : ""}
`;

const CLUB_QUERY = /* GraphQL */ `
  query Club($id: ID!, $after: String) {
    customer(id: $id) {
      tags
      club: metafield(namespace: "${NAMESPACE}", key: "${KEY}") { jsonValue compareDigest }
      orders(first: 50, after: $after, sortKey: PROCESSED_AT) {
        pageInfo { hasNextPage endCursor }
        nodes { ${ORDER_FIELDS} }
      }
    }
  }
`;

type ClubData = {
  customer: {
    tags: string[];
    club: { jsonValue: unknown; compareDigest: string } | null;
    orders: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: OrderNode[] };
  } | null;
};

const latest = (dates: { createdAt: string }[]) => dates.map((d) => d.createdAt).sort().at(-1) ?? null;
const amount = (m: Money) => Number(m?.shopMoney.amount ?? 0);

/** Drop id → the share of the order's subtotal that was that drop's pieces, or nothing when no line is in a drop. */
function dropShare(o: OrderNode): Record<string, number> | undefined {
  const subtotal = amount(o.subtotalPriceSet);
  if (!o.lineItems || subtotal <= 0) return undefined;
  const share: Record<string, number> = {};
  for (const li of o.lineItems.nodes) {
    const drop = li.product && dropOf.get(li.product.handle);
    if (drop) share[drop] = Math.min(1, (share[drop] ?? 0) + amount(li.discountedTotalSet) / subtotal);
  }
  return Object.keys(share).length ? share : undefined;
}

/** An order as the Admin API gives it, as the ledger needs it. */
function toLedgerOrder(o: OrderNode): LedgerOrder {
  const share = dropShare(o);
  return {
    id: o.id,
    name: o.name,
    processedAt: o.processedAt,
    cancelledAt: o.cancelledAt,
    test: o.test,
    financial: o.displayFinancialStatus ?? "",
    fulfillment: o.displayFulfillmentStatus,
    subtotal: amount(o.subtotalPriceSet),
    current: amount(o.currentSubtotalPriceSet),
    discountCodes: o.discountCodes,
    refundedAt: latest(o.refunds),
    shippedAt: latest(o.fulfillments),
    ...(share ? { dropShare: share } : {}),
  };
}

export type Loaded = { tags: string[]; store: ClubStore; digest: string | null; orders: LedgerOrder[] };

/** A member's tags, club record (with its version) and orders, up to 500. */
export async function loadClub(customerId: string): Promise<Loaded> {
  let after: string | null = null;
  const orders: LedgerOrder[] = [];
  let first: NonNullable<ClubData["customer"]> | null = null;
  for (let page = 0; page < 10; page++) {
    const data: ClubData = await admin<ClubData>(CLUB_QUERY, { id: customerId, after });
    if (!data.customer) throw new Error(`No customer ${customerId}`);
    first ??= data.customer;
    for (const o of data.customer.orders.nodes) orders.push(toLedgerOrder(o));
    if (!data.customer.orders.pageInfo.hasNextPage) break;
    after = data.customer.orders.pageInfo.endCursor;
  }
  return { tags: first!.tags, store: first!.club ? parseStore(first!.club.jsonValue) : emptyStore(), digest: first!.club?.compareDigest ?? null, orders };
}

// ---------------------------------------------------------------------------------------------------------------------
// The league: every member, for the tables on /members. Two paginated reads (the customers, then every order since the
// club opened), kept in memory for `club.leagueCacheMinutes` because each member's visit would otherwise read them all.

const MEMBERS_QUERY = /* GraphQL */ `
  query LeagueMembers($after: String) {
    customers(first: 250, after: $after, sortKey: CREATED_AT) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id firstName lastName createdAt
        emailAddress { marketingState }
        club: metafield(namespace: "${NAMESPACE}", key: "${KEY}") { jsonValue }
      }
    }
  }
`;
type MembersData = {
  customers: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: { id: string; firstName: string | null; lastName: string | null; createdAt: string; emailAddress: { marketingState: string } | null; club: { jsonValue: unknown } | null }[];
  };
};

const ORDERS_QUERY = /* GraphQL */ `
  query LeagueOrders($after: String, $query: String!) {
    orders(first: 100, after: $after, query: $query, sortKey: PROCESSED_AT) {
      pageInfo { hasNextPage endCursor }
      nodes { customer { id } ${ORDER_FIELDS} }
    }
  }
`;
type OrdersData = { orders: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: (OrderNode & { customer: { id: string } | null })[] } };

const PAGE_CAP = 20;
let leagueCache: { at: number; members: LeagueMember[] } | null = null;
let leagueLoading: Promise<LeagueMember[]> | null = null;

async function readLeagueMembers(): Promise<LeagueMember[]> {
  const byCustomer = new Map<string, LedgerOrder[]>();
  let after: string | null = null;
  for (let page = 0; ; page++) {
    if (page === PAGE_CAP) {
      console.warn(`Leaderboard: more than ${PAGE_CAP} pages of orders, the rest are not counted`);
      break;
    }
    const data: OrdersData = await admin<OrdersData>(ORDERS_QUERY, { after, query: `processed_at:>='${club.startsAt}'` });
    for (const o of data.orders.nodes) {
      if (!o.customer) continue;
      const list = byCustomer.get(o.customer.id) ?? [];
      list.push(toLedgerOrder(o));
      byCustomer.set(o.customer.id, list);
    }
    if (!data.orders.pageInfo.hasNextPage) break;
    after = data.orders.pageInfo.endCursor;
  }

  const members: LeagueMember[] = [];
  after = null;
  for (let page = 0; ; page++) {
    if (page === PAGE_CAP) {
      console.warn(`Leaderboard: more than ${PAGE_CAP} pages of members, the rest are left off`);
      break;
    }
    const data: MembersData = await admin<MembersData>(MEMBERS_QUERY, { after });
    for (const c of data.customers.nodes) {
      members.push({
        id: c.id,
        name: leagueName(c.firstName, c.lastName),
        input: {
          firstName: c.firstName ?? "",
          createdAt: c.createdAt,
          lettersLive: c.emailAddress?.marketingState === "SUBSCRIBED",
          orders: byCustomer.get(c.id) ?? [],
          store: c.club ? parseStore(c.club.jsonValue) : emptyStore(),
        },
      });
    }
    if (!data.customers.pageInfo.hasNextPage) break;
    after = data.customers.pageInfo.endCursor;
  }
  return members;
}

/** Every member with the input their own page is built from, at most `club.leagueCacheMinutes` old. One read at a time. */
export async function loadLeagueMembers(): Promise<LeagueMember[]> {
  if (leagueCache && Date.now() - leagueCache.at < club.leagueCacheMinutes * 60_000) return leagueCache.members;
  leagueLoading ??= readLeagueMembers()
    .then((members) => {
      leagueCache = { at: Date.now(), members };
      return members;
    })
    .catch((err: unknown) => {
      // A failed refresh keeps the last list rather than emptying the tables.
      if (leagueCache) {
        console.error("Leaderboard: refresh failed, keeping the last read", err);
        return leagueCache.members;
      }
      throw err;
    })
    .finally(() => {
      leagueLoading = null;
    });
  return leagueLoading;
}

/** Saves the record if nobody changed it since `digest` was read (null: it must not exist yet). */
export async function saveClub(customerId: string, store: ClubStore, digest: string | null): Promise<{ ok: true; digest: string } | { ok: false; error: string }> {
  const data = await admin<{ metafieldsSet: { metafields: { compareDigest: string }[] | null; userErrors: { message: string; code: string | null }[] } }>(
    `mutation SaveClub($metafields: [MetafieldsSetInput!]!) {
       metafieldsSet(metafields: $metafields) { metafields { compareDigest } userErrors { message code } }
     }`,
    { metafields: [{ ownerId: customerId, namespace: NAMESPACE, key: KEY, type: "json", value: JSON.stringify(store), compareDigest: digest }] },
  );
  const errors = data.metafieldsSet.userErrors;
  if (errors.length || !data.metafieldsSet.metafields?.[0]) return { ok: false, error: errors.map((e) => `${e.code ?? ""} ${e.message}`).join("; ") || "not saved" };
  return { ok: true, digest: data.metafieldsSet.metafields[0].compareDigest };
}

/** A one-use code only this customer can use, for a reward that has one. Returns the discount's id. */
export async function createCode(customerId: string, reward: Reward, code: string, endsAt: string): Promise<string> {
  const common = {
    title: `${club.name} · ${reward.reward}`,
    code,
    startsAt: new Date().toISOString(),
    endsAt,
    context: { customers: { add: [customerId] } },
    usageLimit: 1,
    appliesOncePerCustomer: true,
  };
  type Payload = { codeDiscountNode: { id: string } | null; userErrors: { field: string[] | null; message: string }[] };
  let payload: Payload;
  if (reward.kind === "shipping") {
    const data = await admin<{ discountCodeFreeShippingCreate: Payload }>(
      `mutation Ship($d: DiscountCodeFreeShippingInput!) {
         discountCodeFreeShippingCreate(freeShippingCodeDiscount: $d) { codeDiscountNode { id } userErrors { field message } }
       }`,
      { d: { ...common, destination: { all: true }, combinesWith: { orderDiscounts: true, productDiscounts: true, shippingDiscounts: false } } },
    );
    payload = data.discountCodeFreeShippingCreate;
  } else {
    const data = await admin<{ discountCodeBasicCreate: Payload }>(
      `mutation Code($d: DiscountCodeBasicInput!) {
         discountCodeBasicCreate(basicCodeDiscount: $d) { codeDiscountNode { id } userErrors { field message } }
       }`,
      {
        d: {
          ...common,
          customerGets: { value: { discountAmount: { amount: (reward.amount ?? 0).toFixed(2), appliesOnEachItem: false } }, items: { all: true } },
          combinesWith: { orderDiscounts: false, productDiscounts: false, shippingDiscounts: true },
        },
      },
    );
    payload = data.discountCodeBasicCreate;
  }
  if (payload.userErrors.length || !payload.codeDiscountNode) throw new Error(`Discount: ${payload.userErrors.map((e) => e.message).join("; ") || "not created"}`);
  return payload.codeDiscountNode.id;
}

/** The discount behind a code, if Shopify has it (to settle a claim that was interrupted). */
export async function findCode(code: string): Promise<string | null> {
  const data = await admin<{ codeDiscountNodeByCode: { id: string } | null }>(`query Find($code: String!) { codeDiscountNodeByCode(code: $code) { id } }`, { code });
  return data.codeDiscountNodeByCode?.id ?? null;
}

/** Tags the customer, e.g. so a Shopify Flow tells the team a reward was requested. */
export async function tagCustomer(customerId: string, tags: string[]): Promise<void> {
  const data = await admin<{ tagsAdd: { userErrors: { message: string }[] } }>(
    `mutation Tag($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`,
    { id: customerId, tags },
  );
  if (data.tagsAdd.userErrors.length) throw new Error(`Tags: ${data.tagsAdd.userErrors.map((e) => e.message).join("; ")}`);
}
