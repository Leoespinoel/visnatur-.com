import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of sale" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of sale."
      updated="October 2026"
      sections={[
        { heading: "Who we are", body: ["Vis Naturæ (\"we\", \"us\") sells made-to-order clothing and accessories through this website. [Company name, registration number and registered address to be added.]"] },
        { heading: "Orders", body: ["An order is accepted when we email you a confirmation. Payment is taken in full at checkout, in euros, via Stripe. Production begins once payment is confirmed."] },
        { heading: "Lead times", body: ["Pieces are made to order in Mauritius and ship within 3–4 weeks of the order date unless stated otherwise on the product page. Delivery times are estimates, not guarantees. Import duties and taxes charged by the destination country are the customer's responsibility unless shown as included at checkout."] },
        { heading: "Prices and the conservation pledge", body: ["Prices include VAT where applicable. 10% of the sale price of every item, excluding shipping and taxes, is donated to conservation organisations we publish on the Conservation page."] },
        { heading: "Cancellation and returns", body: ["See our Returns & exchanges policy. Made-to-order goods are exempt from the EU 14-day right of withdrawal, but you may cancel within 48 hours of ordering."] },
        { heading: "Liability", body: ["Our liability is limited to the price paid for the goods, except where the law does not allow such a limit."] },
        { heading: "Governing law", body: ["These terms are governed by the laws of [country]. Disputes may be brought before the courts of [city] or, for consumers, your home courts."] },
      ]}
    />
  );
}
