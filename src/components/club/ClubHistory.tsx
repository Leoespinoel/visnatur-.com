"use client";

import { useState } from "react";
import type { ClubView, HistoryStatus } from "@/lib/club-ledger";
import { shortDate, signed } from "./format";

const tone: Record<HistoryStatus, string> = {
  Pending: "text-muted",
  Added: "text-ink",
  Spent: "text-ink",
  Returned: "text-red",
  Expired: "text-muted",
};

/** The member's own history: every point in and out, newest first. Under "Your history" in the leaderboard band. */
export function HistoryTable({ view }: { view: ClubView }) {
  const [all, setAll] = useState(false);
  const rows = all ? view.history : view.history.slice(0, 20);
  return (
    <>
        <table className="w-full border-t border-line text-sm md:max-w-5xl">
          <thead className="sr-only md:not-sr-only">
            <tr className="border-b border-line text-left">
              {["Date", "What", "Points", "Status"].map((h, i) => (
                <th key={h} scope="col" className={`eyebrow py-4 font-normal ${i === 2 ? "text-right" : ""} ${i === 3 ? "pl-8" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.at}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-line py-4 md:table-row md:py-0">
                <td className="text-xs text-muted md:py-4 md:text-sm md:text-ink-2">{shortDate(r.at)}</td>
                <td className="col-start-1 row-start-2 md:py-4">{r.what}</td>
                <td className="col-start-2 row-span-2 row-start-1 self-center text-right font-serif text-xl tabular-nums md:py-4">{signed(r.points)}</td>
                <td className={`col-start-1 row-start-3 text-[11px] uppercase tracking-[0.18em] md:py-4 md:pl-8 ${tone[r.status]}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {view.history.length > 20 && (
          <button type="button" onClick={() => setAll((a) => !a)} className="eyebrow link-underline mt-8 !text-ink">
            {all ? "Show fewer" : `Show all ${view.history.length}`}
          </button>
        )}
    </>
  );
}
