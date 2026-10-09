import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getProduct, editionLabel, editionKindLabel, isOneOfOne } from "@/data/products";
import { shippingCountries, site } from "@/data/site";
import { getStripe } from "@/lib/stripe";
import { pledgeCents } from "@/lib/pledge";
import { leadTimeLabel } from "@/lib/format";
import { availabilityOf, dispatchLabel, dropOf, formatDropDate } from "@/lib/editions";
import { readInventory } from "@/lib/inventory";

type Item = { slug: string; size: string };

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Checkout is not configured yet. Add STRIPE_SECRET_KEY to .env.local to enable payments." },
      { status: 503 },
    );
  }

  let items: Item[];
  try {
    const body = (await req.json()) as { items?: unknown };
    if (!Array.isArray(body.items) || body.items.length === 0) throw new Error("empty");
    items = body.items as Item[];
  } catch {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  // A bag line is one unit of a design in one size. The edition must still have that many units free.
  const inventory = await readInventory();
  const wanted = new Map<string, number>();
  const units: Item[] = [];
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;
  let needsMaking = false;

  for (const item of items) {
    const product = getProduct(String(item.slug));
    if (!product) return NextResponse.json({ error: `Unknown piece: ${item.slug}` }, { status: 400 });
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json({ error: `Unknown size for ${product.name}.` }, { status: 400 });
    }
    const already = wanted.get(product.slug) ?? 0;
    const a = availabilityOf(product, inventory);

    if (a.state === "upcoming") {
      return NextResponse.json(
        { error: `${product.name} is part of ${dropOf(product).name}, which opens ${formatDropDate(dropOf(product).opens)}.`, soldOut: [product.slug] },
        { status: 409 },
      );
    }
    if (a.state === "closed") {
      return NextResponse.json(
        { error: `Orders for ${product.name} closed on ${formatDropDate(dropOf(product).closes)}. The edition is being made and will not reopen.`, soldOut: [product.slug] },
        { status: 409 },
      );
    }
    if (a.state === "sold" || a.remaining <= already) {
      const msg = isOneOfOne(product)
        ? `${product.name} has just been sold. It was one of one.`
        : `${product.name} has just sold out. All ${a.total} are spoken for.`;
      return NextResponse.json({ error: msg, soldOut: [product.slug] }, { status: 409 });
    }
    if (a.free <= already) {
      const msg = isOneOfOne(product)
        ? `${product.name} is at checkout with someone else right now. If they don't complete within ${site.reservationMinutes} minutes it frees up.`
        : `The last of ${product.name} is at checkout with someone else right now. If they don't complete within ${site.reservationMinutes} minutes it frees up.`;
      return NextResponse.json({ error: msg, reserved: [product.slug] }, { status: 409 });
    }

    wanted.set(product.slug, already + 1);
    units.push({ slug: product.slug, size: item.size });
    subtotal += product.price;
    if (!isOneOfOne(product)) needsMaking = true;
    lineItems.push({
      quantity: 1,
      adjustable_quantity: { enabled: false },
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: product.price,
        product_data: {
          name: `${product.name} · ${editionLabel(product)}`,
          description: `${editionKindLabel(product)} · ${product.colour.name} · Size ${item.size} · ${dispatchLabel(product)}`,
          metadata: { slug: product.slug, size: item.size, design: editionLabel(product), edition: editionKindLabel(product) },
        },
      },
    });
  }

  const shippingCents = subtotal >= site.freeShippingThresholdCents ? 0 : site.flatShippingCents;
  const origin = site.url;
  // Editions are made after the window closes, so the delivery estimate runs from closing, not from today.
  const latestClose = Math.max(
    ...units.map((u) => {
      const p = getProduct(u.slug)!;
      return isOneOfOne(p) ? 0 : Date.parse(`${dropOf(p).closes}T23:59:59Z`);
    }),
  );
  const daysUntilClose = needsMaking ? Math.max(0, Math.ceil((latestClose - Date.now()) / 86_400_000)) : 0;
  const minDays = needsMaking ? daysUntilClose + site.leadTime.minWeeks * 7 : site.oneOfOneDispatchDays;
  const maxDays = needsMaking ? daysUntilClose + (site.leadTime.maxWeeks + 1) * 7 : site.oneOfOneDispatchDays + 7;

  const submitMessage = needsMaking
    ? `Your number in the edition is reserved the moment you pay. When orders close, the whole edition is cut and sewn together and ships in ${leadTimeLabel()}. Then the design is retired. 10% of the price goes to conservation.`
    : `This piece is one of one and already made. Once you pay it is yours alone and ships within ${site.oneOfOneDispatchDays} working days. 10% of the price goes to conservation.`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      currency: site.currency.toLowerCase(),
      // Holds the units for a limited time; an abandoned session releases them.
      expires_at: Math.floor(Date.now() / 1000) + site.reservationMinutes * 60,
      shipping_address_collection: { allowed_countries: [...shippingCountries] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shippingCents === 0 ? "Free express shipping from Mauritius" : "Express shipping from Mauritius",
            fixed_amount: { amount: shippingCents, currency: site.currency.toLowerCase() },
            delivery_estimate: {
              minimum: { unit: "day", value: Math.max(1, minDays) },
              maximum: { unit: "day", value: Math.max(2, maxDays) },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      custom_fields: [
        {
          key: "inseam",
          label: { type: "custom", custom: "Inseam in cm (trousers only, optional)" },
          type: "text",
          optional: true,
        },
      ],
      custom_text: { submit: { message: submitMessage } },
      metadata: {
        units: units.map((u) => `${u.slug}:${u.size}`).join(","),
        pledge_cents: String(pledgeCents(subtotal)),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again in a moment." }, { status: 502 });
  }
}
