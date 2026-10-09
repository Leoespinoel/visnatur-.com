# "Dressed for it" — AI video generation prompts

One prompt per shot, written for Veo 3, Runway Gen-4, Kling 2 or Sora. Generate each shot twice: 16:9 for desktop and 9:16 for phones. Save the clips as `film-src/landscape/01.mp4 … 08.mp4` and `film-src/portrait/01.mp4 … 08.mp4`, then run `node scripts/assemble-film.mjs`.

## Style line (appended to every prompt)

> Shallow depth of field, natural light, muted filmic colour, slow steady camera, photorealistic.

Keep prompts as plain scene descriptions. Higgsfield's filter refused a "cinematic fashion film, 35mm anamorphic, no logos" preamble, brand names, and the word "polo"; "collared shirt" and "collared top" pass.

## Cast and wardrobe

Men of all ages from 24 up. Every garment is a Vis Naturæ piece, described in the prompts by colour and fabric only (see the comment block in `scripts/generate-film-clips.mjs` for the product-to-description key). Reference footage: the kite film in the project root for the two ocean shots.

## Shots

The exact prompts are the `SHOTS` table in `scripts/generate-film-clips.mjs`; that file is the source of truth. Shots 01, 03, 05, 06, 08 are kept from the first generation; 02 was regenerated in the Atoll Print Swim Short and Dune Knit Polo; 04 was cut; 09 (kitesurf), 10 (boat bow and wave) and 11 (safari in linen) are new.

## Edit order

01, 09, 06, 03, 06, 10, 07, 02, 05, 11, 06, 08, then black and the title card. The assembly script trims the picture to fit the subtitle cue sheet in `src/data/film.ts`.

## Phones (9:16)

Same prompts with "vertical 9:16 framing, subject centred, more headroom" added. Keep the subject in the middle third so the website's `object-fit: cover` crop does no harm.
