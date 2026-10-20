import type { Metadata } from "next";
import { AccountOrders } from "@/components/AccountOrders";
import { AccountPage } from "@/components/AccountPage";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

export default function OrdersPage() {
  return (
    <AccountPage current="/account/orders">
      <AccountOrders />
    </AccountPage>
  );
}
