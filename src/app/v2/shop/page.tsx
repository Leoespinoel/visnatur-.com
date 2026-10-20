import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingHead } from "@/components/v2/ListingHead";
import { V2Shop, V2ShopFallback } from "@/components/v2/Shop";
import { dispatchLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shop everything",
  description: "Every Vis Naturæ piece: hoodies, tees, caps, rugby shirts, knits, trousers and more, made by hand in Mauritius.",
};

export default function V2ShopPage() {
  return (
    <>
      <ListingHead title="Everything" line={`Every piece, for men and women. The Signature line, in stock and out of Mauritius within ${dispatchLabel()}.`} crumb={false} />
      <Suspense fallback={<V2ShopFallback />}>
        <V2Shop />
      </Suspense>
    </>
  );
}
