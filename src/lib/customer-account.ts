import "server-only";
import { cookies, headers } from "next/headers";
import { SHOPIFY_SHOP_ID } from "@/data/account";
import { site } from "@/data/site";

/**
 * Sign-in on the site (Leo, 2026-10-20), so My sizes and the wishlist save to the customer's account the way
 * Nude Project's Key Members does. It uses Shopify's Customer Account API: OAuth with PKCE, as the Headless storefront's
 * public (web app) client. Shopify only sends customers back to the callback, JavaScript origin and logout addresses
 * listed in Headless → storefront → Customer Account API → Application setup, all https (no localhost).
 *
 * The tokens live in an httpOnly cookie. `vn_signed_in` holds no token: it only tells the page that someone is signed
 * in, so it knows to fetch /api/account. The account keeps sizes and the wishlist in the customer fields custom.sizes
 * and custom.wishlist (JSON, "Customer accounts: Read and write", made in Settings → Metafields and metaobjects).
 */

/** Not a secret: a public client's id is sent to the browser in the sign-in address anyway. */
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "12eaa40a-c8db-4e7d-a105-1dd0df2025ef";
const AUTH = `https://shopify.com/authentication/${SHOPIFY_SHOP_ID}`;
const API = `https://shopify.com/${SHOPIFY_SHOP_ID}/account/customer/api/2026-10/graphql`;
const SCOPE = "openid email customer-account-api:full";

const SESSION_COOKIE = "vn_session";
const SIGNED_IN_COOKIE = "vn_signed_in";
const OAUTH_COOKIE = "vn_oauth";
/** How long a sign-in lasts; Shopify's refresh token keeps the access token fresh until then. */
const SESSION_SECONDS = 60 * 60 * 24 * 30;

type Session = { access: string; refresh: string; expires: number; id: string };
type Tokens = { access_token: string; refresh_token: string; expires_in: number; id_token?: string };

async function incoming() {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim();
  const local = !host || /^(localhost|127\.0\.0\.1)(:|$)/.test(host);
  const proto = (h.get("x-forwarded-proto") ?? (local ? "http" : "https")).split(",")[0].trim();
  return { host, local, proto };
}

/**
 * The site's public address for Shopify (callback, origin, logout), e.g. https://xn--visnatur-q0a.com, or a test tunnel's.
 * On localhost, which Shopify doesn't allow, and behind a proxy that hides the public host: the site's own address.
 */
export async function requestOrigin(): Promise<string> {
  const { host, local, proto } = await incoming();
  return local ? new URL(site.url).origin : `${proto}://${host}`;
}

/** Secure cookies on https only, so a test on http://localhost still keeps them. */
const secureCookies = async () => (await incoming()).proto === "https";

/** A redirect within the site. The address stays relative, so the browser stays on the host it is on. */
export const redirectTo = (path: string, status = 307) => new Response(null, { status, headers: { Location: path } });

const b64url = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
const random = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async (s: string) => b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))));

/** Starts a sign-in: remembers the PKCE verifier, state and nonce for the callback and returns Shopify's sign-in address. */
export async function loginUrl(returnTo: string): Promise<string> {
  const origin = await requestOrigin();
  const state = random();
  const nonce = random();
  const verifier = random(48);
  const redirectUri = `${origin}/account/callback`;
  (await cookies()).set(OAUTH_COOKIE, JSON.stringify({ state, nonce, verifier, redirectUri, returnTo }), {
    httpOnly: true,
    secure: await secureCookies(),
    sameSite: "lax",
    path: "/account",
    maxAge: 60 * 10,
  });
  const url = new URL(`${AUTH}/oauth/authorize`);
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SCOPE,
    state,
    nonce,
    code_challenge: await sha256(verifier),
    code_challenge_method: "S256",
  }).toString();
  return url.toString();
}

/** Finishes a sign-in on /account/callback: checks state and nonce, swaps the code for tokens. Returns where to go next. */
export async function finishLogin(params: URLSearchParams): Promise<string> {
  const jar = await cookies();
  const raw = jar.get(OAUTH_COOKIE)?.value;
  jar.set(OAUTH_COOKIE, "", { path: "/account", maxAge: 0 });
  if (!raw) throw new Error("No sign-in in progress (cookie missing or expired)");
  const pending = JSON.parse(raw) as { state: string; nonce: string; verifier: string; redirectUri: string; returnTo: string };
  if (params.get("error")) throw new Error(`Shopify sign-in: ${params.get("error")} ${params.get("error_description") ?? ""}`);
  const code = params.get("code");
  if (!code || params.get("state") !== pending.state) throw new Error("Sign-in state mismatch");

  const tokens = await tokenRequest(
    { grant_type: "authorization_code", client_id: CLIENT_ID, redirect_uri: pending.redirectUri, code, code_verifier: pending.verifier },
    new URL(pending.redirectUri).origin,
  );
  const claims = tokens.id_token ? (JSON.parse(Buffer.from(tokens.id_token.split(".")[1] ?? "", "base64url").toString()) as { nonce?: string }) : {};
  if (claims.nonce !== pending.nonce) throw new Error("Sign-in nonce mismatch");
  await writeSession({ access: tokens.access_token, refresh: tokens.refresh_token, expires: Date.now() + tokens.expires_in * 1000, id: tokens.id_token ?? "" });
  return pending.returnTo;
}

async function tokenRequest(body: Record<string, string>, origin: string): Promise<Tokens> {
  const res = await fetch(`${AUTH}/oauth/token`, {
    method: "POST",
    // Shopify checks a public client's token requests against its JavaScript origins.
    headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: origin, "User-Agent": "VisNaturae" },
    body: new URLSearchParams(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify token ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as Tokens;
}

async function writeSession(s: Session) {
  const jar = await cookies();
  const secure = await secureCookies();
  jar.set(SESSION_COOKIE, JSON.stringify(s), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
  jar.set(SIGNED_IN_COOKIE, "1", { secure, sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
}

/** Signs out on this site. Returns the id token, which Shopify's logout needs to end its side too. */
export async function clearSession(): Promise<string | undefined> {
  const jar = await cookies();
  const id = readSession(jar.get(SESSION_COOKIE)?.value)?.id;
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  jar.set(SIGNED_IN_COOKIE, "", { path: "/", maxAge: 0 });
  return id || undefined;
}

/** Shopify's logout, which comes back to the home page (listed as a Logout URI); just home when there's nothing to end. */
export async function logoutUrl(idToken: string | undefined): Promise<string> {
  if (!idToken) return "/";
  return `${AUTH}/logout?${new URLSearchParams({ id_token_hint: idToken, post_logout_redirect_uri: `${await requestOrigin()}/` })}`;
}

function readSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    return s.access && s.refresh ? s : null;
  } catch {
    return null;
  }
}

/**
 * The signed-in customer's access token, refreshed when it is about to run out, or null when nobody is signed in or
 * the sign-in has lapsed (then the cookies are cleared). Only from Route Handlers, which can set cookies.
 */
export async function accessToken(): Promise<string | null> {
  const jar = await cookies();
  const session = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) {
    if (jar.get(SIGNED_IN_COOKIE)) await clearSession();
    return null;
  }
  if (session.expires - Date.now() > 60_000) return session.access;
  try {
    const t = await tokenRequest({ grant_type: "refresh_token", client_id: CLIENT_ID, refresh_token: session.refresh }, await requestOrigin());
    await writeSession({ access: t.access_token, refresh: t.refresh_token || session.refresh, expires: Date.now() + t.expires_in * 1000, id: t.id_token ?? session.id });
    return t.access_token;
  } catch (err) {
    console.error("Customer sign-in refresh failed", err);
    await clearSession();
    return null;
  }
}

export class SignedOutError extends Error {}

/** A Customer Account API call as the signed-in customer. Throws SignedOutError when Shopify no longer accepts the token. */
export async function customerApi<T>(token: string, query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: token, Origin: await requestOrigin(), "User-Agent": "VisNaturae" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (res.status === 401) {
    await clearSession();
    throw new SignedOutError("Signed out");
  }
  if (!res.ok) throw new Error(`Customer Account API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`Customer Account API: ${json.errors.map((e) => e.message).join("; ")}`);
  if (!json.data) throw new Error("Customer Account API: empty response");
  return json.data;
}

/**
 * An /api/account/* handler run as the signed-in customer: 401 { signedIn: false } when nobody is signed in or the
 * sign-in has lapsed, 502 { error: failure } when Shopify fails.
 */
export async function asCustomer(failure: string, run: (token: string) => Promise<Response>): Promise<Response> {
  const token = await accessToken();
  if (!token) return Response.json({ signedIn: false }, { status: 401 });
  try {
    return await run(token);
  } catch (err) {
    if (err instanceof SignedOutError) return Response.json({ signedIn: false }, { status: 401 });
    console.error(failure, err);
    return Response.json({ error: failure }, { status: 502 });
  }
}
