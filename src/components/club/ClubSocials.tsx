"use client";

import { useState } from "react";
import { socialNetworks, type SocialId } from "@/data/members";
import type { ClubView } from "@/lib/club-ledger";
import type { ClubAct } from "./ClubMember";

const field = "w-full border-b border-line bg-transparent py-2 text-base placeholder:text-muted focus:border-ink focus:outline-none";

/**
 * The member's socials, at the foot of Level up (Leo, 2026-10-22): the handles they share show on the search bar on /stories
 * (MemberFinder.tsx) with their first name and initial. Empty fields keep them off it; saving with every field empty takes them off.
 */
export function ClubSocials({ view, act }: { view: ClubView; act: ClubAct }) {
  const [values, setValues] = useState<Record<SocialId, string>>(() => Object.fromEntries(socialNetworks.map((n) => [n.id, view.socials[n.id] ?? ""])) as Record<SocialId, string>);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const shared = socialNetworks.filter((n) => view.socials[n.id]).length;
  const changed = socialNetworks.some((n) => values[n.id].trim().replace(/^@/, "") !== (view.socials[n.id] ?? ""));

  return (
    <div id="socials" className="mt-16 grid gap-8 border-t border-line pt-12 scroll-mt-40 md:mt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12 md:pt-16">
      <div>
        <p className="eyebrow mb-3">In the wild</p>
        <h3 className="display text-3xl md:text-4xl">Let members find you.</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
          Share a handle and anyone on the In the wild page can look you up by name or handle, as {view.firstName ? `${view.firstName} and your initial` : "your first name and initial"}.
          Leave them all empty to stay out of it.{" "}
          {shared > 0 && <span className="text-ink">You can be found on {shared === 1 ? "one network" : `${shared} networks`}.</span>}
        </p>
      </div>
      <form
        className="grid gap-6 sm:grid-cols-3 sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setNote(null);
          const res = await act({ action: "socials", socials: values });
          setBusy(false);
          setNote(res.ok ? "Saved. Members can find you on the In the wild page." : res.error ?? res.message ?? "Please try again.");
        }}
      >
        {socialNetworks.map((n) => (
          <label key={n.id} className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.2em] text-muted">
            {n.name}
            <input
              type="text"
              value={values[n.id]}
              onChange={(e) => setValues((v) => ({ ...v, [n.id]: e.target.value }))}
              placeholder="@handle"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={120}
              className={field}
            />
          </label>
        ))}
        <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
          <button type="submit" disabled={busy || !changed} className="btn btn-outline">
            {busy ? "Saving…" : "Save"}
          </button>
          {note && (
            <p role="status" className="text-xs text-ink-2">
              {note}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
