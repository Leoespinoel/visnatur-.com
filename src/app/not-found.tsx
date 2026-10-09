import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export default function NotFound() {
  return (
    <>
      <PageIntro eyebrow="404" title="Not made yet." lede="That page doesn't exist. Everything that does is in the shop." />
      <div className="container-x pb-24">
        <Link href="/shop" className="btn btn-primary">
          Shop Collection I
        </Link>
      </div>
    </>
  );
}
