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
          heading: "Made to order",
          body: [
            "Every Vis Naturæ piece is made after it is ordered, in its owner's size. That is the whole idea, and it changes how returns work. Because your piece is made for you alone, we cannot put it back on a shelf.",
          ],
        },
        {
          heading: "Cancelling",
          body: ["You can cancel within 48 hours of ordering, for a full refund. After that your fabric has been cut, and we can offer an exchange or credit instead."],
        },
        {
          heading: "Wrong size",
          body: [
            "If the size is wrong, contact us within 14 days of delivery. We will remake the piece in the right size at no cost and collect the original. Pieces must be unworn, unwashed and in their original packaging.",
          ],
        },
        {
          heading: "Faults",
          body: ["If we have made a mistake or the piece is faulty, we will repair, remake or refund it, your choice, and cover all shipping."],
        },
        {
          heading: "Your statutory rights",
          body: [
            "Under EU consumer law, goods made to the consumer's specifications or clearly personalised are exempt from the 14-day right of withdrawal. Nothing in this policy limits your statutory rights regarding faulty goods.",
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
