import Link from 'next/link';
import Wave from '@/components/Wave';
import { Skater } from '@/components/kit/Kit';
import Doodle from '@/components/Doodle';
import { PageHero, WaveSection, Ticks, BookingBand } from '@/components/Sections';
import { wa, SURF_BUNDLES, PRIVATE_SESSION, SURF_INCLUDES, POLICY } from '@/lib/site';

export const metadata = { title: 'Surf lessons', description: 'Beginner surf lessons in Mulki, Karnataka: 2-hour group sessions from ₹2,000, 3 to 10-day bundles and private 1:1 training.' };

export default function SurfLessons() {
  return (
    <>
      <PageHero band="band-ocean" label="Surf lessons" lines={['First wave,', 'sorted.']} doodle="board"
        lead="Two-hour sessions on a gentle, sandy beach with an instructor beside you. Board and basic surf equipment included."
        img="/img/beach-theory.jpg" alt="Students learning surf theory on the sand" />
      <WaveSection bg="--sb-offwhite" n={0}>
        <p className="label" style={{ marginTop: '3rem' }}>How a lesson works</p>
        <h2 style={{ fontSize: 'var(--fs-h2)' }}>From the sand to standing up</h2>
        <ol className="steps" style={{ marginTop: '2rem' }}>
          <li className="reveal"><h3>Theory on the sand</h3><p>Waves, safety and where to sit, drawn right there in the sand.</p></li>
          <li className="reveal"><h3>Beach drills</h3><p>Paddling and the pop-up, practised on the board before you get wet.</p></li>
          <li className="reveal"><h3>Into the whitewash</h3><p>Your coach helps you into broken waves until you're standing.</p></li>
          <li className="reveal"><h3>Green waves</h3><p>On longer programs you paddle out and learn to read and ride unbroken waves.</p></li>
        </ol>
        <p className="muted" style={{ marginTop: '1.5rem' }}>Sessions run in the morning, between 8 and 11 AM. Exact start times follow the tide and are confirmed on WhatsApp the evening before.</p>
      </WaveSection>

      {/* placeholder: safety figures carried over from the draft site */}
      <section className="section" style={{ background: 'var(--sb-white)' }} aria-labelledby="safe-title">
        <div className="wrap">
          <p className="label">Your safety comes first</p>
          <h2 id="safe-title" style={{ fontSize: 'var(--fs-h2)' }}>One of the safest places in India to learn</h2>
          <p className="lead">Mulki has gentle, sandy-bottom breaks. Our coaches are trained in surf rescue and CPR, and we keep groups small so you're always watched.</p>
          <div className="safety">
            <div className="reveal"><b>4:1</b>Max students per coach</div>
            <div className="reveal"><b>ISA</b>Certified coaches</div>
            <div className="reveal"><b>CPR</b>Rescue &amp; first-aid trained</div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="sl-courses">
        <div className="wrap">
          <div className="section-head"><div><p className="label">Surf only · per person</p><h2 id="sl-courses">Pick your number of sessions</h2></div></div>
          <div className="two-col">
            <div className="reveal">
              <table className="price-table">
                <thead><tr><th scope="col">Group sessions</th><th scope="col" className="num">Price</th></tr></thead>
                <tbody>
                  {Object.entries(SURF_BUNDLES).map(([n, price]) => (
                    <tr key={n}><td>{n === '1' ? '1 day / 1 session' : `${n} days / ${n} sessions`}</td><td className="num">₹{price.toLocaleString('en-IN')}</td></tr>
                  ))}
                  <tr><td>Private 1:1 training, per session</td><td className="num">₹{PRIVATE_SESSION.toLocaleString('en-IN')}</td></tr>
                </tbody>
              </table>
              <div className="band-actions" style={{ marginTop: '1.5rem' }}>
                <Link className="btn btn-primary" href="/book?type=surf&program=group">Pick your surf days</Link>
                <Link className="btn btn-secondary" href="/book?type=surf&program=private">Book private 1:1</Link>
              </div>
            </div>
            <div className="reveal">
              <div className="includes" style={{ marginTop: 0 }}>
                <p className="label">Surf only includes</p>
                <Ticks items={SURF_INCLUDES} />
              </div>
              <p className="label" style={{ marginTop: '1.75rem' }}>Good to know</p>
              <ul className="policy">{POLICY.surf.map((x) => <li key={x}>{x}</li>)}<li>{POLICY.general}</li></ul>
            </div>
          </div>
          <p className="fineprint">Want a bed by the backwaters with daily lessons, bonfires and ice baths? <Link href="/packages">See Stay &amp; Surf packages</Link>.</p>
        </div>
      </section>

      <section className="band band-ocean has-wave-top flip" aria-labelledby="sl-extra">
        <Wave color="var(--sb-ocean)" n={2} />
        <div className="wrap band-grid">
          <div className="reveal">
            <div className="band-head"><span className="badge-icon"><Doodle name="kayak" /></span><p className="label" style={{ margin: 0 }}>Beyond the lesson</p></div>
            <h2 id="sl-extra">More time<br />on the water.</h2>
            <p className="lead">Already surfing? Rent a soft-top or epoxy board. Want a break from the waves? Paddle the river by day or under the stars, or dial in your technique on a surfskate.</p>
            <p className="price-from">Rentals from ₹500/hr · Kayaking ₹600 / ₹700 <small>per person</small></p>
            <div className="band-actions"><a className="btn btn-primary" href={wa("Hi! I'd like to ask about board rentals / kayaking.")}>Ask on WhatsApp</a><Skater tone="light" size={150} className="band-kayaker" title="" /></div>
          </div>
          <div className="band-media reveal"><img className="wide tilt-l" src="/img/sunset-surfers.jpg" alt="Surfers waiting for waves at sunset" loading="lazy" width="1050" height="1400" /></div>
        </div>
      </section>
      <BookingBand href="/book?type=surf" btn="Pick your surf days" />
    </>
  );
}
