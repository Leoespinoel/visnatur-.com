"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { rooms } from "@/data/members";
import type { ClubView } from "@/lib/club-ledger";
import { updateAccount } from "@/lib/account-sync";
import { BandHeading } from "./BandHeading";
import { ClubFaq } from "./ClubFaq";
import { ClubHero } from "./ClubHero";
import { ClubLeague } from "./ClubLeague";
import { ClubLevelUp } from "./ClubLevelUp";
import { ClubRewards, ClubWallet } from "./ClubRewards";
import { ClubStatus } from "./ClubStatus";
import { ClubTabs } from "./ClubTabs";
import { pts, roomNo } from "./format";
import { RoomCard } from "./RoomCard";
import { Newsletter } from "@/components/Newsletter";

export type ClubResult = { ok: boolean; error?: string; message?: string; code?: string; endsAt?: string; requested?: boolean };
export type ClubAct = (body: Record<string, unknown>) => Promise<ClubResult>;

/** While the club loads (two calls to Shopify): the badger, breathing. */
function Opening({ error, retry }: { error: string | null; retry: () => void }) {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-4 text-center" aria-busy={!error}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/badger-mark.svg" alt="" className="w-40 animate-[club-breathe_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />
      {error ? (
        <>
          <p role="alert" className="text-sm text-ink-2">
            {error}
          </p>
          <button type="button" onClick={retry} className="btn btn-outline">
            Try again
          </button>
        </>
      ) : (
        <p className="eyebrow">Opening the club</p>
      )}
    </section>
  );
}

/**
 * /members for a signed-in member (Leo, 2026-10-20, after nude-project.com's member page): their room, points, card,
 * rewards, ways to earn, rooms, the leaderboard and the FAQ. Bands run white → black → grey → black (rewards, Leo 2026-10-21) → white → black → grey → red.
 * `initial` and `preview` are for /dev/club, which shows the page with local test data and saves nothing.
 */
export function ClubMember({ initial, preview = false }: { initial?: ClubView; preview?: boolean }) {
  const router = useRouter();
  const [view, setView] = useState<ClubView | null>(initial ?? null);
  const [error, setError] = useState<string | null>(null);

  // The sign-in has lapsed: the server already cleared it, so a refresh shows the public page.
  const signedOut = useCallback(() => {
    updateAccount({ status: "signed-out" });
    router.refresh();
  }, [router]);

  const load = useCallback(() => {
    return fetch("/api/account/club", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) return signedOut();
        const json = (await res.json()) as ClubView & { error?: string };
        if (!res.ok) throw new Error(json.error);
        setView(json);
      })
      .catch((err: Error) => setError(err.message || "We couldn't open your club. Please try again."));
  }, [signedOut]);

  useEffect(() => {
    if (!initial) void load();
  }, [initial, load]);
  const retry = () => {
    setError(null);
    void load();
  };

  const act: ClubAct = useCallback(
    async (body) => {
      if (preview) return { ok: false, message: "Preview: nothing is saved." };
      try {
        const res = await fetch("/api/account/club", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (res.status === 401) {
          signedOut();
          return { ok: false, error: "Please sign in again." };
        }
        const json = (await res.json()) as Omit<ClubResult, "ok"> & { view?: ClubView };
        if (json.view) setView(json.view);
        return { ok: res.ok, ...json };
      } catch {
        return { ok: false, error: "No connection. Please try again." };
      }
    },
    [preview, signedOut],
  );

  if (!view) return <Opening error={error} retry={retry} />;
  const current = roomNo(view.room);

  return (
    <>
      <ClubHero view={view} />
      <ClubStatus view={view} />
      <ClubTabs />
      <ClubWallet view={view} />
      <ClubRewards view={view} act={act} />
      <ClubLevelUp view={view} act={act} />

      {/* Rooms: where the member stands. Black. */}
      <section id="rooms" className="theme-dark scroll-mt-40 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Spots" title="Where you stand.">
            Each spot comes with its own perks. Your spot follows the points earned in the last twelve months, and nobody moves down.
          </BandHeading>
          <ol className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {rooms.map((r, i) => (
              <li key={r.id}>
                <RoomCard room={r} state={i === current ? "current" : i < current ? "reached" : "locked"} note={i > current ? `${pts(r.min)} points in twelve months` : undefined} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClubLeague view={view} />
      <ClubFaq />
      {/* The letters, red, last: the member is greeted by the name on the account. */}
      <Newsletter defaultName={view.firstName || undefined} />
    </>
  );
}
