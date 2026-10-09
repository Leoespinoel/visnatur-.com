# Cap 01 — ecru crown, red visor, embroidered wordmark

First cap for Vis Naturæ. Brief set 2026-10-08. Sketch: [cap-01-front.svg](cap-01-front.svg).

## Spec

| Part | Decision |
|---|---|
| Silhouette | Six-panel, unstructured (soft crown, no buckram), mid-low profile, curved visor |
| Crown, button, eyelets | Ecru / off-white, organic cotton twill. Working hex `#EBE4D6` (not bright white — a warm bone) |
| Visor, top and underside | Signal red `#C8102E` ≈ Pantone 186 C. Three or four rows of tonal stitching on top |
| Sweatband | Ecru twill or unbleached cotton |
| Closure | Self-fabric strap with brass slider (matches the Marram Cap entry in `products.ts`) |
| Front embroidery | `VIS NATURÆ`, Cormorant Garamond, uppercase, tracked. Flat satin stitch, ~11 cm wide, centred on the two front panels, sitting ~2.5 cm above the visor seam |
| Embroidery colours | Letters in ink black; the trailing `Æ` in the same red as the visor (the site's logo rule: the Æ is the mark) |
| Back | Nothing, or a tiny red `Æ` above the strap opening. Decide after samples |

Alternative to test alongside: all-red embroidery (`VIS NATURÆ` entirely in 186 C). Cleaner at a distance, but loses the Æ-as-logo idea.

## Prompts

Image models can't spell "NATURÆ" reliably. Expect the ligature to come out as "NATURAE" or garbled. Workflow: generate the cap with the wordmark described, then swap the text in Photoshop/Figma using [the wordmark SVG](../../public/brand/wordmark.svg), or generate with a placeholder word and composite. The prompts below ask for the text anyway so the placement and scale come out right.

### Midjourney (v7)

```
product photograph of a six-panel unstructured baseball cap, soft off-white ecru organic cotton twill crown with matching cloth button and eyelets, contrasting bright signal red curved visor (Pantone 186) with tonal red stitch rows, small embroidered serif wordmark "VIS NATURÆ" in black capital letters across the front panels with the final "Æ" embroidered in the same red as the visor, brass slider strap at the back, three-quarter front view, floating on a clean warm white seamless studio background, soft diffused daylight, subtle shadow, shot on medium format, 100mm macro, sharp fabric texture, luxury resort menswear catalogue, minimal, Aimé Leon Dore / Ralph Lauren Purple Label mood --ar 4:5 --style raw --v 7 --s 150
```

Variations to run as separate jobs:

- Straight-on front view: replace `three-quarter front view` with `perfectly centred straight-on front view, visor slightly tilted up so its top surface is visible`.
- On a model: `... worn by a man in his thirties with sun-tanned skin and a white linen shirt, Mediterranean harbour out of focus behind him, late afternoon light, candid editorial, cropped at the shoulders`.
- Flat lay: `... laid flat on raw linen, overhead view, the visor pointing down, natural window light`.

### GPT Image / Imagen / Flux (plain-language models)

```
A product photo of a baseball cap for a luxury resort menswear brand. The cap is six-panel and unstructured, with a soft, low-profile crown in off-white ecru cotton twill. The visor is curved and a strong signal red (Pantone 186 C), with three rows of tonal red stitching. Across the front two panels there is a small embroidered wordmark in a classic serif, uppercase with wide letter-spacing, reading "VIS NATURÆ". The letters are black except the final "Æ" ligature, which is embroidered in the same red as the visor. The button on top and the eyelets are the same ecru as the crown. The back has a self-fabric strap with a brass slider. Three-quarter front view, floating on a clean warm white studio background with a soft shadow, diffused daylight, high detail in the twill weave and embroidery thread. No other logos, no text anywhere else, no mannequin head. Vertical 4:5.
```

### Negative prompt (where the model takes one)

```
snapback, flat brim, mesh, trucker, structured crown, white (pure), beige/brown visor, extra logos, patches, pins, multiple caps, mannequin, watermark, text on visor, distressed, vintage wash
```

### Technical flat / tech-pack prompt

```
flat technical sketch of a six-panel unstructured baseball cap, front view and side view side by side, ecru off-white crown, red curved visor, black line art with flat colour fills, stitch rows on the visor shown as dashed lines, panel seams visible, small embroidered serif wordmark "VIS NATURÆ" on the front, white background, no shading, apparel tech pack style, vector look
```

## What to check in the results

1. Crown height. Unstructured caps sit low; if the AI gives a tall dome, add "low crown, dad-cap profile".
2. Red temperature. 186 C is a blue-leaning, clean red. If it drifts orange, say "cool crimson red, not orange-red, not burgundy".
3. Ecru, not white. If the crown reads bright white, add "warm bone, unbleached cotton colour".
4. Embroidery scale. Should be small and quiet, roughly a third of the front width. Not a billboard.
5. The visor underside. Decide if it stays red (sportier, bolder) or goes ecru (quieter). The sketch keeps it red.

## Next

- Pick the embroidery option (black + red Æ, or all red) and update the sketch.
- Replace the Marram Cap placeholder colour (`Sand`) with this two-tone once the sample is confirmed, or add this as a separate product.
- Ask the Mauritius maker for twill and thread swatches against Pantone 186 C and an ecru reference.
