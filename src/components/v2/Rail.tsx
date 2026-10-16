import { siblingsOf, type Product } from "@/data/products";
import { V2ProductTile } from "./ProductTile";

/** A sideways-scrolling row of product tiles; each tile carries its design's other colourways as dots. */
export function V2Rail({ products }: { products: Product[] }) {
  return (
    <div className="no-scrollbar v2-cells grid snap-x snap-mandatory auto-cols-[68vw] grid-flow-col overflow-x-auto sm:auto-cols-[42vw] md:auto-cols-[30vw] xl:auto-cols-[22vw]">
      {products.map((p) => (
        <div key={p.slug} className="snap-start">
          <V2ProductTile group={[p, ...siblingsOf(p).filter((c) => c.slug !== p.slug)]} />
        </div>
      ))}
    </div>
  );
}
