import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type Stripe from "stripe";
import { getProduct, editionTotal } from "@/data/products";
import { getStripe } from "@/lib/stripe";
import { INVENTORY_TAG, unitsFromSession } from "@/lib/inventory";

/**
 * Stripe webhook. Locally: `stripe listen --forward-to localhost:3000/api/webhook`
 * and put the printed whsec_... into STRIPE_WEBHOOK_SECRET.
 * Subscribe to: checkout.session.completed, checkout.session.expired
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const units = unitsFromSession(session);

      // Guard against overselling: two sessions holding the last unit of an edition (or a
      // one-of-one) can both complete inside the same reservation window. Count every unit
      // paid for up to and including this session and compare with the edition size.
      const soldSoFar: Record<string, number> = {};
      const earlier = stripe.checkout.sessions.list({ status: "complete", limit: 100 });
      for await (const other of earlier) {
        if (other.created > session.created) continue;
        for (const u of unitsFromSession(other)) soldSoFar[u.slug] = (soldSoFar[u.slug] ?? 0) + 1;
      }
      const oversold = units
        .map((u) => u.slug)
        .filter((slug, i, all) => all.indexOf(slug) === i)
        .filter((slug) => {
          const p = getProduct(slug);
          return p && (soldSoFar[slug] ?? 0) > editionTotal(p);
        });

      // Unit numbers are assigned in order of payment: the nth paid unit of a design is "n of 12".
      const numbers = units.map((u) => `${u.slug}:${u.size} = ${soldSoFar[u.slug] ?? "?"} of ${getProduct(u.slug) ? editionTotal(getProduct(u.slug)!) : "?"}`);

      // This is where a production build would create the order record, email the customer,
      // and notify the atelier. For now the order is logged so it shows up in the server output.
      console.log("Order paid", {
        id: session.id,
        email: session.customer_details?.email,
        total: session.amount_total,
        units: numbers,
        pledgeCents: session.metadata?.pledge_cents,
        inseam: session.custom_fields?.find((f) => f.key === "inseam")?.text?.value ?? null,
      });
      if (oversold.length) {
        console.error("OVERSOLD: more units paid for than the edition holds. Refund the later order and contact the customer", {
          session: session.id,
          oversold,
        });
      }

      // Update the counts on the site immediately.
      revalidateTag(INVENTORY_TAG, { expire: 0 });
      break;
    }
    case "checkout.session.expired": {
      // A reservation lapsed: the units are free again.
      revalidateTag(INVENTORY_TAG, { expire: 0 });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
