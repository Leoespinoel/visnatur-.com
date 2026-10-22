"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { rooms, socialNetworks } from "@/data/members";
import type { FoundMember } from "@/app/api/members/search/route";

type Answer = { members: FoundMember[]; sharing?: number; error?: string };

/**
 * The search bar on /stories, between the film and the wall (Leo, 2026-10-22: "a search engine / bar to find members
 * socials"): type a name or a handle and the members who share their socials on /members come up with their room and the links
 * (/api/members/search). Focusing the empty bar shows the newest to have shared, so it is never blank. Nothing is shown about a
 * member who hasn't chosen to be found.
 */
export function MemberFinder() {
  const id = useId();
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const latest = useRef(0);

  useEffect(() => {
    if (!open) return;
    const n = ++latest.current;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setBusy(true);
      fetch(`/api/members/search?q=${encodeURIComponent(q.trim())}`, { signal: controller.signal })
        .then(async (res) => (await res.json()) as Answer)
        .then((json) => {
          if (n === latest.current) setAnswer(json);
        })
        .catch((err: unknown) => {
          if ((err as Error).name !== "AbortError" && n === latest.current) setAnswer({ members: [], error: "No connection. Please try again." });
        })
        .finally(() => {
          if (n === latest.current) setBusy(false);
        });
    }, q ? 250 : 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, open]);

  const roomName = (room: string) => rooms.find((r) => r.id === room)?.name ?? "";
  const trimmed = q.trim();
  const status = !answer
    ? busy
      ? "Looking…"
      : null
    : answer.error
      ? answer.error
      : answer.members.length === 0
        ? trimmed
          ? "No member by that name yet."
          : "Nobody has shared their socials yet."
        : !trimmed
          ? "The latest members to share theirs."
          : null;

  return (
    <section aria-label="Find a member" className="container-x py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12">
        <div>
          <p className="eyebrow mb-3">Members</p>
          <h2 className="display text-4xl md:text-5xl">Find a member.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
            The people in the pieces, by name or handle. Members choose what to share on their{" "}
            <Link href="/members" className="link-underline">
              club page
            </Link>
            .
          </p>
        </div>

        <div>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="relative"
          >
            <label htmlFor={id} className="sr-only">
              Search members by name or handle
            </label>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 md:h-7 md:w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5 21 21" strokeLinecap="round" />
            </svg>
            <input
              id={id}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder="Name or @handle"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-controls={`${id}-results`}
              className="w-full border-b border-ink bg-transparent py-3 pl-9 pr-10 font-serif text-2xl leading-tight placeholder:text-muted focus:outline-none md:pl-11 md:text-4xl [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear the search"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-2xl leading-none text-muted transition-colors hover:text-ink"
              >
                ×
              </button>
            )}
          </form>

          <div id={`${id}-results`} aria-live="polite" aria-busy={busy} className="min-h-6">
            {status && <p className="pt-4 text-sm text-ink-2">{status}</p>}
            {answer && answer.members.length > 0 && (
              <ul className="divide-y divide-line border-b border-line">
                {answer.members.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-base">{m.name}</span>
                      <span className="eyebrow">{roomName(m.room)}</span>
                    </div>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1">
                      {socialNetworks.map((n) => {
                        const h = m.socials[n.id];
                        return h ? (
                          <li key={n.id}>
                            <a href={n.url(h)} target="_blank" rel="noopener noreferrer" className="link-underline text-sm" aria-label={`${m.name} on ${n.name}: @${h}`}>
                              <span className="eyebrow mr-2">{n.name}</span>@{h}
                            </a>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
