import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";
import { MySizesForm } from "@/components/MySizesForm";

export const metadata: Metadata = { title: "My sizes", robots: { index: false } };

/** My sizes (Leo, 2026-10-20): the customer's own measurements, saved in this browser and on the account when signed in, used by Made to order. */
export default function MySizesPage() {
  return (
    <AccountPage current="/account/sizes">
      <section className="container-x max-w-4xl py-12 md:py-16">
        <p className="eyebrow mb-3">Account</p>
        <h1 className="display text-4xl md:text-5xl">My sizes.</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
          Your measurements and usual sizes, kept on file like a tailor would. Fill in what you know; every field is optional.
        </p>
        <div className="mt-10">
          <MySizesForm />
        </div>
      </section>
    </AccountPage>
  );
}
