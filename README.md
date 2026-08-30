# SPGCL — Sri Priyanka Geo Commex Limited

A static corporate site for SPGCL: a globally diversified commodity group in critical
minerals and rice bran oil, operating across India, Singapore and Morocco, listed on
the NSE Emerge platform.

Hand-written HTML, CSS and vanilla JavaScript. No framework, no build step, no
dependencies at runtime.

```
index.html                  the whole page — all ten sections
assets/css/styles.css       design system + page styles (single stylesheet)
assets/js/main.js           progressive-enhancement interactions
assets/img/*.svg            artwork (generated — see "Artwork" below)
tools/generate_images.py    regenerates the artwork
tools/test-interactions.js  interaction smoke test
tools/test-a11y.js          axe-core accessibility audit
vercel.json                 cache + security headers
```

---

## ⚠️ Verify before go-live

Three figures come from the design brief and **could not be confirmed** against any
public filing. They are marked with `VERIFY BEFORE GO-LIVE` comments in `index.html`.
On an investor-facing page these must be checked against the audited accounts before
the site is published.

| Figure | Appears in | Status |
|---|---|---|
| `₹365 Cr` revenue FY26 | Hero stat bar, investor highlight bar | **Unverified.** Public sources report 9M FY26 total income of ₹236.50 Cr and FY25 consolidated total income of ₹322.58 Cr. |
| `161.3%` PAT CAGR | Investor highlight bar | **Unverified.** No public source found. |
| `12+` countries served | Hero stat bar, sector card, vision section | **Unverified.** Directional claim taken from the brief. |

Everything else on the page is sourced from the DRHP (14 Aug 2025), the RHP
(18 Jun 2026) and NSE listing records: the ₹322.58 Cr / ₹28.13 Cr FY25 consolidated
figures, the ₹236.50 Cr / ₹38.69 Cr 9M FY26 figures, the ₹94.51 Cr issue size, the
₹207–212 price band, the 2 Jul 2026 listing date, CIN `U10402TN1990PLC019110`, the
registered office address, the subsidiary names, and the board names and designations.

Two placeholders are also live in the footer, styled so they cannot be shipped by
accident (dashed underline, italic, copper): **investor-relations email** and
**contact telephone**. Neither is published in the sources available here — take both
from the RHP and replace the `<span class="todo">` elements.

---

## Artwork

No image-generation model was available in the environment this was built in, so
rather than leave grey boxes, every image slot is a **procedurally generated vector
scene** — layered gradient skies, industrial silhouettes, atmospheric haze and film
grain — art-directed to the same brief as the photography prompts below. They are
2–56 KB each, render instantly, and are designed to be replaced.

Regenerate them with:

```bash
python3 tools/generate_images.py
```

### Generating real photography with Gemini

`tools/generate_images_gemini.py` will generate the twelve photographs from the
prompts below and write them to `assets/img/<name>.png`, leaving the vector scenes
in place until you wire the new files in:

```bash
export GEMINI_API_KEY=...
python3 tools/generate_images_gemini.py --list-models   # what the key can reach
python3 tools/generate_images_gemini.py                 # generate all twelve
python3 tools/generate_images_gemini.py --wire          # point index.html at the PNGs
```

**Image generation requires a billed Google AI project.** Every image model
(`gemini-3-pro-image`, `gemini-2.5-flash-image`, `gemini-3.1-flash-image`, …) reports
a free-tier quota of `limit: 0` — they are paid-tier only. A key with no billing
attached still works for text models but returns HTTP 429 for every image request;
the script detects that case and says so. Enable billing in Google AI Studio under
Settings → Plan, then re-run.

### Replacing the artwork with real photography

Each file is referenced exactly once, by path, from `index.html` (the hero, sector,
news, location and leadership images) — there is no CSS `background-image` to hunt
down except the section motif. So:

1. Export your photograph at the aspect ratio in the table below.
2. Save it as WebP (with a JPEG fallback if you need to support older browsers).
3. Either **keep the filename** — drop `hero-refinery.webp` in and change the one
   `src` — or point the `src` at whatever you name it.
4. Update the `alt` text to describe the actual photograph.
5. For anything below the fold, keep `loading="lazy" decoding="async"`. The hero
   keeps `fetchpriority="high"` and must **not** be lazy-loaded.

To serve responsive sizes, add `srcset`/`sizes` to the `<img>` — the CSS already sizes
every image with `object-fit: cover`, so no style changes are needed:

```html
<img src="/assets/img/hero-refinery-1280.webp"
     srcset="/assets/img/hero-refinery-800.webp   800w,
             /assets/img/hero-refinery-1280.webp 1280w,
             /assets/img/hero-refinery-1920.webp 1920w"
     sizes="100vw" alt="…" fetchpriority="high" decoding="async">
```

### Image generation prompts

| File | Ratio | Prompt |
|---|---|---|
| `hero-refinery.svg` | 16:9 | Cinematic wide-angle photograph of an industrial oil refinery at golden hour, massive steel distillation columns and pipework silhouetted against a dramatic orange and purple sunset sky, foreground shows refined copper cathode sheets with metallic sheen, middle ground features shipping containers at a port terminal, atmospheric industrial haze, professional corporate photography, high contrast, desaturated colour grading with warm highlights, shot on medium format camera, 16:9, photorealistic, ultra detailed |
| `sector-minerals.svg` | 4:5 | Close-up macro photograph of raw barite mineral crystals with metallic copper cathode sheets in background, industrial mining facility blurred in distance, dramatic side lighting creating strong shadows, earth tones with copper accents, professional product photography, shallow depth of field, 4:5, photorealistic |
| `sector-agro.svg` | 4:5 | Industrial refinery interior showing golden refined edible oil flowing through stainless steel processing equipment, modern manufacturing facility with clean lines, warm amber lighting, steam rising, professional industrial photography, high detail, 4:5, photorealistic |
| `sector-logistics.svg` | 4:5 | Aerial view of Singapore port at dusk, massive container ships docked, organised shipping containers in vibrant colours, city skyline in background with purple-orange sunset, professional drone photography, cinematic colour grading, 4:5, photorealistic |
| `news-mining.svg` | 3:2 | Professional photograph of mining excavation site in Morocco, large earth-moving equipment, desert landscape, blue sky, workers in safety gear, wide angle, professional photojournalism style |
| `news-boardroom.svg` | 8:5 | Corporate office meeting room with financial documents and charts, modern interior, natural light |
| `news-product.svg` | 8:5 | Product packaging mockup for edible oil brand, clean modern design, studio photography |
| `news-legal.svg` | 8:5 | Legal documents with official seals, professional business photography |
| `loc-chennai.svg` | 3:2 | Modern corporate office building exterior in Chennai, glass facade, professional architectural photography, daytime, clear sky |
| `loc-nellore.svg` | 3:2 | Industrial refinery facility exterior, large storage tanks, processing units, professional industrial photography |
| `loc-singapore.svg` | 3:2 | Modern office building in Singapore financial district, Marina Bay area, professional architectural photography |
| `loc-morocco.svg` | 3:2 | Mining facility in Agadir Morocco, desert landscape, industrial equipment, professional photography |
| `pattern.svg` | tile | Line-art motif of mineral facet, oil drop and shipping container — tiled at 5.5% opacity behind the light sections |
| `logo.svg`, `favicon.svg` | — | Geometric mark using the SPGCL gradient |

### A note on the leadership portraits

`leader-*.svg` are **monogram tiles, not portraits.** The five board members are real,
named people; generating synthetic photorealistic "headshots" of them would put
fabricated images of identifiable individuals on a public investor page. Replace them
with genuine commissioned headshots, or keep the monograms — they are designed to look
deliberate either way. The CSS renders whatever you supply as a square, so real
portraits drop straight in.

The bios are role descriptions derived from each person's designation, not researched
biographies. Replace them with approved copy from the RHP.

### The logo

The SPGCL mark is **inlined** in `index.html` (twice — header and footer) rather than
loaded via `<img>`, so the wordmark inherits `currentColor` and stays legible on both
the dark header and the dark footer. The gradient stops are exactly as specified:
`#F29300 → #00A650 → #00BCD4`.

This is a reconstruction, not the official asset. When you have the real logo file,
replace the `<g>` paths inside both `<svg class="logo__svg">` blocks and keep the
gradient stops. If you swap in a flat image file instead, set an explicit colour on
the wordmark — `currentColor` will no longer apply.

---

## Updating content

Everything is literal text in `index.html`; there is no CMS or data file. Sections are
marked with banner comments (`SECTION 5 · NEWS`) and each has a stable `id` used by the
navigation: `#about`, `#sectors`, `#news`, `#global`, `#investors`, `#leadership`,
`#vision`, `#contact`.

- **News** — copy any `<article class="news-card">` block. Keep the `<time datetime="YYYY-MM-DD">`
  machine-readable; the visible text inside it is free-form.
- **Countries** — a country needs three things: a `<button class="reach__tab">`, a
  matching `<div class="reach__panel">` whose `id` matches the button's
  `aria-controls`, and `aria-labelledby` pointing back at the button. The JavaScript
  pairs tabs to panels **by index**, so keep the two lists in the same order.
- **Board** — copy a `<article class="leader">` block; `data-reveal-delay` (0–4) just
  staggers the entrance and can be omitted.
- **Investor documents** — rows are `<li>` pairs of a label and a `.pill`. Use
  `.pill--ok` for an available document, `.pill--num` for a figure, `.pill--req` for a
  request link.

### Design tokens

Colours, type scale and spacing are CSS custom properties at the top of `styles.css`.
Change a token there and it applies everywhere.

One deliberate deviation from the brief: white text on the specified copper `#B87333`
measures **3.79:1**, below the WCAG AA minimum of 4.5:1 for normal text. So `#B87333`
is kept for rules, icons, and text on charcoal (4.59:1 — passing), and a second token
`--copper-cta: #A8652B` (4.6:1) is used for surfaces that carry white text — buttons,
badges, pills. The two are visually near-identical. The page currently reports **zero
axe-core violations** at 1440px and 390px; reverting that token reintroduces ~11.

The type scale uses `clamp()` rather than fixed per-breakpoint sizes. The floors and
ceilings match the brief's ratios (mobile ≈60% of desktop), but it scales continuously
instead of stepping, so there are no awkward sizes between breakpoints.

---

## JavaScript interactions

`assets/js/main.js` is progressive enhancement only — every section renders and reads
correctly with JavaScript disabled. Nothing is injected; the script only toggles
classes.

| Behaviour | How it works |
|---|---|
| Sticky header | Adds `.is-scrolled` past 24px for the opaque background and shadow. |
| Mobile navigation | Burger toggles `.is-open`; closes on link tap and on <kbd>Esc</kbd>. Keeps `aria-expanded` in sync. The closed drawer is `visibility: hidden`, so its links stay out of the keyboard focus order. |
| Scroll reveals | One `IntersectionObserver` adds `.is-visible`, then unobserves. Elements are staggered with `data-reveal-delay="0–4"`. |
| Hero stat bar | `.is-ready` on `<body>` after first paint triggers the four stats fading up in sequence from 1.2s. |
| Country tabs | Full ARIA tab pattern — click plus <kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>Home</kbd><kbd>End</kbd>, with roving `tabindex`. |
| Hero parallax | `translate3d` on the hero image at 0.2× scroll, rAF-throttled. The image is 118% tall so it never reveals an edge. |

If `IntersectionObserver` is missing, or the visitor prefers reduced motion,
everything is shown immediately. `prefers-reduced-motion: reduce` also disables the
parallax, smooth scrolling and all transitions.

---

## Running it

Any static server; there is nothing to compile.

```bash
python3 -m http.server 8123     # then open http://127.0.0.1:8123
```

Deploying to Vercel needs no configuration — `index.html` at the repository root is
served as-is. `vercel.json` only adds cache and security headers.

### Checks

```bash
npm install                        # playwright, html-validate, axe-core (dev only)
npx html-validate index.html       # markup — currently clean
node tools/test-interactions.js    # 11 interaction tests
node tools/test-a11y.js            # axe-core — currently 0 violations
node tools/shoot.js http://127.0.0.1:8123/ out.png 1440 900   # full-page screenshot
node tools/sections.js ./shots 390 844                        # per-section screenshots
```

The screenshot helpers disable `scroll-behavior: smooth` before walking the page —
without that, programmatic scrolling lags behind the loop and the lower sections are
captured before their reveals have fired.
