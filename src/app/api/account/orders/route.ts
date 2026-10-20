import { site } from "@/data/site";
import { asCustomer, customerApi } from "@/lib/customer-account";

/** The signed-in customer's orders, newest first, for /account/orders. Shopify keeps them; this only reads. */

type Money = { amount: string; currencyCode: string } | null;
type Data = {
  customer: {
    orders: {
      nodes: {
        id: string;
        name: string;
        processedAt: string;
        cancelledAt: string | null;
        financialStatus: string | null;
        fulfillmentStatus: string;
        statusPageUrl: string;
        subtotal: Money;
        totalShipping: Money;
        totalPrice: Money;
        shippingAddress: { formatted: string[] } | null;
        fulfillments: { nodes: { latestShipmentStatus: string | null; trackingInformation: { company: string | null; number: string | null; url: string | null }[] }[] };
        lineItems: { nodes: { id: string; title: string; variantTitle: string | null; quantity: number; image: { url: string; altText: string | null } | null; totalPrice: Money }[] };
      }[];
    };
  };
};

const ORDERS = /* GraphQL */ `
  query Orders {
    customer {
      orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          cancelledAt
          financialStatus
          fulfillmentStatus
          statusPageUrl
          subtotal { amount currencyCode }
          totalShipping { amount currencyCode }
          totalPrice { amount currencyCode }
          shippingAddress { formatted(withName: true) }
          fulfillments(first: 5) { nodes { latestShipmentStatus trackingInformation { company number url } } }
          lineItems(first: 20) { nodes { id title variantTitle quantity image { url altText } totalPrice { amount currencyCode } } }
        }
      }
    }
  }
`;

const money = (m: Money) =>
  m ? new Intl.NumberFormat(site.locale, { style: "currency", currency: m.currencyCode, minimumFractionDigits: Number(m.amount) % 1 ? 2 : 0 }).format(Number(m.amount)) : "";

const date = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

type Order = Data["customer"]["orders"]["nodes"][number];

function status(o: Order): string {
  if (o.cancelledAt) return "Cancelled";
  if (o.financialStatus === "REFUNDED") return "Refunded";
  const shipment = o.fulfillments.nodes.map((f) => f.latestShipmentStatus);
  if (o.fulfillmentStatus === "FULFILLED") return shipment.includes("DELIVERED") ? "Delivered" : shipment.includes("OUT_FOR_DELIVERY") ? "Out for delivery" : "Shipped";
  if (o.fulfillmentStatus === "PARTIALLY_FULFILLED") return "Partly shipped";
  if (o.fulfillmentStatus === "ON_HOLD") return "On hold";
  return "Being prepared";
}

export async function GET() {
  return asCustomer("We couldn't load your orders.", async (token) => {
    const { customer } = await customerApi<Data>(token, ORDERS);
    return Response.json({
      orders: customer.orders.nodes.map((o) => ({
        id: o.id,
        name: o.name,
        date: date(o.processedAt),
        status: status(o),
        subtotal: money(o.subtotal),
        shipping: money(o.totalShipping),
        total: money(o.totalPrice),
        address: o.shippingAddress?.formatted ?? [],
        tracking: o.fulfillments.nodes.flatMap((f) =>
          f.trackingInformation.filter((t) => t.url || t.number).map((t) => ({ label: [t.company, t.number].filter(Boolean).join(" ") || "Tracking", url: t.url })),
        ),
        statusUrl: o.statusPageUrl,
        items: o.lineItems.nodes.map((l) => ({
          id: l.id,
          title: l.title,
          variant: l.variantTitle ?? "",
          quantity: l.quantity,
          image: l.image?.url ?? null,
          alt: l.image?.altText ?? l.title,
          total: money(l.totalPrice),
        })),
      })),
    });
  });
}
