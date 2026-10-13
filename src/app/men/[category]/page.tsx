import type { Metadata } from "next";
import { categories } from "@/data/site";
import { AudienceShop, audienceMetadata } from "@/components/AudienceShop";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return audienceMetadata("men", (await params).category);
}

export default async function MenCategoryPage({ params }: Props) {
  return <AudienceShop audience="men" category={(await params).category} />;
}
