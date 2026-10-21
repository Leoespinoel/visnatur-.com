"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ordersHref, profileHref, signInHref } from "@/data/account";
import { signOutLocally, useAccount } from "@/lib/account-sync";

const noop = () => () => {};

/** /account's body: sign in, or (signed in) the customer's name, their account and Sign out. */
export function AccountHome() {
  const account = useAccount();
  // /account/callback sends a failed sign-in back with ?signin=failed.
  const failed = useSyncExternalStore(noop, () => new URLSearchParams(window.location.search).get("signin") === "failed", () => false);

  if (account.status === "unknown") return <section className="min-h-[26rem]" aria-busy="true" />;

  if (account.status === "signed-out") {
    return (
      <section className="container-x py-20 text-center md:py-28">
        <h1 className="display text-5xl md:text-7xl">Your account</h1>
        <p className="mx-auto mt-5 max-w-md text-ink-2 md:text-lg">
          Sign in to see your orders, keep your details up to date and have your sizes and wishlist on any device. No password needed: you get a code by email.
        </p>
        {failed && (
          <p role="alert" className="mx-auto mt-5 max-w-md text-sm text-ink">
            Signing in didn&rsquo;t work that time. Please try again.
          </p>
        )}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href={signInHref} className="pill">
            Sign in
          </a>
          <Link href="/wishlist" className="pill">
            My wishlist
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-2">
          Not a member yet?{" "}
          <Link href="/account/register" className="link-underline !text-ink">
            Become a member
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="container-x py-20 text-center md:py-28">
      <p className="eyebrow mb-4">Members only</p>
      <h1 className="display text-5xl md:text-7xl">{account.firstName ? `Hello, ${account.firstName}.` : "Your account"}</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-2 md:text-lg">
        {account.email ? <>Signed in as {account.email}. </> : null}Your sizes and wishlist are saved to your account, so they are there on any device.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/members" className="pill">
          Members only
        </Link>
        <Link href={ordersHref} className="pill">
          Orders
        </Link>
        <Link href={profileHref} className="pill">
          Profile
        </Link>
        <Link href="/account/sizes" className="pill">
          My sizes
        </Link>
        <Link href="/wishlist" className="pill">
          My wishlist
        </Link>
      </div>
      <form method="post" action="/account/logout" onSubmit={signOutLocally} className="mt-6">
        <button type="submit" className="link-underline text-sm !text-ink">
          Sign out
        </button>
      </form>
    </section>
  );
}
