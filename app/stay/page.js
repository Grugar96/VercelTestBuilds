import { PageHero, WaveSection, Card, BookingBand, Ticks } from '@/components/Sections';

export const metadata = { title: 'Riverside stay', description: 'Camping and dorm beds by the Shambhavi river in Mulki, from ₹800 a night.' };

export default function Stay() {
  return (
    <>
      <PageHero band="band-deep" label="Riverside stay" lines={['Sleep by', 'the river.']} doodle="palm"
        lead="Camping under the palms or a bunk in the dorm, a few steps from the Shambhavi and a short walk from the surf."
        img="/img/board-hostel.jpg" alt="A painted surfboard at the hostel entrance" />
      <WaveSection bg="--sb-offwhite" n={0}>
        <div className="section-head" style={{ marginTop: '3rem' }}><div><p className="label">Rooms &amp; beds</p><h2>Pick your bed</h2></div></div>
        {/* placeholder: bed counts and amenities carried over from the draft site */}
        <div className="cards-3">
          <Card label="Best value · 12 spots" title="Camping" price="₹800" unit="/ guest / night" href="/book?type=stay&room=camp" btn="Choose camping"
            ticks={['Tents under the palms by the river', 'Shared washrooms & hot showers', 'High-speed fiber Wi-Fi']} />
          <Card label="Coastal breeze · 6 beds" title="Non-AC dorm" price="₹1,000" unit="/ guest / night" href="/book?type=stay&room=nonac" btn="Choose non-AC"
            ticks={['Wooden bunks, orthopedic mattresses', 'Ceiling fans and a privacy curtain', 'Secure locker, fiber Wi-Fi']} />
          <Card label="Most popular · 11 beds" title="AC dorm" price="₹1,200" unit="/ guest / night" href="/book?type=stay&room=ac" btn="Choose AC" primary
            ticks={['Air-conditioned wooden bunks', 'Privacy curtain and reading lamp', 'Secure locker, fiber Wi-Fi']} />
        </div>
        <p className="fineprint">Meals: veg full board ₹500 or non-veg ₹600 per guest per day. Breakfast is included with every Surf + Stay package.</p>
      </WaveSection>
      <section className="section" style={{ background: 'var(--sb-white)' }}>
        <div className="wrap two-col">
          <div className="reveal">
            <p className="label">House rules</p>
            <h2 style={{ fontSize: 'var(--fs-h2)' }}>Three simple ones</h2>
            <div style={{ fontSize: '1.15rem' }}><Ticks items={['Respect the ocean.', 'Respect each other.', 'Leave the place better.']} /></div>
            <p className="muted">Check-in from 1:00 PM, check-out by 11:00 AM. Quiet hours after 11 PM, because we're up early for the surf. Free luggage storage if you arrive early.</p>
            <span className="hand">Slow down. Stay awhile.</span>
          </div>
          <div className="reveal"><img src="/img/morning-tea.jpg" alt="Morning tea on the beach" style={{ borderRadius: 20, transform: 'rotate(2deg)', aspectRatio: '4/5', objectFit: 'cover', width: '100%', height: 'auto' }} loading="lazy" width="1050" height="1400" /></div>
        </div>
      </section>
      <BookingBand title={<>Claim your spot<br />by the river.</>} href="/book?type=stay" btn="Choose your bed" />
    </>
  );
}
