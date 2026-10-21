// Prints what The VN Club engine (src/lib/club-ledger.ts) makes of one member's input: balance, room, wallet and the
// history, to check against numbers worked out by hand. The input is the JSON /dev/club reads (a fixture in
// ~/.vis-naturae/club-fixtures/, outside the repo), with an optional "now".
//
//   node --import ./scripts/ts-resolve.mjs scripts/club-ledger-check.mts ~/.vis-naturae/club-fixtures/terrace.json [--now 2027-03-10]

import { readFileSync } from "node:fs";
import { computeClub, parseStore, type ClubInput } from "../src/lib/club-ledger.ts";

const [file] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!file) {
  console.error("Usage: club-ledger-check.mts <fixture.json> [--now YYYY-MM-DD]");
  process.exit(1);
}
const nowArg = process.argv.indexOf("--now");
const raw = JSON.parse(readFileSync(file, "utf8")) as ClubInput & { now?: string };
const now = nowArg > 0 ? Date.parse(process.argv[nowArg + 1]) : raw.now ? Date.parse(raw.now) : Date.now();
const v = computeClub({ ...raw, store: parseStore(raw.store) }, now);

console.log(`As of ${new Date(now).toISOString().slice(0, 10)}`);
console.log(`  balance ${v.balance}   pending ${v.pending}   earned (12 months) ${v.earned}   room ${v.room}`);
console.log(`  next ${v.next ? `${v.next.points} to ${v.next.room}` : "—"}   expires ${v.expiresOn?.slice(0, 10) ?? "—"}`);
console.log(`  done ${JSON.stringify(v.done)}`);
console.log("Wallet");
for (const w of v.wallet) console.log(`  ${w.at.slice(0, 10)}  ${w.reward.padEnd(16)} ${String(w.points).padStart(5)}  ${w.status}${w.usedOn ? ` on ${w.usedOn}` : ""}${w.code ? `  ${w.code}` : ""}`);
console.log("History");
for (const h of v.history) console.log(`  ${h.at.slice(0, 10)}  ${h.what.padEnd(28)} ${String(h.points).padStart(6)}  ${h.status}`);
