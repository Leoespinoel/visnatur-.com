import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getStripe } from "@/lib/stripe";
import { formatPrice, leadTimeLabel } from "@/lib/format";
import { site } from "@/data/site";
import { pledgeCents, pledgePercentLabel } from "@/lib/pledge";
import { PageIntro } from "@/components/PageIntro";
import { LeafIcon } from "@/components/Icons";
import { ClearCart } from "./ClearCart";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

type Props = { searchParams: Promise<{ session_id?: string }> };

export default function SuccessPage({ searchParams }: Props) {
  return (
    <>
      <ClearCart />
      <PageIntro
        eyebrow="Thank you"
        title="Your number is yours."
        lede={`Edition pieces are made together once orders close and ship ${leadTimeLabel()} later; one-of-one pieces already exist and ship within ${site.oneOfOneDispatchDays} working days. We email you when your piece is cut and when it ships.`}
      />
      <section className="container-x pb-24">
        <Suspense fallback={<Summary />}>
          <SessionSummary searchParams={searchParams} />
        </Suspense>
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

async function SessionSummary({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const stripe = getStripe();
  if (!session_id || !stripe) return <Summary />;
  const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null);
  if (!session) return <Summary />;
  return (
    <Summary
      subtotal={session.amount_subtotal ?? 0}
      total={session.amount_total ?? 0}
      email={session.customer_details?.email ?? undefined}
    />
  );
}

function Summary({ subtotal, total, email }: { subtotal?: number; total?: number; email?: string }) {
  return (
    <div className="max-w-lg border border-line bg-surface p-6">
      <div className="flex items-start gap-3">
        <LeafIcon className="mt-0.5 shrink-0 text-red" />
        <div className="space-y-2 text-sm text-ink-2">
          {subtotal !== undefined ? (
            <>
              <p>
                <span className="font-medium text-ink">{formatPrice(pledgeCents(subtotal))}</span> of your order goes to conservation ({pledgePercentLabel()} of {formatPrice(subtotal)}).
              </p>
              {total !== undefined && <p>Total paid: {formatPrice(total)}.</p>}
              {email && <p>A confirmation has been sent to {email}.</p>}
            </>
          ) : (
            <p>{pledgePercentLabel()} of your order goes to conservation. A confirmation email is on its way.</p>
          )}
        </div>
      </div>
    </div>
  );
}
