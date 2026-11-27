# Motion kit — filler animations for reels and the website

Warli-inspired figures (two triangles meeting at the waist, round head, thin line limbs, one flat paint colour with a light wall texture). Water and ground lines stay still; only the figures move. 30 fps, seamless loops.

| Element | Files | Size | Loop |
| --- | --- | --- | --- |
| Surfer, man (alternate with the woman) | `surfer-man-light`, `surfer-man-dark` | 1080×900 | 4 s |
| Surfer, woman | `surfer-woman-light`, `surfer-woman-dark` | 1080×900 | 4 s |
| Kayaker | `kayaker-light`, `kayaker-dark` | 1080×900 | 4 s |
| Skater | `skater-light`, `skater-dark` | 1080×900 | 4 s |
| Coconut tree | `coconut-tree-light`, `coconut-tree-dark` | 1080×1080 | 4 s |
| Bonfire dance circle | `bonfire-circle-light`, `bonfire-circle-dark` | 1080×1080 | 8 s |
| Frieze of everyday Mulki moments | `frieze-light`, `frieze-dark` | 1080×200 | 3 s |
| Shaka (traced from the crew's own shaka, not Warli) | `shaka-light`, `shaka-dark` | 1080×1080 | 4 s |
| Four-layer drifting wave strip | `wavestrip` | 1080×220 | 8 s |

- `-light` = charcoal paint, for light backgrounds. `-dark` = off-white paint, for footage and blue / charcoal / laterite backgrounds.
- `.webm` = transparent (VP9 alpha): web, Premiere, DaVinci, After Effects.
- `-magenta-key.mp4` = on a magenta background for phone editors (CapCut / VN / InShot): use Chroma Key and pick the magenta.
- Transparent ProRes 4444 `.mov` files (best quality) are too large for this repo; they're in `SurfBrothers-warli-kit-mov-dark.zip` and `SurfBrothers-warli-kit-mov-light.zip` shared in chat.
- `warli-kit-preview.mp4` shows everything at once.

Website: React components in `components/kit/Warli.js` (`<WarliSurfer variant="man|woman">`, `<WarliKayaker>`, `<WarliSkater>`, `<WarliPalm>`, `<WarliCircle>`, `<WarliFrieze>`, `<Zigzag>`, each figure with `tone="light" | "dark"`) and `components/kit/Kit.js` (`<Shaka>`, `<WaveStrip>`), styled in `app/globals.css`. Preview page: `/kit` (not indexed).
