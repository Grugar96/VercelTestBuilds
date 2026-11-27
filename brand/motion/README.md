# Motion kit — filler animations for reels and the website

Hand-drawn style, brand colours. Figures loop seamlessly every 4 s, the wave strip every 8 s. 30 fps.

| Element | Files | Size |
| --- | --- | --- |
| Shaka (traced from the crew's own shaka) | `shaka-light`, `shaka-dark` | 1080×1080 |
| Surfer silhouette on a lime board, wave crest, spray | `surfer-light`, `surfer-dark` | 1080×900 |
| Kayaker paddling a lime kayak | `kayaker-light`, `kayaker-dark` | 1080×900 |
| Four-layer drifting wave strip | `wavestrip` | 1080×220 |

- `-light` = charcoal ink, for light backgrounds. `-dark` = off-white ink, for footage and dark/blue backgrounds.
- `.webm` = transparent (VP9 alpha): web, Premiere, DaVinci, After Effects.
- `-magenta-key.mp4` = on a magenta background for phone editors (CapCut / VN / InShot): use Chroma Key and pick the magenta. Magenta is used instead of green because the boards are lime.
- `.mov` (ProRes 4444 with alpha, best quality) is too large for this repo; it's in the SurfBrothers-motion-kit.zip shared in chat.
- `motion-kit-preview.mp4` shows everything at once.

On the website they're React components in `components/kit/Kit.js` (`<Shaka>`, `<Surfer>`, `<Kayaker>`, `<WaveStrip>`, each with `tone="light" | "dark"`), styled by the `.kit-*` rules in `app/globals.css`. Preview page: `/kit` (not indexed).
