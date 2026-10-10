import Image from "next/image";
import Link from "next/link";
import { editionLabel, editionKindLabel, isOneOfOne, productImages, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { pledgeCents } from "@/lib/pledge";
import { isArchived, remainingLabel, type Availability } from "@/lib/editions";

/**
 * Product tile in the style of a classic resort e-commerce grid: a flat studio tile with the
 * garment centred, a small label on the tile, then an uppercase name, the price and the colour dot.
 * Hovering swaps the front view for the on-model shot, or the detail view when there is none.
 */
export function ProductCard({
  product,
  priority = false,
  availability,
  siblings,
}: {
  product: Product;
  priority?: boolean;
  availability?: Availability;
  /** Other colourways of the same pattern (including `product`), shown as dots under the tile. */
  siblings?: Product[];
}) {
  const colours = siblings && siblings.length > 1 ? siblings : null;
  const [front, hover] = productImages(product);
  const done = availability ? isArchived(availability) : false;
  const corner = !availability || availability.state === "upcoming" ? editionKindLabel(product) : remainingLabel(product, availability);
  const urgent = done || (availability !== undefined && availability.remaining <= 3 && !isOneOfOne(product));
  const foot = !availability || !done ? null : availability.state === "closed" ? `Closed at ${availability.sold} of ${availability.total}` : isOneOfOne(product) ? "Made for its owner" : `All ${availability.total} made for their owners`;

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
          <Image
            src={front}
            alt={`${product.name} in ${product.colour.name}`}
            fill
            unoptimized
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover transition-opacity duration-500 group-hover:opacity-0 ${done ? "grayscale" : ""}`}
          />
          <Image
            src={hover}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={`object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${done ? "grayscale" : ""}`}
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            <span className={`bg-paper px-2 py-1.5 text-[11px] leading-none ${urgent ? "text-red" : "text-ink"}`}>{corner}</span>
            {product.badge && !done && <span className="bg-ink px-2 py-1.5 text-[11px] leading-none text-paper">{product.badge}</span>}
          </div>
        </div>

        <div className="mt-3 space-y-1.5 px-0.5">
          <h3 className="font-sans text-[11px] font-medium uppercase leading-snug tracking-[0.06em] text-ink">{product.name}</h3>
          <div className="flex items-baseline justify-between gap-3">
            <p className={`text-[12px] tabular-nums ${done ? "text-muted line-through" : "text-ink"}`}>{formatPrice(product.price)}</p>
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">{editionLabel(product)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-0.5">
            {colours ? (
              <span className="text-[11px] text-muted">{colours.length} colours</span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-muted" title={product.colour.name}>
                <span className="h-3 w-3 shrink-0 rounded-full border border-line" style={{ backgroundColor: product.colour.hex }} />
                <span className="hidden sm:inline">{product.colour.name}</span>
              </span>
            )}
            <span className={`whitespace-nowrap text-[10px] ${foot ? "text-muted" : "text-red"}`}>{foot ?? `${formatPrice(pledgeCents(product.price))} to conservation`}</span>
          </div>
        </div>
      </Link>
      {colours && (
        <ul className="mt-2 flex flex-wrap gap-1.5 px-0.5" aria-label={`${product.name} colours`}>
          {colours.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/product/${c.slug}`}
                title={c.colour.name}
                aria-label={`${c.name} in ${c.colour.name}`}
                aria-current={c.slug === product.slug ? "true" : undefined}
                className={`block h-3.5 w-3.5 rounded-full border transition-transform hover:scale-125 ${c.slug === product.slug ? "border-ink ring-1 ring-ink ring-offset-1 ring-offset-paper" : "border-line"}`}
                style={{ backgroundColor: c.colour.hex }}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
