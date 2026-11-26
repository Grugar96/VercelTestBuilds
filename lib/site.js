// Mulki Surf Brothers — site content and prices in one place.
// Items marked `placeholder: true` were carried over from the draft site and still
// need the owner's confirmation before launch. Search "placeholder" to find them all.

// WhatsApp goes to the first number; both are shown for calls.
export const PHONE = '919972158288';
export const PHONE_LABEL = '+91 99721 58288';
export const PHONES = [['919972158288', '+91 99721 58288'], ['919739319902', '+91 97393 19902']];
export const TAGLINE = 'Stay • Surf • Belong';
export const EMAIL = { value: 'hello@surfbrothersmulki.com', placeholder: true };
export const INSTAGRAM = 'https://www.instagram.com/surfbrothers_mulki';
export const INSTAGRAM_HANDLE = '@surfbrothers_mulki';
export const MAPS = 'https://maps.app.goo.gl/rz4vBZACQcednSep7';
export const ADDRESS = ['Mulki Surf Brothers', 'Bappanadu, Mulki', 'Karnataka 574154'];
export const wa = (text) => `https://wa.me/${PHONE}${text ? '?text=' + encodeURIComponent(text) : ''}`;

export const NAV = [
  ['/surf-lessons', 'Surf lessons'],
  ['/stay', 'Stay'],
  ['/packages', 'Packages'],
  ['/about', 'About'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact'],
];

// Proof points from the draft site (placeholders until confirmed)
export const PROOF = [
  { value: '4.9★', label: 'Google rating', placeholder: true },
  { value: '1000+', label: 'Students coached', placeholder: true },
  { value: 'ISA', label: 'Certified coaches', placeholder: true },
  { value: '4:1', label: 'Max student ratio', placeholder: true },
];

export const TESTIMONIALS = [
  { quote: "Best surf hostel vibe I've found in India. The community, the river views, the waves — this place is magic.", name: 'Tom H.', place: 'Berlin, Germany', img: '/img/sunset-surfers.jpg', placeholder: true },
  { quote: 'Came for a weekend, stayed for two weeks. The long-stay package is incredible value. 10/10 would recommend.', name: 'Ananya R.', place: 'Mumbai', img: '/img/boards-friends.jpg', placeholder: true },
  { quote: 'I was terrified of the ocean. The coaches made me feel so safe — I stood up on my first day! Coming back next month.', name: 'Priya S.', place: 'Bengaluru', img: '/img/carry-board.jpg', placeholder: true },
];

export const CREW = [
  { initial: 'K', name: 'Kiran', role: 'Co-founder & manager', bio: 'Runs the house, the bookings and most of the plans.' },
  { initial: 'M', name: 'Manju', role: 'Head instructor', bio: 'National bronze medallist in stand-up paddling. Keeps the water fun and the crew feeling like family.' },
  { initial: 'A', name: 'Anu', role: 'Instructor', bio: "Our only female instructor, and a doctor when she's not in the water." },
  { initial: 'F', name: 'Flinu', role: 'Instructor', bio: 'Pop-ups, paddling and the first push into your first wave.' },
  { initial: 'S', name: 'Sandy', role: 'Instructor', bio: 'Beach drills, board safety and getting you standing.' },
  { initial: 'V', name: 'Vishal', role: 'Instructor', bio: 'Joined the crew this season.' },
];

// ---------------- Prices (from the owner's price list, Nov 2026) ----------------
export const ROOMS = {
  camp: { name: 'Riverside camping', short: 'Camping', img: '/img/palms-evening.jpg', alt: 'Palm trees by the camping area at sunset', desc: 'Tents under the palms, a few steps from the backwaters.', feats: ['Under the palms', 'Shared washrooms', 'Wi-Fi & open kitchen'] },
  ac: { name: 'AC hostel', short: 'AC hostel', img: '/img/board-hostel.jpg', alt: 'The hostel entrance with a painted surfboard', desc: 'Air-conditioned hostel rooms. Every room is AC now.', feats: ['Air conditioning', 'Lockers', 'Wi-Fi & open kitchen'] },
};
export const PACKAGE_DAYS = [3, 5, 7, 10]; // nights = days - 1
export const PACKAGE_PRICE = { // per person, accommodation + surfing
  camp: { 3: 8000, 5: 11500, 7: 14500, 10: 18000 },
  ac: { 3: 10000, 5: 15000, 7: 19500, 10: 25000 },
};
export const SURF_BUNDLES = { 1: 2000, 3: 6000, 5: 10000, 7: 13000, 10: 17000 }; // group sessions, per person
export const PRIVATE_SESSION = 3000; // per person per session
export const MEALS = { none: { name: 'No meal plan', rate: 0 }, veg: { name: 'Veg meals', rate: 300 }, nonveg: { name: 'Non-veg meals', rate: 400 } }; // per person per day
export const KAYAK = { day: 600, night: 700, placeholder: true }; // carried over from the draft site
export const WEEKDAY_OFFER = 1000; // ₹ off per person, Stay & Surf, Mon–Thu check-in, subject to availability
export const ADVANCE_PER_PERSON = 2000; // Stay & Surf, non-refundable

// Cheapest way to buy n group sessions from the bundles above (e.g. 4 = 3-day + 1 session)
export function groupSurfPrice(n) {
  const sizes = Object.keys(SURF_BUNDLES).map(Number);
  const best = [0];
  for (let i = 1; i <= n; i++) best[i] = Math.min(...sizes.filter((k) => k <= i).map((k) => best[i - k] + SURF_BUNDLES[k]));
  return best[n] || 0;
}

export const SURF_INCLUDES = ['2-hour group surf session', 'Surfboard and basic surf equipment', 'Instructor guidance'];
export const PACKAGE_INCLUDES = ['Daily surf lessons with instructors', 'Surfboard and basic surf equipment', 'Small-batch learning', 'Ice bath recovery', 'Cycling and outdoor activities', 'Bonfire, music, karaoke and movie nights', 'Wi-Fi and open kitchen access'];
export const POLICY = {
  surf: ['Full payment is required to confirm the booking', 'No refund after booking', 'Surf sessions are 2 hours', 'Guests staying elsewhere arrange their own travel to the surf location'],
  package: [`₹${ADVANCE_PER_PERSON.toLocaleString('en-IN')} advance per person to confirm the booking`, 'Remaining payment at check-in', 'Advance payment is non-refundable'],
  general: 'Surf sessions are subject to ocean and weather conditions.',
  offer: [`₹${WEEKDAY_OFFER.toLocaleString('en-IN')} off Stay & Surf packages`, 'Valid for Monday to Thursday check-ins', 'Subject to availability', 'Not applicable to Surf Only bookings', 'Cannot be combined with other offers'],
};

export const BOOKING_TYPES = {
  package: { name: 'Stay & Surf package', img: '/img/sunset-walk.jpg', alt: 'A surfer walking into the sea at sunset with a board', desc: 'A bed by the backwaters, daily surf lessons, bonfires and ice baths.', from: 'From ₹8,000 / person' },
  surf: { name: 'Surf only', img: '/img/beach-theory.jpg', alt: 'Students learning on the sand before a surf session', desc: 'Staying elsewhere? Pick any days you want to surf.', from: 'From ₹2,000 / session' },
};

const inr = (n) => '₹' + n.toLocaleString('en-IN');
export const PACKAGES = PACKAGE_DAYS.map((d) => ({
  days: d,
  label: `${d} days · ${d - 1} nights`,
  title: { 3: 'Surf escape', 5: 'Surf mastery', 7: 'Surf immersion', 10: 'Surf life' }[d],
  camp: inr(PACKAGE_PRICE.camp[d]),
  ac: inr(PACKAGE_PRICE.ac[d]),
  tag: d === 5 ? 'Most popular' : undefined,
  primary: d === 5,
}));

export const MAP_SPOTS = [
  { name: 'Surf beach', x: 128, y: 320, icon: 'wave', lx: 96, ly: 358, img: '/img/sunset-surfers.jpg', alt: 'Surfers in the water at sunset on Mulki beach', text: 'Morning sessions run 8–11 AM: theory on the sand, beach drills, then into the water.' },
  { name: 'The hostel', x: 232, y: 262, icon: 'house', lx: 258, ly: 268, img: '/img/board-hostel.jpg', alt: 'Hand-painted surfboard at the Surf Brothers hostel', text: 'Camping and AC hostel rooms by the backwaters, with bonfires, karaoke and movie nights.' },
  { name: 'Kayaking', x: 350, y: 150, icon: 'kayak', lx: 320, ly: 196, img: '/img/kayak-river.jpg', alt: 'Kayaks on the Shambhavi river lined with mangroves', text: 'Paddle the backwaters and mangroves. Timings follow the tide, so we confirm them the day before.' },
  { name: 'Glowing river', x: 270, y: 200, icon: 'sparkle', lx: 186, ly: 176, img: '/img/river-dusk.jpg', alt: 'The Shambhavi river at dusk', text: 'In bioluminescence season the river glows at night. Book a night kayak to see it.' },
  { name: 'Sunset point', x: 150, y: 120, icon: 'sun', lx: 176, ly: 126, img: '/img/palms-evening.jpg', alt: 'Palm trees at sunset by the beach', text: 'Evenings on the beach: volleyball, football and the sun dropping into the Arabian Sea.' },
  { name: 'Mulki town', x: 420, y: 320, icon: 'pin', lx: 352, ly: 362, img: '/img/mulki-road.jpg', alt: 'A palm-lined road in Mulki', text: 'Mulki railway station and the NH66 bus stand are a short auto ride away. Mangaluru airport (IXE) is about 25–45 minutes by road.' },
];

export const GALLERY = [
  ['surf', 'sunset-board.jpg', 'A surfer holding a board at sunset', 'golden hour'],
  ['surf', 'carry-board.jpg', 'A guest carrying a blue surfboard into the sea', 'first steps in'],
  ['life', 'falls-crew-2.jpg', 'The crew sitting on the rocks at a waterfall', 'crew day out'],
  ['stay', 'board-art.jpg', 'Mandala art painted on a surfboard', 'board art'],
  ['surf', 'beach-theory.jpg', 'Students learning theory on the sand', 'theory first'],
  ['river', 'kayak-river.jpg', 'Kayaking on the Shambhavi river', 'mangrove paddle'],
  ['life', 'night-volley.jpg', 'Night volleyball under string lights', "volleyball o'clock"],
  ['surf', 'sunset-surfers.jpg', 'Surfers in the water at sunset', 'last waves'],
  ['stay', 'board-hostel.jpg', 'A painted board at the hostel door', 'home base'],
  ['river', 'river-dusk.jpg', 'The river at dusk with birds', 'river at dusk'],
  ['life', 'celebration.jpg', 'The team celebrating with cake', 'any excuse for cake'],
  ['surf', 'boards-friends.jpg', 'Two guests with their surfboards', 'day one smiles'],
  ['life', 'sunset-dog.jpg', 'A beach dog against the sunset', 'beach security'],
  ['stay', 'morning-tea.jpg', 'Morning tea on the beach', 'chai first'],
  ['surf', 'green-board.jpg', 'A guest with a green surfboard on the beach', 'new board day'],
  ['life', 'falls-fun.jpg', 'Friends pulling faces at a waterfall', 'no filter needed'],
  ['river', 'boat-sunset.jpg', 'Sunset seen from a boat', 'out on the water'],
  ['life', 'jeep-crew.jpg', 'The crew in the jeep among coconut palms', 'road trip'],
].map(([cat, file, alt, caption]) => ({ cat, src: `/img/${file}`, alt, caption }));

export const HOME_FAQ = [
  ['Can complete beginners join?', 'Yes. Most of our guests have never stood on a board. Every session starts with theory on the sand and beach drills before you go in.'],
  ['Do I need to know how to swim?', 'Basic comfort in water helps, but beginner sessions stay in chest-deep water with high-buoyancy soft-top boards and an ISA-certified coach beside you. Tell us when you book if you can’t swim.'],
  ['When is the best time to surf in Mulki?', 'The surf season runs from September to May. Mornings usually have the cleanest conditions, which is why sessions run from 8 to 11 AM. Sessions are always subject to ocean and weather conditions.'],
  ["What's included in a surf lesson?", 'A 2-hour group session with an instructor, a surfboard and basic surf equipment. Theory and beach drills come first, then time in the water.'],
  ['How do I pay?', 'Surf Only: full payment confirms the booking, and it is non-refundable. Stay & Surf: ₹2,000 advance per person confirms it (non-refundable), and the rest is paid at check-in.'],
];

// Ride line on the hero video: where the surfer's board is (720×1280 video units) while he's riding.
// Annotated frame by frame from public/video/hero-surf.mp4. Re-annotate if the clip changes.
export const HERO_RIDE = [
  { start: 0.05, end: 1.85, from: [-40, 980], c1: [170, 1010], c2: [250, 720], keys: [[0, 425, 730], [0.75, 421, 730], [1.25, 410, 738], [1.85, 382, 745]] },
  { start: 3.95, end: 6.85, from: [-40, 860], c1: [230, 900], c2: [330, 610], keys: [[4.0, 569, 640], [4.75, 569, 632], [5.25, 545, 632], [5.75, 527, 634], [6.25, 555, 634], [6.85, 550, 642]] },
];
