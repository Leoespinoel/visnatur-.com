import type { Metadata } from "next";
import { Suspense } from "react";
import { products } from "@/data/products";
import { dispatchLabel } from "@/lib/format";
import { PageIntro } from "@/components/PageIntro";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "All pieces",
  description: "Vis Naturæ: the Signature line, always in stock, and limited collections, made by hand in Mauritius. Swim, knitwear, linen shirts, chinos, linen trousers, caps and socks.",
};

export default function ShopPage() {
  return (
    <>
      <PageIntro
        variant="listing"
        crumbs={[{ label: "Shop", href: "/shop" }]}
        title="All pieces"
        lede={`The Signature line, in stock in Mauritius and dispatched within ${dispatchLabel()}. Any piece can be made to order, adjusted to fit.`}
      />
      <section className="container-x pb-10">
        <Suspense fallback={<ProductGrid products={products} />}>
          <ShopGrid products={products} />
        </Suspense>
      </section>
    </>
  );
}
