import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";
import { AccountProfile } from "@/components/AccountProfile";

export const metadata: Metadata = { title: "Profile", robots: { index: false } };

export default function ProfilePage() {
  return (
    <AccountPage current="/account/profile">
      <AccountProfile />
    </AccountPage>
  );
}
