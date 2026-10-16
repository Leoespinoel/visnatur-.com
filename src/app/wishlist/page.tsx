import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <AccountPage current="/wishlist">
      <WishlistView />
    </AccountPage>
  );
}
