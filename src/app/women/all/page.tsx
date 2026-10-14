import { AudienceShop, audienceMetadata } from "@/components/AudienceShop";

export const metadata = audienceMetadata("women");

/** Every women's piece, one click below the /women landing page. */
export default function WomenAllPage() {
  return <AudienceShop audience="women" allHref="/women/all" />;
}
