"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getProduct, type Product } from "@/data/products";
import { site } from "@/data/site";
import { pledgeCents } from "@/lib/pledge";

/** A bag line is one unit of a design in one size. The same design in two sizes is two lines. */
export type CartLine = { slug: string; size: string };

export const lineKey = (l: CartLine) => `${l.slug}:${l.size}`;

export type CartLineView = CartLine & { product: Product };

type CartContextValue = {
  lines: CartLineView[];
  count: number;
  subtotal: number;
  shipping: number;
  pledge: number;
  total: number;
  isOpen: boolean;
  hydrated: boolean;
  /** Is this design in the bag (in any size, or in the given size)? */
  has: (slug: string, size?: string) => boolean;
  add: (line: CartLine) => void;
  remove: (line: CartLine) => void;
  removeMany: (slugs: string[]) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "vis-naturae-cart-v3";
const CHECKOUT_KEY = "vis-naturae-checkout";

/** The Shopify cart a checkout was started from. Shopify doesn't redirect back, so we ask about it later. */
export function rememberCheckout(cartId: string) {
  try {
    window.localStorage.setItem(CHECKOUT_KEY, cartId);
  } catch {
    // Storage unavailable: the bag just isn't emptied automatically.
  }
}

/* ---------- Tiny external store (persisted to localStorage) ---------- */

type State = { lines: CartLine[]; isOpen: boolean };

const EMPTY: State = { lines: [], isOpen: false };
let state: State | null = null; // null until first client read
const listeners = new Set<() => void>();

function load(): State {
  if (state) return state;
  let lines: CartLine[] = [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) {
        lines = (parsed as CartLine[]).filter((l) => l && typeof l.slug === "string" && getProduct(l.slug) && typeof l.size === "string");
      }
    }
  } catch {
    // Storage unavailable or corrupt: start with an empty bag.
  }
  state = { lines, isOpen: false };
  return state;
}

function set(next: Partial<State>) {
  const prev = load();
  state = { ...prev, ...next };
  if (next.lines) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Ignore storage failures (private mode, quota).
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => load();
const getServerSnapshot = () => EMPTY;

/* ---------- React bindings ---------- */

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Empty the bag once the checkout it went to has become an order.
  useEffect(() => {
    if (!hydrated) return;
    let cartId: string | null = null;
    try {
      cartId = window.localStorage.getItem(CHECKOUT_KEY);
    } catch {
      return;
    }
    if (!cartId) return;
    let cancelled = false;
    fetch(`/api/checkout/status?cart=${encodeURIComponent(cartId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ ordered: boolean }>) : null))
      .then((res) => {
        if (cancelled || !res?.ordered) return;
        set({ lines: [] });
        try {
          window.localStorage.removeItem(CHECKOUT_KEY);
        } catch {
          // ignore
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  const add = useCallback((line: CartLine) => {
    const { lines } = load();
    // One unit per design per size. Re-adding the same size just opens the bag.
    const next = lines.some((l) => lineKey(l) === lineKey(line)) ? lines : [...lines, line];
    set({ lines: next, isOpen: true });
  }, []);

  const remove = useCallback((line: CartLine) => set({ lines: load().lines.filter((l) => lineKey(l) !== lineKey(line)) }), []);
  const removeMany = useCallback((slugs: string[]) => set({ lines: load().lines.filter((l) => !slugs.includes(l.slug)) }), []);
  const clear = useCallback(() => set({ lines: [] }), []);
  const open = useCallback(() => set({ isOpen: true }), []);
  const close = useCallback(() => set({ isOpen: false }), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLineView[] = [];
    for (const l of snap.lines) {
      const product = getProduct(l.slug);
      if (product) lines.push({ ...l, product });
    }
    const subtotal = lines.reduce((s, l) => s + l.product.price, 0);
    const shipping = subtotal === 0 || subtotal >= site.freeShippingThresholdCents ? 0 : site.flatShippingCents;
    const pledge = lines.reduce((s, l) => s + pledgeCents(l.product.price), 0);
    return {
      lines,
      count: lines.length,
      subtotal,
      shipping,
      pledge,
      total: subtotal + shipping,
      isOpen: snap.isOpen,
      hydrated,
      has: (slug, size) => lines.some((l) => l.slug === slug && (size === undefined || l.size === size)),
      add,
      remove,
      removeMany,
      clear,
      open,
      close,
    };
  }, [snap, hydrated, add, remove, removeMany, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
