import { PageHero, WaveSection, PackageCards, BookingBand } from '@/components/Sections';
import { wa } from '@/lib/site';

export const metadata = { title: 'Surf + Stay packages', description: '3, 5 and 7-day Surf + Stay packages in Mulki with lessons, a riverside bed and breakfast every day.' };

const DAY = [
  ['Morning', 'Surf session', 'Theory on the sand, beach drills, then into the water. Usually between 8 and 11 AM.'],
  ['Late morning', 'Breakfast', 'Refuel after the session.'],
  ['Afternoon', 'Slow time', 'Hammocks, work on the Wi-Fi, or a paddle on the river.'],
  ['Evening', 'Video analysis', 'Review your waves with the coaches.'],
  ['Sunset', 'Beach evenings', 'Volleyball, football and the sun going down over the Arabian Sea.'],
  ['Night', 'Dinner & campfire', 'And in season, a night kayak on the glowing river.'],
];

export default function Packages() {
  return (
    <>
      <PageHero band="band-lime" label="Surf + Stay packages" lines={['Surf. Eat.', 'Sleep. Repeat.']} doodle="sun"
        lead="Lessons every morning, a bed by the river and breakfast, bundled into one price per guest."
        img="/img/sunset-walk.jpg" alt="A surfer walking into the sea at sunset" />
      <WaveSection bg="--sb-offwhite" n={1}>
        <div style={{ marginTop: '3.5rem' }}><PackageCards /></div>
        <p className="fineprint">Packages run in surf season, September to May. Add meals (₹500 veg / ₹600 non-veg per day) and kayaking (₹600 day / ₹700 night) when you book. Groups, retreats, college clubs and 10+ day stays: <a href={wa("Hi! I'd like a custom package for a group / long stay.")}>message us</a>.</p>
      </WaveSection>
      <section className="section" style={{ background: 'var(--sb-white)' }} aria-labelledby="day-title">
        <div className="wrap two-col">
          <div className="reveal">
            <p className="label">A day at Surf Brothers</p>
            <h2 id="day-title" style={{ fontSize: 'var(--fs-h2)' }}>Roughly how it goes</h2>
            <p className="muted">The ocean sets the timetable, so times move with the tide.</p>
            <span className="hand">The only meeting is with the ocean.</span>
          </div>
          <div className="schedule">
            {DAY.map(([t, h, p]) => <div className="reveal" key={t}><time>{t}</time><div><h3>{h}</h3><p>{p}</p></div></div>)}
          </div>
        </div>
      </section>
      <BookingBand title={<>Lock in your<br />surf escape.</>} href="/book?type=package&pkg=5" btn="Plan your package" />
    </>
  );
}
