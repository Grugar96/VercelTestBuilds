import { PageHero, WaveSection, PackageCards, PackageIncludes, BookingBand } from '@/components/Sections';
import { PACKAGE_DAYS, PACKAGE_PRICE, MEALS, POLICY, wa } from '@/lib/site';
import Doodle from '@/components/Doodle';

export const metadata = { title: 'Stay & Surf packages', description: '3, 5, 7 and 10-day Stay & Surf packages in Mulki: camping or AC hostel with daily surf lessons, from ₹8,000 per person.' };

const inr = (n) => '₹' + n.toLocaleString('en-IN');
const DAY = [
  ['Morning', 'Surf session', 'Two hours with your instructors: theory on the sand, drills, then into the water.'],
  ['After surf', 'Ice bath recovery', 'Cold plunge, then breakfast from the open kitchen or the meal plan.'],
  ['Afternoon', 'Slow time', 'Cycling, hammocks, work on the Wi-Fi, or a paddle on the river.'],
  ['Sunset', 'Beach evenings', 'Volleyball, football and the sun going down over the Arabian Sea.'],
  ['Night', 'Bonfire & music', 'Karaoke, movie nights and, in season, a night kayak on the glowing river.'],
];

export default function Packages() {
  return (
    <>
      <PageHero band="band-lime" label="Stay & Surf packages" lines={['Stay. Surf.', 'Belong.']} doodle="sun"
        lead="Accommodation and daily surf lessons in one price per person, with ice baths, cycling, bonfires and good people."
        img="/img/sunset-walk.jpg" alt="A surfer walking into the sea at sunset" />
      <WaveSection bg="--sb-offwhite" n={1}>
        <div style={{ marginTop: '3.5rem' }}><PackageCards /></div>
        <div className="two-col" style={{ marginTop: '2.5rem' }}>
          <div className="reveal">
            <table className="price-table">
              <thead><tr><th scope="col">Package</th><th scope="col" className="num">Camping</th><th scope="col" className="num">AC hostel</th></tr></thead>
              <tbody>{PACKAGE_DAYS.map((d) => <tr key={d}><td>{d} days / {d - 1} nights</td><td className="num">{inr(PACKAGE_PRICE.camp[d])}</td><td className="num">{inr(PACKAGE_PRICE.ac[d])}</td></tr>)}</tbody>
            </table>
            <p className="fineprint">Per person, accommodation + surfing. Optional daily meals: veg {inr(MEALS.veg.rate)} · non-veg {inr(MEALS.nonveg.rate)} per day.</p>
          </div>
          <div className="reveal">
            <div className="offer-box">
              <span className="badge-icon" style={{ background: 'var(--sb-offwhite)' }}><Doodle name="sparkle" /></span>
              <div><h3>Surf into savings</h3><ul>{POLICY.offer.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            <p className="label" style={{ marginTop: '1.75rem' }}>Booking information</p>
            <ul className="policy">{POLICY.package.map((x) => <li key={x}>{x}</li>)}<li>{POLICY.general}</li></ul>
            <p className="small muted" style={{ marginTop: '1rem' }}>Groups and longer stays: <a href={wa("Hi! I'd like a custom package for a group / long stay.")}>message us</a>.</p>
          </div>
        </div>
        <PackageIncludes />
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
      <BookingBand surfer="woman" title={<>Lock in your<br />surf escape.</>} href="/book?type=package&days=5" btn="Plan your package" />
    </>
  );
}
