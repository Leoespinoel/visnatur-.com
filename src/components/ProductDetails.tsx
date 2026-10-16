"use client";

import Link from "next/link";
import { useState } from "react";
import { designNumber, siblingsOf, type Product } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { useCart } from "@/lib/cart";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { CheckIcon, ChevronIcon, LeafIcon } from "./Icons";
import { WishlistButton } from "./WishlistButton";

export function ProductDetails({ product }: { product: Product }) {
  const { add, has, open } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [sizeError, setSizeError] = useState(false);
  const inBag = size ? has(product.slug, size) : false;

  function addToBag() {
    if (!size) {
      setSizeError(true);
      return;
    }
    add({ slug: product.slug, size });
  }

  const madeToMeasure = product.garment === "trouser";

  return (
    <div className="flex flex-col gap-7">
      {/* Design number, making time and colour (fixed: each design is one colourway) */}
      <dl className="grid grid-cols-3 gap-4 border-y border-line py-4 text-sm">
        <div>
          <dt className="eyebrow mb-1.5">Design</dt>
          <dd className="font-medium">{designNumber(product)}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-1.5">Ships in</dt>
          <dd className="font-medium">{leadTimeLabel()}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-1.5">Colour</dt>
          <dd className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: product.colour.hex }} />
            {product.colour.name}
          </dd>
        </div>
      </dl>

      {/* Other colourways */}
      {siblingsOf(product).length > 1 && (
        <div>
          <p className="eyebrow mb-3">Also in</p>
          <ul className="flex flex-wrap gap-2">
            {siblingsOf(product).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/product/${c.slug}`}
                  title={c.colour.name}
                  aria-label={c.colour.name}
                  aria-current={c.slug === product.slug ? "page" : undefined}
                  className={`block h-7 w-7 rounded-full border transition-transform hover:scale-110 ${c.slug === product.slug ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper" : "border-line"}`}
                  style={{ backgroundColor: c.colour.hex }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Size: every piece is cut to the buyer's size */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <p className="eyebrow">{product.sizes.length === 1 ? "Size" : "Made in your size"}</p>
          <a href="/made-to-order#sizing" className="text-xs text-ink-2 link-underline">
            Size guide
          </a>
        </div>
        <ul className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <li key={s}>
              <button
                type="button"
                aria-pressed={size === s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={`min-w-12 border px-3 py-2.5 text-xs transition-colors ${
                  size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        {sizeError && (
          <p role="alert" className="mt-2 text-xs text-red">
            Choose a size first.
          </p>
        )}
        {madeToMeasure && <p className="mt-2 text-xs text-muted">Tell us your inseam at checkout and we hem it for you at no extra cost.</p>}
      </div>

      {/* The bag button, with the wishlist heart beside it */}
      <div className="flex gap-2">
        {!isAvailable(product) ? (
          <button type="button" disabled className="btn btn-outline flex-1">
            Coming soon
          </button>
        ) : inBag ? (
          <button type="button" onClick={open} className="btn btn-outline flex-1">
            In your bag · view
          </button>
        ) : (
          <button type="button" onClick={addToBag} className="btn btn-primary flex-1">
            Add to bag · {formatPrice(product.price)}
          </button>
        )}
        <WishlistButton slug={product.slug} name={`${product.name} in ${product.colour.name}`} className="btn btn-outline w-12 !px-0" />
      </div>

      {/* Made-to-order notes */}
      <ul className="space-y-2.5 border-y border-line py-5 text-xs text-ink-2">
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          Made to order. Nothing is cut until you order it.
        </li>
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          Cut and sewn in your size in Mauritius. Ships {leadTimeLabel()} after you order.
        </li>
        <li className="flex gap-2.5">
          <LeafIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {formatPrice(pledgeCents(product.price))} of this price ({pledgePercentLabel()}) goes to conservation.
        </li>
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          Free repairs for life. Remade in the right size within 14 days.
        </li>
      </ul>

      {/* Accordion */}
      <div className="divide-y divide-line border-b border-line">
        <Row title="Details">
          <ul className="list-disc space-y-1 pl-4">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Row>
        <Row title="Fabric">{product.fabric}.</Row>
        <Row title="Care">{product.care}</Row>
        <Row title="Made to order & returns">
          Nothing is made in advance. Your piece is cut and sewn in a small workshop in Mauritius after you order, in the size you choose, and ships{" "}
          {leadTimeLabel()} later. Because it is made for you, we offer a remake in the right size within 14 days of delivery and free repairs for the
          life of the garment. Refunds are available if we have made a mistake. See the full <a href="/legal/returns" className="underline">returns policy</a>.
        </Row>
      </div>
    </div>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group py-4">
      <summary className="flex items-center justify-between">
        <span className="eyebrow !text-ink">{title}</span>
        <ChevronIcon className="transition-transform group-open:rotate-180" width={16} height={16} />
      </summary>
      <div className="pt-4 text-sm leading-relaxed text-ink-2">{children}</div>
    </details>
  );
}
