"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { cleanSizes, hasSizes, readSizes, subscribeSizes, writeSizes, type MySizes } from "./sizes";
import { readWishlist, subscribeWishlist, writeWishlist } from "./wishlist";

/**
 * Keeps My sizes and the wishlist on the customer's account while they are signed in (src/lib/customer-account.ts,
 * /api/account). The pages keep using the browser copies; on each page load this brings the account's copies into them,
 * then sends every change back. The first time a customer signs in on a browser, what they saved there before is added
 * to the account. Signing out empties the browser copies (they are on the account).
 */
export type Account = { status: "unknown" | "signed-out" | "signed-in"; firstName?: string; email?: string };

/** The customer whose copies this browser holds, once they have been merged into the account. */
const SYNCED_KEY = "vis-naturae-account-v1";
const UNKNOWN: Account = { status: "unknown" };

let account: Account = UNKNOWN;
const listeners = new Set<() => void>();
let started = false;
/** True while the account's copies are written into the browser, so they aren't sent straight back. */
let applying = false;
/** After signing out (or the sign-in lapsing): nothing more is sent. */
let stopped = false;

function setAccount(next: Account) {
  account = next;
  if (next.status === "signed-out") stopped = true;
  listeners.forEach((l) => l());
}

const signedInCookie = () => /(?:^|;\s*)vn_signed_in=1(?:;|$)/.test(document.cookie);

function storage(key: string, value?: string | null): string | null {
  try {
    if (value === undefined) return window.localStorage.getItem(key);
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: syncing still works for this page load.
  }
  return null;
}

async function save(body: { sizes?: MySizes; wishlist?: string[] }): Promise<boolean> {
  if (stopped) return false;
  try {
    const res = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true });
    if (res.status === 401) setAccount({ status: "signed-out" });
    return res.ok;
  } catch {
    // Offline: the browser copy still has it, and it goes up with the next change.
    return false;
  }
}

function debounce(fn: () => void, ms = 600) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

type Remote = { signedIn: boolean; id?: string; firstName?: string; email?: string; sizes?: MySizes; wishlist?: string[] };

async function start() {
  if (started) return;
  started = true;
  if (!signedInCookie()) return setAccount({ status: "signed-out" });

  // Changes made from here on go to the account once it has been read; ones made while it loads also win the merge.
  let ready = false;
  const changed = { sizes: false, wishlist: false };
  const sendSizesSoon = debounce(() => void save({ sizes: readSizes() }));
  const sendWishlistSoon = debounce(() => void save({ wishlist: readWishlist() }));
  subscribeSizes(() => {
    if (applying || stopped) return;
    if (ready) sendSizesSoon();
    else changed.sizes = true;
  });
  subscribeWishlist(() => {
    if (applying || stopped) return;
    if (ready) sendWishlistSoon();
    else changed.wishlist = true;
  });

  let remote: Remote;
  try {
    const res = await fetch("/api/account", { cache: "no-store" });
    remote = (await res.json()) as Remote;
    if (!res.ok) throw new Error(`/api/account ${res.status}`);
  } catch (err) {
    // Signed in, but the account couldn't be read: keep to the browser copies for this page load.
    console.error(err);
    stopped = true;
    return setAccount({ status: "signed-in" });
  }
  if (!remote.signedIn || !remote.id) return setAccount({ status: "signed-out" });

  const first = storage(SYNCED_KEY) !== remote.id;
  const [rs, rw] = [cleanSizes(remote.sizes), remote.wishlist ?? []];
  const [ls, lw] = [readSizes(), readWishlist()];

  // Sizes: the newer copy wins (the account's on a tie). On a browser's first sign-in, sizes saved only here go up;
  // after that, sizes missing from the account were cleared on another device.
  let sizes = rs;
  let sendSizes = false;
  if (changed.sizes || (hasSizes(ls) && (hasSizes(rs) ? (ls.updated ?? "") > (rs.updated ?? "") : first))) {
    sizes = ls;
    sendSizes = true;
  }
  // Wishlist: the account's list, plus (on a first sign-in, or tapped while it loaded) anything saved here.
  const wishlist = first || changed.wishlist ? [...rw, ...lw.filter((s) => !rw.includes(s))] : rw;
  const sendWishlist = wishlist.length !== rw.length;

  applying = true;
  writeSizes(sizes);
  writeWishlist(wishlist);
  applying = false;
  setAccount({ status: "signed-in", firstName: remote.firstName, email: remote.email });

  // Only marked as merged once the account has everything, so nothing saved here can be lost to a failed save.
  ready = true;
  if (!(sendSizes || sendWishlist) || (await save({ ...(sendSizes && { sizes }), ...(sendWishlist && { wishlist }) }))) storage(SYNCED_KEY, remote.id);
}

/** Before the Sign out form posts: stop syncing and empty the browser copies, which are on the account. */
export function signOutLocally() {
  stopped = true;
  applying = true;
  writeSizes({});
  writeWishlist([]);
  applying = false;
  storage(SYNCED_KEY, null);
}

/** A change made on /account/profile (the name the account page greets with), or the sign-in found to have lapsed. */
export function updateAccount(next: Partial<Account>) {
  setAccount({ ...account, ...next });
}

/**
 * Data from an /api/account/* route for the signed-in customer, e.g. their orders. A 401 means the sign-in has lapsed,
 * which signs the page out.
 */
export function useAccountData<T>(url: string) {
  const [state, setState] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  const load = useCallback(
    () =>
      fetch(url, { cache: "no-store" })
        .then(async (res) => {
          const json = (await res.json()) as T & { error?: string };
          if (res.status === 401) return setAccount({ status: "signed-out" });
          if (!res.ok) throw new Error(json.error);
          setState({ data: json, loading: false });
        })
        .catch((err: Error) => setState({ error: err.message || "Something went wrong. Please try again.", loading: false })),
    [url],
  );
  useEffect(() => {
    void load();
  }, [load]);
  return { ...state, reload: load };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Who is signed in: "unknown" until the page has checked. */
export function useAccount(): Account {
  return useSyncExternalStore(subscribe, () => account, () => UNKNOWN);
}

/** Mounted once in the root layout. */
export function AccountSync() {
  useEffect(() => {
    void start();
  }, []);
  return null;
}
