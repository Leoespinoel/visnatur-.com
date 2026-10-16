"use client";

import { useEffect } from "react";

/**
 * Paints the page behind /v2 black (the ticker and footer are black, so overscroll matches) while a V2 page is
 * showing. An effect rather than a `body:has(.v2)` rule: Next keeps the last route mounted but hidden after
 * navigating away, so the .v2 wrapper can still be in the DOM on a classic page; hidden routes run their
 * effect cleanups, which hands the background back.
 */
export function V2BodyTone() {
  useEffect(() => {
    const body = document.body.style;
    const before = body.background;
    body.background = "#0d0d0d";
    return () => {
      body.background = before;
    };
  }, []);
  return null;
}
