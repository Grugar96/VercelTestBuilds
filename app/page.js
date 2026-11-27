import Wavy from '@/components/Wavy';
import Link from 'next/link';
import Wave from '@/components/Wave';
import { DoodleSvg } from '@/components/Doodle';
import AutoVideo from '@/components/AutoVideo';
import StatCards from '@/components/StatCards';
import Happenings from '@/components/Happenings';
import MulkiMap from '@/components/MulkiMap';
import HandLine from '@/components/HandLine';
import WaveAnim from '@/components/WaveAnim';
import { PackageCards, Testimonials, CrewGrid, Faq, BookingBand, FriezeBand } from '@/components/Sections';
import BookingBar from '@/components/BookingBar';
import { HOME_FAQ, wa } from "@/lib/site";
import { HERO_TRACK } from "@/lib/heroTrack";



const TILES = [
  { icon: 'board', label: 'surf lessons', title: 'First wave, sorted', text: 'Two hours: theory on the sand, pop-ups, then gentle whitewash with an instructor beside you.', price: 'From ₹2,000 a session', href: '/surf-lessons', cta: 'How lessons work', video: '/video/beach-drill.mp4', poster: '/img/drill-poster.jpg', alt: 'An instructor teaching the pop-up on the sand' },
  { icon: 'palm', label: 'stay', title: 'Sleep under the palms', text: 'Tents inside the property or an AC hostel room, with a surf lesson every day built in.', price: 'From ₹8,000 for 3 days', href: '/stay', cta: 'See the rooms', img: '/img/board-hostel.jpg', alt: 'A hand-painted surfboard leaning in the hostel doorway' },
  { icon: 'sparkle', label: 'only with surf brothers', title: 'Night kayak on a glowing river', text: 'In glow season every paddle stroke lights the Shambhavi up blue. Day trips through the mangroves too.', price: 'Day ₹600 · Night ₹700', href: '/book?type=package&addon=kayak-night', cta: 'Add it to a stay', img: '/img/kayak-river.jpg', alt: 'Guests kayaking on the Shambhavi river' },
  { icon: 'sun', label: 'life here', title: 'The only meeting is with the ocean', text: 'Volleyball at sunset, surfskate sessions, cycling into town, waterfall days with the crew.', price: 'Surfskate ₹300 an hour', href: '/gallery', cta: 'See more of Mulki', img: '/img/jeep-crew.jpg', alt: 'The crew heading out in the jeep through the coconut groves' },
];
const HOME_FAQ_SHORT = HOME_FAQ.slice(0, 4);

export default function Home() {
  return (
    <>
      {/* 1 HERO + quick booking */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="label">Mulki, Karnataka · surf school &amp; riverside stay</p>
            <h1 className="poster" id="hero-title"><span><i>Stay.</i></span><span><i>Surf.</i></span><span className="out"><i>Belong.</i></span></h1>
            <p className="lead">Surf lessons in the morning, the river in the afternoon, a bonfire at night. Most people who come here have never stood on a board.</p>
            <BookingBar />
            <p className="hero-sub"><a className="link-arrow" href="#packages">See all packages</a><Link className="link-arrow" href="/book?type=surf">Just surf lessons</Link></p>
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

      {/* 2 PROOF */}
      <StatCards />

      {/* 3 WHAT YOU CAN DO */}
      <section className="section tiles-section" aria-labelledby="do-title">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="intro-big">A surf school, a riverside hostel and a crew that feels like{' '}
                <u>family.<svg className="draw" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 14c30-8 70-10 110-6s60 4 84-2" /></svg></u></p>
              <h2 id="do-title" className="sr-only">What you can do here</h2>
            </div>
            <HandLine text="Find your flow" />
          </div>
          <div className="tiles">
            {TILES.map((t, i) => (
              <article className={`tile t${i}`} key={t.title}>
                <Link href={t.href} className="tile-media" tabIndex={-1} aria-hidden="true">
                  {t.video ? <AutoVideo src={t.video} poster={t.poster} label={t.alt} /> : <img src={t.img} alt="" loading="lazy" />}
                </Link>
                <div className="tile-body">
                  <div className="tile-head"><span className="tile-icon"><DoodleSvg name={t.icon} /></span><Wavy as="p" className="tile-label">{t.label}</Wavy></div>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                  <p className="tile-price">{t.price}</p>
                  <Link className="link-arrow" href={t.href}>{t.cta}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 PACKAGES */}
      <section className="section" id="packages" aria-labelledby="pk-title" style={{ background: 'var(--sb-white)' }}>
        <div className="wrap">
          <div className="section-head">
            <div><Wavy as="p" className="label eyebrow">{"Stay & Surf, per person"}</Wavy><h2 id="pk-title">How many days have you got?</h2></div>
            <Link className="link-arrow" href="/packages">Compare all options</Link>
          </div>
          <PackageCards />
          <p className="fineprint">Arrive Monday to Thursday and get ₹1,000 off your booking, subject to availability. Add daily meals (veg ₹300 / non-veg ₹400) when you book.</p>
        </div>
      </section>

      {/* 5 VIDEO BREAK */}
      <section className="video-break" aria-label="Video: a day out with the crew">
        <div className="vb-clip">
        <AutoVideo src="/video/waterfall-crew.mp4" poster="/img/waterfall-poster.jpg" label="The crew at a waterfall on a team day out">
          <p className="caption">Come for the waves.<br />Stay for the people.</p>
        </AutoVideo>
        </div>
      </section>

      {/* 6 EVERYTHING THAT HAPPENS */}
      <FriezeBand />
      <Happenings />

      {/* 7 MAP */}
      <section className="section map-section has-wave-top" id="mulki">
        <Wave color="var(--sb-white)" n={1} />
        <MulkiMap />
      </section>

      {/* 8 CREW, 9 REVIEWS */}
      <CrewGrid row />
      <Testimonials />

      {/* 10 FAQ + BOOK */}
      <Faq items={HOME_FAQ_SHORT} bg="var(--sb-white)" more />
      <BookingBand surfer="woman" />
    </>
  );
}
