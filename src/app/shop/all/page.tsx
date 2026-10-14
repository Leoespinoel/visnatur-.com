import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@/data/products";
import { leadTimeLabel } from "@/lib/format";
import { PageIntro } from "@/components/PageIntro";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "All pieces",
  description: "Every Vis Naturæ piece is made to order in Mauritius, in your size. Swim, hoodies and knitwear, linen shirts, chinos, linen trousers, caps and socks.",
};

export default function ShopPage() {
  return (
    <>
      <PageIntro
        variant="listing"
        crumbs={[{ label: "Shop", href: "/shop" }]}
        title="All pieces"
        lede={`Nothing here is made until you order it. Choose your size, we cut and sew it for you in Mauritius, and it ships ${leadTimeLabel()} later.`}
      />
      <section className="container-x pb-10">
        <Suspense fallback={<ProductGrid products={products} />}>
          <ShopGrid products={products} />
        </Suspense>
      </section>
    </>
  );
}
