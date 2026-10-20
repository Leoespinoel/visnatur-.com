"use client";

import Link from "next/link";
import { useState } from "react";
import { designNumber, lineOf, siblingsOf, type Product } from "@/data/products";
import { getDrop } from "@/data/drops";
import { site } from "@/data/site";
import { isAvailable } from "@/data/availability";
import { useCart } from "@/lib/cart";
import { dispatchLabel, formatPrice, madeToOrderLabel, transitLabel } from "@/lib/format";
import { useMySizes } from "@/lib/sizes";
import { adjustFields, cleanAdjustments, FIT_LABELS, NOTE_MAX, offersMadeToOrder, RANGES, type AdjustField, type Adjustments, type Fit } from "@/lib/adjust";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { CheckIcon, ChevronIcon, LeafIcon } from "./Icons";
import { WishlistButton } from "./WishlistButton";

export function ProductDetails({ product, soldOut = [] }: { product: Product; soldOut?: string[] }) {
  const { add, has, open } = useCart();
  // Saved sizes (/account/sizes): the usual size is preselected until another is picked, and Made to order is filled in
  // from them when it is switched on.
  const { sizes: mine } = useMySizes();
  const bottoms = product.garment === "trouser" || product.garment === "short" || product.garment === "swim-short";
  const usual = bottoms ? mine.bottom : mine.top;
  const [picked, setSize] = useState<string | null>(null);
  const size = picked ?? (product.sizes.length === 1 ? product.sizes[0] : usual && product.sizes.includes(usual) ? usual : null);
  const [sizeError, setSizeError] = useState(false);
  // Made to order: a Signature piece adjusted to fit, for a flat surcharge (Leo, 2026-10-20).
  const mtoOffered = offersMadeToOrder(product);
  const [mto, setMto] = useState(false);
  const [draft, setDraft] = useState<Adjustments>({});
  const [mtoError, setMtoError] = useState(false);
  const adjust = mto ? (cleanAdjustments(product.garment, draft) ?? undefined) : undefined;
  const inBag = size ? has(product.slug, size, adjust) : false;
  const surcharge = site.delivery.madeToOrderSurchargeCents;
  const drop = lineOf(product) === "drop" ? getDrop(product.drop) : undefined;
  const startMto = () => {
    setDraft((d) => ({
      ...d,
      ...(adjustFields(product.garment).includes("inseam") && mine.inseam && d.inseam === undefined ? { inseam: mine.inseam } : {}),
      ...(mine.fit && d.fit === undefined ? { fit: mine.fit } : {}),
    }));
  };
  // A sold-out size can still be made to order (it is cut for the buyer); otherwise it can't be chosen.
  const isOut = (s: string) => soldOut.includes(s) && !mto;
  const allOut = product.sizes.every((s) => soldOut.includes(s));

  function addToBag() {
    if (!size) {
      setSizeError(true);
      return;
    }
    if (mto && !adjust) {
      setMtoError(true);
      return;
    }
    if (isOut(size)) return;
    add(adjust ? { slug: product.slug, size, adjust } : { slug: product.slug, size });
  }

  const setField = (f: keyof Adjustments, v: number | string | undefined) => {
    setMtoError(false);
    setDraft((d) => ({ ...d, [f]: v }));
  };

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
          <dd className="font-medium">{mto ? madeToOrderLabel() : dispatchLabel().replace(" working days", " days")}</dd>
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

      {/* Size */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <p className="eyebrow">Size</p>
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
                disabled={isOut(s)}
                title={isOut(s) ? "Sold out" : undefined}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                className={`min-w-12 border px-3 py-2.5 text-xs transition-colors ${
                  isOut(s) ? "cursor-not-allowed border-line text-muted line-through" : size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
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
      </div>

      {/* Made to order: Signature pieces only, adjusted to fit for a flat surcharge */}
      {mtoOffered && (
        <div className="border border-line">
          <button
            type="button"
            aria-expanded={mto}
            onClick={() => {
              if (!mto) startMto();
              setMto((v) => !v);
              setMtoError(false);
            }}
            className="flex w-full items-center justify-between gap-4 p-4 text-left"
          >
            <span>
              <span className="eyebrow !text-ink">Made to order</span>
              <span className="mt-1 block text-xs text-ink-2">
                Adjusted to fit · +{formatPrice(surcharge)} · ships in {madeToOrderLabel()}
              </span>
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center border ${mto ? "border-ink bg-ink text-paper" : "border-line"}`}
              aria-hidden="true"
            >
              {mto && <CheckIcon width={12} height={12} />}
            </span>
          </button>
          {mto && (
            <div className="space-y-4 border-t border-line p-4">
              {adjustFields(product.garment).map((f) => (
                <AdjustInput key={f} field={f} garment={product.garment} value={draft} onChange={setField} />
              ))}
              <label className="block">
                <span className="eyebrow mb-2 block">Note (optional)</span>
                <textarea
                  value={draft.note ?? ""}
                  onChange={(e) => setField("note", e.target.value)}
                  maxLength={NOTE_MAX}
                  rows={2}
                  placeholder="Anything else, e.g. your height or how you like it to sit"
                  className="w-full border border-line bg-transparent p-2 text-sm focus:border-ink focus:outline-none"
                />
              </label>
              <p className="text-xs leading-relaxed text-muted">
                {Object.keys(mine).length > 1 ? (
                  <>
                    Your saved sizes go with the order (
                    <Link href="/account/sizes" className="underline">
                      edit
                    </Link>
                    ).{" "}
                  </>
                ) : (
                  <>
                    <Link href="/account/sizes" className="underline">
                      Save your sizes
                    </Link>{" "}
                    and they go with the order.{" "}
                  </>
                )}
                The measurements are confirmed by email before anything is cut. Cancel within 48 hours of ordering.{" "}
                <Link href="/made-to-order" className="underline">
                  How it works
                </Link>
              </p>
              {mtoError && (
                <p role="alert" className="text-xs text-red">
                  Set at least one adjustment, or switch Made to order off.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* The bag button, with the wishlist heart beside it */}
      <div className="flex gap-2">
        {!isAvailable(product) ? (
          <button type="button" disabled className="btn btn-outline flex-1">
            Coming soon
          </button>
        ) : allOut && !mto ? (
          <button type="button" disabled className="btn btn-outline flex-1">
            {mtoOffered ? "Sold out · made to order only" : "Sold out"}
          </button>
        ) : inBag ? (
          <button type="button" onClick={open} className="btn btn-outline flex-1">
            In your bag · view
          </button>
        ) : (
          <button type="button" onClick={addToBag} className="btn btn-primary flex-1">
            Add to bag · {formatPrice(product.price + (mto ? surcharge : 0))}
          </button>
        )}
        <WishlistButton slug={product.slug} name={`${product.name} in ${product.colour.name}`} className="btn btn-outline w-12 !px-0" />
      </div>

      {/* Line and delivery notes */}
      <ul className="space-y-2.5 border-y border-line py-5 text-xs text-ink-2">
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {drop
            ? `${drop.name}: ${drop.units} pieces in all. When they are gone, they are gone.`
            : lineOf(product) === "drop"
              ? "A collection piece: limited units, then gone."
              : "Signature: in stock in Mauritius, made by hand."}
        </li>
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {mto ? `Made to order: cut and sewn for you, ships ${madeToOrderLabel()} after the order.` : `Dispatched within ${dispatchLabel()}, then ${transitLabel()} to Europe.`}
        </li>
        <li className="flex gap-2.5">
          <LeafIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          {formatPrice(pledgeCents(product.price))} of this price ({pledgePercentLabel()}) goes to conservation.
        </li>
        <li className="flex gap-2.5">
          <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-red" />
          Free repairs for life. {mto ? "Remade if it doesn't match the measurements agreed." : "Returns and exchanges within 14 days."}
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
        <Row title="Delivery & returns">
          Signature and collection pieces are held in stock in Mauritius, dispatched within {dispatchLabel()} and delivered in {transitLabel()}. They can be
          returned or exchanged within 14 days of delivery.{" "}
          {mtoOffered &&
            `Made to order, the piece is adjusted to your measurements and made for you in ${madeToOrderLabel()}; it can be cancelled within 48 hours and is remade if it doesn't match what was agreed. `}
          Free repairs for the life of the garment. See the full <a href="/legal/returns" className="underline">returns policy</a>.
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

const ADJUST_LABELS: Record<AdjustField, string> = { sleeve: "Sleeve length", length: "Length", inseam: "Inseam", waist: "Waist", fit: "Fit" };

/** One adjustment: a ± cm stepper list, an inseam in cm, or the fit. */
function AdjustInput({
  field,
  garment,
  value,
  onChange,
}: {
  field: AdjustField;
  garment: Product["garment"];
  value: Adjustments;
  onChange: (f: keyof Adjustments, v: number | string | undefined) => void;
}) {
  if (field === "fit") {
    const fits = Object.keys(FIT_LABELS) as Fit[];
    return (
      <div>
        <span className="eyebrow mb-2 block">{ADJUST_LABELS.fit}</span>
        <div className="flex flex-wrap gap-2">
          {fits.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={(value.fit ?? "as-cut") === f}
              onClick={() => onChange("fit", f)}
              className={`border px-3 py-2 text-xs transition-colors ${(value.fit ?? "as-cut") === f ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
            >
              {FIT_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (field === "inseam") {
    const r = RANGES.inseam;
    return (
      <label className="block">
        <span className="eyebrow mb-2 block">Inseam (cm)</span>
        <input
          type="number"
          inputMode="numeric"
          min={r.min}
          max={r.max}
          value={value.inseam ?? ""}
          onChange={(e) => onChange("inseam", e.target.value === "" ? undefined : Number(e.target.value))}
          placeholder={`${r.min}–${r.max}, e.g. 81`}
          className="w-40 border border-line bg-transparent p-2 text-sm tabular-nums focus:border-ink focus:outline-none"
        />
      </label>
    );
  }
  const r = RANGES[field];
  const steps = Array.from({ length: r.max - r.min + 1 }, (_, i) => r.min + i);
  const label = field === "length" && (garment === "short" || garment === "swim-short") ? "Leg length" : ADJUST_LABELS[field];
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      <select
        value={value[field] ?? 0}
        onChange={(e) => onChange(field, Number(e.target.value))}
        className="w-40 border border-line bg-transparent p-2 text-sm tabular-nums focus:border-ink focus:outline-none"
      >
        {steps.map((n) => (
          <option key={n} value={n}>
            {n === 0 ? "As cut" : `${n > 0 ? "+" : "−"}${Math.abs(n)} cm`}
          </option>
        ))}
      </select>
    </label>
  );
}
