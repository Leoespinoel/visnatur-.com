"use client";

import { useCart } from "@/lib/cart";

export function OpenBagButton() {
  const { open } = useCart();
  return (
    <button type="button" onClick={open} className="btn btn-primary">
      Open my bag
    </button>
  );
}
