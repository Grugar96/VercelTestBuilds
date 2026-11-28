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
export const wa = (text, to = PHONE) => `https://wa.me/${to}${text ? '?text=' + encodeURIComponent(text) : ''}`;

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

// Team clips cut from the "Meet the team" reel live in public/video/team/<clip>.mp4 (+ .jpg poster).
export const CREW = [
  { name: 'Manju', role: 'Head instructor', from: 'Karnataka', clip: 'manju', bio: 'National bronze in stand-up paddling. Patient, loud, and the reason sessions feel like a family thing.' },
  { name: 'Flinu', role: 'Instructor', from: 'Kerala', clip: 'flinu', bio: 'Will get you paddling properly before he lets you near a wave.' },
  { name: 'Vishal', role: 'Instructor', from: 'Tamil Nadu', clip: 'vishal', bio: 'New this season and already the first one in the water.' },
  { name: 'Sandy', role: 'Instructor', from: 'Andhra Pradesh', clip: 'sandy', bio: 'Beach drills, board safety, and a lot of "one more pop-up".' },
  { name: 'Dr. Anu', role: 'Instructor', from: 'Karnataka', clip: 'anu', bio: "Our only female instructor. She's also a doctor." },
  { name: 'Gurukoushik', role: 'Volunteer', from: 'Tamil Nadu', clip: 'gurukoushik', bio: 'Behind the camera most mornings. Probably filming you right now.' },
  { name: 'Chetu', role: 'The future', clip: 'chetu', bio: 'Youngest on the crew. Already better than most of us.' },
  { name: 'Shivu', role: 'The future', clip: 'shivu', bio: 'Never far from a board.' },
  { name: 'Yuva', role: 'The future', clip: 'yuva', bio: 'Shows up to every session, invited or not.' },
];
export const OWNERS = [
  { initial: 'K', name: 'Kiran', role: 'Co-founder & manager' },
  { initial: 'S', name: 'Shreyas', role: 'Co-founder & manager' },
];

// ---------------- Prices (from the owner's price list, Nov 2026) ----------------
export const ROOMS = {
  camp: { name: 'Camping under the palms', short: 'Camping', img: '/img/palms-evening.jpg', alt: 'Palm trees by the camping area at sunset', desc: 'Tents under the palms, inside the property and a short walk from the river.', feats: ['Under the palms', 'Shared washrooms', 'Wi-Fi & open kitchen'] },
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
export const KAYAK = { day: 600, night: 700, moon: 700 }; // morning ₹600; night, full moon and bioluminescence trips all ₹700
// Bioluminescence on this coast is usually seen October to March, brightest on dark, clear nights. Nature, so never guaranteed.
export const GLOW_MONTHS = [9, 10, 11, 0, 1, 2];
export const isGlowSeason = (d = new Date()) => GLOW_MONTHS.includes(d.getMonth());
export const SKATE_HOUR = 300; // surfskate, per person per hour
export const WEEKDAY_OFFER = 1000; // ₹ off per booking (to confirm with Kiran), Stay & Surf, Mon–Thu check-in, subject to availability
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
  package: { name: 'Stay & Surf package', img: '/img/sunset-walk.jpg', alt: 'A surfer walking into the sea at sunset with a board', desc: 'A bed by the river and a surf lesson every day, plus bonfires and ice baths.', from: 'From ₹8,000 / person' },
  surf: { name: 'Surf only', img: '/img/beach-theory.jpg', alt: 'Students learning on the sand before a surf session', desc: 'Staying elsewhere? Pick any days you want to surf.', from: 'From ₹2,000 / session' },
};

const inr = (n) => '₹' + n.toLocaleString('en-IN');
export const PACKAGES = PACKAGE_DAYS.map((d) => ({
  days: d,
  label: `${d} days · ${d - 1} nights`,
  title: { 3: 'Long weekend', 5: 'Find your feet', 7: 'A full week', 10: 'Stay a while' }[d],
  camp: inr(PACKAGE_PRICE.camp[d]),
  ac: inr(PACKAGE_PRICE.ac[d]),
  tag: d === 5 ? 'Most popular' : undefined,
  primary: d === 5,
}));

// Positions are real (from Guru's pins, Nov 2026), projected onto a 400x520 map:
// x = (lon - 74.7745) / 0.012 * 400, y = (13.0782 - lat) / 0.0169 * 520.
// Surf point 13.06399,74.77857 · Surf Brothers 13.06994,74.78243 · Sunset point 13.07542,74.77960.
export const MAP_SPOTS = [
  { name: 'Surf spot', x: 137, y: 437, icon: 'board', lx: 160, ly: 482, img: '/img/carry-board.jpg', alt: 'A guest carrying a surfboard into the sea', text: "Our spot on Sasihitlu beach. The boards live here, the jeep drops you off and picks you up, and there's a freshwater well to rinse off after the session." },
  { name: 'Surf Brothers', x: 280, y: 254, icon: 'house', lx: 300, ly: 222, anchor: 'middle', img: '/img/board-hostel.jpg', alt: 'Hand-painted surfboard at the Surf Brothers hostel', text: 'Home base: the AC hostel and the camping area, tucked inside the property under the palms.' },
  { name: 'Kayaks', x: 236, y: 300, icon: 'kayak', lx: 262, ly: 330, img: '/img/kayak-river.jpg', alt: 'Kayaks on the Shambhavi river lined with mangroves', text: 'Right opposite the property, on the river. Morning paddles through the mangroves, night trips in glow season. Timings follow the tide.' },
  { name: 'Glowing river', x: 214, y: 175, icon: 'sparkle', lx: 244, ly: 168, img: '/img/river-dusk.jpg', alt: 'The Shambhavi river at dusk', text: 'In bioluminescence season the backwater glows at night. Book a night kayak to see it.' },
  { name: 'Sunset point', x: 170, y: 86, icon: 'sun', lx: 196, ly: 60, img: '/img/palms-evening.jpg', alt: 'Palm trees at sunset by the beach', text: 'Where the backwater meets the sea. A short walk from the hostel, best around 6 pm.' },
  { name: 'Mulki town', x: 362, y: 46, icon: 'pin', lx: 392, ly: 96, anchor: 'end', img: '/img/mulki-road.jpg', alt: 'A palm-lined road in Mulki', text: 'About 2 km up the road: Mulki railway station and the NH66 bus stand. Mangaluru airport (IXE) is about 25–45 minutes by road.' },
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
  ['Can complete beginners join?', 'Yes. Most of our guests have never stood on a board. Every session starts with theory on the sand and pop-up drills before you go in, and you learn on big soft-top boards in waist-deep whitewash.'],
  ['Do I need to know how to swim?', 'It helps to be comfortable in water, but you don’t need to be a strong swimmer. Beginners stay in shallow water with a leash on the board (which floats) and an instructor beside you. If you can’t swim, tell us when you book and we’ll keep you closer in.'],
  ['What do I need to bring for surfing?', 'Swimwear or board shorts that stay put, a rash guard or a fitted quick-dry T-shirt, water-resistant sunscreen (SPF 50, reef-safe if you can), a towel, a water bottle and a change of clothes. We give you the board and leash. The water is warm here, so there’s no wetsuit.'],
  ['What should I avoid before a session?', 'A heavy meal (eat something light an hour before), a late night out, jewellery, watches and sunglasses (the sea keeps them), loose cotton clothes that drag, and contact lenses without a spare pair. Never paddle out on your own outside a session until a coach says you’re ready.'],
  ['Will I stand up on my first day?', 'Most people do, at least for a few seconds, in their first session or two. Everyone learns at their own pace. Paddling and timing take longer, which is why multi-day packages make such a difference.'],
  ['When are sessions?', 'Surf lessons are in the morning, roughly between 8 and 11 AM. Exact times for surfing and kayaking follow the tide, so we confirm them the evening before.'],
  ['Do I need to be fit?', 'No. Any reasonable fitness is fine and you build strength as you go. Expect tired shoulders after paddling on the first couple of days.'],
  ['When is the best time to surf in Mulki?', 'The surf season runs from September to May. June to August is monsoon, when the sea is too rough for lessons. Sessions always depend on ocean and weather conditions.'],
  ['When can I see the river glow?', 'Bioluminescence usually shows up between October and March, brightest on dark, clear nights. Book a night kayak (₹700) and we take you out when it’s glowing. It’s nature, so it’s never guaranteed.'],
  ["What's included in a surf lesson?", 'A 2-hour group session with an ISA-certified instructor, a surfboard and leash. Theory and beach drills come first, then time in the water.'],
  ['How do I pay?', 'Book online. Surf Only is paid in full to confirm the booking. Stay & Surf needs a ₹2,000 advance per person, and the rest is paid at check-in.'],
  ['What is your refund policy?', 'Surf Only bookings are paid in full and can’t be refunded after booking. For Stay & Surf, the ₹2,000-per-person advance is non-refundable, and nothing else is charged until check-in. Surf sessions depend on ocean and weather conditions. Plans changed? Message us as early as you can.'],
];

// A day (and the days off) at Surf Brothers, in order. Swap in your own photos/clips as they come.
export const HAPPENINGS = [
  ['7:30 am', 'chai on the beach', 'morning-tea.jpg', 'Morning tea being poured on the beach'],
  ['8 am', 'theory in the sand', 'beach-theory.jpg', 'Students learning surf theory drawn in the sand'],
  ['9 am', 'into the water', 'carry-board.jpg', 'A guest carrying a surfboard into the sea'],
  ['11 am', 'day one smiles', 'boards-friends.jpg', 'Two guests posing with their surfboards'],
  ['afternoon', 'paddle the mangroves', 'kayak-river.jpg', 'Kayaking on the Shambhavi river'],
  ['sunset', 'golden hour', 'sunset-board.jpg', 'A surfer holding a board at sunset'],
  ['evening', "volleyball o'clock", 'night-volley.jpg', 'Night volleyball under string lights'],
  ['any night', 'any excuse for cake', 'celebration.jpg', 'The team celebrating with a cake'],
  ['days off', 'waterfall runs', 'falls-crew.jpg', 'The crew sitting together at a waterfall'],
  ['days off', 'road trips', 'jeep-crew.jpg', 'The crew in the jeep among coconut palms'],
];
