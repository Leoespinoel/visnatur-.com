"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { designNumber, productImages } from "@/data/products";
import { site } from "@/data/site";
import { v2Href } from "@/data/v2";
import { lineKey, useCart } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";

/** The V2 bag: same cart and checkout as the classic drawer, in the V2 look. */
export function V2CartDrawer() {
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
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-200 ${cart.isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-[1.5px] border-ink bg-paper transition-transform duration-200 ease-out ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-14 items-stretch border-b-[1.5px] border-ink md:h-16">
          <h2 className="v2-display flex items-center px-4 text-[2.2rem]">
            Bag <span className="ml-2 text-red">({cart.count})</span>
          </h2>
          <button type="button" onClick={cart.close} className="v2-wide ml-auto border-l-[1.5px] border-ink px-5 text-[0.8rem] hover:bg-ink hover:text-paper">
            Close
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
            <p className="v2-display text-[4.5rem]">Empty.</p>
            <p className="max-w-xs text-sm text-ink-2">Nothing gets made until you order it. Pick a piece and a size and we cut it for you.</p>
            <Link href={v2Href.shop} onClick={cart.close} className="v2-btn">
              Shop everything
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y-[1.5px] divide-ink overflow-y-auto">
              {cart.lines.map((l) => (
                <li key={lineKey(l)} className="flex gap-4 p-4">
                  <Link href={v2Href.product(l.product.slug)} onClick={cart.close} className="relative aspect-[4/5] w-20 shrink-0 border-[1.5px] border-ink bg-white">
                    <Image src={productImages(l.product)[0]} alt="" fill unoptimized sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={v2Href.product(l.product.slug)} onClick={cart.close} className="v2-wide text-[0.85rem] leading-tight hover:text-red">
                          {l.product.name}
                        </Link>
                        <p className="v2-mono mt-1 text-muted">
                          {designNumber(l.product)} · {l.product.colour.name} · {l.size}
                        </p>
                      </div>
                      <p className="v2-mono !text-sm">{formatPrice(l.product.price)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="v2-mono text-red">Made to order</span>
                      <button type="button" className="v2-mono underline underline-offset-4 hover:text-red" onClick={() => cart.remove({ slug: l.slug, size: l.size })}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t-[1.5px] border-ink p-4">
              <p className="bg-ink p-3 text-xs leading-relaxed text-paper">
                <span className="font-bold text-red">{formatPrice(cart.pledge)}</span> of this order goes to the wild. We cut each piece in your size
                after you order and ship it {leadTimeLabel()} later.
              </p>
              <dl className="v2-mono space-y-1.5 !text-[0.75rem]">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
                </div>
                {remaining > 0 && <p className="text-muted">Add {formatPrice(remaining)} for free shipping in Europe.</p>}
                <div className="flex justify-between border-t-[1.5px] border-ink pt-2 font-bold">
                  <dt>Total</dt>
                  <dd>{formatPrice(cart.total)}</dd>
                </div>
              </dl>
              {error && (
                <p role="alert" className="v2-mono text-red">
                  {error}
                </p>
              )}
              <button type="button" onClick={checkout} disabled={busy} className="v2-btn v2-btn-red w-full !min-h-14 !text-base">
                {busy ? "Off to checkout…" : "Checkout"}
              </button>
              <p className="v2-mono text-center text-muted">
                Secure checkout by Shopify · {pledgePercentLabel()} on every order
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
