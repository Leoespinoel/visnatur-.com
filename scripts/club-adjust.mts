// Adds or takes away a member's VN Club points by hand (goodwill, an order from before the club, or testing a claim on
// the live site before there are real orders), or shows their club record. Saves with the version it read, like the site.
//
//   npm run club:adjust -- --email someone@example.com --points 500 --note "Welcome back"
//   npm run club:adjust -- --email someone@example.com --points -500 --note "Test points removed"
//   npm run club:adjust -- --email someone@example.com --show

import { parseStore } from "../src/lib/club-ledger.ts";

const API_VERSION = "2026-07";
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const fail = (msg: string): never => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const email = arg("email");
const show = process.argv.includes("--show");
const points = Number(arg("points"));
const note = arg("note") ?? "Adjustment";
if (!email || (!show && (!Number.isInteger(points) || points === 0))) fail('Usage: --email <address> (--points <±n> --note "<why>" | --show)');

const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.SHOPIFY_CLIENT_ID ?? "", client_secret: process.env.SHOPIFY_CLIENT_SECRET ?? "" }),
});
if (!tokenRes.ok) fail(`Couldn't get an Admin API token (${tokenRes.status})`);
const { access_token: token } = (await tokenRes.json()) as { access_token: string };

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!res.ok || json.errors) fail(`Shopify API error: ${JSON.stringify(json.errors ?? res.statusText)}`);
  return json.data!;
}

type Found = { customers: { nodes: { id: string; firstName: string | null; club: { jsonValue: unknown; compareDigest: string } | null }[] } };
const found = await gql<Found>(
  `query Find($q: String!) { customers(first: 1, query: $q) { nodes { id firstName club: metafield(namespace: "custom", key: "club") { jsonValue compareDigest } } } }`,
  { q: `email:${email}` },
);
const customer = found.customers.nodes[0] ?? fail(`No customer with the email ${email}`);
const store = customer.club ? parseStore(customer.club.jsonValue) : parseStore({});
console.log(`${customer.firstName ?? "(no first name)"} · ${customer.id}`);

if (show) {
  console.log(JSON.stringify(store, null, 2));
  process.exit(0);
}

store.adjust.push({ at: new Date().toISOString(), points, note });
const saved = await gql<{ metafieldsSet: { userErrors: { message: string }[] } }>(
  `mutation Save($m: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $m) { userErrors { message } } }`,
  { m: [{ ownerId: customer.id, namespace: "custom", key: "club", type: "json", value: JSON.stringify(store), compareDigest: customer.club?.compareDigest ?? null }] },
);
if (saved.metafieldsSet.userErrors.length) fail(`Not saved (try again): ${saved.metafieldsSet.userErrors.map((e) => e.message).join("; ")}`);
console.log(`✓ ${points > 0 ? "+" : ""}${points} points, "${note}". They show on their /members page now.`);
