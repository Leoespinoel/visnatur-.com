import Image from "next/image";
import Link from "next/link";

export type CategoryTile = { label: string; href: string; image: string };

/** A centred heading over a row of category pictures with the name under each (ralphlauren.com's "Men's Categories"). */
export function CategoryTiles({ title, tiles }: { title: string; tiles: CategoryTile[] }) {
  return (
    <section className="container-x py-14 md:py-20">
      <h2 className="display mb-8 text-center text-4xl md:mb-10 md:text-5xl">{title}</h2>
      <ul className="grid grid-cols-3 gap-x-1.5 gap-y-7 md:grid-cols-6 md:gap-x-2">
        {tiles.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                <Image src={t.image} alt="" fill unoptimized sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-ink">{t.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
