import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { audiences, type AudienceSlug } from "@/data/site";
import { outfitPieces, outfitsFor } from "@/data/outfits";
import { productImages } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { formatPrice } from "@/lib/format";
import { PageIntro } from "./PageIntro";
import { ComingSoon } from "./ComingSoon";

const LEDE = "Whole looks from the island, piece by piece. Every piece is made to order in Mauritius, in your size.";

export function outfitsMetadata(audience: AudienceSlug): Metadata {
  return { title: `${audiences.find((a) => a.slug === audience)!.name} · Outfits`, description: LEDE };
}

/** /men/outfits and /women/outfits: each look's picture with the pieces in it underneath, as a "shop the look". */
export function Outfits({ audience }: { audience: AudienceSlug }) {
  const a = audiences.find((x) => x.slug === audience)!;
  const looks = outfitsFor(audience);
  return (
    <>
      <PageIntro variant="listing" crumbs={[{ label: a.name, href: `/${audience}` }]} title="Outfits" lede={LEDE} />
      <section className="container-x pb-16 md:pb-24">
        <div className="grid gap-x-2 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {looks.map((o, i) => {
            const pieces = outfitPieces(o);
            return (
              <article key={o.slug} id={o.slug} className="scroll-mt-28">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                  <Image
                    src={o.image}
                    alt={o.alt}
                    fill
                    unoptimized
                    priority={i < 3}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    style={o.position ? { objectPosition: o.position } : undefined}
                    className="object-cover"
                  />
                  {!pieces.some(isAvailable) && <ComingSoon />}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4 px-0.5">
                  <h2 className="font-serif text-2xl leading-tight text-ink">{o.title}</h2>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-muted">Look {String(i + 1).padStart(2, "0")}</span>
                </div>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {pieces.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} className="group flex items-center gap-4 py-3">
                        <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-paper-2">
                          <Image src={productImages(p)[0]} alt="" fill unoptimized sizes="64px" className="object-cover" />
                          {!isAvailable(p) && <ComingSoon label={false} />}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-sans text-[11px] font-medium uppercase leading-snug tracking-[0.06em] text-ink group-hover:underline">{p.name}</p>
                          <p className="text-[11px] text-muted">
                            {p.colour.name}
                            {!isAvailable(p) && " · Coming soon"}
                          </p>
                        </div>
                        <p className="text-[12px] tabular-nums text-ink">{formatPrice(p.price)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex items-baseline justify-between px-0.5 text-[12px]">
                  <span className="text-muted">The look</span>
                  <span className="tabular-nums text-ink">{formatPrice(pieces.reduce((sum, p) => sum + p.price, 0))}</span>
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
