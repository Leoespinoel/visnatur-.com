import { Outfits, outfitsMetadata } from "@/components/Outfits";

export const metadata = outfitsMetadata("women");

/** Whole women's looks, the last item in the Women menu. */
export default function WomenOutfitsPage() {
  return <Outfits audience="women" />;
}
