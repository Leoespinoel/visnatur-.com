import { Outfits, outfitsMetadata } from "@/components/Outfits";

export const metadata = outfitsMetadata("men");

/** Whole men's looks, the last item in the Men menu. */
export default function MenOutfitsPage() {
  return <Outfits audience="men" />;
}
