import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of sale" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of sale."
      updated="October 2026"
      sections={[
        { heading: "Who we are", body: ["Vis Naturæ (\"we\", \"us\") sells clothing and accessories through this website: the Signature line, limited collections, and Signature pieces made to order with adjustments. [Company name, registration number and registered address to be added.]"] },
        { heading: "Orders", body: ["An order is accepted when we email you a confirmation. Payment is taken in full at checkout, in euros, through Shopify Payments. A made to order piece goes into production once payment is confirmed and its measurements are agreed."] },
        { heading: "Delivery times", body: ["Signature and collection pieces are held in stock in Mauritius and are dispatched within 1–2 working days. Made to order pieces ship within 3–4 weeks of the order date. Both are stated on the product page. Delivery times are estimates, not guarantees. Import duties and taxes charged by the destination country are the customer's responsibility unless shown as included at checkout."] },
        { heading: "Prices and the fifth", body: ["Prices include VAT where applicable. Made to order carries a flat surcharge per piece, shown in the bag before payment. Each year, 1/5 of the company's profit after tax is spent on creating the environments the pieces are worn in, the reef, forest and shoreline of Mauritius, through the organisations we build with, named before the first payment, and the figure is published with the accounts."] },
        { heading: "Cancellation and returns", body: ["See our Returns & exchanges policy. Signature and collection pieces carry the EU 14-day right of withdrawal. Made to order pieces, made to the customer's specifications, are exempt from it, but may be cancelled within 48 hours of ordering."] },
        { heading: "Collections", body: ["Collection pieces are made in limited numbers and sold while stock lasts. They are not remade once sold out and cannot be made to order."] },
        { heading: "Liability", body: ["Our liability is limited to the price paid for the goods, except where the law does not allow such a limit."] },
        { heading: "Governing law", body: ["These terms are governed by the laws of [country]. Disputes may be brought before the courts of [city] or, for consumers, your home courts."] },
      ]}
    />
  );
}
