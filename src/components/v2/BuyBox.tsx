"use client";

import Link from "next/link";
import { useState } from "react";
import { canMadeToOrder, designNumber, siblingsOf, type Product } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { site } from "@/data/site";
import { v2Href } from "@/data/v2";
import { useCart } from "@/lib/cart";
import { dispatchLabel, formatPrice, madeToOrderLabel, transitLabel } from "@/lib/format";

/**
 * The V2 buy box: colourways, square size boxes and one big button. Same rules as the classic ProductDetails:
 * pick a size first, one per design per size, and pieces that aren't on sale yet can't go in the bag. Made to order
 * (a Signature piece adjusted to fit) is chosen on the classic product page; here it is only pointed to.
 */
export function V2BuyBox({ product }: { product: Product }) {
  const { add, has, open } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [sizeError, setSizeError] = useState(false);
  const inBag = size ? has(product.slug, size) : false;
  const colours = siblingsOf(product);
  const available = isAvailable(product);
  const madeToOrder = canMadeToOrder(product);
  const surcharge = formatPrice(site.delivery.madeToOrderSurchargeCents);

  function addToBag() {
    if (!size) {
      setSizeError(true);
      return;
    }
    add({ slug: product.slug, size });
  }

  return (
    <div className="flex flex-col">
      {colours.length > 1 && (
        <div className="border-b-[1.5px] border-ink py-4">
          <p className="v2-mono mb-3">
            Colour: <span className="text-muted">{product.colour.name}</span>
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {colours.map((c) => (
              <li key={c.slug}>
                <Link
                  href={v2Href.product(c.slug)}
                  title={c.colour.name}
                  aria-label={c.colour.name}
                  aria-current={c.slug === product.slug ? "page" : undefined}
                  className={`block h-9 w-9 border-[1.5px] transition-transform hover:-translate-y-0.5 ${
                    c.slug === product.slug ? "border-ink outline-2 outline-offset-2 outline-ink" : "border-ink/30"
                  }`}
                  style={{ backgroundColor: c.colour.hex }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-b-[1.5px] border-ink py-4">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="v2-mono">{product.sizes.length === 1 ? "Size" : "Size: pick yours"}</p>
          <a href="/made-to-order#sizing" className="v2-mono text-muted underline underline-offset-4 hover:text-ink">
            Size guide
          </a>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {product.sizes.map((s) => (
            <li key={s}>
              <button
                type="button"
                aria-pressed={size === s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={`v2-wide h-12 min-w-12 border-[1.5px] border-ink px-3 text-[0.75rem] transition-colors ${
                  size === s ? "bg-ink text-paper" : "bg-paper hover:bg-white"
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        {sizeError && (
          <p role="alert" className="v2-mono mt-2 text-red">
            Pick a size first.
          </p>
        )}
        {product.garment === "trouser" && madeToOrder && (
          <p className="v2-mono mt-2 text-muted">
            Another inseam?{" "}
            <a href={`/product/${product.slug}`} className="underline underline-offset-4 hover:text-ink">
              Made to order
            </a>
            , {surcharge} more.
          </p>
        )}
      </div>

      <div className="py-4">
        {!available ? (
          <button type="button" disabled className="v2-btn w-full !min-h-16 !text-base">
            Coming soon
          </button>
        ) : inBag ? (
          <button type="button" onClick={open} className="v2-btn v2-btn-outline w-full !min-h-16 !text-base">
            In your bag · view
          </button>
        ) : (
          <button type="button" onClick={addToBag} className="v2-btn v2-btn-red w-full !min-h-16 !text-base">
            Add to bag · {formatPrice(product.price)}
          </button>
        )}
      </div>

      {/* Facts as a stamped list */}
      <ul className="v2-mono grid grid-cols-2 border-l-[1.5px] border-t-[1.5px] border-ink">
        {[
          ["Design", designNumber(product)],
          ["Ships in", dispatchLabel()],
          ["Repairs", "Free, for life"],
        ].map(([k, v]) => (
          <li key={k} className="border-b-[1.5px] border-r-[1.5px] border-ink p-3">
            <span className="block text-muted">{k}</span>
            <span className="mt-1 block !text-[0.8rem] font-bold">{v}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t-[1.5px] border-ink">
        <Row title="Details">
          <ul className="list-disc space-y-1 pl-4">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Row>
        <Row title="Fabric">{product.fabric}.</Row>
        <Row title="Care">{product.care}</Row>
        <Row title="Delivery & returns">
          In stock in Mauritius. It leaves within {dispatchLabel()}, then {transitLabel()} express to Europe, free over{" "}
          {formatPrice(site.freeShippingThresholdCents)}. Exchange or return it within 14 days of delivery, unworn and unwashed. Repairs free, for life.{" "}
          {madeToOrder ? (
            <>
              <a href="/made-to-order" className="underline underline-offset-4">
                Made to order
              </a>
              : the sleeves, length or fit adjusted, {surcharge} more, ready in {madeToOrderLabel()}. Choose it on the{" "}
              <a href={`/product/${product.slug}`} className="underline underline-offset-4">
                classic product page
              </a>
              .
            </>
          ) : (
            "Limited edition pieces sell as they are, so no made to order."
          )}{" "}
          Full{" "}
          <a href="/legal/returns" className="underline underline-offset-4">
            returns policy
          </a>
          .
        </Row>
      </div>
    </div>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b-[1.5px] border-ink">
      <summary className="v2-wide flex cursor-pointer list-none items-center justify-between py-4 text-[0.8rem]">
        {title}
        <span aria-hidden="true" className="v2-mono !text-base transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-ink-2">{children}</div>
    </details>
  );
}
