# SPGCL — Sri Priyanka Geo Commex Limited

A static corporate site for SPGCL: a globally diversified commodity group in critical
minerals and rice bran oil, operating across India, Singapore and Morocco, listed on
the NSE Emerge platform.

Hand-written HTML, CSS and vanilla JavaScript. No framework, no build step, no
runtime dependencies.

```
index.html                     the whole page — all ten sections
assets/css/styles.css          design system + page styles (single stylesheet)
assets/js/main.js              progressive-enhancement interactions
assets/img/                    photography, logo, and generated vector artwork
tools/generate_images.py       regenerates the vector artwork
tools/wire_images.py           points index.html at real photographs
tools/extract_attachments.py   recovers images supplied through chat
tools/test-interactions.js     interaction smoke test
tools/test-a11y.js             axe-core accessibility audit
vercel.json / .vercelignore    static-deploy config
```

---

## ⚠️ Verify before go-live

Three figures come from the design brief and **could not be confirmed** against any
public filing. They are marked `VERIFY BEFORE GO-LIVE` in `index.html`.

| Figure | Appears in | Status |
|---|---|---|
| `₹365 Cr` revenue FY26 | Hero stat bar, investor highlight bar | **Unverified.** Public sources report 9M FY26 total income of ₹236.50 Cr and FY25 consolidated total income of ₹322.58 Cr. |
| `161.3%` PAT CAGR | Investor highlight bar | **Unverified.** No public source found. |
| `12+` countries served | Hero stat bar, sector card, vision section | **Unverified.** Directional claim from the brief. |

Everything else is sourced from the DRHP (14 Aug 2025), the RHP (18 Jun 2026) and NSE
listing records: the FY25 ₹322.58 Cr / ₹28.13 Cr and 9M FY26 ₹236.50 Cr / ₹38.69 Cr
figures, the ₹94.51 Cr issue size, the ₹207–212 price band, the 2 Jul 2026 listing
date, CIN `U10402TN1990PLC019110`, the registered office, the subsidiary names, and
the board names and designations. Footer contact details are those published on
spgeocl.com.

### Where the site deliberately departs from the brief

The redesign brief's sample markup carried placeholder content that contradicts the
filings. The **brand system** was applied in full; the **content** was not reverted,
because publishing these on an investor page would be a regression:

| Brief said | Site says | Why |
|---|---|---|
| Crude Palm Oil, RBD Palm Olein | Crude and refined **rice bran oil**, de-oiled cake | SPGCL's agro segment is rice bran oil. It does not process palm. |
| "Proposed NSE Emerge listing" | Listed 2 Jul 2026, with issue particulars | The IPO closed 29 Jun 2026 and the shares are trading. |
| SIDCO Industrial Estate, Kakkalur | Century Plaza, Teynampet, Chennai 600018 | Matches the RHP and the company's own site. |
| SPGCL Singapore Pte Ltd | Geo Min Commodities Pte. Ltd. | Actual subsidiary name; Morocco is Ste Atlas Resources International SARL. |
| info@spgcl.com, +91 44 3344 5566 | cs@ / info@spgeocl.com, 044 2432 3609 | Published contact details. |
| 2.5M+ tonnes, 50K+ MT capacity | Verified stats only | No source found for either figure. |

---

## Brand system

Built to the SPGCL Brand Guide. All tokens live at the top of `styles.css`.

**Colour.** Navy `#0B2B60` for headings, Navy Deep `#051A3D` for dark sections and
the footer, Light Beige `#FDF1E3` for soft sections, `#333333` for body text (never
pure black, per the guide). Copper `#B87333` is reserved for what the guide reserves
it for — data highlights and stat numerals — and appears nowhere else.

**One accessibility-driven split.** Accent Blue `#2C7CD4` is the brand standard but
measures 4.25:1 with white and 3.82:1 on beige, short of the WCAG AA minimum of 4.5:1
for normal text. So it keeps every non-text job (dividers, icon fills, borders, focus
rings, large display type), and text roles fall to two colours **already in the brand
palette**:

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--accent` | `#2C7CD4` | Brand standard — non-text and large text | 3:1+ |
| `--accent-text` | `#1A5FA8` ("Accent Dark") | Link text, CTA surfaces with white text | 6.47:1 white / 5.81:1 beige |
| `--accent-on-dark` | `#5B9FE3` ("Accent Light") | Interactive text on navy | 6.15:1 |

Nothing is invented — the roles are assigned by contrast. The page reports **zero
axe-core violations** at 1440px and 390px; using `#2C7CD4` for text reintroduces them.

**Type.** Montserrat for headings (800 display / 700 H1 / 600 below), Source Sans 3
for body and UI, JetBrains Mono for numerals. The guide's rules are honoured: no bold
below H2, ALL CAPS only for eyebrow text, no justified text, body capped at the 800px
measure (`--measure`).

The scale uses `clamp()` rather than fixed per-breakpoint sizes. Floors and ceilings
match the brief's ratios (mobile ≈60% of desktop) but scale continuously, so there are
no awkward sizes between breakpoints.

**Depth.** Three-layer navy-tinted shadows (`--shadow`, `--shadow-lift`), a separate
CTA glow (`--shadow-cta`), and gradient text on the display headline and stat numerals
via `.grad-text` / `.grad-text--on-dark`.

### Logo

`assets/img/logo-spgcl.webp` is the official lockup, used as an `<img>` — not
recreated in fonts, per the guide. It has an alpha channel, so the header and footer
(both Navy Deep) get the guide's **white monochrome** variant from
`filter: brightness(0) invert(1)` rather than shipping a second file. The CSS adds
clear space and applies no shadow, glow or outline.

---

## Images

11 of 17 slots carry real photography. The rest are procedurally generated vector
scenes — layered gradients, industrial silhouettes, atmospheric haze and grain —
art-directed to the prompts in `IMAGE-PROMPTS.md` and designed to be replaced.

```bash
python3 tools/generate_images.py    # regenerate the vector artwork
python3 tools/wire_images.py        # point index.html at any real photos present
python3 tools/wire_images.py --status   # report only
python3 tools/wire_images.py --revert   # back to vector artwork
```

Drop a raster with the same base name into `assets/img/` (`.png`, `.jpg`, `.webp`) and
run `wire_images.py`. It wires what is present and leaves the rest, so it can be re-run
as images arrive. **Update the `alt` text afterwards** — it must describe the actual
photograph. Aspect ratio matters more than pixel size; everything is placed with
`object-fit: cover`.

Still on generated artwork: `news-product`, `news-legal`, `loc-singapore`,
`loc-morocco`, and monogram tiles for Priya Rao and Velayutham Anburaj. Those two are
monograms on purpose — the directors are real people, and synthetic headshots of
identifiable individuals do not belong on an investor page. The tiles sit on the same
`#e0e0e0` studio backdrop as the real portraits so the row reads as one set.

The hero is currently 1024×578 upscaled to full viewport and will look soft on a large
display; the 2720×1536 original is worth swapping in.

---

## JavaScript

`assets/js/main.js` is progressive enhancement only — every section renders and reads
correctly with JavaScript disabled. It only toggles classes.

| Behaviour | How |
|---|---|
| Sticky header | `.is-scrolled` past 24px. |
| Mobile nav | Burger toggles `.is-open`; closes on link tap and <kbd>Esc</kbd>; the closed drawer is `visibility: hidden` so its links stay out of the focus order. |
| Scroll reveals | One `IntersectionObserver` adds `.is-visible`, then unobserves. Staggered with `data-reveal-delay="0–4"`. |
| Hero stats | `.is-ready` on `<body>` after first paint; four stats fade up from 1.2s. |
| Country tabs | Full ARIA tab pattern with roving `tabindex` and arrow/Home/End keys. |
| Hero parallax | `translate3d` at 0.2× scroll, rAF-throttled. |

`prefers-reduced-motion: reduce` disables parallax, smooth scrolling and all
transitions, and shows everything immediately.

---

## Running and deploying

```bash
python3 -m http.server 8123     # http://127.0.0.1:8123
```

Deploying to Vercel needs no configuration. `vercel.json` declares no framework and
no-op install/build commands — `package.json` exists only for the dev tooling, and
without that declaration Vercel would detect it and try to fetch a Playwright browser
for a site with no build step. `.vercelignore` keeps tooling and docs out of the
upload; only `index.html`, `assets/` and `vercel.json` ship.

### Checks

```bash
npm install
npx html-validate index.html       # currently clean
node tools/test-interactions.js    # 11 interaction tests
node tools/test-a11y.js            # axe-core — currently 0 violations
node tools/sections.js ./shots 1440 900   # per-section screenshots
```

The screenshot helpers disable `scroll-behavior: smooth` before walking the page —
without that, programmatic scrolling lags behind the loop and lower sections are
captured before their reveals fire.
