"use client";

import { useCallback, useSyncExternalStore } from "react";
import { cleanSizes, hasSizes, type MySizes } from "./sizes-core";

export { BOTTOM_SIZES, MEASURE_RANGES, SIZES_NOTE_MAX, TOP_SIZES, cleanSizes, hasSizes, sizesSummary } from "./sizes-core";
export type { MeasureField, MySizes } from "./sizes-core";

/** The browser copy of My sizes (src/lib/sizes-core.ts). */
const STORAGE_KEY = "vis-naturae-sizes-v1";
const EMPTY: MySizes = {};
let current: MySizes | null = null; // null until first client read
const listeners = new Set<() => void>();

function load(): MySizes {
  if (current) return current;
  current = {};
  try {
    current = cleanSizes(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}"));
  } catch {
    // Storage unavailable or corrupt: start empty.
  }
  return current;
}

/** The saved sizes, read outside React (checkout). */
export function readSizes(): MySizes {
  return typeof window === "undefined" ? EMPTY : load();
}

/** Replaces the browser copy, e.g. with the copy on the account (src/lib/account-sync.tsx). */
export function writeSizes(next: MySizes) {
  current = next;
  try {
    if (hasSizes(next)) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures (private mode, quota).
  }
  listeners.forEach((l) => l());
}

export function subscribeSizes(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    current = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useMySizes() {
  const sizes = useSyncExternalStore(subscribeSizes, load, () => EMPTY);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const save = useCallback((next: MySizes) => writeSizes({ ...cleanSizes(next), updated: new Date().toISOString().slice(0, 10) }), []);
  const clear = useCallback(() => writeSizes({}), []);
  return { sizes, hydrated, save, clear };
}
