// Generate one take of one shot of "The grind, then the calm" with the Higgsfield CLI (Seedance 2.5).
//
//   node scripts/generate-film-clips.mjs <shot-id>          e.g. A1, P7
//   MODEL=seedance RESOLUTION=720p node scripts/generate-film-clips.mjs A4   (cheaper engine)
//   NO_OPEN=1 node scripts/generate-film-clips.mjs A1        (don't open the take in QuickTime)
//
// Every run writes a new take to film-src/takes/<id>-t<N>.mp4 (+ .json with the prompt) and opens it
// for review. Approve a take with `node scripts/approve-take.mjs <id> <N>`; the assembly reads only
// film-src/approved/. Needs `higgsfield auth login` done once (npm i -g @higgsfield/cli).
//
// Prompts are plain scene descriptions on purpose: Higgsfield's filter refuses brand names, the word
// "polo", "cinematic fashion film" preambles and the like; plain descriptions pass.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [, , id] = process.argv;
// Engine. Default is the highest-realism option on Higgsfield: Google Veo 3.1 preview at ultra quality
// (90 credits per 6 s take). MODEL=seedance sends the same prompt to Seedance 2.5 (35 credits at 720p).
const model = process.env.MODEL ?? "seedance"; // Leo chose Seedance for the film; MODEL=veo for Veo 3.1 preview/ultra
const resolution = process.env.RESOLUTION ?? "720p";
const REAL = "Real people with natural skin texture, pores and imperfections, real hair, real fabric weave, documentary realism, no CGI look, no smoothing.";
const takesDir = join(root, "film-src", "takes");
mkdirSync(takesDir, { recursive: true });

// The look of an action-sports energy reel: action-camera and fisheye angles, gritty handheld,
// lens flares, punchy high-contrast colour, a little film grain, everything fast.
const GRIND =
  "Shot like a high-energy action-sports reel: action-camera and fisheye angles, gritty handheld movement, sun flares, punchy high-contrast saturated colour, a little film grain, motion blur, fast. The athlete is fully in frame, never cropped. Photorealistic, no text or logos anywhere.";
const ATELIER =
  "Documentary film in a small clothing atelier in Mauritius: warm window light, wooden tables, fabric dust in the light, macro and slow steady dolly, real skilled hands, natural workshop sound. Premium craft, calm and precise. Photorealistic, no logos, no text.";
const CALM =
  "He stands completely still and looks straight into the camera lens, calm, a slow breath, no smile needed. Photorealistic, golden hour, shallow depth of field, soft natural light, the whole man in frame with headroom, no text or logos.";

/**
 * Shot list. EVERY shot, action and portrait, wears Vis Naturæ pieces (Leo's rule, no exceptions):
 *   Riviera Camp Shirt = bone linen camp-collar short-sleeved shirt; Estuary Cable Knit = oat cream
 *   cable-knit sweater with a collar; Harbour Rugby Shirt = navy and bone heavy cotton striped collared
 *   top; Dune Knit Polo = oat linen knitted short-sleeved collared top; Delta Pleated Trouser = oat
 *   pleated cotton-linen trousers; Cove Linen Short = sand linen shorts; Tidal / Atoll swim shorts =
 *   plain reef-navy / fern-green leaf-print swim shorts; Marram Cap = sand cotton cap.
 */
export const SHOTS = {
  // ---------- Part one: the grind (generated 5 s, cut to ~2 s)
  A1: { duration: 5, style: GRIND, prompt: `Professional rugby match at night under stadium floodlights, packed stands. A powerful Polynesian winger of about 27 in a navy and bone heavy cotton striped collared rugby top and sand linen shorts sprints flat out down the touchline with the rugby ball tucked firmly under his left arm the whole time, breaks a diving tackle from an opposing player with a right-hand hand-off and launches himself over the line to ground the ball for the try, mud and water spraying. The opposing team all wear plain dark green jerseys and black shorts, clearly different from his navy and bone stripes; his own team-mates behind him wear the same navy and bone striped top. Chase angle at knee height, fast tracking, intense.` },
  A2: { duration: 5, style: GRIND, prompt: `Professional road cycling race finish. A sprinter of about 30 in an oat linen knitted short-sleeved collared top and sand linen shorts, out of the saddle, head down, bike rocking side to side at maximum effort in the final two hundred metres, seen in full side profile from a camera motorbike riding level with him at hip height: both wheels, the whole bike and his entire body from helmet to shoes inside the frame with road and sky around him, the bike rocking violently under him, the chasing peloton blurred a few metres behind, crowd barriers and flags streaking past. Not a close-up. Brutal effort.` },
  A3: { duration: 5, style: GRIND, prompt: `Professional golf tournament, a big crowd behind the ropes. An East Asian tour player of about 35 in a dark pine-green cotton piqué short-sleeved collared shirt and oat pleated trousers unleashes a full-power drive from the tee, the tee and grass flying, the club whipping through, the follow-through held as the ball rockets away and the crowd roars. Low angle from behind the tee, fast.` },
  A4: { duration: 5, style: GRIND, prompt: `Professional surfing competition heat on a heavy reef wave. A Black surfer of about 30 in reef-navy swim shorts and an open bone linen shirt drops in late, pulls into a deep barrel and gets blown out in a burst of spit, pumping down the line. Water-level long lens, fast tracking, explosive.` },
  A5: { duration: 5, style: GRIND, prompt: `Big-air kitesurfing competition on a windy turquoise bay, judges' boat and flags. A rider of about 26 in fern-green leaf-print swim shorts and an open bone linen shirt boosts twenty metres into the air and throws a full megaloop: at the top of the jump he steers the kite into a violent full loop, the canopy diving down and around beneath him while he is yanked horizontally across the sky, lines and canopy clearly in frame the whole time, then the kite catches him and he lands hard in white water. Low chase-boat angle, intense.` },
  A6: { duration: 5, style: GRIND, prompt: `Professional wakeboarding competition behind a tournament boat. A Latino rider of about 24 in reef-navy swim shorts and an open bone linen shirt loads the line, launches off the wake into a huge inverted air with a grab, and stomps the landing in a wall of spray. Tracking from the boat, low and fast, aggressive.` },
  A7: { duration: 5, style: GRIND, prompt: `Street skateboarding contest in a city plaza at dusk, crowd behind barriers. A Black skater of about 22 in a bone heavyweight cotton T-shirt and oat pleated trousers sprints, ollies a big twelve-stair set, flips the board under him and rolls away clean as the crowd erupts. Low wide-angle follow, fast, raw.` },
  A8: { duration: 5, style: GRIND, prompt: `Snowboard big-air contest at night under floodlights, a huge kicker and a packed crowd. An East Asian rider of about 25 in an oat cream cable-knit sweater with a collar and oat pleated trousers launches off the kicker into a massive spinning air with a grab, snow spraying, and stomps the landing. Long lens from the landing, dramatic lights, intense.` },
  A9: { duration: 5, style: GRIND, prompt: `Downhill mountain bike race in a dark forest, course tape and cowbells. A rider of about 28 in a navy and bone heavy cotton striped collared rugby top, sand linen shorts and a full-face helmet hammers a steep rooty chute at speed, bike kicking sideways over the roots, mud and dust flying, brakes screaming. Mix of helmet-cam and low chase angle, violent and fast.` },
  A10: { duration: 5, style: GRIND, prompt: `Big-mountain freeride ski competition. A Middle Eastern skier of about 33 in an olive waxed-cotton field jacket over an oat cable-knit sweater and oat pleated trousers drops a cliff into steep powder, lands and carves out hard with a wave of slough chasing him down the face, snow exploding. Drone chase from above and behind, epic and fast.` },
  A11: { duration: 5, style: GRIND, prompt: `Mountain ultra-marathon on a knife-edge ridge above a sea of cloud. A South Asian runner of about 38 in a bone heavyweight cotton T-shirt, sand linen shorts and a sand cotton cap, poles planting hard, breath visible, face at the limit, drives up the ridge at the red line. Low tracking shot ahead of him, raw effort.` },
  A12: { duration: 5, style: GRIND, prompt: `Lead-climbing competition on a steep overhanging wall, crowd below, chalk in the air. A lean climber of about 40 with short dark hair in a bone heavyweight cotton T-shirt and oat pleated trousers is spread across a steep overhang; his feet swing free so he hangs from his arms alone, then he explodes upward in a big dynamic leap, both hands flying to the final hold, and catches it as the crowd roars. Fast and violent, intense.` },

  // ---------- Part two: the calm (generated 5 s, used ~2.5 s). Same athlete as the A shot.
  P1: { duration: 5, style: CALM, prompt: `An empty rugby pitch after the match, floodlights still on, mist in the air. The Polynesian winger of about 27, mud on his face, now in an oat cream cable-knit sweater with a collar and oat pleated trousers.` },
  P2: { duration: 5, style: CALM, prompt: `A high mountain pass road at golden hour, valleys below. The cyclist of about 30 after the race: helmet off and held under one arm, no sunglasses, his face fully visible and hair pressed from the helmet, changed into a bone linen camp-collar shirt and oat pleated trousers, his bike leaning on the stone wall beside him.` },
  P3: { duration: 5, style: CALM, prompt: `An empty golf green at golden hour, flag stirring. The East Asian golfer of about 35, now in an oat linen knitted short-sleeved collared top and oat pleated trousers.` },
  P4: { duration: 5, style: CALM, prompt: `A quiet beach at golden hour, the reef breaking far out. The Black surfer of about 30, hair wet, board under his arm, now in an open bone linen camp-collar shirt and reef-navy swim shorts.` },
  P5: { duration: 5, style: CALM, prompt: `A wide sandy bay at golden hour, his kite lying deflated on the sand behind him. The kitesurfer of about 26, now in a bone linen camp-collar shirt and fern-green leaf-print swim shorts.` },
  P6: { duration: 5, style: CALM, prompt: `A wooden dock on a glassy lake at golden hour, the boat moored behind. The Latino wakeboarder of about 24, hair wet, now in a navy and bone heavy cotton striped collared top and reef-navy swim shorts.` },
  P7: { duration: 5, style: CALM, prompt: `An empty city plaza at blue hour, streetlights coming on. The Black skater of about 22 sits on his board, now in a bone linen camp-collar shirt and oat pleated trousers.` },
  P8: { duration: 5, style: CALM, prompt: `The top of the snow kicker at dusk, the floodlights off, mountains pink behind. The East Asian snowboarder of about 25, now in an oat cream cable-knit sweater with a collar and oat pleated trousers, board planted in the snow beside him.` },
  P9: { duration: 5, style: CALM, prompt: `A forest clearing at golden hour, light through the pines. The downhill rider of about 28, helmet off under his arm, mud on his cheek, now in a navy and bone heavy cotton striped collared top and sand linen shorts.` },
  P10: { duration: 5, style: CALM, prompt: `A summit ridge at golden hour, skis planted in the snow beside him. The Middle Eastern skier of about 33, now in an oat cream cable-knit sweater with a collar, oat pleated trousers and a sand cotton cap.` },
  P11: { duration: 5, style: CALM, prompt: `A mountain summit above a sea of cloud at sunrise. The South Asian trail runner of about 38, now in a bone linen camp-collar shirt and sand linen shorts, poles in one hand.` },
  P12: { duration: 5, style: CALM, prompt: `The top of a sea cliff at golden hour, the ocean far below. The dark-haired climber of about 40, chalk on his hands, now in an oat linen knitted short-sleeved collared top and oat pleated trousers.` },

  // ---------- The atelier edit for the homepage film block (generated 5 s, used ~2.5 s)
  M1: { duration: 5, style: ATELIER, prompt: `A bolt of bone-coloured linen is rolled out across a long wooden cutting table, a shirt pattern chalked on it; a tailor of about 50 with grey hair cuts cleanly along the chalk line with large steel shears, the linen falling away. Close and low along the table.` },
  M2: { duration: 5, style: ATELIER, prompt: `Macro close-up of a sewing machine needle stitching the collar of a bone linen camp-collar shirt, a seamstress of about 35 guiding the fabric with both hands, the stitches running in a straight line, the needle a blur. Shallow depth of field.` },
  M3: { duration: 5, style: ATELIER, prompt: `A young knitter of about 25 works a hand-operated flat knitting machine, sliding the carriage across, an oat cream cable-knit panel growing row by row below the needle bed, yarn cones above. Medium close shot, slow push in.` },
  M4: { duration: 5, style: ATELIER, prompt: `A screen-printing table: an artisan of about 40 pulls a squeegee firmly across a silk screen, fern-green ink pressing a botanical leaf print onto pale swim-short fabric, then lifts the screen to reveal the fresh print. Overhead and side angles.` },
  M5: { duration: 5, style: ATELIER, prompt: `Close-up of an older seamstress's hands, about 60, hand-stitching a small woven cream label inside the collar of a linen shirt with needle and thread; the label reads "No. 07 / 12". Macro, shallow depth of field.` },
  M6: { duration: 5, style: ATELIER, prompt: `An artisan of about 30 presses the front pleats of oat-coloured cotton-linen trousers with a heavy steam iron on a padded table, a soft cloud of steam rising into the window light. Medium close, slow dolly.` },
  M7: { duration: 5, style: ATELIER, prompt: `On a finishing table, hands fold a finished bone linen camp-collar shirt neatly into cream tissue paper inside a plain sand-coloured box, smooth the tissue, and close the lid. Top-down then side angle, slow.` },
};

if (!id || !SHOTS[id]) {
  console.error(`usage: node scripts/generate-film-clips.mjs <shot-id>\nshots: ${Object.keys(SHOTS).join(" ")}`);
  process.exit(1);
}
const shot = SHOTS[id];
const duration = Number(process.env.DURATION ?? (model === "veo" ? 6 : shot.duration)); // Veo takes 4, 6 or 8 s
// Reserve the take number up front with a .json stub, so takes still rendering never collide.
const taken = readdirSync(takesDir)
  .map((f) => f.match(new RegExp(`^${id}-t(\\d+)\\.(mp4|json)$`)))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const takeNo = (taken.length ? Math.max(...taken) : 0) + 1;
const file = join(takesDir, `${id}-t${takeNo}.mp4`);
// Portraits must show the same athlete as the action clip: pass a reference frame of him
// (film-src/refs/<id>.png, cut from the approved action take) through Seedance's reference mode.
const ref = process.env.REF ?? (existsSync(join(root, "film-src", "refs", `${id}.png`)) ? join(root, "film-src", "refs", `${id}.png`) : null);
const prompt = `${ref ? "The man in the reference image, same face, same build, same skin and hair. " : ""}${shot.prompt} ${shot.style} ${REAL}`;
writeFileSync(file.replace(/\.mp4$/, ".json"), JSON.stringify({ id, take: takeNo, status: "generating", prompt }, null, 2));

const engine =
  model === "veo"
    ? ["veo3_1", "--variant", "veo-3-1-preview", "--quality", "ultra", "--duration", String(duration), "--aspect_ratio", "16:9"]
    : ref
      ? ["seedance_2_5", "--mode", "omni_reference", "--image-references", ref, "--duration", String(duration), "--resolution", resolution, "--aspect_ratio", "16:9", "--bitrate_mode", "high"]
      : ["seedance_2_5", "--mode", "t2v", "--duration", String(duration), "--resolution", resolution, "--aspect_ratio", "16:9", "--bitrate_mode", "high"];
console.log(`${id} take ${takeNo}: generating on ${engine[0]} (${duration}s 16:9${model === "veo" ? ", preview/ultra" : ` ${resolution}`}${ref ? `, reference ${ref.split("/").pop()}` : ""})…`);
const args = ["--json", "generate", "create", ...engine, "--wait", "--wait-timeout", "25m", "--wait-interval", "5s", "--prompt", prompt];
let raw = "";
try {
  raw = execFileSync("higgsfield", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
} catch (e) {
  raw = (e.stdout ?? "") + (e.stderr ?? "");
}
const json = raw.slice(raw.indexOf("["));
let jobs = [];
try {
  jobs = JSON.parse(json.slice(0, json.lastIndexOf("]") + 1));
} catch {
  console.error(`${id}: could not parse CLI output:\n${raw.slice(0, 800)}`);
  process.exit(1);
}
const job = jobs[0];
if (!job) {
  console.error(`${id}: no job was created. CLI said:\n${raw.replace(json, "").trim().slice(0, 600) || "(nothing)"}`);
  process.exit(1);
}
const url = job.result_url ?? job.min_result_url;
if (job.status !== "completed" || !url) {
  console.error(`${id}: job ${job.id} ended with status "${job.status}" (refunded if refused). Re-run or reword.`);
  process.exit(1);
}
const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
writeFileSync(file, bytes);
writeFileSync(file.replace(/\.mp4$/, ".json"), JSON.stringify({ id, take: takeNo, engine: engine[0], ref, job: job.id, url, duration, resolution, prompt }, null, 2));
console.log(`${id} take ${takeNo}: saved ${file} (${(bytes.length / 1e6).toFixed(1)} MB)`);
if (process.platform === "darwin" && !process.env.NO_OPEN && existsSync(file)) {
  try {
    execFileSync("open", [file]);
  } catch {
    /* ignore */
  }
}
