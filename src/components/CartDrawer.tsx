"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { site } from "@/data/site";
import { editionLabel, editionKindLabel, isOneOfOne, productImages } from "@/data/products";
import { lineKey, rememberCheckout } from "@/lib/cart";
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
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.lines.map(({ slug, size }) => ({ slug, size })) }),
      });
      const data = (await res.json()) as { url?: string; cartId?: string; error?: string; soldOut?: string[] };
      if (!res.ok || !data.url) {
        // A piece that sold while it sat in the bag is removed so the rest can proceed.
        if (data.soldOut?.length) cart.removeMany(data.soldOut);
        throw new Error(data.error ?? "Checkout failed. Please try again.");
      }
      // Shopify's checkout doesn't come back here, so remember it and empty the bag once it becomes an order.
      if (data.cartId) rememberCheckout(data.cartId);
      window.location.assign(data.url);
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
            <p className="text-sm text-ink-2 max-w-xs">Every design is released once, in a numbered edition. Claim a number and it is made for you.</p>
            <Link href="/shop" onClick={cart.close} className="btn btn-primary">
              See what is available
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
                          {editionLabel(l.product)} · {l.product.colour.name} · Size {l.size}
                        </p>
                      </div>
                      <p className="text-sm tabular-nums">{formatPrice(l.product.price)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="eyebrow !text-red">{editionKindLabel(l.product)}</span>
                      <button type="button" className="eyebrow link-underline" onClick={() => cart.remove({ slug: l.slug, size: l.size })}>
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
                  <span className="text-ink font-medium">{formatPrice(cart.pledge)}</span> of this order goes to conservation.{" "}
                  {cart.lines.some((l) => !isOneOfOne(l.product))
                    ? `Edition pieces are made together once orders close and ship ${leadTimeLabel()} later.`
                    : `One-of-one pieces already exist and ship within ${site.oneOfOneDispatchDays} working days.`}{" "}
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
