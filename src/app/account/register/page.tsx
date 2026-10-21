import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";
import { clubSignInHref } from "@/data/account";

export const metadata: Metadata = { title: "Become a member", robots: { index: false } };

/** Joining the club is making a Shopify customer account: an email and a code, so the same sign-in also makes new accounts. */
const steps = ["Enter your email on the next page", "Type in the code that comes by email", "You are in the Terrace, with 100 welcome points"];

export default function Register() {
  return (
    <AccountPage current="/members">
      <section className="container-x py-20 text-center md:py-28">
        <p className="eyebrow mb-4">Members only</p>
        <h1 className="display text-5xl md:text-7xl">Become a member</h1>
        <p className="mx-auto mt-5 max-w-md text-ink-2 md:text-lg">
          Free to join. Your account is your membership: orders, details and points in one place. No password needed: you get a code by email.
        </p>
        <ol className="mx-auto mt-10 max-w-md divide-y divide-line border-y border-line text-left">
          {steps.map((s, i) => (
            <li key={s} className="flex items-baseline gap-5 py-4 text-sm text-ink-2">
              <span className="eyebrow !text-ink">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {/* Both come back to /members, the member's own page. */}
          <a href={clubSignInHref} className="pill">
            Create my account
          </a>
          <a href={clubSignInHref} className="pill">
            I&rsquo;m a member
          </a>
        </div>
        <p className="mx-auto mt-6 max-w-md text-xs text-muted">
          Points start counting the day they show in your account. Join before then and the welcome points are waiting.
        </p>
      </section>
    </AccountPage>
  );
}
