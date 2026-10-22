import type { NextRequest } from "next/server";
import { socialNetworks } from "@/data/members";
import { computeClub, type LeagueMember, type Socials } from "@/lib/club-ledger";
import { loadLeagueMembers } from "@/lib/club-store";
import { adminConfigured } from "@/lib/shopify-admin";

/**
 * The search bar on /stories (MemberFinder.tsx): GET ?q= gives the members who share their socials and whose name or handle
 * matches, by first name and initial only, with their room and the links. Without a query, the newest to have shared. Public:
 * the only thing it tells is what a member chose to share on /members (action "socials" in /api/account/club), from the same
 * cached read of all members as the leaderboard, so a visitor's typing never reaches Shopify.
 */

export type FoundMember = { id: string; name: string; room: string; socials: Socials };

const LIMIT = 12;
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const handles = (m: LeagueMember) => socialNetworks.map((n) => m.input.store.socials?.[n.id]).filter((h): h is string => Boolean(h));

/** How well a member matches: a handle or the name starting with the query beats containing it; nothing when neither does. */
function score(m: LeagueMember, q: string): number {
  const keys = [fold(m.name), ...handles(m).map(fold)];
  if (keys.some((k) => k.startsWith(q))) return 2;
  if (keys.some((k) => k.includes(q))) return 1;
  return 0;
}

export async function GET(req: NextRequest) {
  const headers = { "Cache-Control": "private, max-age=60" };
  if (!adminConfigured()) return Response.json({ members: [] }, { headers });
  const q = fold((req.nextUrl.searchParams.get("q") ?? "").trim().replace(/^@/, "")).slice(0, 60);

  let members: LeagueMember[];
  try {
    members = await loadLeagueMembers();
  } catch (err) {
    console.error("Member search: the members could not be read", err);
    return Response.json({ members: [], error: "The search is resting. Please try again in a minute." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const sharing = members.filter((m) => m.input.store.socials);
  const found = q
    ? sharing
        .map((m) => ({ m, s: score(m, q) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || a.m.name.localeCompare(b.m.name))
        .map((x) => x.m)
    : sharing.sort((a, b) => Date.parse(b.input.createdAt) - Date.parse(a.input.createdAt));

  const result: FoundMember[] = found.slice(0, LIMIT).map((m) => ({ id: m.id, name: m.name, room: computeClub(m.input).room, socials: m.input.store.socials ?? {} }));
  return Response.json({ members: result, sharing: sharing.length }, { headers });
}
