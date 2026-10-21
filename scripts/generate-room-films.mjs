// The looping room films on the signed-in /members page (Leo, 2026-10-20, after nude-project.com's member page): each
// room of The VN Club, with a brass room key on a red leather fob turning in mid-air, the way Nude Project's key turns in
// its penthouse. Made with Higgsfield in three steps, each one approved by Leo before the next:
//
//   node scripts/generate-room-films.mjs key                  the key on its own (Nano Banana Pro, 2 credits)
//   node scripts/generate-room-films.mjs approve key <take>   → film-src/club/approved/key.png
//   node scripts/generate-room-films.mjs still <room>         the key composited into the room picture (2 credits)
//   node scripts/generate-room-films.mjs approve still <room> <take>
//   node scripts/generate-room-films.mjs film <room>          8 s loop, the still as first and last frame (Kling 3.0 Omni Frames, ~10 credits)
//   node scripts/generate-room-films.mjs approve film <room> <take>
//                                                             → public/film/club/<room>-{landscape,portrait}.mp4 + posters
//
// <room> is terrace, clubhouse or rooftop (the order of the rooms). Takes land in film-src/club/takes/ (git-ignored) and open in Preview/QuickTime.
// Needs `higgsfield auth login` done once (npm i -g @higgsfield/cli). Approving a film fills nothing in by itself:
// add the paths to the room's `film` in src/data/members.ts.

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const takesDir = join(root, "film-src", "club", "takes");
const approvedDir = join(root, "film-src", "club", "approved");
const outDir = join(root, "public", "film", "club");
const ffmpeg = join(root, "node_modules", "ffmpeg-static", "ffmpeg");
for (const d of [takesDir, approvedDir]) mkdirSync(d, { recursive: true });

/** The three rooms, their pictures and what moves in each while the key turns. */
const ROOMS = {
  clubhouse: {
    image: "public/images/moments/home-for-dinner.jpg",
    life: "the candle flames flicker, wine catches the light in the glasses, the friends at the table move a little as they talk",
  },
  terrace: {
    image: "public/images/moments/drinks-wall.jpg",
    life: "the sea behind glints and swells gently, a light breeze moves the linen shirt, the two friends shift their weight as they talk",
  },
  rooftop: {
    image: "public/images/moments/rooftop.jpg",
    life: "the lights of the city twinkle in the blue hour, a faint breeze, the two friends move a little as they talk",
  },
};

const KEY_PROMPT =
  "An antique solid brass hotel room key: a long round shank with simple teeth and an ornate oval bow, hanging from a small brass ring " +
  "on a long rounded tag of dark oxblood-red leather with a fine stitched edge. The leather tag is blind-embossed, tone on tone, with a " +
  "small badger lying on its back, exactly the silhouette in the reference image, and nothing else on it. The key and tag float upright " +
  "in mid-air against a plain warm dark background, three-quarter view, soft cinematic light catching the polished brass edges, shallow " +
  "depth of field. Photorealistic product photograph. No text, no letters, no numbers anywhere.";

const stillPrompt = () =>
  "The first reference image exactly as it is: the same scene, the same people, the same light, colours and framing, unchanged. " +
  "Add the brass room key on its red leather tag from the second reference image, large, floating upright in mid-air in the centre " +
  "foreground at eye level, the tag hanging below the key, sharp and in focus, lit by the scene's own light with soft warm reflections " +
  "on the brass, as if it were really hanging there. Nothing else in the picture changes. Photorealistic.";

const filmPrompt = (room) =>
  "Locked-off camera: the camera does not move at all. The brass room key on its red leather tag floats in mid-air in the centre and " +
  `slowly turns one full revolution around its vertical axis, the brass catching the light as it turns. Around it the scene lives quietly: ${ROOMS[room].life}. ` +
  "The last frame matches the first frame exactly, for a seamless loop. Photorealistic, natural light, no text.";

function takeNo(prefix, ext) {
  const nums = readdirSync(takesDir)
    .map((f) => f.match(new RegExp(`^${prefix}-t(\\d+)\\.${ext}$`)))
    .filter(Boolean)
    .map((m) => Number(m[1]));
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

/** Runs one Higgsfield job and saves the result as `file`. */
async function generate(args, file, meta) {
  writeFileSync(file.replace(/\.\w+$/, ".json"), JSON.stringify({ ...meta, status: "generating" }, null, 2));
  let raw = "";
  try {
    raw = execFileSync("higgsfield", ["--json", "generate", "create", ...args, "--wait", "--wait-timeout", "25m", "--wait-interval", "5s"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 1 << 24,
    });
  } catch (e) {
    raw = (e.stdout ?? "") + (e.stderr ?? "");
  }
  let job;
  try {
    job = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1))[0];
  } catch {
    console.error(`Could not parse the CLI output:\n${raw.slice(0, 800)}`);
    process.exit(1);
  }
  const url = job?.result_url ?? job?.min_result_url;
  if (job?.status !== "completed" || !url) {
    console.error(`Job ${job?.id} ended with status "${job?.status}" (refunded if refused). Re-run or reword.`);
    process.exit(1);
  }
  writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
  writeFileSync(file.replace(/\.\w+$/, ".json"), JSON.stringify({ ...meta, job: job.id, url }, null, 2));
  console.log(`Saved ${file.replace(root + "/", "")}`);
  if (process.platform === "darwin" && !process.env.NO_OPEN) execFileSync("open", [file]);
}

const run = (bin, args) => execFileSync(bin, args, { stdio: ["ignore", "inherit", "inherit"] });
const need = (p, what) => {
  if (!existsSync(p)) {
    console.error(`Missing ${what}: ${p.replace(root + "/", "")}`);
    process.exit(1);
  }
  return p;
};
const roomArg = (r) => {
  if (!ROOMS[r]) {
    console.error(`Room must be one of: ${Object.keys(ROOMS).join(", ")}`);
    process.exit(1);
  }
  return r;
};

const [, , step, a, b, c] = process.argv;

if (step === "key") {
  const n = takeNo("key", "png");
  const file = join(takesDir, `key-t${n}.png`);
  console.log(`Key, take ${n}…`);
  await generate(
    ["nano_banana_pro", "--aspect_ratio", "1:1", "--resolution", "2k", "--prompt", KEY_PROMPT, "--image-references", need(join(root, "public/brand/logo-badger.png"), "badger")],
    file,
    { step, take: n, prompt: KEY_PROMPT },
  );
} else if (step === "still") {
  const room = roomArg(a);
  const n = takeNo(`${room}-still`, "png");
  const file = join(takesDir, `${room}-still-t${n}.png`);
  console.log(`${room} still, take ${n}…`);
  await generate(
    [
      "nano_banana_pro", "--aspect_ratio", "16:9", "--resolution", "2k", "--prompt", stillPrompt(),
      "--image-references", need(join(root, ROOMS[room].image), "room picture"),
      "--image-references", need(join(approvedDir, "key.png"), "approved key (approve key <take> first)"),
    ],
    file,
    { step, room, take: n, prompt: stillPrompt() },
  );
} else if (step === "film") {
  const room = roomArg(a);
  const still = need(join(approvedDir, `${room}.png`), `approved ${room} still (approve still ${room} <take> first)`);
  const n = takeNo(room, "mp4");
  const file = join(takesDir, `${room}-t${n}.mp4`);
  console.log(`${room} film, take ${n} (Kling 3.0 Omni Frames, pro, 8 s)…`);
  await generate(
    [
      "kling_o3_flf", "--mode", "pro", "--duration", "8", "--aspect_ratio", "16:9", "--sound", "off", "--multi_shots", "false",
      "--start-image", still, "--end-image", still, "--prompt", filmPrompt(room),
    ],
    file,
    { step, room, take: n, prompt: filmPrompt(room) },
  );
} else if (step === "approve" && a === "key") {
  copyFileSync(need(join(takesDir, `key-t${b}.png`), "take"), join(approvedDir, "key.png"));
  console.log("Approved the key → film-src/club/approved/key.png");
} else if (step === "approve" && a === "still") {
  const room = roomArg(b);
  copyFileSync(need(join(takesDir, `${room}-still-t${c}.png`), "take"), join(approvedDir, `${room}.png`));
  console.log(`Approved the ${room} still → film-src/club/approved/${room}.png`);
} else if (step === "approve" && a === "film") {
  const room = roomArg(b);
  const take = need(join(takesDir, `${room}-t${c}.mp4`), "take");
  mkdirSync(outDir, { recursive: true });
  const h264 = ["-an", "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "23", "-preset", "slow", "-movflags", "+faststart"];
  // Landscape for screens, a 4:5 centre crop for phones, and a poster of each (the first frame, which is also the last).
  run(ffmpeg, ["-y", "-loglevel", "error", "-i", take, "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", ...h264, join(outDir, `${room}-landscape.mp4`)]);
  run(ffmpeg, ["-y", "-loglevel", "error", "-i", take, "-vf", "crop=ih*4/5:ih,scale=1080:1350", ...h264, join(outDir, `${room}-portrait.mp4`)]);
  run(ffmpeg, ["-y", "-loglevel", "error", "-i", take, "-frames:v", "1", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", join(outDir, `${room}-poster.jpg`)]);
  run(ffmpeg, ["-y", "-loglevel", "error", "-i", take, "-frames:v", "1", "-vf", "crop=ih*4/5:ih,scale=1080:1350", "-q:v", "3", join(outDir, `${room}-poster-portrait.jpg`)]);
  console.log(`Approved the ${room} film → public/film/club/${room}-{landscape,portrait}.mp4 and posters.`);
  console.log(`Now set rooms[…].film in src/data/members.ts to { landscape: "/film/club/${room}-landscape.mp4", portrait: "/film/club/${room}-portrait.mp4", poster: "/film/club/${room}-poster.jpg", posterPortrait: "/film/club/${room}-poster-portrait.jpg" }.`);
} else {
  console.error("Usage: key | still <room> | film <room> | approve key <take> | approve still <room> <take> | approve film <room> <take>");
  process.exit(1);
}
