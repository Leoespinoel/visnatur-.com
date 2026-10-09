"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Empties the bag once the customer lands on the success page. */
export function ClearCart() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
