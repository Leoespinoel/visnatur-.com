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
            "Every Vis Naturæ edition is made after its order window closes, each unit in its owner's size. That is the whole idea, and it changes how returns work. Because your piece is made for you alone, we cannot put it back on a shelf.",
            "One-of-one pieces are the exception: they already exist when you buy them, so they can be returned unworn within 14 days of delivery for a full refund.",
          ],
        },
        {
          heading: "Cancelling",
          body: ["You can cancel an edition order any time before its drop closes, for a full refund. Once the window closes the fabric for the whole edition is cut and the order can no longer be cancelled."],
        },
        {
          heading: "Wrong size",
          body: [
            "If the size is wrong, contact us within 14 days of delivery. We will remake the piece in the right size at no cost and collect the original. Pieces must be unworn, unwashed and in their original packaging.",
          ],
        },
        {
          heading: "Double sales",
          body: ["In the rare case that two customers pay for the same one-of-one piece, or for the last number of an edition, within the same minutes, the first payment stands and the second is refunded in full within two working days."],
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
