import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { formatDropDate, piecesInDrop, releasedDrops, upcomingDrops, type Drop } from "@/data/drops";
import { PageIntro } from "@/components/PageIntro";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "Limited edition",
  description: "Vis Naturæ Limited edition: a handful of designs, made once in small numbers and released on a date. When they are gone, they are gone.",
};

/**
 * Limited edition (Leo, 2026-10-20; first called drops, then collections, off menu, reserve and Hors série; Limited edition since 2026-10-22): limited units, then gone. The list
 * lives in src/data/drops.ts and is empty until the first one.
 */
export default function CollectionsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Collections · Limited edition"
        title="Limited edition."
        lede="A handful of designs, made once in small numbers and released on a date. When they are gone, they are gone."
      />
      {/* Which releases are out depends on today's date, so this part renders at request time. */}
      <Suspense fallback={null}>
        <DropList />
      </Suspense>
      <Newsletter />
    </>
  );
}

async function DropList() {
  await connection();
  const released = releasedDrops();
  const upcoming = upcomingDrops();

  if (!released.length && !upcoming.length) {
    return (
      <section className="container-x pb-16 md:pb-24">
        <div className="border-y border-line py-12 md:py-16">
          <p className="eyebrow mb-3">Collection 01</p>
          <h2 className="display text-4xl md:text-5xl">DIVA is on its way.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
            The date, the designs and the number of pieces go up here first. Members of the club and the letters hear before anyone else.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/members" className="btn btn-primary">
              Join the lineup
            </Link>
            <Link href="/shop/signature" className="btn btn-outline">
              Shop Signature
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="pb-16 md:pb-24">
      {upcoming.map((d) => (
        <DropBlock key={d.id} drop={d} status={`Out ${formatDropDate(d.date)}`} />
      ))}
      {released.map((d, i) => (
        <DropBlock key={d.id} drop={d} status={i === 0 ? `Out now · released ${formatDropDate(d.date)}` : `Released ${formatDropDate(d.date)}`} />
      ))}
    </div>
  );
}

function DropBlock({ drop, status }: { drop: Drop; status: string }) {
  const pieces = piecesInDrop(drop);
  return (
    <section id={drop.id} className="container-x scroll-mt-24 border-t border-line pt-10 pb-12 md:pt-14 md:pb-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-2">{status}</p>
          <h2 className="display text-4xl md:text-5xl">{drop.name}</h2>
          {drop.dek && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-2">{drop.dek}</p>}
        </div>
        <p className="eyebrow !text-ink">{drop.units} pieces in all</p>
      </div>
      {pieces.length > 0 && <ProductGrid products={pieces} />}
    </section>
  );
}
