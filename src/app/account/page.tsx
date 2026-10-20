import type { Metadata } from "next";
import { AccountHome } from "@/components/AccountHome";
import { AccountPage } from "@/components/AccountPage";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function Account() {
  return (
    <AccountPage current="/account">
      <AccountHome />
    </AccountPage>
  );
}
