import { groupByFamily, type Product } from "@/data/products";
import { availabilityOf, type Inventory } from "@/lib/editions";
import { ProductCard } from "./ProductCard";

/** Tight studio grid: two tiles across on phones, four on desktop, with hairline gutters. */
export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
  inventory,
}: {
  products: Product[];
  columns?: 3 | 4;
  priorityCount?: number;
  /** When given, cards show live counts (remaining, sold out, closed). */
  inventory?: Inventory;
}) {
  const cols = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 gap-x-1.5 gap-y-8 md:gap-x-2 md:gap-y-12 ${cols}`}>
      {groupByFamily(products).map((group, i) => (
        <ProductCard key={group[0].slug} product={group[0]} siblings={group} priority={i < priorityCount} availability={inventory ? availabilityOf(group[0], inventory) : undefined} />
      ))}
    </div>
  );
}
