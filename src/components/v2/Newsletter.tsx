"use client";

import { useState, type FormEvent } from "react";

/** "Get on the list": an email box and a button. No mailing-list provider is connected yet (same as the classic Newsletter). */
export function V2Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // No mailing-list provider is connected yet. Swap this for a POST to your provider (Klaviyo, Mailchimp, Resend…).
    setDone(true);
  }

  return done ? (
    <p className="v2-wide text-[1.1rem]">You&rsquo;re on the list. We write when there&rsquo;s something to say.</p>
  ) : (
    <form onSubmit={submit} className="flex w-full max-w-xl">
      <label htmlFor="v2-email" className="sr-only">
        Email
      </label>
      <input
        id="v2-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="v2-mono h-14 min-w-0 flex-1 border-[1.5px] border-ink bg-white px-4 !text-[0.85rem] normal-case placeholder:text-muted focus:outline-none"
      />
      <button type="submit" className="v2-btn -ml-[1.5px] !min-h-14 shrink-0">
        Sign up
      </button>
    </form>
  );
}
