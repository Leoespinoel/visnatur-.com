"use client";

import type { ReactNode } from "react";
import { signInHref } from "@/data/account";
import { useAccount } from "@/lib/account-sync";

/** An account page that needs the customer signed in: a sign-in prompt when they aren't, the page when they are. */
export function AccountGate({ title, what, path, children }: { title: string; what: string; path: string; children: ReactNode }) {
  const account = useAccount();
  if (account.status === "unknown") return <section className="min-h-[26rem]" aria-busy="true" />;
  if (account.status === "signed-out") {
    return (
      <section className="container-x py-20 text-center md:py-28">
        <h1 className="display text-5xl md:text-7xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-md text-ink-2 md:text-lg">Sign in to see {what}. No password needed: you get a code by email.</p>
        <div className="mt-9 flex justify-center">
          <a href={`${signInHref}?return=${encodeURIComponent(path)}`} className="pill">
            Sign in
          </a>
        </div>
      </section>
    );
  }
  return <>{children}</>;
}
