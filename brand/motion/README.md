# Motion kit — filler animations for reels and the website

Solid stamp-style silhouettes with a printed grain, in the brand's ink colours. Figures loop seamlessly every 4 s, the wave strip every 8 s. 30 fps.

| Element | Files | Size |
| --- | --- | --- |
| Shaka (traced from the crew's own shaka) | `shaka-light`, `shaka-dark` | 1080×1080 |
| Surfer, man (alternate with the woman) | `surfer-man-light`, `surfer-man-dark` | 1080×900 |
| Surfer, woman | `surfer-woman-light`, `surfer-woman-dark` | 1080×900 |
| Coconut tree, fronds swaying | `coconut-tree-light`, `coconut-tree-dark` | 1080×1080 |
| Kayaker paddling | `kayaker-light`, `kayaker-dark` | 1080×900 |
| Skater rolling | `skater-light`, `skater-dark` | 1080×900 |
| Four-layer drifting wave strip | `wavestrip` | 1080×220 |

- `-light` = charcoal ink, for light backgrounds. `-dark` = off-white ink, for footage and dark/blue backgrounds.
- `.webm` = transparent (VP9 alpha): web, Premiere, DaVinci, After Effects.
- `-magenta-key.mp4` = on a magenta background for phone editors (CapCut / VN / InShot): use Chroma Key and pick the magenta.
- Transparent ProRes 4444 `.mov` files (best quality) are too large for this repo; they're in `SurfBrothers-motion-kit-transparent-mov.zip` shared in chat.
- `motion-kit-preview.mp4` shows everything at once.

Website: React components in `components/kit/Kit.js` (`<Shaka>`, `<Surfer variant="man|woman">`, `<Palm>`, `<Kayaker>`, `<Skater>`, `<WaveStrip>`, each with `tone="light" | "dark"`), styled by the `.kit-*` rules in `app/globals.css`. Preview page: `/kit` (not indexed).
