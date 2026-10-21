import type { Metadata } from "next";
import Link from "next/link";
import { dispatchLabel, madeToOrderLabel } from "@/lib/format";
import { PageIntro } from "@/components/PageIntro";
import { pledgePercentLabel } from "@/lib/pledge";
import { LeafIcon } from "@/components/Icons";
import { ClearCart } from "./ClearCart";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

/** Shopify shows its own order confirmation; this page is the on-site thank-you if a customer lands here. */
export default function SuccessPage() {
  return (
    <>
      <ClearCart />
      <PageIntro
        eyebrow="Thank you"
        title="Now we make it."
        lede={`Signature and collection pieces leave Mauritius within ${dispatchLabel()}. A made to order piece is cut and sewn for you and ships ${madeToOrderLabel()} after the order. An email follows when it ships.`}
      />
      <section className="container-x pb-24">
        <Summary />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-outline">
            Continue browsing
          </Link>
          <Link href="/conservation" className="btn btn-primary">
            Where the fifth goes
          </Link>
        </div>
      </section>
    </>
  );
}

function Summary() {
  return (
    <div className="max-w-lg border border-line bg-surface p-6">
      <div className="flex items-start gap-3">
        <LeafIcon className="mt-0.5 shrink-0 text-red" />
        <p className="text-sm text-ink-2">Thank you. A confirmation email is on its way. {pledgePercentLabel()} of our profits goes to creating and sustaining the environments we love wearing the pieces in.</p>
      </div>
    </div>
  );
}
