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
import AutoScroll from '@/components/AutoScroll';
import { WarliSurfer, WarliPalm, WarliKayaker, WarliSkater } from '@/components/kit/Warli';
import { HOME_FAQ, wa } from "@/lib/site";
import { HERO_TRACK } from "@/lib/heroTrack";



const TILES = [
  { tone: 'ocean', icon: 'board', label: 'surf lessons', title: 'First wave, sorted', text: 'Two hours: theory on the sand, pop-ups, then gentle whitewash with an instructor right beside you.', price: '₹2,000', unit: 'a session', href: '/surf-lessons', cta: 'How lessons work', video: '/video/beach-drill.mp4', poster: '/img/drill-poster.jpg', alt: 'An instructor teaching the pop-up on the sand', sticker: 'pop up!', figure: 'surfer' },
  { tone: 'lime', icon: 'palm', label: 'stay', title: 'Sleep under the palms', text: 'A tent inside the property or a bed in the AC hostel, with a surf lesson built into every day.', price: '₹8,000', unit: 'for 3 days', href: '/stay', cta: 'See the rooms', img: '/img/board-hostel.jpg', alt: 'A hand-painted surfboard leaning in the hostel doorway', sticker: 'home base', figure: 'palm' },
  { tone: 'deep', icon: 'sparkle', label: 'only with surf brothers', title: 'Kayak a glowing river', text: 'Paddle the Shambhavi after dark. In glow season every stroke lights the water blue. Mangrove trips by day too.', price: '₹600', unit: 'morning · ₹700 at night', href: '/book?type=stay&addon=kayak-night', cta: 'Add it to a stay', img: '/img/kayak-river.jpg', alt: 'Guests kayaking on the Shambhavi river', sticker: 'bioluminescence', figure: 'kayaker' },
  { tone: 'charcoal', icon: 'sun', label: 'life here', title: 'The only meeting is with the ocean', text: 'Volleyball at sunset, surfskate sessions, cycling into town and waterfall days with the crew.', price: '₹300', unit: 'an hour of surfskate', href: '/gallery', cta: 'See more of Mulki', img: '/img/jeep-crew.jpg', alt: 'The crew heading out in the jeep through the coconut groves', sticker: 'golden hour', figure: 'skater' },
];
const FIG = { surfer: WarliSurfer, palm: WarliPalm, kayaker: WarliKayaker, skater: WarliSkater };
const HOME_FAQ_SHORT = [...HOME_FAQ.slice(0, 5), HOME_FAQ.find(([q]) => q.startsWith('What is your refund'))];

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
            <p className="hero-sub"><a className="hero-chip" href="#packages">See all packages <span aria-hidden="true">→</span></a><Link className="hero-chip" href="/surf-lessons">Just surf lessons <span aria-hidden="true">→</span></Link></p>
          </div>
          <div className="hero-media">
            <div className="video-frame">
              <AutoVideo src="/video/hero-surf.mp4" poster="/img/hero-poster.jpg" label="A Surf Brothers student riding a wave in Mulki" track={HERO_TRACK} preload="metadata">
                <div className="hero-stats">
                  <div className="stat"><b>8–11 AM</b><span>sessions follow the tide</span></div>
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
          <AutoScroll className="tiles" speed={0.4}>
            {TILES.map((t, i) => {
              const Fig = FIG[t.figure];
              const dark = t.tone === 'deep' || t.tone === 'charcoal';
              return (
                <article className={`tile tile-${t.tone}`} key={t.title}>
                  {t.tone === 'charcoal' && <span className="gold-sun" aria-hidden="true" />}
                  <Link href={t.href} className={`tile-media ${i % 2 ? 'tilt-r' : 'tilt-l'}`} tabIndex={-1} aria-hidden="true">
                    {t.video ? <AutoVideo src={t.video} poster={t.poster} label={t.alt} /> : <img src={t.img} alt="" loading="lazy" />}
                    <Wavy className="tile-sticker">{t.sticker}</Wavy>
                  </Link>
                  <div className="tile-body">
                    <div className="tile-head"><span className="badge-icon"><DoodleSvg name={t.icon} className="doodle" /></span><p className="tile-label">{t.label}</p></div>
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                    <div className="tile-foot">
                      <p className="tile-price">{t.price} <small>{t.unit}</small></p>
                      <Link className="tile-cta" href={t.href}>{t.cta} <span aria-hidden="true">→</span></Link>
                    </div>
                  </div>
                  <Fig tone={dark ? 'dark' : 'light'} size={120} className="tile-fig" title="" />
                </article>
              );
            })}
          </AutoScroll>
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
      <Happenings />

      {/* 7 MAP, opened by the painted frieze */}
      <FriezeBand edgeBottom="var(--sb-white)" />
      <section className="section map-section" id="mulki">
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
