"use client";

import { useState, type FormEvent } from "react";
import { ArrowIcon } from "./Icons";

const mono = "font-mono text-[11px] uppercase tracking-[0.22em]";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // No mailing-list provider is connected yet. Swap this for a POST to your provider (Klaviyo, Mailchimp, Resend…).
    setDone(true);
  }

  if (compact) {
    return (
      <div>
        <p className="eyebrow mb-5">Letters</p>
        {done ? (
          <p className="text-sm text-ink-2">Thank you. We write rarely.</p>
        ) : (
          <form onSubmit={submit} className="flex border-b border-ink">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent py-2 text-sm placeholder:text-muted focus:outline-none"
            />
            <button type="submit" aria-label="Subscribe" className="p-2">
              <ArrowIcon width={16} height={16} />
            </button>
          </form>
        )}
      </div>
    );
  }

  /* Full-bleed red block: eyebrow + "FOLLOW the JOURNEY" on the left, underline fields on the right. */
  return (
    <section className="bg-red text-paper">
      <div className="container-x grid gap-14 py-20 md:grid-cols-[5fr_7fr] md:items-center md:gap-10 md:py-28">
        <div className="md:pl-[8%]">
          <p className={`${mono} flex items-center gap-3`}>
            <span className="h-px w-6 bg-paper" aria-hidden="true" />
            Behind the scenes
          </p>
          <h2 className="headline mt-7 text-6xl leading-[0.88] md:text-[6.5rem]">
            <span className="block">First</span>
            <span className="block">
              <em className="mr-3 font-serif text-[0.72em] font-normal italic normal-case">to</em>Know
            </span>
          </h2>
        </div>

        {done ? (
          <p className="text-base">You&rsquo;re on the list. We write rarely, and you&rsquo;ll hear first.</p>
        ) : (
          <form onSubmit={submit} className="grid gap-10 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-6 md:pl-[6%]">
            <div>
              <label htmlFor="newsletter-name" className={`${mono} block`}>
                Name
              </label>
              <input
                id="newsletter-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-6 w-full border-b border-paper/40 bg-transparent pb-3 text-base placeholder:text-paper/55 focus:border-paper focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="newsletter-email" className={`${mono} block`}>
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-6 w-full border-b border-paper/40 bg-transparent pb-3 text-base placeholder:text-paper/55 focus:border-paper focus:outline-none"
              />
            </div>
            <button type="submit" className={`${mono} inline-flex items-center gap-2 pb-3 text-paper transition-opacity hover:opacity-70`}>
              Join the list
              <ArrowIcon width={14} height={14} className="-rotate-45" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
