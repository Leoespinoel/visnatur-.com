import Image from "next/image";
import Link from "next/link";

export type MosaicTile = { label: string; href: string; image: string; alt: string };

type Six = [MosaicTile, MosaicTile, MosaicTile, MosaicTile, MosaicTile, MosaicTile];
type Seven = [MosaicTile, MosaicTile, MosaicTile, MosaicTile, MosaicTile, MosaicTile, MosaicTile];

/**
 * "Men's Categories" on ralphlauren.com/men: six tiles in four columns, the outer two a 4:5 and a
 * square stacked, the middle two one tall picture each, so every column ends level. On phones the
 * same columns sit two by two. Tiles are passed in column order: outer, tall, tall, outer. A seventh
 * tile splits the second tall column into two stacked halves: outer, tall, half, half, outer.
 */
export function CategoryMosaic({ title, tiles }: { title: string; tiles: Six | Seven }) {
  const [a, b, c, ...rest] = tiles;
  const [f, g] = rest.slice(-2);
  const middle = rest.slice(0, -2);
  return (
    <section className="container-x py-16 md:py-24">
      <h2 className="display mb-8 text-center text-4xl md:mb-12 md:text-5xl">{title}</h2>
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2">
        <div className="grid gap-1.5 md:gap-2">
          <Tile tile={a} className="aspect-[4/5]" />
          <Tile tile={b} className="aspect-square" />
        </div>
        <Tile tile={c} className="h-full" />
        {middle.length === 1 ? (
          <Tile tile={middle[0]} className="h-full" />
        ) : (
          <div className="grid grid-rows-2 gap-1.5 md:gap-2">
            {middle.map((t) => (
              <Tile key={t.href} tile={t} className="h-full" />
            ))}
          </div>
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
      <Image src={tile.image} alt={tile.alt} fill unoptimized sizes="(min-width: 768px) 280px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="absolute inset-x-0 bottom-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] md:bottom-5 md:text-[13px]">{tile.label}</span>
    </Link>
  );
}
