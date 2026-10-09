// Approve a take: copy film-src/takes/<id>-t<N>.mp4 (+ .json) to film-src/approved/<id>.mp4.
//
//   node scripts/approve-take.mjs A1 2
//
// The assembly (scripts/assemble-film.mjs) reads only film-src/approved/.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , id, take] = process.argv;
if (!id || !take) {
  console.error("usage: node scripts/approve-take.mjs <shot-id> <take-number>");
  process.exit(1);
}
const src = join(root, "film-src", "takes", `${id}-t${take}.mp4`);
if (!existsSync(src)) {
  console.error(`no such take: ${src}`);
  process.exit(1);
}
const dir = join(root, "film-src", "approved");
mkdirSync(dir, { recursive: true });
copyFileSync(src, join(dir, `${id}.mp4`));
if (existsSync(src.replace(/\.mp4$/, ".json"))) copyFileSync(src.replace(/\.mp4$/, ".json"), join(dir, `${id}.json`));
console.log(`approved ${id} = take ${take} → ${join(dir, `${id}.mp4`)}`);
