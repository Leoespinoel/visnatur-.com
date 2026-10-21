"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { earn, earnPictures, type EarnId } from "@/data/members";
import { site } from "@/data/site";
import { membersMailto } from "@/data/stories";
import type { ClubView } from "@/lib/club-ledger";
import { BandHeading } from "./BandHeading";
import { dayMonth, roomOf } from "./format";
import type { ClubAct } from "./ClubMember";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const action = "eyebrow link-underline !text-ink disabled:opacity-50";

/** Month and day, once: points come every year from the next birthday. */
function BirthdayForm({ act, onNote }: { act: ClubAct; onNote: (s: string) => void }) {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [busy, setBusy] = useState(false);
  const days = month ? new Date(Date.UTC(2024, Number(month), 0)).getUTCDate() : 31;
  const select = "border-b border-line bg-transparent py-1 text-sm focus:border-ink focus:outline-none";
  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!month || !day) return onNote("Please choose a month and a day.");
        setBusy(true);
        const res = await act({ action: "birthday", md: `${month.padStart(2, "0")}-${day.padStart(2, "0")}` });
        setBusy(false);
        if (!res.ok) onNote(res.error ?? res.message ?? "Please try again.");
      }}
    >
      <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.2em] text-muted">
        Month
        <select value={month} onChange={(e) => setMonth(e.target.value)} className={select}>
          <option value="">–</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={String(i + 1)}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.2em] text-muted">
        Day
        <select value={day} onChange={(e) => setDay(e.target.value)} className={select}>
          <option value="">–</option>
          {Array.from({ length: days }, (_, i) => (
            <option key={i} value={String(i + 1)}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={busy} className={`${action} pb-1.5`}>
        {busy ? "Saving…" : "Add"}
      </button>
    </form>
  );
}

/** Level up: every way to earn, with what the member has done and a way to do the rest. White. */
export function ClubLevelUp({ view, act }: { view: ClubView; act: ClubAct }) {
  const [notes, setNotes] = useState<Partial<Record<EarnId, string>>>({});
  const [busy, setBusy] = useState<EarnId | null>(null);
  const note = (id: EarnId) => (s: string) => setNotes((n) => ({ ...n, [id]: s }));
  const room = roomOf(view.room);

  const run = async (id: EarnId, body: Record<string, unknown>) => {
    setBusy(id);
    const res = await act(body);
    setBusy(null);
    if (!res.ok || res.message) note(id)(res.error ?? res.message ?? "Please try again.");
  };

  const done: Record<EarnId, boolean> = {
    join: true,
    order: false,
    letters: view.done.letters,
    instagram: view.done.instagram,
    friend: false,
    birthday: Boolean(view.done.birthday),
    "members-only": view.done.membersOnly,
  };

  const control: Record<EarnId, ReactNode> = {
    join: <span className="text-sm text-ink-2">Welcome points, the day you joined.</span>,
    order: (
      <>
        <span className="text-sm text-ink-2">In {room.name}</span>
        <Link href="/shop" className={action}>
          Shop
        </Link>
      </>
    ),
    letters: view.done.letters ? (
      <span className="text-sm text-ink-2">You&rsquo;re on the list.</span>
    ) : (
      <button type="button" disabled={busy === "letters"} onClick={() => run("letters", { action: "letters" })} className={action}>
        {busy === "letters" ? "Signing up…" : "Sign me up"}
      </button>
    ),
    instagram: view.done.instagram ? (
      <span className="text-sm text-ink-2">Thank you for following.</span>
    ) : (
      <a href={site.instagram} target="_blank" rel="noopener noreferrer" onClick={() => void run("instagram", { action: "instagram" })} className={action}>
        Follow @{site.instagram.split("/").pop()}
      </a>
    ),
    friend: <span className="text-sm text-muted">Opening soon.</span>,
    birthday: view.done.birthday ? <span className="text-sm text-ink-2">On {dayMonth(view.done.birthday)}, every year.</span> : <BirthdayForm act={act} onNote={note("birthday")} />,
    "members-only": view.done.membersOnly ? (
      <span className="text-sm text-ink-2">Thank you for putting in more.</span>
    ) : (
      <a href={membersMailto} className={action}>
        Write to us
      </a>
    ),
  };

  return (
    <section id="level-up" className="scroll-mt-40 py-16 md:py-24">
      <div className="container-x">
        <BandHeading eyebrow="Level up" title="Ways to earn.">
          Points for every order, and for a few things that take a minute. Each one counts once, birthdays every year.
        </BandHeading>
        <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {earn.map((e) => (
            <li key={e.id} className="flex flex-col">
              <div className="image-frame aspect-square">
                <Image src={earnPictures[e.id]} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-serif text-5xl leading-none">{e.value === null ? room.multiplier : `+${e.value}`}</p>
                  <p className="mt-2 text-sm">{e.value === null ? "points for every €1, on every order" : e.action}</p>
                </div>
                {done[e.id] && <span className="absolute right-4 top-4 rounded-full bg-paper px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink">Done</span>}
              </div>
              <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-line py-3">{control[e.id]}</div>
              {notes[e.id] && (
                <p role="status" className="mt-2 text-xs text-ink-2">
                  {notes[e.id]}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
