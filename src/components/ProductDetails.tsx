"use client";

import Link from "next/link";
import { useState } from "react";
import { editionLabel, editionKindLabel, isOneOfOne, siblingsOf, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { dispatchLabel, dropOf, formatDropDate, remainingLabel, windowLabel, type Availability, type Inventory } from "@/lib/editions";
import { site } from "@/data/site";
import { CheckIcon, ChevronIcon, LeafIcon } from "./Icons";

export function ProductDetails({ product, availability, inventory }: { product: Product; availability: Availability; inventory: Inventory }) {
  const { add, has, open } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [sizeError, setSizeError] = useState(false);
  const single = isOneOfOne(product);
  const drop = dropOf(product);
  const inBag = size ? has(product.slug, size) : false;
  const finished = availability.state === "sold" || availability.state === "closed";

  function claim() {
    if (!size) {
      setSizeError(true);
      return;
    }
    add({ slug: product.slug, size });
  }

  const madeToMeasure = product.garment === "trouser";

  return (
    <div className="flex flex-col gap-7">
      {/* Design number, edition and colour (fixed: the piece exists in one colourway) */}
      <dl className="grid grid-cols-3 gap-4 border-y border-line py-4 text-sm">
        <div>
          <dt className="eyebrow mb-1.5">Design</dt>
          <dd className="font-medium">{editionLabel(product)}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-1.5">Edition</dt>
          <dd className="font-medium">{single ? "1 of 1" : remainingLabel(product, availability)}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-1.5">Colour</dt>
          <dd className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: product.colour.hex }} />
            {product.colour.name}
          </dd>
        </div>
      </dl>

      {/* Other colourways: each is its own numbered edition */}
      {siblingsOf(product).length > 1 && (
        <div>
          <p className="eyebrow mb-3">Also in · each colour is its own edition</p>
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

      {availability.state === "sold" ? (
        <div className="space-y-3">
          <p className="eyebrow !text-red">{single ? "Sold" : "Sold out"}</p>
          <p className="text-sm leading-relaxed text-ink-2">
            {single
              ? "This piece has found its owner. It was the only one and the design is retired."
              : `All ${availability.total} units are spoken for. The edition is being made for the people who claimed it and the design is retired.`}
          </p>
        </div>
      ) : availability.state === "closed" ? (
        <div className="space-y-3">
          <p className="eyebrow !text-red">Orders closed</p>
          <p className="text-sm leading-relaxed text-ink-2">
            The window for this edition closed on {formatDropDate(drop.closes)} with {availability.sold} of {availability.total} claimed. Those are being made
            now and the design will not reopen.
          </p>
        </div>
      ) : availability.state === "upcoming" ? (
        <div className="space-y-3">
          <p className="eyebrow !text-red">{drop.name} opens {formatDropDate(drop.opens)}</p>
          <p className="text-sm leading-relaxed text-ink-2">
            Orders open on {formatDropDate(drop.opens)} and close on {formatDropDate(drop.closes)}.{" "}
            {single ? "It is one of one." : `${availability.total} will be made.`}
          </p>
        </div>
      ) : (
        <>
          {/* Size: an edition unit is cut to the buyer's size; a one-of-one is already made in one */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="eyebrow">{single ? "Made in one size" : product.sizes.length === 1 ? "Size" : "Made in your size"}</p>
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
            {single && <p className="mt-2 text-xs text-muted">This garment already exists, in this size only. If it is not yours, write to us about the next one.</p>}
            {madeToMeasure && <p className="mt-2 text-xs text-muted">Tell us your inseam at checkout and we hem it for you at no extra cost.</p>}
          </div>

          {availability.state === "reserved" && (
            <p className="border border-line bg-surface p-3 text-xs leading-relaxed text-ink-2">
              {single ? "Someone is at checkout with this piece" : "The last units are at checkout with other people"} right now. If they don&apos;t complete within{" "}
              {site.reservationMinutes} minutes they become available again. You can still add it to your bag and try.
            </p>
          )}

          {!single && (
            <p className="text-xs text-ink-2">
              <span className="font-medium text-ink">{windowLabel(drop, inventory.now)}.</span> Your number in the edition is assigned in order of payment.
            </p>
          )}

          {inBag ? (
            <button type="button" onClick={open} className="btn btn-outline w-full">
              In your bag · view
            </button>
          ) : (
            <button type="button" onClick={claim} className="btn btn-primary w-full">
              {single ? "Claim this piece" : "Claim your number"} · {formatPrice(product.price)}
            </button>
          )}
        </>
      )}

      {/* Made-to-order notes */}
      <ul className="space-y-2.5 border-y border-line py-5 text-xs text-ink-2">
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {single ? "One of one. The only garment of this design that will ever exist." : `${editionKindLabel(product)}. Released once, numbered, then the design is retired.`}
        </li>
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {finished ? (single ? "Was made in a small workshop in Mauritius." : `Made as one batch in Mauritius, ${leadTimeLabel()} after orders closed.`) : dispatchLabel(product)}
        </li>
        <li className="flex gap-2.5">
          <LeafIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {formatPrice(pledgeCents(product.price))} of this price ({pledgePercentLabel()}) goes to conservation.
        </li>
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          Free repairs for life.{!single && " Remade in the right size within 14 days."}
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
        <Row title={single ? "One of one & returns" : "Editions, made to order & returns"}>
          {single ? (
            <>
              This garment was made once, in one size, and photographed as it is. When you claim it, it ships within {site.oneOfOneDispatchDays} working
              days and the design is retired. Because it is the only one, we cannot remake it in another size, but you have 14 days to return it unworn
              for a full refund.
            </>
          ) : (
            <>
              Each design is released once, in an edition of {availability.total}. Orders are taken until the window closes, then the whole edition is cut
              and sewn together in Mauritius, each unit in its owner&apos;s size, and the design is never made again. Because your unit is made for you, we
              offer a remake in the right size within 14 days of delivery and free repairs for the life of the garment. Refunds are available if we have
              made a mistake.
            </>
          )}{" "}
          See the full <a href="/legal/returns" className="underline">returns policy</a>.
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
