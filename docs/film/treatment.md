# Vis Naturæ — "The grind, then the calm"

Brand film and homepage opener, built one clip at a time.

## The idea

Two registers, cut hard against each other.

**Part one, the grind.** Competition-level sport at full intensity, cut very short: about two seconds per shot, a different discipline every cut, chase and POV angles, never held. Reference: the Red Bull reel in `exports/redbull.mov`.

**Part two, the calm.** The same athletes afterwards, one at a time, standing still and looking straight into the lens. Golden hour. No smile needed. The reward after the effort.

Then black and the title card. No subtitles, no voice. Soundtrack from `film-src/music/`.

## Wardrobe

Every shot, action and portrait, wears Vis Naturæ pieces, no competition kit: rugby and downhill in the Harbour Rugby Shirt and Cove Linen Short; cycling and golf in the Dune Knit Polo or Meridian Piqué Polo; water sports in the Tidal or Atoll swim shorts with an open Riviera Camp Shirt; snow in the Estuary Cable Knit and Headland Field Jacket; skate, running and climbing in the Canopy Tee. Portraits: Riviera Camp Shirt, Estuary Cable Knit, Harbour Rugby Shirt, Dune Knit Polo, Delta Pleated Trouser, Cove Linen Short, Marram Cap.

## Shot list

The exact prompts are the `SHOTS` table in `scripts/generate-film-clips.mjs`; that file is the source of truth.

| Id | Discipline | The grind (A) | The calm (P) |
|---|---|---|---|
| 1 | Rugby | Winger breaks a tackle and dives for the line under floodlights | On the empty pitch, mud on his face |
| 2 | Cycling | Sprinter out of the saddle in the final 200 m | On a mountain pass, bike against the wall |
| 3 | Golf | Tour player's full-power drive, crowd roaring | On the empty green |
| 4 | Surfing | Late drop into a heavy barrel, spat out | On the beach, board under arm |
| 5 | Kitesurfing | Twenty-metre kite loop, kite and lines in frame | On the sand, kite down behind him |
| 6 | Wakeboarding | Huge inverted air with a grab, wall of spray | On the dock |
| 7 | Skateboarding | Kickflip down a twelve-stair set | Sitting on his board in the empty plaza |
| 8 | Snowboarding | Big-air spin under floodlights, stomped | At the top of the kicker at dusk |
| 9 | Downhill MTB | Hammering a rooty forest chute | In the forest, helmet off |
| 10 | Freeride skiing | Cliff drop into powder, slough chasing | On the summit ridge |
| 11 | Trail running | At the red line on a knife-edge ridge | On the summit above the cloud |
| 12 | Climbing | Cutting loose, then a dyno to the finishing hold | At the top of the sea cliff |

Casting: twelve different men, all under 50, of different backgrounds, one per discipline; the P shot is the same man as the A shot.

## Method

One clip at a time: brief → one take at 720p, 5 s → opens in QuickTime → approve, re-roll or change → `node scripts/approve-take.mjs <id> <take>`. Nothing moves on until the shot is approved. At the end `node scripts/assemble-film.mjs` cuts the approved takes (action about 2 s, portraits about 2.5 s), mixes the soundtrack, adds the title card, and the web encode goes to `public/film/`.

## Deliverables

Master H.264 1920×1080 in `exports/`; web file under 15 MB in `public/film/hero-landscape.mp4` with poster; 9:16 version later from `film-src/approved-portrait/` if wanted.
