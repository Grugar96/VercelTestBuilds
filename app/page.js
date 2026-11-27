import Link from 'next/link';
import Wave from '@/components/Wave';
import Doodle from '@/components/Doodle';
import AutoVideo from '@/components/AutoVideo';
import MulkiMap from '@/components/MulkiMap';
import HandLine from '@/components/HandLine';
import WaveAnim from '@/components/WaveAnim';
import { Kayaker } from '@/components/kit/Kit';
import { PackageCards, ProofStrip, Testimonials, CrewGrid, Faq, BookingBand } from '@/components/Sections';
import { HOME_FAQ, HERO_RIDE, wa } from "@/lib/site";

function Band({ cls, wave, n, icon, label, id, title, lead, price, priceNote, actions, media, flip }) {
  return (
    <section className={`band ${cls} has-wave-top${flip ? ' flip' : ''}`} aria-labelledby={id}>
      <Wave color={wave} n={n} />
      {cls === 'band-charcoal' && <div className="gold-sun" aria-hidden="true" />}
      <div className="wrap band-grid">
        <div className="reveal">
          <div className="band-head"><span className="badge-icon"><Doodle name={icon} /></span><p className="label" style={{ margin: 0 }}>{label}</p></div>
          <h2 id={id}>{title}</h2>
          <p className="lead">{lead}</p>
          {price && <p className="price-from">{price} <small>{priceNote}</small></p>}
          <div className="band-actions">{actions}</div>
        </div>
        <div className="band-media reveal">{media}</div>
      </div>
    </section>
  );
}

const SCATTER = [
  ['m', 'boards-friends.jpg', 'Two guests posing with surfboards on the beach', 'day one smiles', { left: 0, top: '4%', transform: 'rotate(-5deg)' }],
  ['l', 'falls-crew.jpg', 'The crew sitting together at a waterfall', 'crew day out', { left: '22%', top: 0, transform: 'rotate(3deg)' }],
  ['s', 'morning-tea.jpg', 'Morning tea being poured on the beach', 'chai first', { left: '56%', top: '3%', transform: 'rotate(-3deg)' }],
  ['m', 'sunset-board.jpg', 'A surfer holding a board at sunset', 'golden hour', { right: 0, top: 0, transform: 'rotate(5deg)' }],
  ['l', 'night-volley.jpg', 'Night volleyball under string lights', "volleyball o'clock", { left: '3%', bottom: '4%', transform: 'rotate(2deg)' }],
  ['s', 'sunset-dog.jpg', 'A beach dog against the setting sun', 'beach security', { left: '36%', bottom: 0, transform: 'rotate(-4deg)' }],
  ['m', 'falls-fun.jpg', 'Friends pulling faces at the waterfall', 'no filter needed', { left: '60%', bottom: '-3%', transform: 'rotate(4deg)' }],
  ['s', 'celebration.jpg', 'The team celebrating with a cake', 'any excuse for cake', { right: '2%', bottom: '12%', transform: 'rotate(-6deg)' }],
];

export default function Home() {
  return (
    <>
      {/* 1 HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="label">Mulki, Karnataka · surf school &amp; riverside stay</p>
            <h1 className="poster" id="hero-title"><span><i>Stay.</i></span><span><i>Surf.</i></span><span className="out"><i>Belong.</i></span></h1>
            <p className="lead">Your laid-back surf stay by the backwaters, with waves, music, good people and unforgettable experiences.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/book">Plan your stay</Link>
              <a className="btn btn-secondary" href="#packages">See packages</a>
            </div>
          </div>
          <div className="hero-media">
            <div className="video-frame">
              <AutoVideo src="/video/hero-surf.mp4" poster="/img/hero-poster.jpg" label="A Surf Brothers student riding a wave in Mulki" ride={HERO_RIDE} preload="metadata">
                <div className="hero-stats">
                  <div className="stat"><b>8–11 AM</b><span>morning sessions</span></div>
                  <div className="stat"><b>SEP–MAY</b><span>surf season</span></div>
                  <div className="stat"><b>₹2,000</b><span>first session</span></div>
                </div>
              </AutoVideo>
            </div>
          </div>
        </div>
        <WaveAnim back="var(--sb-ocean-deep)" mid="var(--sb-lime)" front="var(--sb-charcoal)" />
      </section>
      <ProofStrip />

      {/* 2 INTRO */}
      <section className="section has-wave-top" style={{ background: 'var(--sb-offwhite)' }}>
        <Wave color="var(--sb-offwhite)" n={0} />
        <div className="wrap intro-grid">
          <p className="intro-big reveal">A surf school, a riverside hostel and a crew that feels like{' '}
            <u>family.<svg className="draw" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 14c30-8 70-10 110-6s60 4 84-2" /></svg></u></p>
          <div className="intro-side reveal">
            <p className="lead">Mulki sits where the Shambhavi river meets the Arabian Sea. Mornings are for the ocean, afternoons for hammocks and the river, evenings for sunsets and long dinners.</p>
            <p className="muted">Beginner? Perfect. Everyone starts somewhere.</p>
            <HandLine text="Find your flow" />
            <div className="intro-photos">
              <figure><img src="/img/board-portrait.jpg" alt="A guest standing with her surfboard on Mulki beach" loading="lazy" /></figure>
              <figure><img src="/img/crew-beach.jpg" alt="Two Surf Brothers instructors chatting on the beach" loading="lazy" /></figure>
            </div>
          </div>
        </div>
      </section>

      {/* 3 MAP */}
      <section className="section map-section has-wave-top" id="mulki">
        <Wave color="var(--sb-white)" n={1} />
        <MulkiMap />
      </section>

      {/* 4 BANDS */}
      <Band cls="band-ocean" wave="var(--sb-ocean)" n={2} icon="board" label="Surf lessons" id="b-surf"
        title={<>First wave,<br />sorted.</>}
        lead="Two-hour sessions: theory on the sand, pop-ups on the beach, then into gentle whitewash with an instructor beside you. Book one day or as many as you like."
        price="From ₹2,000" priceNote="per session"
        actions={<><Link className="btn btn-primary" href="/book?type=surf">Book a lesson</Link><Link className="link-arrow" href="/surf-lessons">How lessons work</Link></>}
        media={<><div className="video-frame" style={{ transform: 'rotate(-2.5deg)', maxWidth: 380, marginInline: 'auto' }}>
          <AutoVideo src="/video/beach-drill.mp4" poster="/img/drill-poster.jpg" label="An instructor teaching the pop-up on the sand" />
        </div><span className="sticker">pop-up drills!</span></>} />

      <Band cls="band-deep" flip wave="var(--sb-ocean-deep)" n={0} icon="palm" label="Riverside stay" id="b-stay"
        title={<>Sleep by<br />the river.</>}
        lead="Camping under the palms or an AC hostel room by the backwaters. Daily surf lessons, ice baths, bonfires, karaoke and movie nights included."
        price="From ₹8,000" priceNote="per person · 3 days with surfing"
        actions={<><Link className="btn btn-primary" href="/book?type=package">Plan your stay</Link><Link className="link-arrow" href="/stay">See the rooms</Link></>}
        media={<img className="tall tilt-r" src="/img/board-hostel.jpg" alt="A hand-painted surfboard leaning in the hostel doorway" loading="lazy" width="1050" height="1400" />} />

      <Band cls="band-charcoal" wave="var(--sb-charcoal)" n={1} icon="kayak" label="River & night kayaking" id="b-river"
        title={<>Paddle into<br />the glow.</>}
        lead="Drift through the mangroves by day. In season, head out after dark when the river lights up with bioluminescence."
        price="Day ₹600 · Night ₹700" priceNote="per person"
        actions={<><Link className="btn btn-primary" href="/book?type=package&addon=kayak-night">Add a kayak trip</Link><Kayaker tone="dark" size={150} className="band-kayaker" title="" /></>}
        media={<img className="wide tilt-l" src="/img/kayak-river.jpg" alt="Guests kayaking on the Shambhavi river" loading="lazy" width="1152" height="746" />} />

      <Band cls="band-lime" flip wave="var(--sb-lime)" n={2} icon="sun" label="Life around Mulki" id="b-life"
        title={<>The only meeting<br />is with the ocean.</>}
        lead="Sunset volleyball, cycling, waterfall days with the crew, bonfires, music and karaoke. Two-thirds of a stay here happens out of the water."
        actions={<Link className="link-arrow" href="/gallery">See more of Mulki</Link>}
        media={<img className="wide tilt-r" src="/img/jeep-crew.jpg" alt="The crew heading out in the jeep through the coconut groves" loading="lazy" width="864" height="524" />} />

      {/* 5 VIDEO BREAK */}
      <section className="video-break has-wave-top" aria-label="Video: a day out with the crew">
        <Wave color="var(--sb-charcoal)" n={0} />
        <AutoVideo src="/video/waterfall-crew.mp4" poster="/img/waterfall-poster.jpg" label="The crew at a waterfall on a team day out">
          <p className="caption">Come for the waves.<br />Stay for the people.</p>
        </AutoVideo>
        <WaveAnim back="var(--sb-ocean)" mid="var(--sb-lime)" front="var(--sb-offwhite)" />
      </section>

      {/* 6 PACKAGES */}
      <section className="section" id="packages" aria-labelledby="pk-title">
        <div className="wrap">
          <div className="section-head">
            <div><p className="label">Stay &amp; Surf packages · per person</p><h2 id="pk-title">Pick your number of days</h2></div>
            <Link className="link-arrow" href="/packages">Compare all options</Link>
          </div>
          <PackageCards />
          <p className="fineprint">Mon–Thu check-ins get ₹1,000 off per person, subject to availability. Add daily meals (veg ₹300 / non-veg ₹400) when you book. Groups: <a href={wa("Hi! I'd like to plan a group trip.")}>message us on WhatsApp</a>.</p>
        </div>
      </section>

      {/* 7 SCATTER */}
      <section className="section scatter-section" aria-labelledby="sc-title" style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          <p className="label">Freedom, humour, friendship</p>
          <h2 id="sc-title" style={{ fontSize: 'var(--fs-h2)' }}>The people make the place</h2>
        </div>
        <div className="wrap scatter">
          <svg className="draw" viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M40 120c80 40 120-30 200 10s60 120 140 110 90-120 180-100 70 90 150 60 120-90 190-40c40 30-10 90-60 120s-150 60-120 140 140 40 170 120c20 60-60 100-140 80s-140-90-230-60-60 120-160 140-140-60-200-20-80 90-120 60" /></svg>
          {SCATTER.map(([size, f, alt, cap, style]) => (
            <figure key={f} className={`print ${size}`} style={style}><img src={`/img/${f}`} alt={alt} loading="lazy" /><figcaption>{cap}</figcaption></figure>
          ))}
          <div className="scatter-copy reveal">
            <p className="lead" style={{ marginBottom: '.5rem' }}>The people who come here are curious, easy-going and up for anything.</p>
            <p className="muted" style={{ margin: 0 }}>Somewhere between the first wipeout and the last sunset, strangers turn into friends.</p>
          </div>
          <Doodle name="smile" className="scatter-doodle" style={{ left: '46%', top: '30%', transform: 'rotate(-12deg)' }} />
          <Doodle name="fire" className="scatter-doodle" style={{ left: '30%', bottom: '34%' }} />
          <Doodle name="arrow" className="scatter-doodle" style={{ right: '28%', top: '36%', transform: 'rotate(160deg)' }} />
        </div>
      </section>

      <CrewGrid />
      <Testimonials />
      <Faq items={HOME_FAQ} bg="var(--sb-white)" />
      <BookingBand surfer="woman" />
    </>
  );
}
