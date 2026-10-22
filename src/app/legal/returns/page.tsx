import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Returns & exchanges" };

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns & exchanges."
      updated="October 2026"
      sections={[
        {
          heading: "Signature and collections",
          body: [
            "Signature and Limited edition pieces can be returned for a refund, or exchanged for another size, within 14 days of delivery. Pieces must be unworn, unwashed and in their original packaging. Write to us first and we will arrange the return; once it arrives, the refund follows within 14 days. Limited edition pieces can only be exchanged while their size is still in stock.",
          ],
        },
        {
          heading: "Made to order",
          body: [
            "A made to order piece is a Signature piece adjusted to your measurements and made for you alone, so it cannot go back on a shelf. You can cancel within 48 hours of ordering for a full refund. After that its fabric has been cut.",
            "If a made to order piece does not match the measurements agreed, contact us within 14 days of delivery and we will remake it at no cost.",
          ],
        },
        {
          heading: "Faults",
          body: ["If we have made a mistake or the piece is faulty, we will repair, remake or refund it, your choice, and cover all shipping."],
        },
        {
          heading: "Your statutory rights",
          body: [
            "Under EU consumer law you have 14 days from delivery to withdraw from a purchase of Signature or Limited edition pieces. Goods made to the consumer's specifications or clearly personalised, such as made to order pieces, are exempt from that right. Nothing in this policy limits your statutory rights regarding faulty goods.",
          ],
        },
        {
          heading: "Repairs",
          body: ["Repairs are free for the life of the garment. Write to us and we will arrange it."],
        },
      ]}
    />
  );
}
