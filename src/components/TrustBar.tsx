import { formatPrice } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { site } from "@/data/site";
import { LeafIcon, LockIcon, NeedleIcon, TruckIcon } from "./Icons";

/** Four reassurance points, icon over label, as on the reference site. */
export function TrustBar() {
  const items = [
    { icon: NeedleIcon, title: "Made to order" },
    { icon: LeafIcon, title: `${pledgePercentLabel()} to conservation` },
    { icon: TruckIcon, title: `Free shipping over ${formatPrice(site.freeShippingThresholdCents)}` },
    { icon: LockIcon, title: "Secure payment" },
  ];
  return (
    <div className="bg-paper">
      <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-8 py-20 md:grid-cols-4">
        {items.map(({ icon: Icon, title }) => (
          <li key={title} className="flex flex-col items-center gap-3 text-center">
            <Icon width={26} height={26} className="text-ink" />
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink">. {title} .</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
