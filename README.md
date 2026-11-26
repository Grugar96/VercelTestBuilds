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

## Placeholders to confirm before launch

Content carried over from the draft site is kept as placeholder. Search the code for `placeholder` to find it.

- [ ] Proof strip: **4.9★ Google rating, 1000+ students, ISA-certified coaches, 4:1 ratio** (`PROOF` in `lib/site.js`)
- [ ] **Testimonials** (Tom H., Ananya R., Priya S.): replace with real Google reviews
- [ ] Safety section on /surf-lessons (**4:1, ISA, CPR**) and "one of the safest places in India to learn"
- [ ] **Email** `hello@surfbrothersmulki.com`, **free cancellation / no advance payment**, "replies within 15 minutes"
- [ ] Bed counts (12 camping spots, 6 non-AC, 11 AC), amenities, **2023** origin story, video analysis, rentals from ₹500/hr
- [ ] Travel times and taxi fares on /contact
- [ ] All prices in `PRICES`, the Sep–May season, check-in 1 PM / check-out 11 AM
- [ ] Crew one-liners and portraits (initials are shown until photos are added)
- [ ] Guest consent for every recognisable person in the photos
- [ ] Brilanys Signature phrases as SVG (Caveat stands in), and the illustrator's doodle/line SVGs (`components/Doodle.js`, wave paths in `components/Wave.js`)

## Booking flow

`components/BookingFlow.js`: what → lessons → guests → dates → stay → extras → send. Nothing is charged online. The last step builds a WhatsApp message to +91 99721 58288 with every choice and the estimated total. Choices are kept in the URL (`/book?type=package&pkg=5&guests=2&in=2026-12-04&room=camp`), so any button can pre-fill it.
