import Wavy from '@/components/Wavy';
import Link from 'next/link';
import Wave from '@/components/Wave';
import Doodle from '@/components/Doodle';
import AutoVideo from '@/components/AutoVideo';
import StatCards from '@/components/StatCards';
import Happenings from '@/components/Happenings';
import MulkiMap from '@/components/MulkiMap';
import HandLine from '@/components/HandLine';
import WaveAnim from '@/components/WaveAnim';
import { WarliKayaker } from '@/components/kit/Warli';
import { PackageCards, ProofStrip, Testimonials, CrewGrid, Faq, BookingBand, FriezeBand } from '@/components/Sections';
import { HOME_FAQ, wa } from "@/lib/site";
import { HERO_TRACK } from "@/lib/heroTrack";

function Band({ cls, wave, n, icon, label, id, title, lead, price, priceNote, actions, media, flip }) {
  return (
    <section className={`band ${cls} has-wave-top${flip ? ' flip' : ''}`} aria-labelledby={id}>
      <Wave color={wave} n={n} />
      {cls === 'band-charcoal' && <div className="gold-sun" aria-hidden="true" />}
      <div className="wrap band-grid">
        <div className="reveal">
          <div className="band-head"><span className="badge-icon"><Doodle name={icon} /></span><Wavy as="p" className="label eyebrow" style={{ margin: 0 }}>{label}</Wavy></div>
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


export default function Home() {
  return (
    <>
      {/* 1 HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="label">Mulki, Karnataka · surf school &amp; riverside stay</p>
            <h1 className="poster" id="hero-title"><span><i>Stay.</i></span><span><i>Surf.</i></span><span className="out"><i>Belong.</i></span></h1>
            <p className="lead">Surf lessons in the morning, the river in the afternoon, a bonfire at night. Most people who come here have never stood on a board.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/book">Plan your stay</Link>
              <a className="btn btn-secondary" href="#packages">See packages</a>
            </div>
          </div>
          <div className="hero-media">
            <div className="video-frame">
              <AutoVideo src="/video/hero-surf.mp4" poster="/img/hero-poster.jpg" label="A Surf Brothers student riding a wave in Mulki" track={HERO_TRACK} preload="metadata">
                <div className="hero-stats">
                  <div className="stat"><b>8–11 AM</b><span>morning sessions</span></div>
                  <div className="stat"><b>SEP–MAY</b><span>surf season</span></div>
                  <div className="stat"><b>₹2,000</b><span>first session</span></div>
                </div>
              </AutoVideo>
            </div>
          </div>
        </div>
        <WaveAnim back="var(--sb-ocean-deep)" mid="var(--sb-lime)" front="var(--sb-offwhite)" />
      </section>
      <StatCards />

      {/* 2 INTRO */}
      <section className="section has-wave-top" style={{ background: 'var(--sb-offwhite)' }}>
        <Wave color="var(--sb-offwhite)" n={0} />
        <div className="wrap intro-grid">
          <div className="intro-main reveal"><p className="intro-big">A surf school, a riverside hostel and a crew that feels like{' '}
            <u>family.<svg className="draw" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 14c30-8 70-10 110-6s60 4 84-2" /></svg></u></p>
              <div className="intro-photos">
              <figure><img src="/img/board-portrait.jpg" alt="A guest standing with her surfboard on Mulki beach" loading="lazy" /></figure>
              <figure><img src="/img/crew-beach.jpg" alt="Two Surf Brothers instructors chatting on the beach" loading="lazy" /></figure>
            </div>
          </div>
          <div className="intro-side reveal">
            <p className="lead">Mulki sits where the Shambhavi river meets the Arabian Sea. You surf in the morning, nap or paddle in the afternoon, and watch the sun go down from the beach.</p>
            <p className="muted">Beginner? Perfect. Everyone starts somewhere.</p>
            <HandLine text="Find your flow" />
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
        </div><Wavy className="sticker">pop-up drills!</Wavy></>} />

      <Band cls="band-deep" flip wave="var(--sb-ocean-deep)" n={0} icon="palm" label="Riverside stay" id="b-stay"
        title={<>Sleep by<br />the river.</>}
        lead="A tent under the palms or an AC room in the hostel. A surf lesson every day comes with it, and so do the ice bath, the bonfire and whoever grabs the karaoke mic."
        price="From ₹8,000" priceNote="per person · 3 days with surfing"
        actions={<><Link className="btn btn-primary" href="/book?type=package">Plan your stay</Link><Link className="link-arrow" href="/stay">See the rooms</Link></>}
        media={<img className="tall tilt-r" src="/img/board-hostel.jpg" alt="A hand-painted surfboard leaning in the hostel doorway" loading="lazy" width="1050" height="1400" />} />

      <Band cls="band-charcoal" wave="var(--sb-charcoal)" n={1} icon="kayak" label="River & night kayaking" id="b-river"
        title={<>Paddle into<br />the glow.</>}
        lead="Paddle through the mangroves in the day. In season, go out after dark, when every stroke lights the river up blue."
        price="Day ₹600 · Night ₹700" priceNote="per person"
        actions={<><Link className="btn btn-primary" href="/book?type=package&addon=kayak-night">Add a kayak trip</Link><WarliKayaker tone="dark" size={160} className="band-kayaker" title="" /></>}
        media={<img className="wide tilt-l" src="/img/kayak-river.jpg" alt="Guests kayaking on the Shambhavi river" loading="lazy" width="1152" height="746" />} />

      <Band cls="band-lime" flip wave="var(--sb-lime)" n={2} icon="sun" label="Life around Mulki" id="b-life"
        title={<>The only meeting<br />is with the ocean.</>}
        lead="Most of a stay here happens out of the water: volleyball at sunset, cycling into town, a waterfall trip when the crew gets a free day."
        actions={<Link className="link-arrow" href="/gallery">See more of Mulki</Link>}
        media={<img className="wide tilt-r" src="/img/jeep-crew.jpg" alt="The crew heading out in the jeep through the coconut groves" loading="lazy" width="864" height="524" />} />

      {/* 5 VIDEO BREAK */}
      <section className="video-break" aria-label="Video: a day out with the crew">
        <div className="vb-clip">
        <AutoVideo src="/video/waterfall-crew.mp4" poster="/img/waterfall-poster.jpg" label="The crew at a waterfall on a team day out">
          <p className="caption">Come for the waves.<br />Stay for the people.</p>
        </AutoVideo>
        </div>
      </section>

      {/* 6 PACKAGES */}
      <section className="section" id="packages" aria-labelledby="pk-title">
        <div className="wrap">
          <div className="section-head">
            <div><Wavy as="p" className="label eyebrow">{"Stay & Surf, per person"}</Wavy><h2 id="pk-title">How many days have you got?</h2></div>
            <Link className="link-arrow" href="/packages">Compare all options</Link>
          </div>
          <PackageCards />
          <p className="fineprint">Mon–Thu check-ins get ₹1,000 off per person, subject to availability. Add daily meals (veg ₹300 / non-veg ₹400) when you book. Groups: <a href={wa("Hi! I'd like to plan a group trip.")}>message us on WhatsApp</a>.</p>
        </div>
      </section>

      {/* 7 SCATTER */}
      <FriezeBand />

      <Happenings />

      <CrewGrid />
      <Testimonials />
      <Faq items={HOME_FAQ} bg="var(--sb-white)" />
      <BookingBand surfer="woman" />
    </>
  );
}
