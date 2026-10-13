import { AudienceShop, audienceMetadata } from "@/components/AudienceShop";

export const metadata = audienceMetadata("men");

export default function MenPage() {
  return <AudienceShop audience="men" />;
}
