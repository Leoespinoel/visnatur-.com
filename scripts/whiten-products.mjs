// Put every product packshot (public/products/<slug>.jpg and <slug>-detail.jpg) on pure white.
//
//   node scripts/whiten-products.mjs              all packshots
//   node scripts/whiten-products.mjs <slug>...    only these slugs
//
// Front views go through Higgsfield's background remover (1 credit), then are trimmed and re-centred on
// #fff with even padding. Detail crops keep their framing; their backdrop is flood-filled white locally.
// Cutouts are cached in stills-src/cutouts/ (re-runs are free) and the first run backs the originals
// up to stills-src/products-orig/. On-model shots (<slug>-model.jpg) are left alone.

import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const productsDir = join(root, "public", "products");
const cutDir = join(root, "stills-src", "cutouts");
const origDir = join(root, "stills-src", "products-orig");
mkdirSync(cutDir, { recursive: true });
mkdirSync(origDir, { recursive: true });

const W = 1200;
const H = 1500;
const FILL = 0.84; // share of the canvas the garment may take on the front view

const only = process.argv.slice(2);
const files = readdirSync(productsDir)
  .filter((f) => f.endsWith(".jpg") && !f.endsWith("-model.jpg"))
  .filter((f) => !only.length || only.includes(f.replace(/(-detail)?\.jpg$/, "")));

for (const f of files) if (!existsSync(join(origDir, f))) copyFileSync(join(productsDir, f), join(origDir, f));

// stdin must be closed: with an open pipe the CLI waits on it and never submits the job.
function run(cmd, args) {
  return new Promise((done) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", () => done(out));
  });
}

async function cutout(f) {
  const out = join(cutDir, f.replace(/\.jpg$/, ".png"));
  if (existsSync(out)) return out;
  const raw = await run("higgsfield", ["--json", "generate", "create", "image_background_remover", "--image-references", join(origDir, f), "--wait", "--wait-timeout", "10m", "--wait-interval", "3s"]);
  const json = raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1);
  const job = JSON.parse(json || "[]")[0];
  const url = job?.result_url ?? job?.min_result_url;
  if (job?.status !== "completed" || !url) throw new Error(`${f}: background removal failed (${job?.status ?? raw.slice(0, 300)})`);
  writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
  return out;
}

async function whiten(f) {
  const dest = join(productsDir, f);
  if (f.endsWith("-detail.jpg")) {
    await whitenDetail(f, dest);
  } else {
    const cut = await cutout(f);
    const garment = await sharp(cut).trim({ threshold: 1 }).png().toBuffer();
    const fitted = await sharp(garment).resize(Math.round(W * FILL), Math.round(H * FILL), { fit: "inside" }).png().toBuffer();
    await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
      .composite([{ input: fitted, gravity: "center" }])
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dest);
  }
  console.log(`white: ${f}`);
}

// Detail crops are mostly garment, which the remover tends to delete. Instead, flood-fill from the edges
// whatever matches the backdrop colour of the original front view (its corner pixel) and paint it white.
async function whitenDetail(f, dest) {
  const front = await sharp(join(origDir, f.replace("-detail", ""))).raw().toBuffer({ resolveWithObject: true });
  const bg = [0, 1, 2].map((c) => front.data[c]);
  const { data, info } = await sharp(join(origDir, f)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const near = (i) => Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) < 36;
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p] || !near(p * 3)) continue;
    seen[p] = 1;
    data[p * 3] = data[p * 3 + 1] = data[p * 3 + 2] = 255;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }
  await sharp(data, { raw: { width: w, height: h, channels: 3 } }).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
}

// At most 3 Higgsfield jobs in flight, or the CLI returns an empty list.
const queue = [...files];
const failed = [];
await Promise.all(
  Array.from({ length: 3 }, async () => {
    for (let f; (f = queue.shift()); ) {
      try {
        await whiten(f);
      } catch (e) {
        failed.push(f);
        console.error(e.message);
      }
    }
  }),
);
if (failed.length) {
  console.error(`\n${failed.length} failed, re-run to retry: ${failed.join(" ")}`);
  process.exit(1);
}
