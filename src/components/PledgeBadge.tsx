import { formatPrice } from "@/lib/format";
import { pledgeCents } from "@/lib/pledge";
import { LeafIcon } from "./Icons";

export function PledgeBadge({ priceCents, className = "" }: { priceCents: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-red ${className}`}>
      <LeafIcon width={14} height={14} />
      {formatPrice(pledgeCents(priceCents))} to conservation
    </span>
  );
}
