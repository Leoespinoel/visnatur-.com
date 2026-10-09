// Assemble the homepage film ("The grind, then the calm") from the approved takes.
//
//   node scripts/assemble-film.mjs [landscape|portrait] [srcDir] [out.mp4]
//
// Defaults: landscape, film-src/approved, exports/vis-naturae-the-grind-then-the-calm-<WxH>.mp4
//
// Takes the approved takes named by shot id (A1.mp4 … P12.mp4), scales and
// crops each to the target frame, hard-cuts them together (with their location sound), trims the picture to the subtitle
// cue sheet in src/data/film.ts, fades to black, adds the title card, and burns the amber
// subtitles in (only with CAPTIONS=1) using the same font and colour the website used.
//
// Needs ffmpeg with libx264 + libfreetype: set FFMPEG=/path/to/ffmpeg, or `npm i -D ffmpeg-static`,
// or have ffmpeg on PATH. Fonts are fetched from Google Fonts into node_modules/.cache on first run.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { film } from "../src/data/film.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , orientationArg = "landscape", srcArg, outArg] = process.argv;
const orientation = orientationArg === "portrait" ? "portrait" : "landscape";
const W = orientation === "portrait" ? 1080 : 1920;
const H = orientation === "portrait" ? 1920 : 1080;
const FPS = 30;
const srcDir = resolve(srcArg ?? join(root, "film-src", orientation === "portrait" ? "approved-portrait" : "approved"));
// CUT=atelier assembles the "Made by hand" making-of (M1–M7) instead of the brand film.
// CUT=brand keeps the twelve portraits after the action (the original two-part film).
const CUT = process.env.CUT === "atelier" ? "atelier" : process.env.CUT === "brand" ? "brand" : "action";
const out = resolve(
  outArg ?? join(root, "exports", CUT === "atelier" ? `vis-naturae-made-by-hand-${W}x${H}.mp4` : `vis-naturae-the-grind-then-the-calm-${W}x${H}.mp4`),
);
const titleCard = join(root, "docs/film/assets", CUT === "atelier" ? `atelier-title-${orientation}.png` : `title-${orientation}.png`);

// ---- Timeline (seconds), from the cue sheet
const FADE = 0.7;
const BLACK_GAP = 0.8;
const TITLE_LEN = 3.6;
const TAIL = 0.8;

// ---- Tools
const ffmpeg = resolveFfmpeg();
const cache = join(root, "node_modules/.cache/vn-film");
mkdirSync(cache, { recursive: true });
mkdirSync(dirname(out), { recursive: true });
const inter = await font("Inter", "400", "Inter-Regular.ttf");

// ---- Edit order (see docs/film/treatment.md). Part one: the grind, ~2 s per shot, Red Bull rhythm.
// Part two: the calm, one portrait per athlete, ~2.5 s each. Trims are in/out seconds of each take;
// tune them per approved take.
const ACTION = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12"];
const PORTRAITS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12"];
// Per-clip trims (seconds into the take) where the default middle two seconds is not the best bit.
const TRIM = {
  A4: { from: 0.3, to: 2.3 }, // first barrel pass only; the take repeats the ride near the end
  M1: { from: 2.0, to: 4.7 }, // the shears come in late
  M4: { from: 1.9, to: 4.7 }, // squeegee pull, then the screen lifts on the print
  M7: { from: 0.6, to: 4.6 }, // fold, tissue, box: the closing shot runs longer
};
const ATELIER = ["M1", "M2", "M3", "M4", "M5", "M6", "M7"];
const EDIT =
  CUT === "atelier"
    ? ATELIER.map((clip) => ({ clip, ...(TRIM[clip] ?? { from: 1.0, to: 3.6 }) }))
    : [
        ...ACTION.map((clip) => ({ clip, ...(TRIM[clip] ?? { from: 1.5, to: 3.5 }) })),
        ...(CUT === "brand" ? PORTRAITS.map((clip) => ({ clip, ...(TRIM[clip] ?? { from: 0.8, to: 3.3 }) })) : []),
      ];

// ---- Inputs
if (!existsSync(srcDir)) fail(`No clips folder at ${srcDir}. See docs/film/generation-prompts.md.`);
const files = readdirSync(srcDir).filter((f) => /\.(mp4|mov|m4v|webm|png|jpg|jpeg)$/i.test(f));
const findClip = (name) => files.find((f) => f.replace(/\.[^.]+$/, "") === name);
const segments = EDIT.flatMap((seg) => {
  const f = findClip(seg.clip);
  if (!f) {
    console.warn(`clip ${seg.clip} missing in ${srcDir}, skipping that segment`);
    return [];
  }
  return [{ ...seg, file: join(srcDir, f) }];
});
if (segments.length === 0) fail(`No clips in ${srcDir}.`);
if (!existsSync(titleCard)) fail(`Missing title card ${titleCard}.`);

// ---- 1. Normalise every clip to the target frame (stills get a 4 s hold with a slow push-in).
const normalised = segments.map(({ file, from, to, speed = 1 }, i) => {
  const dst = join(cache, `${orientation}-${String(i).padStart(2, "0")}.mp4`);
  const still = /\.(png|jpg|jpeg)$/i.test(file);
  // Some generated clips arrive letterboxed; cut the black bars off before filling the frame.
  const bars = still ? "" : detectLetterbox(file);
  const cover = `${bars}scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`;
  const hasAudio = !still && probeHasAudio(file);
  const cut = from !== undefined ? ["-ss", String(from), "-t", String(to - from)] : [];
  const args = still
    ? ["-loop", "1", "-t", "4", "-i", file, "-f", "lavfi", "-t", "4", "-i", "anullsrc=r=48000:cl=stereo", "-vf", `${cover},zoompan=z='1+0.04*in/${4 * FPS}':d=1:s=${W}x${H}:fps=${FPS},format=yuv420p`, "-shortest"]
    : hasAudio
      ? [...cut, "-i", file, "-vf", `${cover},setpts=PTS/${speed},fps=${FPS},format=yuv420p`, "-af", `atempo=${speed},aresample=48000,aformat=channel_layouts=stereo`]
      : [...cut, "-i", file, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-vf", `${cover},setpts=PTS/${speed},fps=${FPS},format=yuv420p`, "-shortest"];
  run(["-y", "-loglevel", "error", ...args, "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "aac", "-b:a", "160k", dst]);
  return dst;
});

// ---- 2. Cut the segments together with transitions, fade to black, add the title card, mix the soundtrack.
// Action-to-action cuts get a quick whip/slide/wipe or a white flash (0.2 s); the last action shot fades
// to black into the calm; portraits dissolve into each other (0.5 s).
const durs = normalised.map((p) => probeDuration(p));
const ACTION_TRANSITIONS = ["slideleft", "fadewhite", "smoothup", "wipeleft", "slideright", "circleopen", "fadewhite", "wipedown", "smoothleft", "slideup", "fadewhite"];
const transitionFor = (i) => {
  if (CUT === "atelier") return { name: "fade", d: 0.4 };
  const a = segments[i].clip.startsWith("P");
  const b = segments[i + 1].clip.startsWith("P");
  if (!a && !b) return { name: ACTION_TRANSITIONS[i % ACTION_TRANSITIONS.length], d: 0.2 };
  if (!a && b) return { name: "fadeblack", d: 0.8 };
  return { name: "fade", d: 0.5 };
};
const chain = [];
let prevV = "0:v";
let prevA = "0:a";
let cum = durs[0];
for (let i = 1; i < normalised.length; i++) {
  const t = transitionFor(i - 1);
  const offset = Math.max(0, cum - t.d);
  chain.push(`[${prevV}][${i}:v]xfade=transition=${t.name}:duration=${t.d}:offset=${offset.toFixed(3)}[v${i}]`);
  chain.push(`[${prevA}][${i}:a]acrossfade=d=${t.d}:c1=tri:c2=tri[a${i}]`);
  prevV = `v${i}`;
  prevA = `a${i}`;
  cum = cum + durs[i] - t.d;
}
const PICTURE_END = cum;
const TOTAL = PICTURE_END + BLACK_GAP + TITLE_LEN + TAIL;
const TITLE_IN = normalised.length; // input index of the title card
const MUSIC_IN = TITLE_IN + 1;
console.log(`${segments.length} segments, edit ${PICTURE_END.toFixed(1)} s with transitions → ${W}x${H} @ ${FPS} fps, ${TOTAL.toFixed(1)} s total`);

// Soundtrack: off by default. MUSIC_START=offset seconds into the track.
const musicDir = join(root, "film-src/music");
// Leo removed the song: films carry only the clips' own sound unless MUSIC=/path/to/track is given
// (MUSIC=default uses the first file in film-src/music/).
const music =
  !process.env.MUSIC || process.env.MUSIC === "none"
    ? undefined
    : process.env.MUSIC === "default"
      ? existsSync(musicDir)
        ? readdirSync(musicDir).filter((f) => /\.(mp3|m4a|wav|aac|flac)$/i.test(f)).sort().map((f) => join(musicDir, f))[0]
        : undefined
      : process.env.MUSIC;
const musicStart = Number(process.env.MUSIC_START ?? 0);
if (music) console.log(`soundtrack: ${music} (from ${musicStart}s)`);

// Subtitles are off by default; set CAPTIONS=1 to burn the cue sheet in.
const captionFilters = (process.env.CAPTIONS === "1" ? film.captions : []).map((c) => {
  const text = c.text.replace(/\\/g, "\\\\").replace(/'/g, "\u2019").replace(/:/g, "\\:").replace(/%/g, "%%");
  const size = Math.round(orientation === "portrait" ? W * 0.034 : H * 0.024);
  const y = `h*0.89-text_h`;
  const alpha = `if(lt(t,${c.start}+0.15),(t-${c.start})/0.15,if(gt(t,${c.end}-0.15),(${c.end}-t)/0.15,1))`;
  return (
    `drawtext=fontfile='${inter}':text='${text}':fontsize=${size}:fontcolor=0xe8a33d:` +
    `x=(w-text_w)/2:y=${y}:shadowcolor=black@0.7:shadowx=0:shadowy=2:` +
    `alpha='${alpha}':enable='between(t,${c.start},${c.end})'`
  );
});

const filter = [
  ...chain,
  // picture: fade out at the end (sound too)
  `[${prevV}]fade=t=out:st=${(PICTURE_END - FADE).toFixed(3)}:d=${FADE}[pic]`,
  `[${prevA}]afade=t=out:st=${(PICTURE_END - FADE).toFixed(3)}:d=${FADE}[pica]`,
  // title card: fade in and out, silent
  `[${TITLE_IN}:v]scale=${W}:${H},format=yuv420p,trim=0:${TITLE_LEN},setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.6,fade=t=out:st=${TITLE_LEN - 0.6}:d=0.6[title]`,
  `anullsrc=r=48000:cl=stereo:d=${TITLE_LEN}[titlea]`,
  // black gaps, silent
  `color=c=black:s=${W}x${H}:r=${FPS}:d=${BLACK_GAP}[gap]`,
  `anullsrc=r=48000:cl=stereo:d=${BLACK_GAP}[gapa]`,
  `color=c=black:s=${W}x${H}:r=${FPS}:d=${TAIL}[tail]`,
  `anullsrc=r=48000:cl=stereo:d=${TAIL}[taila]`,
  `[pic][pica][gap][gapa][title][titlea][tail][taila]concat=n=4:v=1:a=1[cut][amb]`,
  // music over the ambient sound: ambient ducked, music fades out under the title card
  ...(music
    ? [
        `[amb]volume=0.35[ambq]`,
        `[${MUSIC_IN}:a]atrim=0:${TOTAL.toFixed(3)},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:st=0:d=1.5,afade=t=out:st=${(TOTAL - 4).toFixed(3)}:d=4,volume=0.9[mus]`,
        `[ambq][mus]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.891:level=false[a]`, // ceiling at -1 dBFS
      ]
    : [`[amb]anull[a]`]),
  captionFilters.length ? `[cut]${captionFilters.join(",")}[v]` : `[cut]null[v]`,
].join(";");

run([
  "-y",
  "-loglevel",
  "error",
  ...normalised.flatMap((p) => ["-i", p]),
  "-loop",
  "1",
  "-framerate",
  String(FPS),
  "-t",
  String(TITLE_LEN),
  "-i",
  titleCard,
  ...(music ? ["-ss", String(musicStart), "-i", music] : []),
  "-filter_complex",
  filter,
  "-map",
  "[v]",
  "-map",
  "[a]",
  "-c:a",
  "aac",
  "-b:a",
  "160k",
  "-r",
  String(FPS),
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p",
  "-profile:v",
  "high",
  "-movflags",
  "+faststart",
  out,
]);
console.log(`wrote ${out}`);

// ---- helpers
function run(args) {
  execFileSync(ffmpeg, args, { stdio: "inherit" });
}
function fail(msg) {
  console.error(msg);
  process.exit(1);
}
function probe(file, args) {
  // ffmpeg-static ships without ffprobe, so read what we need from ffmpeg's own log line.
  try {
    execFileSync(ffmpeg, ["-hide_banner", "-i", file, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    return String(e.stderr ?? "");
  }
  return "";
}
function detectLetterbox(file) {
  // Returns "crop=w:h:x:y," when ffmpeg's cropdetect finds black bars, else "".
  const log = probe(file, ["-t", "3", "-vf", "cropdetect=limit=24:round=2:reset=0", "-f", "null", "-"]);
  const found = [...log.matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)].pop();
  if (!found) return "";
  const [, w, h, x, y] = found.map(Number);
  const size = log.match(/, (\d{3,4})x(\d{3,4})[, ]/);
  if (!size) return "";
  const [, srcW, srcH] = size.map(Number);
  // Only act on real bars (more than 2 % trimmed on an axis), never on a tiny edge.
  if (w > srcW * 0.98 && h > srcH * 0.98) return "";
  return `crop=${w}:${h}:${x}:${y},`;
}
function probeHasAudio(file) {
  return /Stream #\d+:\d+.*Audio:/.test(probe(file, []));
}
function probeDuration(file) {
  const m = probe(file, []).match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
}
function resolveFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const local = join(root, "node_modules/ffmpeg-static/ffmpeg");
  if (existsSync(local)) return local;
  return "ffmpeg";
}
async function font(family, weight, fileName) {
  const dst = join(cache, fileName);
  if (existsSync(dst)) return dst;
  // An old user agent makes Google Fonts hand back plain TTF urls instead of woff2.
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`, {
      headers: { "User-Agent": "Mozilla/4.0" },
    })
  ).text();
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  if (!url) fail(`Could not resolve a TTF for ${family} from Google Fonts.`);
  writeFileSync(dst, Buffer.from(await (await fetch(url)).arrayBuffer()));
  return dst;
}
