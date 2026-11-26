"""Generates the inner pages from one shared head/foot so they stay consistent.
Run from the surf-brothers folder:  python3 tools/build_pages.py
Edit the page bodies below, not the generated .html files."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Mulki Surf Brothers</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title} — Mulki Surf Brothers">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/img/{og}">
<meta name="theme-color" content="#F5F3EC">
<link rel="icon" href="assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Oswald:wght@500;600&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
</head>
<body data-page="{key}">
<div data-header></div>
<main id="main">
"""

FOOT = """
<section class="booking-band has-wave-top" aria-labelledby="bb-title">
  <svg class="wave wave-top" style="color:var(--sb-ocean-deep)" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" data-wave="1"></svg>
  <div class="wrap">
    <h2 id="bb-title">{cta_title}</h2>
    <p class="lead">Pick your dates and we'll confirm everything on WhatsApp.</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="{cta_href}">{cta_btn}</a>
      <a class="btn btn-ghost" data-wa="Hi Mulki Surf Brothers! I have a question." href="#">Chat on WhatsApp</a>
    </div>
    <p class="phone">Call or WhatsApp <a data-phone href="#">+91 99721 58288</a></p>
  </div>
</section>
</main>
<div data-footer></div>
<script src="assets/js/main.js"></script>
</body>
</html>
"""


def hero(band, label, lines, lead, img, alt, doodle):
    poster = "".join(f"<span>{l}</span>" for l in lines)
    return f"""
<section class="page-hero {band}">
  <div class="wrap page-hero-grid">
    <div>
      <div class="band-head"><span class="badge-icon" data-doodle="{doodle}"></span><p class="label" style="margin:0">{label}</p></div>
      <h1 class="poster">{poster}</h1>
      <p class="lead">{lead}</p>
    </div>
    <img src="assets/img/{img}" alt="{alt}" width="1050" height="1400">
  </div>
</section>"""


def wave_section(bg, n, inner, extra=""):
    return f"""
<section class="section has-wave-top" style="background:var({bg})" {extra}>
  <svg class="wave wave-top" style="color:var({bg})" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" data-wave="{n}"></svg>
  <div class="wrap">{inner}</div>
</section>"""


def card(label, title, price, unit, ticks, href, btn, primary=False, tag=None):
    t = "".join(f"<li>{x}</li>" for x in ticks)
    tg = f'<span class="tag">{tag}</span>' if tag else ""
    cls = "btn-primary" if primary else "btn-secondary"
    return f"""<article class="card reveal">{tg}<p class="label">{label}</p><h3>{title}</h3><p class="price">{price}<small>{unit}</small></p><ul class="ticks">{t}</ul><a class="btn {cls}" href="{href}">{btn}</a></article>"""


PAGES = {}

# ---------------- SURF LESSONS ----------------
PAGES["surf-lessons"] = dict(
    title="Surf lessons", og="beach-theory.jpg",
    desc="Beginner surf lessons in Mulki, Karnataka: group sessions, private lessons and 3 to 10-day programs.",
    cta=("Ready for your<br>first wave?", "book.html?type=surf", "Book a lesson"),
    body=hero("band-ocean", "Surf lessons", ["First wave,", "sorted."],
              "Morning sessions on a gentle, sandy beach with an instructor beside you. Everything you need is included.",
              "beach-theory.jpg", "Students learning surf theory on the sand", "board")
    + wave_section("--sb-offwhite", 0, """
  <p class="label" style="margin-top:3rem">How a lesson works</p>
  <h2 style="font-size:var(--fs-h2)">From the sand to standing up</h2>
  <ol class="steps" style="margin-top:2rem">
    <li class="reveal"><h3>Theory on the sand</h3><p>Waves, safety and where to sit, drawn right there in the sand.</p></li>
    <li class="reveal"><h3>Beach drills</h3><p>Paddling and the pop-up, practised on the board before you get wet.</p></li>
    <li class="reveal"><h3>Into the whitewash</h3><p>Your instructor helps you into broken waves until you're standing.</p></li>
    <li class="reveal"><h3>Green waves</h3><p>On longer programs you paddle out and learn to read and ride unbroken waves.</p></li>
  </ol>
  <p class="muted" style="margin-top:1.5rem">Sessions run in the morning, between 8 and 11 AM. Exact start times follow the tide and are confirmed on WhatsApp the evening before.</p>""")
    + """
<section class="section" style="background:var(--sb-white)" aria-labelledby="sl-courses">
  <div class="wrap">
    <div class="section-head"><div><p class="label">Choose your course</p><h2 id="sl-courses">Sessions &amp; programs</h2></div></div>
    <div class="cards-3">"""
    + card("Single session", "Group session", "₹2,000", "/ session / guest",
           ["Small group with an instructor", "Soft-top surfboard and rash guard", "Theory and beach drills", "Private 1:1 is ₹3,000 a session"],
           "book.html?type=surf&amp;program=group", "Book a session")
    + card("3 mornings in a row", "3-day program", "₹6,000", "/ guest",
           ["Three consecutive mornings", "Paddling, pop-ups and wave basics", "Board and rash guard included", "Add a bed by the river when you book"],
           "book.html?type=surf&amp;program=p3", "Book 3 days", primary=True, tag="Most popular")
    + card("5 mornings or more", "5-day program", "₹9,000", "/ guest",
           ["Five consecutive mornings", "Positioning, wave reading and turns", "7-day ₹11,000 · 10-day ₹15,000", "11+ days on request"],
           "book.html?type=surf&amp;program=p5", "Book 5 days")
    + """
    </div>
    <p class="fineprint">Want lessons with a bed and breakfast included? <a href="packages.html">See Surf + Stay packages</a>.</p>
  </div>
</section>
<section class="band band-ocean has-wave-top flip" aria-labelledby="sl-extra">
  <svg class="wave wave-top" style="color:var(--sb-ocean)" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" data-wave="2"></svg>
  <div class="wrap band-grid">
    <div class="reveal">
      <div class="band-head"><span class="badge-icon" data-doodle="kayak"></span><p class="label" style="margin:0">Beyond the lesson</p></div>
      <h2 id="sl-extra">More time<br>on the water.</h2>
      <p class="lead">Already surfing? Ask about board rentals. Want a break from the waves? Paddle the river by day or under the stars.</p>
      <p class="price-from">Kayaking: day ₹600 · night ₹700 <small>per guest</small></p>
      <div class="band-actions"><a class="btn btn-primary" data-wa="Hi! I'd like to ask about board rentals / kayaking." href="#">Ask on WhatsApp</a></div>
    </div>
    <div class="band-media reveal"><img class="wide tilt-l" src="assets/img/sunset-surfers.jpg" alt="Surfers waiting for waves at sunset" loading="lazy" width="1050" height="1400"></div>
  </div>
</section>""",
)

# ---------------- STAY ----------------
PAGES["stay"] = dict(
    title="Riverside stay", og="board-hostel.jpg",
    desc="Camping and dorm beds by the Shambhavi river in Mulki, from ₹800 a night.",
    cta=("Claim your spot<br>by the river.", "book.html?type=stay", "Choose your bed"),
    body=hero("band-deep", "Riverside stay", ["Sleep by", "the river."],
              "Camping under the palms or a bunk in the dorm, a few steps from the Shambhavi and a short walk from the surf.",
              "board-hostel.jpg", "A painted surfboard at the hostel entrance", "palm")
    + wave_section("--sb-offwhite", 0, """
  <div class="section-head" style="margin-top:3rem"><div><p class="label">Rooms &amp; beds</p><h2>Pick your bed</h2></div></div>
  <div class="cards-3">"""
    + card("Best value", "Camping", "₹800", "/ guest / night", ["Tents under the palms by the river", "Shared bathrooms", "Wi-Fi"], "book.html?type=stay&amp;room=camp", "Choose camping")
    + card("River breeze", "Non-AC dorm", "₹1,000", "/ guest / night", ["Wooden bunks with ceiling fans", "Lockers", "Wi-Fi"], "book.html?type=stay&amp;room=nonac", "Choose non-AC", primary=True)
    + card("Cool nights", "AC dorm", "₹1,200", "/ guest / night", ["Air-conditioned bunks", "Lockers", "Wi-Fi"], "book.html?type=stay&amp;room=ac", "Choose AC")
    + """</div>
  <p class="fineprint">Meals: veg full board ₹500 or non-veg ₹600 per guest per day. Breakfast is included with every Surf + Stay package.</p>""")
    + """
<section class="section" style="background:var(--sb-white)">
  <div class="wrap two-col">
    <div class="reveal">
      <p class="label">House rules</p>
      <h2 style="font-size:var(--fs-h2)">Three simple ones</h2>
      <ul class="ticks" style="font-size:1.15rem"><li>Respect the ocean.</li><li>Respect each other.</li><li>Leave the place better.</li></ul>
      <p class="muted">Check-in from 1:00 PM, check-out by 11:00 AM. Ask us if you're arriving early; we'll find a spot for your bags.</p>
      <span class="hand">Slow down. Stay awhile.</span>
    </div>
    <div class="reveal"><img src="assets/img/morning-tea.jpg" alt="Morning tea on the beach" style="border-radius:20px;transform:rotate(2deg);aspect-ratio:4/5;object-fit:cover;width:100%;height:auto" loading="lazy" width="1050" height="1400"></div>
  </div>
</section>""",
)

# ---------------- PACKAGES ----------------
PAGES["packages"] = dict(
    title="Surf + Stay packages", og="sunset-walk.jpg",
    desc="3, 5 and 7-day Surf + Stay packages in Mulki with lessons, a riverside bed and breakfast every day.",
    cta=("Lock in your<br>surf escape.", "book.html?type=package&amp;pkg=5", "Plan your package"),
    body=hero("band-lime", "Surf + Stay packages", ["Surf. Eat.", "Sleep. Repeat."],
              "Lessons every morning, a bed by the river and breakfast, bundled into one price per guest.",
              "sunset-walk.jpg", "A surfer walking into the sea at sunset", "sun")
    + wave_section("--sb-offwhite", 1, """
  <div class="cards-3" style="margin-top:3.5rem">"""
    + card("3 nights · camping", "Surf escape", "₹8,400", "/ guest", ["3 nights riverside camping", "3-day surf program", "Breakfast every day", "Upgrade to a dorm when you book"], "book.html?type=package&amp;pkg=3", "Choose 3 days")
    + card("5 nights · non-AC dorm", "Surf mastery", "₹14,000", "/ guest", ["5 nights in the non-AC dorm", "5-day surf program", "Breakfast every day", "₹13,000 if you camp instead"], "book.html?type=package&amp;pkg=5", "Choose 5 days", primary=True, tag="Most popular")
    + card("7 nights · AC dorm", "Surf immersion", "₹19,400", "/ guest", ["7 nights in the AC dorm", "7-day surf program", "Breakfast every day", "₹16,600 if you camp instead"], "book.html?type=package&amp;pkg=7", "Choose 7 days")
    + """</div>
  <p class="fineprint">Packages run in surf season, September to May. Add meals (₹500 veg / ₹600 non-veg per day) and kayaking (₹600 day / ₹700 night) when you book. Groups, retreats and 10+ day stays: <a data-wa="Hi! I'd like a custom package for a group / long stay." href="#">message us</a>.</p>""")
    + """
<section class="section" style="background:var(--sb-white)" aria-labelledby="day-title">
  <div class="wrap two-col">
    <div class="reveal">
      <p class="label">A day at Surf Brothers</p>
      <h2 id="day-title" style="font-size:var(--fs-h2)">Roughly how it goes</h2>
      <p class="muted">The ocean sets the timetable, so times move with the tide.</p>
      <span class="hand">The only meeting is with the ocean.</span>
    </div>
    <div class="schedule">
      <div class="reveal"><time>Morning</time><div><h3>Surf session</h3><p>Theory on the sand, beach drills, then into the water. Usually between 8 and 11 AM.</p></div></div>
      <div class="reveal"><time>Late morning</time><div><h3>Breakfast</h3><p>Refuel after the session.</p></div></div>
      <div class="reveal"><time>Afternoon</time><div><h3>Slow time</h3><p>Hammocks, work on the Wi-Fi, or a paddle on the river.</p></div></div>
      <div class="reveal"><time>Sunset</time><div><h3>Beach evenings</h3><p>Volleyball, football and the sun going down over the Arabian Sea.</p></div></div>
      <div class="reveal"><time>Night</time><div><h3>Dinner &amp; stories</h3><p>And in season, a night kayak on the glowing river.</p></div></div>
    </div>
  </div>
</section>""",
)

# ---------------- ABOUT ----------------
crew = [("M", "Manju", "Head instructor", "National bronze medallist in stand-up paddling. He keeps the water fun and the crew feeling like family."),
        ("A", "Anu", "Instructor", "Our only female instructor, and a doctor when she's not in the water."),
        ("F", "Flinu", "Instructor", "Pop-ups, paddling and the first push into your first wave."),
        ("S", "Sandy", "Instructor", "Beach drills, board safety and getting you standing."),
        ("V", "Vishal", "Instructor", "Joined the crew this season.")]
crew_html = "".join(f'<article class="crew reveal"><div class="avatar" aria-hidden="true">{i}</div><h3>{n}</h3><p class="role">{r}</p><p>{d}</p></article>' for i, n, r, d in crew)
PAGES["about"] = dict(
    title="About", og="falls-crew.jpg",
    desc="Mulki Surf Brothers is a surf school and riverside hostel in Mulki, Karnataka, run by a crew that feels like family.",
    cta=("Come join<br>the crew.", "book.html", "Plan your stay"),
    body=hero("band-charcoal", "About us", ["A community,", "not a holiday ad."],
              "Mulki Surf Brothers is a surf school and riverside hostel where the river meets the ocean. Come for a session, stay a little longer, leave with stories.",
              "falls-crew.jpg", "The Surf Brothers crew sitting together at a waterfall", "smile")
    + wave_section("--sb-offwhite", 2, """
  <div class="two-col" style="margin-top:3rem">
    <div class="reveal"><p class="intro-big">Learn to surf. Stay a little longer. Make friends. Explore Mulki. Leave with stories.</p></div>
    <div class="reveal"><p class="lead">We teach beginners on a gentle, sandy beach, and we keep the vibe the way we like it: patient in the water, loud at dinner.</p><p class="muted">Nobody gets shouted at for falling off. Everybody falls off.</p><span class="hand">Find your flow</span></div>
  </div>""")
    + f"""
<section class="section" style="background:var(--sb-white)" aria-labelledby="crew-title">
  <div class="wrap">
    <div class="section-head"><div><p class="label">The crew</p><h2 id="crew-title">Who'll be in the water with you</h2></div></div>
    <div class="crew-grid">{crew_html}</div>
  </div>
</section>""",
)

# ---------------- GALLERY ----------------
gal = [("surf", "sunset-board.jpg", "A surfer holding a board at sunset", "golden hour"),
       ("surf", "carry-board.jpg", "A guest carrying a blue surfboard into the sea", "first steps in"),
       ("life", "falls-crew-2.jpg", "The crew sitting on the rocks at a waterfall", "crew day out"),
       ("stay", "board-art.jpg", "Mandala art painted on a surfboard", "board art"),
       ("surf", "beach-theory.jpg", "Students learning theory on the sand", "theory first"),
       ("river", "kayak-river.jpg", "Kayaking on the Shambhavi river", "mangrove paddle"),
       ("life", "night-volley.jpg", "Night volleyball under string lights", "volleyball o'clock"),
       ("surf", "sunset-surfers.jpg", "Surfers in the water at sunset", "last waves"),
       ("stay", "board-hostel.jpg", "A painted board at the hostel door", "home base"),
       ("river", "river-dusk.jpg", "The river at dusk with birds", "river at dusk"),
       ("life", "celebration.jpg", "The team celebrating with cake", "any excuse for cake"),
       ("surf", "boards-friends.jpg", "Two guests with their surfboards", "day one smiles"),
       ("life", "sunset-dog.jpg", "A beach dog against the sunset", "beach security"),
       ("stay", "morning-tea.jpg", "Morning tea on the beach", "chai first"),
       ("surf", "green-board.jpg", "A guest with a green surfboard on the beach", "new board day"),
       ("life", "falls-fun.jpg", "Friends pulling faces at a waterfall", "no filter needed"),
       ("river", "boat-sunset.jpg", "Sunset seen from a boat", "out on the water"),
       ("life", "jeep-crew.jpg", "The crew in the jeep among coconut palms", "road trip")]
gal_html = "".join(f'<figure data-cat="{c}" class="reveal"><img src="assets/img/{f}" alt="{a}" loading="lazy"><figcaption>{cap}</figcaption></figure>' for c, f, a, cap in gal)
PAGES["gallery"] = dict(
    title="Gallery", og="sunset-surfers.jpg",
    desc="Photos from Mulki Surf Brothers: surf sessions, the riverside hostel, kayaking and crew days out.",
    cta=("Want to be<br>in the next one?", "book.html", "Plan your stay"),
    body=hero("band-ocean", "Gallery", ["Life between", "river &amp; ocean."],
              "Real days at Surf Brothers. No stock photos, no filters beyond a little sunset.",
              "sunset-surfers.jpg", "Surfers waiting for waves at sunset", "sun")
    + wave_section("--sb-offwhite", 0, f"""
  <div class="gallery-filter" role="group" aria-label="Filter photos" style="margin-top:3rem">
    <button type="button" data-f="all" aria-pressed="true">All</button><button type="button" data-f="surf" aria-pressed="false">Surf</button><button type="button" data-f="stay" aria-pressed="false">Stay</button><button type="button" data-f="river" aria-pressed="false">River</button><button type="button" data-f="life" aria-pressed="false">Life</button>
  </div>
  <div class="gallery-grid">{gal_html}</div>
  <p class="fineprint">More every week on <a href="https://www.instagram.com/surfbrothersmulki/">Instagram</a>.</p>"""),
)

# ---------------- CONTACT ----------------
PAGES["contact"] = dict(
    title="Contact", og="mulki-road.jpg",
    desc="How to reach Mulki Surf Brothers in Mulki, Karnataka: WhatsApp, phone, and getting here by train, bus or plane.",
    cta=("See you<br>in Mulki.", "book.html", "Plan your stay"),
    body=hero("band-lime", "Contact", ["Say hi.", "We reply fast."],
              "The quickest way to reach us is WhatsApp. Call if you prefer to talk.",
              "mulki-road.jpg", "A palm-lined road in Mulki", "pin")
    + wave_section("--sb-offwhite", 1, """
  <div class="two-col" style="margin-top:3rem">
    <div class="reveal">
      <p class="label">Talk to us</p>
      <ul class="contact-list">
        <li><span data-doodle="smile"></span><div><b>WhatsApp</b><a data-wa="Hi Mulki Surf Brothers!" href="#">+91 99721 58288</a></div></li>
        <li><span data-doodle="arrow"></span><div><b>Call</b><a data-phone href="#">+91 99721 58288</a></div></li>
        <li><span data-doodle="pin"></span><div><b>Address</b>Mulki Surf Brothers, Bappanadu, Mulki, Karnataka 574154<br><a href="https://www.google.com/maps/search/?api=1&amp;query=Mulki+Surf+Brothers">Open in Google Maps</a></div></li>
        <li><span data-doodle="sun"></span><div><b>Instagram</b><a href="https://www.instagram.com/surfbrothersmulki/">@surfbrothersmulki</a></div></li>
      </ul>
    </div>
    <div class="reveal">
      <p class="label">Getting here</p>
      <div class="schedule">
        <div><time>By train</time><div><h3>Mulki station</h3><p>Trains on the Konkan line stop at Mulki. Take an auto from the station.</p></div></div>
        <div><time>By bus</time><div><h3>NH66, Mulki bus stand</h3><p>Overnight buses from Bengaluru and Mumbai stop on the highway at Mulki.</p></div></div>
        <div><time>By air</time><div><h3>Mangaluru airport (IXE)</h3><p>About 45 minutes by road. Ask us and we'll help arrange a cab.</p></div></div>
      </div>
    </div>
  </div>""")
    + """
<section class="section" style="background:var(--sb-white)" aria-labelledby="faq-title">
  <div class="wrap two-col">
    <div><p class="label">Before you come</p><h2 id="faq-title" style="font-size:var(--fs-h2)">Good to know</h2></div>
    <div class="faq">
      <details><summary>What are the check-in and check-out times?</summary><div><p>Check-in from 1:00 PM, check-out by 11:00 AM. Arriving early? Tell us and we'll keep your bags safe.</p></div></details>
      <details><summary>Can I work remotely from here?</summary><div><p>Yes. There's Wi-Fi at the hostel, and afternoons are quiet once the morning session is done.</p></div></details>
      <details><summary>When is the surf season?</summary><div><p>September to May. June to August is monsoon, when the sea is too rough for lessons.</p></div></details>
      <details><summary>Do I pay online?</summary><div><p>No. You send a booking request, and we confirm availability and the final price with you on WhatsApp.</p></div></details>
    </div>
  </div>
</section>""",
)

for key, p in PAGES.items():
    t, h, b = p["cta"]
    html = HEAD.format(title=p["title"], desc=p["desc"], og=p["og"], key=key) + p["body"] + FOOT.format(cta_title=t, cta_href=h, cta_btn=b)
    (ROOT / f"{key}.html").write_text(html, encoding="utf-8")
    print("wrote", key)
