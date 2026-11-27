import Wavy from './Wavy';
import Link from 'next/link';
import Wave from './Wave';
import Doodle, { DoodleSvg } from './Doodle';
import WaveAnim from './WaveAnim';
import AutoScroll from './AutoScroll';
import { WarliSurfer, WarliPalm, WarliSkater, WarliKayaker, WarliFrieze, Zigzag } from './kit/Warli';
import TeamClip from './TeamClip';
import { PACKAGES, PACKAGE_INCLUDES, PROOF, TESTIMONIALS, CREW, OWNERS, PHONES, WEEKDAY_OFFER, wa } from '@/lib/site';

// Picks a painted icon for a list item from its words; falls back to a painted tick.
const ICON_RULES = [
  [/surf lesson|surf session|group surf/i, 'wave'], [/2-hour|hours?\b/i, 'clock'], [/surfboard|board/i, 'board'],
  [/small-batch|instructor|guidance|coach/i, 'group'], [/ice bath/i, 'snow'], [/cycl/i, 'cycle'],
  [/bonfire|karaoke|music/i, 'fire'], [/wi-?fi/i, 'wifi'], [/kitchen|meal/i, 'pot'], [/palm/i, 'palm'],
  [/washroom|shower/i, 'drop'], [/air condition|\bac\b/i, 'snow'], [/locker/i, 'lock'],
  [/ocean/i, 'wave'], [/each other/i, 'group'], [/leave the place/i, 'palm'],
];
export const iconFor = (t) => (ICON_RULES.find(([re]) => re.test(t)) || [0, 'tick'])[1];

export function Ticks({ items, icons = false }) {
  return (
    <ul className={`ticks${icons ? ' ticks-icons' : ''}`}>
      {items.map((t) => (
        <li key={t}><span className="tick-icon" aria-hidden="true"><DoodleSvg name={icons ? iconFor(t) : 'tick'} /></span><span>{t}</span></li>
      ))}
    </ul>
  );
}

export function Card({ label, title, price, unit = '/ guest', ticks, href, btn, primary = false, tag }) {
  return (
    <article className="card reveal">
      {tag && <Wavy className="tag">{tag}</Wavy>}
      <p className="label">{label}</p>
      <h3>{title}</h3>
      <p className="price">{price}<small>{unit}</small></p>
      <Ticks items={ticks} />
      <Link className={`btn ${primary ? 'btn-primary' : 'btn-secondary'}`} href={href}>{btn}</Link>
    </article>
  );
}

export function PackageCards() {
  return (
    <div className="cards-4">
      {PACKAGES.map((p) => (
        <article className="card reveal" key={p.days}>
          {p.tag && <Wavy className="tag">{p.tag}</Wavy>}
          <p className="label">{p.label}</p>
          <h3>{p.title}</h3>
          <div className="price-pair">
            <div><span>Camping</span><b>{p.camp}</b></div>
            <div><span>AC hostel</span><b>{p.ac}</b></div>
          </div>
          <p className="small muted" style={{ margin: '0 0 1.25rem' }}>Per person · stay + daily surf lessons</p>
          <Link className={`btn ${p.primary ? 'btn-primary' : 'btn-secondary'}`} href={`/book?type=package&days=${p.days}`}>Choose {p.days} days</Link>
        </article>
      ))}
    </div>
  );
}

export function PackageIncludes() {
  return (
    <div className="includes">
      <Wavy as="p" className="label eyebrow">{"Every Stay & Surf package includes"}</Wavy>
      <Ticks items={PACKAGE_INCLUDES} icons />
    </div>
  );
}

// placeholder: figures carried over from the draft site
export function ProofStrip() {
  return (
    <section className="proof" aria-label="At a glance">
      <div className="wrap">
        {PROOF.map((p) => <div key={p.label}><b>{p.value}</b><span>{p.label}</span></div>)}
      </div>
    </section>
  );
}

// placeholder: testimonials carried over from the draft site; replace with real Google reviews
function Voice({ t, i, hidden }) {
  return (
    <figure className={`voice v${(i % 3) + 1}`} aria-hidden={hidden || undefined}>
      <div className="voice-photo"><img src={t.img} alt="" loading="lazy" /></div>
      <blockquote>“{t.quote}”</blockquote>
      <figcaption><cite>{t.name}</cite><span>{t.place}</span></figcaption>
      <span className="stars" aria-label={hidden ? undefined : '5 out of 5 stars'}>★★★★★</span>
    </figure>
  );
}

// Desktop: a slow, endless sideways drift (pauses on hover). Phones: a plain vertical stack.
export function Testimonials({ tone = 'ocean' }) {
  return (
    <section className={`voices has-wave-top voices-${tone}`} aria-labelledby="rev-title">
      <Wave color={tone === 'charcoal' ? 'var(--sb-charcoal)' : 'var(--sb-ocean-deep)'} n={2} />
      <div className="wrap voices-head">
        <svg className="hand-arrow" viewBox="0 0 130 30" aria-hidden="true"><path d="M3 17c30-4 70-6 118-3M106 4c7 4 12 7 16 10-5 3-10 7-15 12" /></svg>
        <h2 id="rev-title" className="hand" aria-label="What our surfers are saying"><Wavy>What our surfers</Wavy><br /><Wavy>are saying</Wavy></h2>
      </div>
      <div className="voices-rail">
        <div className="voices-track">
          {TESTIMONIALS.map((t, i) => <Voice key={t.name} t={t} i={i} />)}
          {TESTIMONIALS.map((t, i) => <Voice key={t.name + '-2'} t={t} i={i} hidden />)}
        </div>
      </div>
    </section>
  );
}

// Face slot: add a square photo per person at public/img/crew/<clip>.jpg and set face: true in CREW (lib/site.js).
function Face({ c, size = 'md' }) {
  return (
    <span className={`crew-face ${size}`} aria-hidden="true">
      {c.face ? <img src={`/img/crew/${c.clip || c.name.toLowerCase()}.jpg`} alt="" loading="lazy" /> : <b>{c.name[0]}</b>}
    </span>
  );
}

function CrewCard({ c }) {
  return (
    <article className="crew" key={c.name}>
      <div className="crew-clip"><TeamClip clip={c.clip} label={`${c.name} at Mulki Surf Brothers`} /></div>
      <div className="crew-body">
        <div className="crew-id"><Face c={c} /><div><h3>{c.name}</h3><Wavy as="p" className="role">{c.role + (c.from ? ` · ${c.from}` : '')}</Wavy></div></div>
        <p>{c.bio}</p>
      </div>
    </article>
  );
}

export function Founders() {
  return (
    <div className="founders">
      {OWNERS.map((o) => (
        <article className="founder" key={o.name}>
          <span className="founder-photo">{o.photo ? <img src={o.photo} alt={o.name} loading="lazy" /> : <><b>{o.initial}</b><small>photo coming</small></>}</span>
          <div><Wavy as="p" className="role">founder</Wavy><h3>{o.name}</h3><p>{o.role}</p></div>
        </article>
      ))}
    </div>
  );
}

// row: one sideways row that drifts on its own (homepage). Otherwise the full grid with the founders (About page).
export function CrewGrid({ link = true, row = false }) {
  return (
    <section className="section" style={{ background: 'var(--sb-white)' }} aria-labelledby="crew-title">
      <div className="wrap">
        <div className="section-head">
          <div><Wavy as="p" className="label eyebrow">{"The crew"}</Wavy><h2 id="crew-title">Who'll be in the water with you</h2></div>
          {link && <Link className="link-arrow" href="/about">Meet everyone</Link>}
        </div>
        {!row && <><h3 className="founders-title">The founders</h3><Founders /><h3 className="founders-title">The crew</h3></>}
      </div>
      {row ? (
        <AutoScroll className="crew-row">{CREW.map((c) => <CrewCard c={c} key={c.name} />)}</AutoScroll>
      ) : (
        <div className="wrap"><div className="crew-grid">{CREW.map((c) => <CrewCard c={c} key={c.name} />)}</div></div>
      )}
      {row && <div className="wrap"><p className="owners">Founded by {OWNERS.map((o, i) => <span key={o.name}>{i > 0 && ' and '}<b>{o.name}</b></span>)}, who run the place: bookings, plans, and most of the decisions about what's for dinner.</p></div>}
    </section>
  );
}

export function Faq({ items, title = 'Questions we get a lot', label = 'Before you come', bg = 'var(--sb-offwhite)', more = false }) {
  return (
    <section className="section" id="faq" style={{ background: bg }} aria-labelledby="faq-title">
      <div className="wrap two-col">
        <div>
          <Wavy as="p" className="label eyebrow">{label}</Wavy>
          <h2 id="faq-title" style={{ fontSize: 'var(--fs-h2)' }}>{title}</h2>
          <p className="muted">Anything else? <a href={wa('Hi! I have a question before booking.')}>Ask us on WhatsApp</a>.</p>
          {more && <Link className="link-arrow" href="/contact#faq">All questions</Link>}
        </div>
        <div className="faq">
          {items.map(([q, a]) => <details key={q}><summary>{q}</summary><div><p>{a}</p></div></details>)}
        </div>
      </div>
    </section>
  );
}

export function BookingBand({ title = <>Ready for your<br />first wave?</>, href = '/book', btn = 'Plan your stay', surfer = 'man', figure }) {
  const f = figure || surfer;
  return (
    <section className="booking-band has-wave-top" aria-labelledby="bb-title">
      <Wave color="var(--sb-ocean-deep)" n={1} />
      <div className="wrap">
        <h2 id="bb-title">{title}</h2>
        <p className="lead">Pick a package and your dates, and book online in a couple of minutes.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" href={href}>{btn}</Link>
          <a className="btn btn-ghost" href={wa("Hi Mulki Surf Brothers! I have a question before booking.")}>Ask us a question</a>
        </div>
        <p className="small" style={{ marginTop: '1rem', marginBottom: '2rem', opacity: 0.85 }}>Check in Monday to Thursday: ₹{WEEKDAY_OFFER.toLocaleString('en-IN')} off your Stay &amp; Surf booking</p>
      </div>
      {f === 'palm' ? <WarliPalm tone="dark" size={170} className="band-surfer band-palm" title="" />
        : f === 'skater' ? <WarliSkater tone="dark" size={180} className="band-surfer" title="" />
        : f === 'kayaker' ? <WarliKayaker tone="dark" size={180} className="band-surfer" title="" />
        : <WarliSurfer tone="dark" variant={f} size={180} className="band-surfer" title="" />}
      <WaveAnim back="var(--sb-ocean)" mid="var(--sb-lime)" front="var(--sb-charcoal)" />
    </section>
  );
}

export function PageHero({ band, label, lines, lead, img, alt, doodle }) {
  return (
    <section className={`page-hero ${band}`}>
      <div className="wrap page-hero-grid">
        <div>
          <div className="band-head"><span className="badge-icon"><Doodle name={doodle} /></span><Wavy as="p" className="label eyebrow" style={{ margin: 0 }}>{label}</Wavy></div>
          <h1 className="poster">{lines.map((l) => <span key={l}><i>{l}</i></span>)}</h1>
          <p className="lead">{lead}</p>
        </div>
        <img src={img} alt={alt} width="1050" height="1400" />
      </div>
    </section>
  );
}

export function WaveSection({ bg, n = 0, children, ...rest }) {
  return (
    <section className="section has-wave-top" style={{ background: `var(${bg})` }} {...rest}>
      <Wave color={`var(${bg})`} n={n} />
      <div className="wrap">{children}</div>
    </section>
  );
}

// Painted Warli frieze of everyday Mulki life, framed by zigzag borders like a village wall.
export function FriezeBand({ edge = 'var(--sb-offwhite)' }) {
  return (
    <section className="frieze-band" aria-label="Life at Mulki Surf Brothers, painted Warli style">
      <Zigzag color={edge} />
      <AutoScroll className="frieze-scroll" speed={0.3}><WarliFrieze tone="dark" /></AutoScroll>
      <Zigzag color={edge} flip />
    </section>
  );
}
