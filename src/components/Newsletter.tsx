"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowIcon } from "./Icons";
import { MarqueeTrack } from "./MarqueeTrack";

/** Labels on the red band, in the site's eyebrow style. */
const label = "eyebrow block !text-paper/85";
const field = "mt-6 w-full border-b border-paper/40 bg-transparent pb-3 text-base placeholder:text-paper/55 focus:border-paper focus:outline-none";

/**
 * What the letters hold: the strip sliding along the band's edges, the line under the salutation and the open question at the
 * end of the form. One set for every page the band sits on (Leo, 2026-10-22: "make this the same for all newsletter
 * sections"; from 2026-10-21 each page had its own).
 */
const letters = {
  subjects: ["Drop dates, before anyone", "The cutting table", "Mauritius", "New colours first", "The fifth, with the accounts", "Member nights", "What we got wrong"],
  line: "We write when there is a story worth telling, a voice worth hearing or a piece worth wearing. So that you experience them first.",
  ask: { label: "What should we make next?", placeholder: "A piece, a colour, a place" },
};

/**
 * The kinds of letter, named after what we write about. The first three follow the homepage line (Leo, 2026-10-22: "a story worth
 * telling, a voice worth hearing or a piece worth wearing"); then drops, the workshop and the fifth.
 */
const topics = [
  { id: "stories", label: "Stories" },
  { id: "voices", label: "Voices" },
  { id: "new-pieces", label: "New pieces" },
  { id: "drops", label: "Drops" },
  { id: "behind-the-scenes", label: "Behind the scenes" },
  { id: "the-fifth", label: "The fifth" },
] as const;
type TopicId = (typeof topics)[number]["id"];

export function Newsletter({ compact = false, defaultName }: { compact?: boolean; defaultName?: string }) {
  /* The name typed here, or until then the account's (the member page passes it), so a member is greeted by name. */
  const [typed, setTyped] = useState<string | null>(null);
  const name = typed ?? defaultName ?? "";
  const setName = setTyped;
  const [email, setEmail] = useState("");
  const [chosen, setChosen] = useState<TopicId[]>(topics.map((t) => t.id));
  const [wish, setWish] = useState("");
  const [done, setDone] = useState(false);

  /* The headline is the letter's opening line: the first name typed, or "Legend" (Leo, 2026-10-22; "Badger" before that) until then. */
  const first = name.trim().split(/\s+/)[0];
  const dear = first || "Legend";

  function toggle(id: TopicId) {
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // No mailing-list provider is connected yet. Swap this for a POST of { name, email, topics: chosen, wish } to your
    // provider (Klaviyo, Mailchimp, Resend…).
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

  /* Full-bleed red block in the house style (Leo, 2026-10-20), made a letter (Leo, 2026-10-21): a strip of what the letters
     hold slides along the top; the serif title is the salutation and takes the name as it is typed; the form asks which
     letters and what to make next; on joining, the form gives way to an envelope that seals itself with the badger; and the
     badger brings the post in the corner. */
  return (
    <section className="relative overflow-hidden bg-red text-paper md:flex md:min-h-[41rem] md:flex-col">
      <Strip subjects={letters.subjects} className="border-b border-paper/20" />

      {/* The postman: the plush badger bringing the letter, drifting in the band's bottom-left corner on wide screens. */}
      {/* He stands on the bottom strip (its height: the eyebrow line plus py-2.5 and the border). */}
      <div className="pointer-events-none absolute bottom-[2.1rem] left-[4%] hidden h-[280px] md:block" aria-hidden="true">
        <Image src="/images/club/mascot/postman-chair-glint.png" alt="" width={883} height={1200} unoptimized className="badger-float h-full w-auto" />
      </div>

      <div className="container-x grid gap-14 py-20 md:grid-cols-[5fr_7fr] md:grow md:items-start md:gap-10 md:py-28">
        <div className="relative pr-28 md:pl-[8%] md:pr-0">
          <p className={label}>Letters</p>
          <h2 className="display mt-4 break-words text-5xl md:text-7xl">
            Dear <em className="italic">{dear}</em>,
          </h2>
          <p className="mt-6 max-w-xs text-base text-paper/85">{letters.line}</p>
          {/* The same badger, small, beside the title on phones. */}
          <Image src="/images/club/mascot/postman-chair-glint.png" alt="" width={883} height={1200} unoptimized aria-hidden="true" className="badger-float pointer-events-none absolute right-0 top-0 h-36 w-auto md:hidden" />
        </div>

        {done ? (
          <div className="env-wrap env-in md:pl-[6%]" role="status">
            <div className="env mx-auto max-w-md">
              <div className="env-flap" />
              <div className="env-seal" />
              <div className="env-face">
                <p className="display text-xl md:text-2xl">Dear {dear},</p>
                <p className="mt-1 text-xs md:mt-2 md:text-sm">You&rsquo;re on the list. We write rarely, and you read it first.</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-10 md:pl-[6%]">
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
              <div>
                <label htmlFor="newsletter-name" className={label}>
                  Name
                </label>
                <input id="newsletter-name" type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
              </div>
              <div>
                <label htmlFor="newsletter-email" className={label}>
                  Email
                </label>
                <input id="newsletter-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
              </div>
            </div>

            <div>
              <p className={label} id="newsletter-topics">
                I&rsquo;d like to hear about
              </p>
              <div className="mt-5 flex flex-wrap gap-2" role="group" aria-labelledby="newsletter-topics">
                {topics.map((t) => {
                  const on = chosen.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(t.id)}
                      className={`h-9 rounded-full border px-4 text-[13px] transition-colors ${on ? "border-paper bg-paper text-ink" : "border-paper/50 text-paper/85 hover:border-paper"}`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="newsletter-wish" className={label}>
                {letters.ask.label}
              </label>
              <input id="newsletter-wish" type="text" value={wish} onChange={(e) => setWish(e.target.value)} placeholder={letters.ask.placeholder} className={field} />
            </div>

            <div className="flex sm:justify-end">
              <button type="submit" className="btn btn-ghost w-full min-w-[140px] sm:w-auto">
                Join the list
              </button>
            </div>
          </form>
        )}
      </div>

      <Strip subjects={letters.subjects} className="border-t border-paper/20" reverse />
    </section>
  );
}

/** The strip of what the letters hold, sliding along the band's top edge, and the other way along its bottom. */
function Strip({ subjects, className, reverse = false }: { subjects: string[]; className: string; reverse?: boolean }) {
  const strip = [...subjects, ...subjects];
  return (
    <div className={`overflow-hidden ${className}`} aria-label="What the letters hold" aria-hidden={reverse || undefined}>
      <MarqueeTrack className={`py-2.5 ${reverse ? "marquee-reverse" : ""}`}>
        {strip.map((text, i) => (
          <span key={i} className="eyebrow !text-paper/75 whitespace-nowrap px-6" aria-hidden={i >= subjects.length}>
            {text}
            <span className="ml-6 opacity-50">·</span>
          </span>
        ))}
      </MarqueeTrack>
    </div>
  );
}
