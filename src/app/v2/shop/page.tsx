import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingHead } from "@/components/v2/ListingHead";
import { V2Shop, V2ShopFallback } from "@/components/v2/Shop";

export const metadata: Metadata = {
  title: "Shop everything",
  description: "Every Vis Naturæ piece: hoodies, tees, caps, rugby shirts, knits, trousers and more, made to order.",
};

export default function V2ShopPage() {
  return (
    <>
      <ListingHead title="Everything" line="Every piece we make, for men and women. Nothing sits on a shelf: we cut it in your size when you order." crumb={false} />
      <Suspense fallback={<V2ShopFallback />}>
        <V2Shop />
      </Suspense>
    </>
  );
}
