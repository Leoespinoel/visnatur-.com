import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { accessToken, customerApi, SignedOutError } from "@/lib/customer-account";
import { cleanSizes, type MySizes } from "@/lib/sizes-core";

/**
 * The signed-in customer, with the sizes and wishlist kept on their account (customer fields custom.sizes and
 * custom.wishlist). GET reads them; POST { sizes?, wishlist? } saves them. src/lib/account-sync.tsx keeps the
 * browser copies and these in step.
 */

const NAMESPACE = "custom";
const WISHLIST_MAX = 300;

const cleanWishlist = (raw: unknown): string[] =>
  Array.isArray(raw) ? [...new Set(raw.filter((s): s is string => typeof s === "string" && !!getProduct(s)))].slice(0, WISHLIST_MAX) : [];

const parse = (value: string | undefined): unknown => {
  try {
    return value ? JSON.parse(value) : undefined;
  } catch {
    return undefined;
  }
};

type Customer = {
  customer: {
    id: string;
    firstName: string | null;
    emailAddress: { emailAddress: string | null } | null;
    sizes: { value: string } | null;
    wishlist: { value: string } | null;
  };
};

const CUSTOMER = /* GraphQL */ `
  query Account {
    customer {
      id
      firstName
      emailAddress { emailAddress }
      sizes: metafield(namespace: "${NAMESPACE}", key: "sizes") { value }
      wishlist: metafield(namespace: "${NAMESPACE}", key: "wishlist") { value }
    }
  }
`;

const signedOut = () => NextResponse.json({ signedIn: false });

export async function GET() {
  const token = await accessToken();
  if (!token) return signedOut();
  try {
    const { customer } = await customerApi<Customer>(token, CUSTOMER);
    return NextResponse.json({
      signedIn: true,
      id: customer.id,
      firstName: customer.firstName ?? "",
      email: customer.emailAddress?.emailAddress ?? "",
      sizes: cleanSizes(parse(customer.sizes?.value)),
      wishlist: cleanWishlist(parse(customer.wishlist?.value)),
    });
  } catch (err) {
    if (err instanceof SignedOutError) return signedOut();
    console.error("Account lookup failed", err);
    return NextResponse.json({ error: "We couldn't load your account." }, { status: 502 });
  }
}

type MetafieldsSet = { metafieldsSet: { userErrors: { field: string[] | null; message: string; code: string | null }[] } };

const METAFIELDS_SET = /* GraphQL */ `
  mutation SaveAccount($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors { field message code }
    }
  }
`;

export async function POST(req: Request) {
  const token = await accessToken();
  if (!token) return NextResponse.json({ signedIn: false }, { status: 401 });

  let body: { sizes?: unknown; wishlist?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const fields: { key: string; value: unknown }[] = [];
  if (body.sizes !== undefined) {
    const sizes: MySizes = cleanSizes(body.sizes);
    fields.push({ key: "sizes", value: sizes });
  }
  if (body.wishlist !== undefined) fields.push({ key: "wishlist", value: cleanWishlist(body.wishlist) });
  if (!fields.length) return NextResponse.json({ error: "Nothing to save." }, { status: 400 });

  try {
    const { customer } = await customerApi<{ customer: { id: string } }>(token, `query Me { customer { id } }`);
    const { metafieldsSet } = await customerApi<MetafieldsSet>(token, METAFIELDS_SET, {
      metafields: fields.map((f) => ({ ownerId: customer.id, namespace: NAMESPACE, key: f.key, type: "json", value: JSON.stringify(f.value) })),
    });
    if (metafieldsSet.userErrors.length) {
      console.error("Account save errors", metafieldsSet.userErrors);
      return NextResponse.json({ error: "We couldn't save to your account." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SignedOutError) return NextResponse.json({ signedIn: false }, { status: 401 });
    console.error("Account save failed", err);
    return NextResponse.json({ error: "We couldn't save to your account." }, { status: 502 });
  }
}
