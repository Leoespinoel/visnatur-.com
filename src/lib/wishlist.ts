"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getProduct } from "@/data/products";

/**
 * The wishlist: the colourways saved with the heart, newest first. It lives in this browser only (the Shopify
 * account has nowhere to keep it), so it survives reloads but not another device.
 */
const STORAGE_KEY = "vis-naturae-wishlist-v1";

const EMPTY: string[] = [];
let slugs: string[] | null = null; // null until first client read
const listeners = new Set<() => void>();

function load(): string[] {
  if (slugs) return slugs;
  slugs = [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    if (Array.isArray(parsed)) slugs = parsed.filter((s): s is string => typeof s === "string" && !!getProduct(s));
  } catch {
    // Storage unavailable or corrupt: start with an empty list.
  }
  return slugs;
}

function save(next: string[]) {
  slugs = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures (private mode, quota): the list still works until the page closes.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // A heart tapped in another tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    slugs = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useWishlist() {
  const list = useSyncExternalStore(subscribe, load, () => EMPTY);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const toggle = useCallback((slug: string) => {
    const now = load();
    save(now.includes(slug) ? now.filter((s) => s !== slug) : [slug, ...now]);
  }, []);
  return { slugs: list, hydrated, has: (slug: string) => list.includes(slug), toggle };
}
