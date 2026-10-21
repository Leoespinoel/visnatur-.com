import { readdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AccountNav } from "@/components/AccountPage";
import { ClubMember } from "@/components/club/ClubMember";
import { buildLeague, computeClub, parseStore, type ClubInput, type LeagueDrop, type LeagueMember } from "@/lib/club-ledger";

export const metadata = { title: "The club preview", robots: { index: false } };

/**
 * Development only: the signed-in /members page without signing in (Shopify only signs in on the live https address).
 * `?f=<name>` reads ~/.vis-naturae/club-fixtures/<name>.json, outside the repo so no test data ships: the same input the
 * API builds from Shopify ({ firstName, createdAt, lettersLive, orders, store }, plus an optional `now` and `live`), run
 * through the real computeClub. An optional `league` ([{ id, name, ...ClubInput }]) and `drop` ({ id, name }) build the
 * leaderboard band with the fixture's own member as "you" (id "you"). Nothing can be claimed or saved here.
 */
const DIR = join(homedir(), ".vis-naturae", "club-fixtures");

async function Preview({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f = "" } = await searchParams;
  const names = (await readdir(DIR).catch(() => [] as string[])).filter((n) => n.endsWith(".json")).map((n) => n.slice(0, -5));
  if (!/^[a-z0-9-]+$/.test(f) || !names.includes(f)) {
    return (
      <section className="container-x py-20">
        <h1 className="display text-4xl">The club preview</h1>
        <p className="mt-4 text-sm text-ink-2">Fixtures in {DIR}:</p>
        <ul className="mt-4 space-y-2">
          {names.map((n) => (
            <li key={n}>
              <a href={`?f=${n}`} className="link-underline">
                {n}
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  const raw = JSON.parse(await readFile(join(DIR, `${f}.json`), "utf8")) as ClubInput & { now?: string; live?: boolean; league?: (ClubInput & { id: string; name: string })[]; drop?: LeagueDrop };
  const now = raw.now ? Date.parse(raw.now) : undefined;
  const input: ClubInput = { ...raw, store: parseStore(raw.store) };
  const view = computeClub(input, now, raw.live ?? true);
  if (raw.league) {
    const others: LeagueMember[] = raw.league.map(({ id, name, ...m }) => ({ id, name, input: { ...m, store: parseStore(m.store) } }));
    view.league = buildLeague([{ id: "you", name: raw.firstName || "You", input }, ...others], "you", { ...(now ? { now } : {}), ...(raw.drop ? { drop: raw.drop } : {}) });
  }
  return (
    <>
      <AccountNav current="/members" />
      <ClubMember initial={view} preview />
    </>
  );
}

export default function ClubPreviewPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Suspense fallback={null}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}
