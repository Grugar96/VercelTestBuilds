// Mulki Surf Brothers — site content and prices in one place.
// Items marked `placeholder: true` were carried over from the draft site and still
// need the owner's confirmation before launch. Search "placeholder" to find them all.

export const PHONE = '919972158288';
export const PHONE_LABEL = '+91 99721 58288';
export const EMAIL = { value: 'hello@surfbrothersmulki.com', placeholder: true };
export const INSTAGRAM = 'https://www.instagram.com/surfbrothersmulki/';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=Mulki+Surf+Brothers';
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

export const PRICES = {
  room: {
    camp: { name: 'Riverside camping', short: 'Camping', rate: 800, img: '/img/palms-evening.jpg', alt: 'Palm trees by the camping area at sunset', desc: 'Tents under the palms, a few steps from the river.', feats: ['Under the palms', 'Shared washrooms & hot showers', 'Fiber Wi-Fi'] },
    nonac: { name: 'Non-AC dorm', short: 'Non-AC dorm', rate: 1000, img: '/img/board-hostel.jpg', alt: 'The hostel dorm entrance with a painted surfboard', desc: 'Wooden bunks with ceiling fans and the river breeze.', feats: ['Ceiling fans', 'Lockers', 'Fiber Wi-Fi'] },
    ac: { name: 'AC dorm', short: 'AC dorm', rate: 1200, img: '/img/board-art.jpg', alt: 'Close-up of the mandala art on a hostel surfboard', desc: 'Air-conditioned bunks with privacy curtains.', feats: ['Air conditioning', 'Privacy curtains & lockers', 'Fiber Wi-Fi'] },
  },
  pkg: {
    3: { name: '3-day Surf escape', short: 'Surf escape', nights: 3, program: 6000, room: 'camp' },
    5: { name: '5-day Surf mastery', short: 'Surf mastery', nights: 5, program: 9000, room: 'nonac' },
    7: { name: '7-day Surf immersion', short: 'Surf immersion', nights: 7, program: 11000, room: 'ac' },
  },
  surf: {
    group: { name: 'Group session', price: 2000, per: 'session', days: 1, sessions: true, desc: 'Small group with an ISA-certified coach. About 2 hours.' },
    private: { name: 'Private 1:1 session', price: 3000, per: 'session', days: 1, sessions: true, desc: 'Just you and a coach.' },
    p3: { name: '3-day program', price: 6000, per: 'guest', days: 3, desc: 'Three consecutive mornings, from first pop-up to riding whitewash.' },
    p5: { name: '5-day program', price: 9000, per: 'guest', days: 5, desc: 'Five mornings: paddling, positioning and reading waves.' },
    p7: { name: '7-day program', price: 11000, per: 'guest', days: 7, desc: 'A full week of coaching.' },
    p10: { name: '10-day program', price: 15000, per: 'guest', days: 10, desc: 'Ten mornings for real independence.' },
  },
  meals: { none: { name: 'No meal plan', rate: 0 }, veg: { name: 'Veg full board', rate: 500 }, nonveg: { name: 'Non-veg full board', rate: 600 } },
  kayakDay: 600,
  kayakNight: 700,
};

export const BOOKING_TYPES = {
  package: { name: 'Surf + Stay package', img: '/img/sunset-walk.jpg', alt: 'A surfer walking into the sea at sunset with a board', desc: 'Lessons, a bed by the river and breakfast, bundled.', from: 'From ₹8,400 / guest' },
  surf: { name: 'Surf lessons only', img: '/img/beach-theory.jpg', alt: 'Students learning on the sand before a surf session', desc: 'Already staying nearby? Join a session or a program.', from: 'From ₹2,000 / session' },
  stay: { name: 'Stay only', img: '/img/river-dusk.jpg', alt: 'The Shambhavi river at dusk', desc: 'Camping or a dorm bed by the Shambhavi river.', from: 'From ₹800 / night' },
};

export const PACKAGES = [
  { pkg: 3, label: '3 nights · camping', title: 'Surf escape', price: '₹8,400', ticks: ['3 nights riverside camping', '3-day surf program', 'Breakfast every day', 'Switch to a dorm when you book'] },
  { pkg: 5, label: '5 nights · non-AC dorm', title: 'Surf mastery', price: '₹14,000', tag: 'Most popular', primary: true, ticks: ['5 nights in the non-AC dorm', '5-day surf program', 'Breakfast every day', '₹13,000 if you camp instead'] },
  { pkg: 7, label: '7 nights · AC dorm', title: 'Surf immersion', price: '₹19,400', ticks: ['7 nights in the AC dorm', '7-day surf program', 'Breakfast every day', '₹16,600 if you camp instead'] },
];

export const MAP_SPOTS = [
  { name: 'Surf beach', x: 128, y: 320, icon: 'wave', lx: 96, ly: 358, img: '/img/sunset-surfers.jpg', alt: 'Surfers in the water at sunset on Mulki beach', text: 'Morning sessions run 8–11 AM: theory on the sand, beach drills, then into the water.' },
  { name: 'The hostel', x: 232, y: 262, icon: 'house', lx: 258, ly: 268, img: '/img/board-hostel.jpg', alt: 'Hand-painted surfboard at the Surf Brothers hostel', text: 'Camping and dorms by the Shambhavi river. Breakfast is included with every Surf + Stay package.' },
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
  ['When is the best time to surf in Mulki?', 'The surf season runs from September to May. Mornings usually have the cleanest conditions, which is why sessions run from 8 to 11 AM.'],
  ["What's included in a surf lesson?", 'A soft-top surfboard, a rash guard, an ISA-certified coach, theory and beach drills, then time in the water.'],
];
