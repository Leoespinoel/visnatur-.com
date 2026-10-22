"use client";

import { useState } from "react";
import type { ClubView, LeagueRow, LeagueTable, LeagueTableId } from "@/lib/club-ledger";
import { BandHeading } from "./BandHeading";
import { HistoryTable } from "./ClubHistory";
import { pts, roomOf, two } from "./format";

/** One table of the leaderboard: the top rows, then "…" and the member's own row when they're further down. */
function Table({ table }: { table: LeagueTable }) {
  if (table.empty) return <p className="border-t border-line py-10 text-sm text-ink-2">{table.empty}</p>;
  const outside = table.you && !table.rows.some((r) => r.you);
  const rows: (LeagueRow | "gap")[] = outside ? [...table.rows, "gap", table.you!] : table.rows;
  return (
    <table className="w-full border-t border-line text-sm md:max-w-5xl">
      <thead className="sr-only md:not-sr-only">
        <tr className="border-b border-line text-left">
          {["Position", "Member", "Spot", "Points"].map((h, i) => (
            <th key={h} scope="col" className={`eyebrow py-4 font-normal ${i === 3 ? "text-right" : ""} ${i === 2 ? "pl-8" : ""}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) =>
          r === "gap" ? (
            <tr key="gap" aria-hidden="true" className="border-b border-line">
              <td colSpan={4} className="py-3 text-center text-muted">
                …
              </td>
            </tr>
          ) : (
            <tr
              key={`${r.rank}-${r.name}-${i}`}
              aria-current={r.you ? "true" : undefined}
              className={`grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1 border-b border-line py-4 md:table-row md:py-0 ${r.you ? "text-red" : ""}`}
            >
              <td className="font-serif text-xl tabular-nums md:py-4 md:text-sm">{two(r.rank)}</td>
              <td className="md:py-4">
                {r.name}
                {r.you && <span className="eyebrow ml-3 !text-red">You</span>}
              </td>
              <td className={`col-start-2 row-start-2 text-[11px] uppercase tracking-[0.18em] md:py-4 md:pl-8 ${r.you ? "text-red" : "text-muted"}`}>{roomOf(r.room).name}</td>
              <td className="col-start-3 row-span-2 row-start-1 self-center text-right font-serif text-xl tabular-nums md:py-4">{pts(r.points)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

/**
 * Leaderboard: every member in order, three tables (the current drop, this month, all time), the member's own row in red.
 * Grey. Without a leaderboard on the view (the Admin access not set up yet) the member stands alone at 01. The member's own
 * ledger stays under "Your history".
 */
export function ClubLeague({ view }: { view: ClubView }) {
  const league = view.league;
  const tables: LeagueTable[] = league?.tables ?? [
    {
      id: "all",
      label: "All time",
      note: "Points earned since the club opened.",
      rows: [{ name: view.firstName || "You", room: view.room, points: view.balance + view.pending, rank: 1, you: true }],
      you: null,
    },
  ];
  const first = tables.find((t) => t.id === "drop" && !t.empty) ?? tables.find((t) => t.id === "month" && !t.empty) ?? tables[0];
  const [current, setCurrent] = useState<LeagueTableId>(first.id);
  const [history, setHistory] = useState(false);
  const table = tables.find((t) => t.id === current) ?? tables[0];

  return (
    <section id="leaderboard" className="scroll-mt-40 bg-surface py-16 md:py-24">
      <div className="container-x">
        <BandHeading eyebrow="Leaderboard" title="Every member, in order.">
          Points earned, including those on their way. {league ? "Updated every quarter of an hour." : "The table fills as members join."}
        </BandHeading>

        {tables.length > 1 && (
          <div role="tablist" aria-label="Leaderboard tables" className="no-scrollbar mb-8 flex gap-8 overflow-x-auto">
            {tables.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === current}
                onClick={() => setCurrent(t.id)}
                className={`eyebrow flex shrink-0 items-center gap-2 py-2 transition-colors ${t.id === current ? "!text-ink" : "hover:!text-ink"}`}
              >
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full transition-colors ${t.id === current ? "bg-red" : "bg-transparent"}`} />
                {t.label}
              </button>
            ))}
          </div>
        )}

        <p className="mb-6 text-sm text-ink-2">{table.note}</p>
        <Table table={table} />

        <div className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3">
          {league && (
            <p className="text-sm text-ink-2">
              {league.members.toLocaleString("en-GB")} member{league.members === 1 ? "" : "s"} on the leaderboard.
            </p>
          )}
          <button type="button" onClick={() => setHistory((h) => !h)} aria-expanded={history} aria-controls="your-history" className="eyebrow link-underline !text-ink">
            {history ? "Hide your history" : "Your history"}
          </button>
        </div>
        {history && (
          <div id="your-history" className="mt-10">
            <p className="eyebrow mb-6">Every point, accounted for.</p>
            <HistoryTable view={view} />
          </div>
        )}
      </div>
    </section>
  );
}
