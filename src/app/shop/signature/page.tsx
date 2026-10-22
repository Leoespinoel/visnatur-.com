import type { Metadata } from "next";
import { Suspense } from "react";
import { lineOf, products } from "@/data/products";
import { dispatchLabel } from "@/lib/format";
import { PageIntro } from "@/components/PageIntro";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Signature",
  description: "The Vis Naturæ Signature line: the permanent collection, always in stock and made by hand in Mauritius. Any piece can be made to order, adjusted to fit.",
};

/** The permanent line (Leo, 2026-10-20): every piece not in a drop. */
export default function SignaturePage() {
  const signature = products.filter((p) => lineOf(p) === "signature");
  return (
    <>
      <PageIntro
        variant="listing"
        crumbs={[{ label: "Collections", href: "/shop" }]}
        title="Signature"
        lede={`The permanent line, always on the site. In stock in Mauritius and dispatched within ${dispatchLabel()}; any piece can be made to order, adjusted to fit.`}
      />
      <section className="container-x pb-10">
        <Suspense fallback={<ProductGrid products={signature} />}>
          <ShopGrid products={signature} />
        </Suspense>
      </section>
    </>
  );
}
