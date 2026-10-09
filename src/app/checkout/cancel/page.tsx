import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { OpenBagButton } from "./OpenBagButton";

export const metadata: Metadata = { title: "Checkout cancelled", robots: { index: false } };

export default function CancelPage() {
  return (
    <>
      <PageIntro eyebrow="Checkout" title="Nothing was made." lede="Your payment was cancelled and your bag is exactly as you left it. Nothing is cut until you order." />
      <section className="container-x flex flex-wrap gap-3 pb-24">
        <OpenBagButton />
        <Link href="/shop" className="btn btn-outline">
          Back to the shop
        </Link>
      </section>
    </>
  );
}
