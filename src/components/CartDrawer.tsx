"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { dispatchLabel, formatPrice, madeToOrderLabel } from "@/lib/format";
import { adjustSummary } from "@/lib/adjust";
import { pledgePercentLabel } from "@/lib/pledge";
import { site } from "@/data/site";
import { designNumber, productImages } from "@/data/products";
import { lineKey, lineSurcharge } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";
import { CloseIcon, LeafIcon } from "./Icons";

export function CartDrawer() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cart.isOpen, cart.close, cart]);

  // Back button from Shopify's checkout restores this page from cache with the button still busy.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      await startCheckout(cart.lines, cart.removeMany);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
      setBusy(false);
    }
  }

  const remaining = site.freeShippingThresholdCents - cart.subtotal;

  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? "" : "pointer-events-none"}`} aria-hidden={!cart.isOpen}>
      <button
        type="button"
        aria-label="Close bag"
        onClick={cart.close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${cart.isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 h-16">
          <h2 className="eyebrow !text-ink">
            Bag <span className="text-muted">({cart.count})</span>
          </h2>
          <button type="button" onClick={cart.close} aria-label="Close bag" className="-mr-2 p-2">
            <CloseIcon />
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
            <p className="font-serif text-3xl">Your bag is empty.</p>
            <p className="text-sm text-ink-2 max-w-xs">The Signature line is in stock and ships in days. Any Signature piece can be made to order, adjusted to fit.</p>
            <Link href="/shop" onClick={cart.close} className="btn btn-primary">
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 divide-y divide-line">
              {cart.lines.map((l) => (
                <li key={lineKey(l)} className="flex gap-4 py-5">
                  <Link href={`/product/${l.product.slug}`} onClick={cart.close} className="image-frame w-20 shrink-0 aspect-[4/5]">
                    <Image src={productImages(l.product)[0]} alt="" fill unoptimized sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${l.product.slug}`} onClick={cart.close} className="font-serif text-lg leading-tight">
                          {l.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {designNumber(l.product)} · {l.product.colour.name} · Size {l.size}
                        </p>
                        {l.adjust && (
                          <p className="mt-1 text-xs text-ink-2">
                            {adjustSummary(l.adjust) || "As cut"} · incl. {formatPrice(lineSurcharge(l))} made to order
                          </p>
                        )}
                      </div>
                      <p className="text-sm tabular-nums">{formatPrice(l.product.price + lineSurcharge(l))}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="eyebrow !text-red">{l.adjust ? `Made to order · ${madeToOrderLabel()}` : `Ships in ${dispatchLabel()}`}</span>
                      <button type="button" className="eyebrow link-underline" onClick={() => cart.remove(l)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-6 py-5 space-y-4">
              <div className="flex items-start gap-3 bg-surface border border-line p-3">
                <LeafIcon className="text-red shrink-0 mt-0.5" width={18} height={18} />
                <p className="text-xs text-ink-2 leading-relaxed">
                  <span className="text-ink font-medium">{formatPrice(cart.pledge)}</span> of this order goes to conservation. Signature and collection pieces
                  leave Mauritius within {dispatchLabel()}; made to order pieces ship {madeToOrderLabel()} after the order.
                </p>
              </div>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-2">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Shipping</dt>
                  <dd className="tabular-nums">{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
                </div>
                {remaining > 0 && <p className="text-xs text-muted">Add {formatPrice(remaining)} for free shipping across Europe.</p>}
                <div className="flex justify-between border-t border-line pt-2 font-medium">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPrice(cart.total)}</dd>
                </div>
              </dl>
              {error && (
                <p role="alert" className="text-xs text-red">
                  {error}
                </p>
              )}
              <button type="button" onClick={checkout} disabled={busy} className="btn btn-primary w-full">
                {busy ? "Redirecting to checkout…" : "Checkout"}
              </button>
              <p className="text-center text-[11px] text-muted">
                Secure checkout by Shopify · {pledgePercentLabel()} pledged on every order
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
