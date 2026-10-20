"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccountData } from "@/lib/account-sync";
import { AccountGate } from "./AccountGate";

/** /account/orders: the signed-in customer's orders from Shopify, in the site's own design. */

type Order = {
  id: string;
  name: string;
  date: string;
  status: string;
  subtotal: string;
  shipping: string;
  total: string;
  address: string[];
  tracking: { label: string; url: string | null }[];
  statusUrl: string;
  items: { id: string; title: string; variant: string; quantity: number; image: string | null; alt: string; total: string }[];
};

export function AccountOrders() {
  return (
    <AccountGate title="Your orders" what="your orders" path="/account/orders">
      <Orders />
    </AccountGate>
  );
}

function Orders() {
  const { data, error, loading } = useAccountData<{ orders: Order[] }>("/api/account/orders");

  return (
    <section className="container-x max-w-4xl py-12 md:py-16">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="display text-4xl md:text-5xl">Orders.</h1>

      {loading ? (
        <div className="min-h-64" aria-busy="true" />
      ) : error ? (
        <p role="alert" className="mt-8 text-ink-2">
          {error}
        </p>
      ) : !data?.orders.length ? (
        <div className="mt-8">
          <p className="max-w-xl text-base leading-relaxed text-ink-2">No orders yet. When you order, it shows here, with its status and tracking.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/men" className="pill">
              Shop Men
            </Link>
            <Link href="/women" className="pill">
              Shop Women
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {data.orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderRow({ order: o }: { order: Order }) {
  return (
    <li className="py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-base font-medium">Order {o.name}</p>
          <p className="mt-1 text-sm text-ink-2">{o.date}</p>
        </div>
        <div className="text-right">
          <p className="eyebrow !text-ink">{o.status}</p>
          <p className="mt-1 text-sm tabular-nums">{o.total}</p>
        </div>
      </div>

      <ul className="no-scrollbar mt-5 flex gap-2 overflow-x-auto" aria-label="Pieces">
        {o.items.map((l) => (
          <li key={l.id} className="relative aspect-[2/3] w-20 shrink-0 bg-paper-2">
            {l.image && <Image src={l.image} alt={l.alt} fill unoptimized sizes="80px" className="object-cover" />}
          </li>
        ))}
      </ul>

      <details className="group mt-5">
        <summary className="eyebrow link-underline inline-block cursor-pointer list-none !text-ink [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Details</span>
          <span className="hidden group-open:inline">Hide details</span>
        </summary>
        <div className="mt-6 grid gap-8 md:grid-cols-[3fr_2fr]">
          <div>
            <ul className="divide-y divide-line border-y border-line text-sm">
              {o.items.map((l) => (
                <li key={l.id} className="flex justify-between gap-4 py-3">
                  <span>
                    {l.title}
                    {l.variant && <span className="block text-xs text-muted">{l.variant}</span>}
                  </span>
                  <span className="shrink-0 tabular-nums text-ink-2">
                    {l.quantity > 1 && `${l.quantity} × `}
                    {l.total}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 text-sm tabular-nums">
              <div className="flex justify-between text-ink-2">
                <dt>Subtotal</dt>
                <dd>{o.subtotal}</dd>
              </div>
              <div className="flex justify-between text-ink-2">
                <dt>Shipping</dt>
                <dd>{o.shipping}</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>Total</dt>
                <dd>{o.total}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-6 text-sm">
            {o.address.length > 0 && (
              <div>
                <p className="eyebrow mb-2">Delivery address</p>
                <address className="not-italic leading-relaxed text-ink-2">
                  {o.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            )}
            {o.tracking.length > 0 && (
              <div>
                <p className="eyebrow mb-2">Tracking</p>
                {o.tracking.map((t) =>
                  t.url ? (
                    <a key={t.label} href={t.url} target="_blank" rel="noopener noreferrer" className="block underline">
                      {t.label}
                    </a>
                  ) : (
                    <span key={t.label} className="block text-ink-2">
                      {t.label}
                    </span>
                  ),
                )}
              </div>
            )}
            <div className="space-y-2">
              <a href={o.statusUrl} className="block underline">
                Order status and returns
              </a>
              <Link href="/legal/returns" className="block text-ink-2 underline">
                Returns policy
              </Link>
            </div>
          </div>
        </div>
      </details>
    </li>
  );
}
