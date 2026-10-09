import type { Metadata } from "next";
import Link from "next/link";
import { leadTimeLabel } from "@/lib/format";
import { site } from "@/data/site";
import { pledgePercentLabel } from "@/lib/pledge";
import { PageIntro } from "@/components/PageIntro";
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
        title="Your number is yours."
        lede={`Edition pieces are made together once orders close and ship ${leadTimeLabel()} later; one-of-one pieces already exist and ship within ${site.oneOfOneDispatchDays} working days. We email you when your piece is cut and when it ships.`}
      />
      <section className="container-x pb-24">
        <Summary />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-outline">
            Continue browsing
          </Link>
          <Link href="/conservation" className="btn btn-primary">
            Where the pledge goes
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
        <p className="text-sm text-ink-2">{pledgePercentLabel()} of your order goes to conservation. A confirmation email is on its way.</p>
      </div>
    </div>
  );
}
