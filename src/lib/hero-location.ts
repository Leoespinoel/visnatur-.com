"use client";

import { useSyncExternalStore } from "react";

/**
 * The coordinates of the hero slide on screen, which the header shows under the wordmark. A hero slider
 * sets them as its slides change and clears them when it goes.
 */
let coords: string | undefined;
const listeners = new Set<() => void>();

export function setHeroCoords(next: string | undefined) {
  coords = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const useHeroCoords = () => useSyncExternalStore(subscribe, () => coords, () => undefined);
