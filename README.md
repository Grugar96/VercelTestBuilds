# Mulki Surf Brothers — website

Next.js (App Router) site for Mulki Surf Brothers, a surf school and riverside hostel in Mulki, Karnataka. Built to the **Website Brand Guide v1.1** and the **Website Redesign Brief**, using real Surf Brothers photos and video.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

Deploys on Vercel automatically on push (framework: Next.js, set in `vercel.json`).

## Where things live

```
app/                    one folder per page (/, /book, /surf-lessons, /stay, /packages, /about, /gallery, /contact)
app/layout.js           fonts (Oswald, Roboto, Caveat via next/font), header, footer, metadata
app/globals.css         design tokens + all styles (tokens match the Brand Guide)
lib/site.js             ALL content and prices: phone, prices, packages, crew, testimonials, FAQ, map pins, gallery
components/             Header, Footer, Wave, Doodle, AutoVideo (+ ride line), MulkiMap, GalleryGrid,
                        BookingFlow, Sections (cards, proof strip, testimonials, crew, FAQ, booking band, page hero)
public/img, public/video  real photos and clips from the Surf Brothers shoots (web-compressed)
```

To change a price, a crew line or a testimonial, edit `lib/site.js`. Every page and the booking flow read from it.

## Real data (from the owner's price list, Nov 2026)

Prices, packages (3/5/7/10 days, camping or AC hostel), what's included, meals, the Mon–Thu ₹1,000 offer, payment rules, both phone numbers, Instagram and the Maps link all live in `lib/site.js`. There is no non-AC room any more.

## Placeholders to confirm before launch

Search the code for `placeholder` to find them all.

- [ ] Proof strip: **4.9★ Google rating, 1000+ students, ISA-certified coaches, 4:1 ratio** (`PROOF`)
- [ ] **Testimonials** (Tom H., Ananya R., Priya S.): replace with real Google reviews
- [ ] Safety section on /surf-lessons (4:1, ISA, CPR)
- [ ] **Email** `hello@surfbrothersmulki.com`, "replies within 15 minutes", 2023 origin story, rentals from ₹500/hr
- [ ] **Kayaking prices** (₹600 day / ₹700 night) — not on the owner's price list
- [ ] Check-in 1 PM / check-out 11 AM, quiet hours, Sep–May season
- [ ] Is the ₹1,000 weekday offer per person or per booking? (built as per person)
- [ ] Travel times and taxi fares on /contact
- [ ] Crew one-liners and portraits (initials show until photos are added)
- [ ] Guest consent for every recognisable person in the photos
- [ ] Brilanys Signature phrases as SVG (Caveat stands in), and the illustrator's doodle SVGs

## Hero ride line

The lime line on the hero video follows the surfer using hand-annotated positions in `HERO_RIDE` (`lib/site.js`). If the hero clip changes, re-annotate those keyframes.

## Booking flow

`components/BookingFlow.js`. Stay & Surf: days → guests → check-in date → room → meals/extras → send. Surf only: group or private → guests → pick any number of surf days (any dates) → extras → send. Group sessions use the cheapest bundle mix (e.g. 4 days = 3-day bundle + 1 session). Nothing is charged online. The last step builds a WhatsApp message to +91 99721 58288 with every choice and the estimated total. Choices are kept in the URL (`/book?type=package&days=5&room=camp&in=2026-12-01&guests=2`, `/book?type=surf&program=group&dates=2026-12-01,2026-12-04`), so any button can pre-fill it.
