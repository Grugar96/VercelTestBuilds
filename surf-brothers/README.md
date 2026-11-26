# Mulki Surf Brothers — website redesign

A redesign of the draft site (surf-brothers-demo.vercel.app) following the **Website Brand Guide v1.1** and the **Website Redesign Brief**. It uses real Surf Brothers photos and video.

Plain HTML, CSS and JavaScript. No framework, no build step. It can be deployed as it is, or used as the visual reference for porting into the Next.js project.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import `Grugar96/VercelTestBuilds`.
2. Set **Root Directory** to `surf-brothers`.
3. Set Framework Preset to **Other**, leave the build settings empty, and deploy.

`vercel.json` in this folder turns on clean URLs (`/stay` instead of `/stay.html`).

## Structure

```
index.html            home: hero video + ride line, intro, Mulki map, colour bands, video break,
                      packages, photo scatter, crew, FAQ, booking band
book.html             booking flow (what → lessons → guests → dates → stay → extras → send)
surf-lessons.html  stay.html  packages.html  about.html  gallery.html  contact.html
assets/css/styles.css design tokens + all styles (tokens match the Brand Guide)
assets/js/main.js     shared header/footer, wavy edges, doodle icons, scroll reveals, map, gallery filter
assets/js/book.js     booking flow: prices, steps, calendar, live summary, WhatsApp hand-off
assets/img, assets/video   real photos and clips from the Surf Brothers shoots (web-compressed)
tools/build_pages.py  regenerates the six inner pages from one template. Edit there, then run it
```

## Signature elements (from the brief)

| Element | Where in code |
| --- | --- |
| Poster headline | `.poster` in styles.css |
| Wavy section edges | `<svg data-wave="0-2">`, paths in `main.js` → `WAVES` |
| Hand-drawn line | `.draw` SVG paths with `pathLength="1"`, drawn on scroll |
| Ride line on hero video | `.ride-line` in index.html, synced to the video in `main.js` |
| Doodle icons | `<span data-doodle="board">`, paths in `main.js` → `D` |
| Colour bands | `.band-ocean`, `.band-deep`, `.band-lime`, `.band-charcoal` |
| Photo scatter | `.scatter` / `.print` on the home page |

## Before launch, confirm with the owner

- [ ] **Prices** in `assets/js/book.js` (`PRICES`) and on the cards. These were carried over from the draft site.
- [ ] **Surf season** Sep–May, and **check-in 1 PM / check-out 11 AM**.
- [ ] **Room features** (lockers, Wi-Fi, shared bathrooms) and meal prices.
- [ ] **FAQ answers** on the home and contact pages.
- [ ] **Crew one-liners** on the home and About pages. Ask each instructor to write their own, and add portraits.
- [ ] **Guest consent.** Every recognisable guest in the photos (home scatter, gallery, packages hero) has said yes to appearing on the website.
- [ ] **Instagram handle** `@surfbrothersmulki` and the Google Maps link on the contact page.
- [ ] **Handwritten font.** `Caveat` stands in for Brilanys Signature. Swap in SVG exports of the real phrases.
- [ ] **Doodles and the hand-drawn line** are code drawings standing in for the final hand-drawn set. Replace the paths with the illustrator's SVGs.
- [ ] **Reviews.** The draft's testimonials were placeholders and have been removed. Add real Google reviews (with permission) as a section before the FAQ.

Claims from the draft site that were removed because they couldn't be verified: the 4.9 Google rating, "1000+ students", ISA certification, the 4:1 ratio, the placeholder team (Aravind, Maya, Rohit), "tide desk", "live rates", and the placeholder phone and email.

## Booking flow

Nothing is charged online. The last step builds a WhatsApp message to +91 99721 58288 listing everything chosen and the estimated total. Choices are kept in the URL (`?type=package&pkg=5&guests=2&in=2026-12-04&room=camp`), so a link can be shared or pre-filled from any button.

To add real availability or payments later, compare a surf-camp booking engine (Bookinglayer, BookingSutra) with building it in-house using Razorpay.
