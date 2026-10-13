import { AudienceShop, audienceMetadata } from "@/components/AudienceShop";

export const metadata = audienceMetadata("women");

export default function WomenPage() {
  return <AudienceShop audience="women" />;
}
