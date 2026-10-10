// Generate one take of one still (shot list in scripts/stills-shots.mjs) with Nano Banana Pro on Higgsfield.
//
//   node scripts/generate-stills.mjs <shot-id>       e.g. campaign-swim, p4, riviera-linen-shirt-sky
//   node scripts/generate-stills.mjs --list          shot ids and whether each is approved
//   NO_OPEN=1 node scripts/generate-stills.mjs <id>  don't open the take in Preview
//
// Each run writes stills-src/takes/<id>-t<N>.png (+ .json with prompt and references) and opens it.
// Approve with `node scripts/approve-still.mjs <id> <N>`. 2 credits per take at 2k.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EDITORIAL, GARMENT, REAL, SHOTS, STUDIO } from "./stills-shots.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const takesDir = join(root, "stills-src", "takes");
const modelsDir = join(root, "stills-src", "models");
mkdirSync(takesDir, { recursive: true });

const [, , id] = process.argv;
if (id === "--list") {
  for (const [k, s] of Object.entries(SHOTS)) {
    const done = existsSync(join(root, "stills-src", "approved", `${k}.png`));
    console.log(`${done ? "✓" : " "} ${k.padEnd(40)} → public/${s.out}`);
  }
  process.exit(0);
}
const shot = SHOTS[id];
if (!shot) {
  console.error(`Unknown shot "${id}". Run with --list.`);
  process.exit(1);
}

// References: the person to keep first, then each worn piece's packshot and detail.
const refs = [];
const face = shot.face
  ? [join(root, "stills-src", "images-orig", shot.face), join(root, "public", shot.face)].find((p) => existsSync(p))
  : shot.family && existsSync(join(modelsDir, `${shot.family}.png`)) ? join(modelsDir, `${shot.family}.png`) : null;
if (face && existsSync(face)) refs.push(face);
for (const slug of shot.wear) {
  for (const f of [`${slug}.jpg`, `${slug}-detail.jpg`]) {
    const p = join(root, "public", "products", f);
    if (!existsSync(p)) throw new Error(`missing packshot ${p}`);
    refs.push(p);
  }
}
if (refs.length > 14) throw new Error(`${id}: ${refs.length} references, Nano Banana Pro takes 14`);

const keep = face && !shot.face ? "The man in the first reference image, same face, same build, same skin and hair. " : "";
const prompt = shot.look === "studio" ? `${keep}${STUDIO} The model is ${shot.prompt} ${GARMENT} ${REAL}` : `${shot.prompt} ${EDITORIAL} ${GARMENT} ${REAL}`;

const taken = readdirSync(takesDir)
  .map((f) => f.match(new RegExp(`^${id}-t(\\d+)\\.(png|json)$`)))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const takeNo = (taken.length ? Math.max(...taken) : 0) + 1;
const file = join(takesDir, `${id}-t${takeNo}.png`);
const meta = file.replace(/\.png$/, ".json");
writeFileSync(meta, JSON.stringify({ id, take: takeNo, status: "generating", prompt }, null, 2));

console.log(`${id} take ${takeNo}: generating (${shot.aspect}, ${refs.length} references)…`);
const args = ["--json", "generate", "create", "nano_banana_pro", "--aspect_ratio", shot.aspect, "--resolution", "2k", "--wait", "--wait-timeout", "15m", "--wait-interval", "4s", "--prompt", prompt];
for (const r of refs) args.push("--image-references", r);
let raw = "";
try {
  raw = execFileSync("higgsfield", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 24 });
} catch (e) {
  raw = (e.stdout ?? "") + (e.stderr ?? "");
}
const json = raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1);
let job;
try {
  job = JSON.parse(json)[0];
} catch {
  console.error(`${id}: could not parse CLI output:\n${raw.slice(0, 800)}`);
  process.exit(1);
}
const url = job?.result_url ?? job?.min_result_url;
if (job?.status !== "completed" || !url) {
  console.error(`${id}: job ${job?.id} ended with status "${job?.status}" (refunded if refused). Re-run or reword.`);
  process.exit(1);
}
writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
writeFileSync(meta, JSON.stringify({ id, take: takeNo, job: job.id, url, refs: refs.map((r) => r.replace(root + "/", "")), prompt }, null, 2));
console.log(`${id} take ${takeNo}: saved ${file}`);
if (process.platform === "darwin" && !process.env.NO_OPEN) {
  try {
    execFileSync("open", [file]);
  } catch {
    /* ignore */
  }
}
