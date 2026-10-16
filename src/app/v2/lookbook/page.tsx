import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { designNumber, productImages } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { looks, piecesOf, v2Href } from "@/data/v2";
import { formatPrice } from "@/lib/format";
import { Tape } from "@/components/v2/Sticker";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Vis Naturæ worn out there: hoodies, rugby shirts, tees, caps and chinos.",
};

/** Every look, big, with the pieces in the picture beside it. Alternates sides down the page. */
export default function V2Lookbook() {
  return (
    <>
      <header className="border-b-[1.5px] border-ink px-4 pb-6 pt-8 md:px-6 md:pb-8 md:pt-10">
        <p className="v2-mono text-muted">{looks.length} looks · Shop what they&rsquo;re wearing</p>
        <h1 className="v2-display mt-3 text-[22vw] md:text-[15vw] xl:text-[13rem]">Lookbook</h1>
      </header>

      {looks.map((look, i) => {
        const pieces = piecesOf(look.pieces);
        const total = pieces.reduce((sum, p) => sum + p.price, 0);
        const flip = i % 2 === 1;
        return (
          <section key={look.slug} id={look.slug} className="grid scroll-mt-24 border-b-[1.5px] border-ink lg:grid-cols-12">
            <div className={`v2-grain relative aspect-[4/5] bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-[85svh] ${flip ? "lg:order-2 lg:border-l-[1.5px]" : "lg:border-r-[1.5px]"} border-ink`}>
              <Image
                src={look.image}
                alt={look.alt}
                fill
                unoptimized
                priority={i === 0}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
                style={{ objectPosition: look.position }}
              />
              <Tape tilt={flip ? 3 : -3} className="absolute left-4 top-4 !text-[0.75rem]">
                {look.caption}
              </Tape>
              <span className="v2-display absolute bottom-3 right-4 text-[5rem] text-white/90 md:text-[7rem]">{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className="flex flex-col px-4 py-8 md:px-6 lg:col-span-5 lg:py-10">
              <p className="v2-mono text-muted">Look {String(i + 1).padStart(2, "0")} · Shop the look</p>
              <ul className="mt-5 border-t-[1.5px] border-ink">
                {pieces.map((p) => (
                  <li key={p.slug} className="border-b-[1.5px] border-ink">
                    <Link href={v2Href.product(p.slug)} className="group flex items-center gap-4 py-3">
                      <span className="relative aspect-[4/5] w-24 shrink-0 border-[1.5px] border-ink bg-white">
                        <Image src={productImages(p)[0]} alt="" fill unoptimized sizes="96px" className="object-cover" />
                      </span>
                      <span className="flex-1">
                        <span className="v2-mono block text-muted">
                          {designNumber(p)} · {p.colour.name}
                        </span>
                        <span className="v2-wide mt-1 block text-[0.9rem] leading-tight group-hover:text-red">{p.name}</span>
                        <span className="v2-mono mt-1 block">
                          {formatPrice(p.price)}
                          {isAvailable(p) ? "" : " · Coming soon"}
                        </span>
                      </span>
                      <span aria-hidden="true" className="v2-wide text-[1.2rem] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* A total only for an outfit, not for a pile of colourways of one design */}
              {new Set(pieces.map((p) => p.family)).size > 1 && <p className="v2-mono mt-4 text-right">The look: {formatPrice(total)}</p>}
            </div>
          </section>
        );
      })}

      <div className="px-4 py-16 text-center md:px-6">
        <Link href={v2Href.shop} className="v2-btn">
          Shop everything
        </Link>
      </div>
    </>
  );
}
