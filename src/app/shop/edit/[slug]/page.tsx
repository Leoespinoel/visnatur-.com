import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { edits, getEdit, productsInEdit } from "@/data/edits";
import { PageIntro } from "@/components/PageIntro";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductGrid } from "@/components/ProductGrid";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return edits.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const edit = getEdit((await params).slug);
  return edit ? { title: edit.title, description: edit.dek } : {};
}

/** A curated edit: the designs it gathers, as a listing with design chips. */
export default async function EditPage({ params }: Props) {
  const edit = getEdit((await params).slug);
  if (!edit) notFound();
  const items = productsInEdit(edit);

  return (
    <>
      <PageIntro variant="listing" crumbs={[{ label: "Shop", href: "/shop" }]} title={edit.title} lede={edit.dek} />
      <section className="container-x pb-10">
        <Suspense fallback={<ProductGrid products={items} />}>
          <ShopGrid products={items} chips="designs" />
        </Suspense>
      </section>
    </>
  );
}
