import Image from "next/image";
import Link from "next/link";
import { Carousel } from "../Carousel";

export type ExploreTile = { title: string; href: string; image: string; alt: string; cta: string };

/**
 * "More to Explore" on ralphlauren.com/men: title and a line on the left, arrows on the right, then a
 * row of tall pictures, each with a serif title and an underlined link over its lower edge.
 */
export function ExploreCarousel({ title, text, tiles, className = "" }: { title: string; text: string; tiles: ExploreTile[]; className?: string }) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container-x">
        <Carousel
          ariaLabel={title}
          arrows="top"
          itemClassName="w-[72%] sm:w-[42%] md:w-[calc((100%-3*8px)/3.4)]"
          header={
            <>
              <h2 className="display text-4xl md:text-5xl">{title}</h2>
              <p className="mt-2 font-serif text-lg leading-snug text-ink-2">{text}</p>
            </>
          }
        >
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className="group relative block aspect-[3/4] overflow-hidden bg-paper-2 text-white">
              <Image src={t.image} alt={t.alt} fill unoptimized sizes="(min-width: 768px) 30vw, 72vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <p className="display text-3xl md:text-4xl">{t.title}</p>
                <span className="mt-3 inline-block border-b border-white pb-1 text-[11px] font-medium uppercase tracking-[0.16em] md:text-[12px]">{t.cta}</span>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
