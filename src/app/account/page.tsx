import type { Metadata } from "next";
import Link from "next/link";
import { AccountPage } from "@/components/AccountPage";
import { signInHref } from "@/data/account";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function Account() {
  return (
    <AccountPage current="/account">
      <section className="container-x py-20 text-center md:py-28">
        <h1 className="display text-5xl md:text-7xl">Your account</h1>
        <p className="mx-auto mt-5 max-w-md text-ink-2 md:text-lg">
          Sign in to see your orders and keep your details up to date. No password needed: you get a code by email.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={signInHref} className="pill">
            Sign in
          </a>
          <Link href="/wishlist" className="pill">
            My wishlist
          </Link>
        </div>
      </section>
    </AccountPage>
  );
}
