import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSection, sections } from "@/data/v2";
import { ListingHead } from "@/components/v2/ListingHead";
import { V2Shop, V2ShopFallback } from "@/components/v2/Shop";

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const s = getSection(section);
  if (!s) return {};
  return { title: s.label, description: s.line };
}

export default async function V2SectionPage({ params }: Props) {
  const { section } = await params;
  const s = getSection(section);
  if (!s) notFound();

  return (
    <>
      <ListingHead title={s.label} line={s.line} />
      <Suspense fallback={<V2ShopFallback section={s.slug} />}>
        <V2Shop section={s.slug} />
      </Suspense>
    </>
  );
}
