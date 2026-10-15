import Image from "next/image";
import Link from "next/link";
import { comingSoon } from "@/data/availability";
import { ComingSoon } from "../ComingSoon";

/** `position` is the picture's object-position, for tall pictures cut down to a short tile. */
export type MosaicTile = { label: string; href: string; image: string; alt: string; position?: string };

/**
 * "Men's Categories" on ralphlauren.com/men: tiles in four columns, the outer two a 4:5 and a square
 * stacked, the middle two sharing the rest, one tall picture each with six tiles, stacked when there
 * are more, so every column ends level. On phones the same columns sit two by two. Tiles are passed in
 * column order: the first two and the last two are the outer columns; of the ones between, the second
 * middle column takes the extra one when they don't split evenly.
 */
export function CategoryMosaic({ title, tiles }: { title: string; tiles: MosaicTile[] }) {
  const [a, b] = tiles;
  const [f, g] = tiles.slice(-2);
  const middle = tiles.slice(2, -2);
  const split = Math.floor(middle.length / 2);
  return (
    <section className="container-x py-16 md:py-24">
      <h2 className="display mb-8 text-center text-4xl md:mb-12 md:text-5xl">{title}</h2>
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
        <div className="grid gap-1.5 md:gap-2">
          <Tile tile={a} className="aspect-[4/5]" />
          <Tile tile={b} className="aspect-square" />
        </div>
        {[middle.slice(0, split), middle.slice(split)].map((column, i) =>
          column.length === 1 ? (
            <Tile key={i} tile={column[0]} className="h-full" />
          ) : (
            <div key={i} className="grid gap-1.5 md:gap-2" style={{ gridTemplateRows: `repeat(${column.length}, minmax(0, 1fr))` }}>
              {column.map((t) => (
                <Tile key={t.href} tile={t} className="h-full" />
              ))}
            </div>
          ),
        )}
        <div className="grid gap-1.5 md:gap-2">
          <Tile tile={f} className="aspect-square" />
          <Tile tile={g} className="aspect-[4/5]" />
        </div>
      </div>
    </section>
  );
}

function Tile({ tile, className }: { tile: MosaicTile; className: string }) {
  return (
    <Link href={tile.href} className={`group relative block overflow-hidden bg-paper-2 text-white ${className}`}>
      <Image
        src={tile.image}
        alt={tile.alt}
        fill
        unoptimized
        sizes="(min-width: 768px) 280px, 50vw"
        style={tile.position ? { objectPosition: tile.position } : undefined}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      {comingSoon(tile.href) && <ComingSoon />}
      <span className="absolute inset-x-0 bottom-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] md:bottom-5 md:text-[13px]">{tile.label}</span>
    </Link>
  );
}
