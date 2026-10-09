import type { Metadata } from "next";
import Link from "next/link";
import { getInventory } from "@/lib/inventory";
import { archivedProducts } from "@/lib/editions";
import { PageIntro } from "@/components/PageIntro";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every Vis Naturæ edition that has closed and every one-of-one piece that has found its owner. None of these designs will be made again.",
};

export default async function ArchivePage() {
  const inventory = await getInventory();
  const closed = archivedProducts(inventory);
  return (
    <>
      <PageIntro
        eyebrow="Archive"
        title="Closed editions."
        lede="Every design is released once. When its window closes or its last number is claimed, it lives here: a record of what left the workshop, how many were made, and for whom, in number only."
      />
      <section className="container-x pb-24">
        {closed.length === 0 ? (
          <div className="max-w-md space-y-5">
            <p className="font-serif text-3xl">Nothing yet.</p>
            <p className="text-sm leading-relaxed text-ink-2">The first edition to close will appear here, numbered, the day it goes to the workshop.</p>
            <Link href="/shop" className="btn btn-primary">
              See what is available
            </Link>
          </div>
        ) : (
          <ProductGrid products={closed} inventory={inventory} />
        )}
      </section>
    </>
  );
}
