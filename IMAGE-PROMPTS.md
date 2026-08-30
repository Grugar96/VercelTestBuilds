# SPGCL — image generation prompts

Production-ready prompts for every photographic slot on the site. Each is hardened
for photorealism and carries a negative clause, because in-image text or a fake logo
on a corporate site reads as a mistake.

**How to hand images back:** save each one with the **exact filename** in the table
(any of `.png`, `.jpg`, `.webp`) and drop it into `assets/img/`. The markup currently
points at the `.svg` of the same name — say the word and I'll repoint the `src`,
rewrite the `alt` text to match the real photograph, and re-run the checks.

Aspect ratio matters more than pixel size: every image is placed with
`object-fit: cover`, so the ratio decides what survives the crop. Aim for the long
edge at **1600–2400px**. If your generator has no 4:5, use 3:4 — the crop absorbs it.

---

## Status

| # | File | Ratio | Status |
|---|---|---|---|
| 1 | `hero-refinery` | 16:9 | Generated — Kling 3 Omni 2K, 2720×1536 — **download needed** |
| 2 | `sector-minerals` | 3:4 | Generated — Kling 3 Omni 2K, 1760×2368 — **download needed** |
| 3 | `sector-agro` | 3:4 | Generated — Kling 3 Omni 2K, 1760×2368 — **download needed** |
| 4 | `sector-logistics` | 3:4 | Generated — Kling 3 Omni 2K, 1760×2368 — **download needed** |
| 5 | `news-mining` | 3:2 | **Yours to generate** |
| 6 | `news-boardroom` | 16:10 | **Yours to generate** |
| 7 | `news-product` | 16:10 | **Yours to generate** |
| 8 | `news-legal` | 16:10 | **Yours to generate** |
| 9 | `loc-chennai` | 3:2 | **Yours to generate** |
| 10 | `loc-nellore` | 3:2 | **Yours to generate** |
| 11 | `loc-singapore` | 3:2 | **Yours to generate** |
| 12 | `loc-morocco` | 3:2 | **Yours to generate** |

Board portraits are deliberately **not** on this list — see the note at the end.

### Retrieving the four generated images

They exist in the OpenArt account but are not in this repo: the build sandbox's
egress proxy blocks `cdn.openart.ai`, so they could not be fetched automatically.
From your own machine:

```bash
bash tools/fetch-openart.sh      # downloads all four under the right filenames
python3 tools/wire_images.py     # repoints index.html at them
```

Or download them by hand from <https://openart.ai/my-creations> and save them into
`assets/img/` as `hero-refinery.png`, `sector-minerals.png`, `sector-agro.png` and
`sector-logistics.png`, then run `wire_images.py`.

`wire_images.py` wires whatever rasters are present and leaves the rest on their
generated `.svg`, so run it again as more images arrive. `--status` reports without
changing anything and `--revert` puts everything back to the vector artwork.

**Then update the alt text.** It currently describes the vector scene; alt text has
to describe the image that is actually there. Re-run `npx html-validate index.html`
and `node tools/test-a11y.js` afterwards.

---

## House style

Every prompt below already ends with this clause. If your tool has a separate
negative-prompt field, move it there instead:

> No text, no lettering, no signage, no logos, no watermarks, no brand names.

The look to hold across all twelve: **professional corporate photography, high
contrast, slightly desaturated colour grading with warm highlights.** That grade is
what makes a mixed set look like one commissioned shoot rather than twelve stock
photos. The site's accent is copper `#B87333`, so warm highlights sit naturally
against it.

---

## 5 · `news-mining` — 3:2

Featured newsroom card, the largest image below the fold.

```
Wide documentary photograph of an open-pit barite mining operation in Morocco.
Terraced excavation benches cut into ochre and sand-coloured rock, a large
hydraulic excavator and an articulated haul truck working the pit floor, arid
desert landscape and low hills on the horizon under a hard clear blue sky.
Strong midday sun, crisp shadows, fine airborne dust catching the light.
Photojournalism style, wide angle, natural colour, deep depth of field.
Photorealistic, ultra detailed. Workers only as small distant figures in
high-visibility safety gear and hard hats, no recognisable faces.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 6 · `news-boardroom` — 16:10

```
Interior photograph of a modern corporate boardroom, empty. Long polished table
with printed financial statements, bar charts and a pen arranged mid-meeting,
leather chairs, floor-to-ceiling windows with soft diffused daylight and a
blurred city skyline beyond. Muted greys, warm wood, restrained palette.
Architectural interior photography, natural light, shallow depth of field on the
documents. Photorealistic, ultra detailed, no people. Charts and documents must
be abstract shapes and unreadable marks, not legible writing.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 7 · `news-product` — 16:10

```
Studio product photograph of a single unbranded bottle of refined rice bran oil.
Clear glass, warm golden oil, plain cream label with no writing, matte dark cap.
Neutral seamless backdrop in soft warm grey, single soft key light from upper
left, gentle gradient falloff, subtle reflection on the surface beneath.
Premium FMCG packaging photography, shallow depth of field, high detail.
Photorealistic. The label must be completely blank.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 8 · `news-legal` — 16:10

```
Close-up photograph of formal legal and regulatory documents on a dark wooden
desk. Layered cream paper with an embossed gold foil seal and a red ribbon, a
fountain pen resting alongside. Warm directional window light raking across the
paper, showing its texture and fibre. Business photography, shallow depth of
field, muted warm palette. Photorealistic, ultra detailed. The document body must
read as abstract printed lines and unreadable marks, not legible writing.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 9 · `loc-chennai` — 3:2

Group headquarters. Sits at the top of the Global Reach panel.

```
Exterior architectural photograph of a modern corporate office tower in Chennai,
India. Blue-green glass curtain wall facade reflecting a clear sky, clean
horizontal floor banding, palm trees and a paved forecourt at the base. Bright
tropical daylight, low upward camera angle emphasising height, crisp shadows.
Professional architectural photography, natural colour, deep depth of field.
Photorealistic, ultra detailed, no people in the foreground.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 10 · `loc-nellore` — 3:2

Manufacturing site — an edible-oil refinery, **not** a petrochemical plant.

```
Exterior photograph of an edible oil refinery and processing plant in rural
Andhra Pradesh, India. Rows of large white and steel cylindrical storage tanks,
stainless steel processing columns, pipework and walkways, a low industrial
building behind. Warm late-afternoon sunlight, long shadows, dry scrub landscape
and hazy sky at the horizon. Industrial photography, wide angle, natural colour.
Photorealistic, ultra detailed, no people.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 11 · `loc-singapore` — 3:2

```
Exterior photograph of modern office towers in the Singapore financial district
at blue hour. Glass and steel high-rises with warm lit windows, Marina Bay
waterfront in the foreground with still water reflecting the skyline, deep blue
and violet sky with a warm orange band low on the horizon. Architectural and
cityscape photography, long exposure, cinematic colour grading.
Photorealistic, ultra detailed.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

## 12 · `loc-morocco` — 3:2

```
Wide exterior photograph of a mineral mining and processing facility in the
Moroccan desert near Agadir. Conveyor gantries, ore stockpiles, storage silos
and heavy plant machinery set against arid ochre hills and a wide pale sky.
Strong dry sunlight, dust haze on the horizon, warm earth tones with cool
shadows. Industrial landscape photography, wide angle, deep depth of field.
Photorealistic, ultra detailed, no people.
No text, no lettering, no signage, no logos, no watermarks, no brand names.
```

---

## The board portraits

`leader-shivprasad`, `leader-veeravikram`, `leader-ravikumar`, `leader-priyarao`
and `leader-anburaj` are **not** on this list on purpose.

The five directors are real, named people. Generating synthetic photorealistic
"headshots" of identifiable individuals and publishing them on an investor page
would be a misrepresentation, whatever the prompt says. Two legitimate routes:

1. **Commission real headshots** — the CSS renders whatever you supply as a square
   tile, so real portraits drop straight in with no style changes.
2. **Keep the monogram tiles** currently in place. They are designed to look
   deliberate rather than missing, and they carry the copper accent.

The bios beside them are role descriptions inferred from each person's
designation, not researched biography. Replace them with approved copy from the
RHP before go-live.
