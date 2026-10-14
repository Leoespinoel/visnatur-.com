import { AudienceShop, audienceMetadata } from "@/components/AudienceShop";

export const metadata = audienceMetadata("men");

/** Every men's piece, one click below the /men landing page. */
export default function MenAllPage() {
  return <AudienceShop audience="men" allHref="/men/all" />;
}
