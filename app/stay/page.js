import Link from 'next/link';
import { Palm } from '@/components/kit/Kit';
import { PageHero, WaveSection, BookingBand, Ticks, PackageIncludes } from '@/components/Sections';
import { ROOMS, PACKAGE_DAYS, PACKAGE_PRICE, MEALS } from '@/lib/site';

export const metadata = { title: 'Stay', description: 'Camping and AC hostel rooms by the backwaters in Mulki, booked as Stay & Surf packages from ₹8,000 per person.' };

const inr = (n) => '₹' + n.toLocaleString('en-IN');

export default function Stay() {
  return (
    <>
      <PageHero band="band-deep" label="Stay by the backwaters" lines={['Sleep by', 'the river.']} doodle="palm"
        lead="Your laid-back surf stay by the backwaters: camping under the palms or an AC hostel room, with waves, music and good people."
        img="/img/board-hostel.jpg" alt="A painted surfboard at the hostel entrance" />
      <WaveSection bg="--sb-offwhite" n={0}>
        <div className="section-head" style={{ marginTop: '3rem' }}><div><p className="label">Two ways to stay</p><h2>Pick your room</h2></div></div>
        <div className="cards-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
          {Object.entries(ROOMS).map(([k, r]) => (
            <article className="card reveal" key={k} style={{ padding: 0, overflow: 'hidden' }}>
              <img src={r.img} alt={r.alt} loading="lazy" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <div style={{ padding: 'clamp(1.25rem, 2.5vw, 2rem)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p className="label">{k === 'ac' ? 'All hostel rooms are AC' : 'Under the palms'}</p>
                <h3>{r.name}</h3>
                <p>{r.desc}</p>
                <Ticks items={r.feats} />
                <p className="price">From {inr(PACKAGE_PRICE[k][3])}<small>/ person · 3 days with surfing</small></p>
                <Link className={`btn ${k === 'ac' ? 'btn-primary' : 'btn-secondary'}`} href={`/book?type=package&room=${k}`}>Book {r.short.toLowerCase()}</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="fineprint">Rooms are booked as Stay &amp; Surf packages. See every price on the <Link href="/packages">packages page</Link>. Optional daily meals: veg {inr(MEALS.veg.rate)} or non-veg {inr(MEALS.nonveg.rate)} per person per day.</p>
        <PackageIncludes />
      </WaveSection>
      <section className="section" style={{ background: 'var(--sb-white)' }}>
        <div className="wrap two-col">
          <div className="reveal">
            <p className="label">House rules</p>
            <h2 style={{ fontSize: 'var(--fs-h2)' }}>Three simple ones</h2>
            <div style={{ fontSize: '1.15rem' }}><Ticks items={['Respect the ocean.', 'Respect each other.', 'Leave the place better.']} /></div>
            {/* placeholder: check-in/out times and quiet hours carried over from the draft site */}
            <p className="muted">Check-in from 1:00 PM, check-out by 11:00 AM. Quiet hours after 11 PM, because we're up early for the surf.</p>
            <div className="kit-inline"><Palm size={120} title="" /><span className="hand">Slow down. Stay awhile.</span></div>
          </div>
          <div className="reveal"><img src="/img/morning-tea.jpg" alt="Morning tea on the beach" style={{ borderRadius: 20, transform: 'rotate(2deg)', aspectRatio: '4/5', objectFit: 'cover', width: '100%', height: 'auto' }} loading="lazy" width="1050" height="1400" /></div>
        </div>
      </section>
      <BookingBand title={<>Claim your spot<br />by the river.</>} href="/book?type=package" btn="Plan your stay" figure="palm" />
    </>
  );
}
