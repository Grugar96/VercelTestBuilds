import Link from 'next/link';
import Wave from './Wave';
import Doodle from './Doodle';
import { PACKAGES, PROOF, TESTIMONIALS, CREW, PHONE, PHONE_LABEL, wa } from '@/lib/site';

export function Ticks({ items }) {
  return <ul className="ticks">{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

export function Card({ label, title, price, unit = '/ guest', ticks, href, btn, primary = false, tag }) {
  return (
    <article className="card reveal">
      {tag && <span className="tag">{tag}</span>}
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
    <div className="cards-3">
      {PACKAGES.map((p) => (
        <Card key={p.pkg} label={p.label} title={p.title} price={p.price} ticks={p.ticks} tag={p.tag} primary={p.primary}
          href={`/book?type=package&pkg=${p.pkg}`} btn={`Choose ${p.pkg} days`} />
      ))}
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
export function Testimonials() {
  return (
    <section className="section" style={{ background: 'var(--sb-offwhite)' }} aria-labelledby="rev-title">
      <div className="wrap">
        <div className="section-head"><div><p className="label">What our surfers say</p><h2 id="rev-title">Real stories, salty hair</h2></div></div>
        <div className="reviews">
          {TESTIMONIALS.map((t) => (
            <figure className="review reveal" key={t.name} style={{ margin: 0 }}>
              <img src={t.img} alt="" loading="lazy" />
              <div className="body">
                <span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption><cite>{t.name}<span>{t.place}</span></cite></figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CrewGrid({ link = true }) {
  return (
    <section className="section" style={{ background: 'var(--sb-white)' }} aria-labelledby="crew-title">
      <div className="wrap">
        <div className="section-head">
          <div><p className="label">The crew</p><h2 id="crew-title">Who'll be in the water with you</h2></div>
          {link && <Link className="link-arrow" href="/about">Meet everyone</Link>}
        </div>
        <div className="crew-grid">
          {CREW.map((c) => (
            <article className="crew reveal" key={c.name}>
              <div className="avatar" aria-hidden="true">{c.initial}</div>
              <h3>{c.name}</h3><p className="role">{c.role}</p><p>{c.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ items, title = 'Questions we get a lot', label = 'Before you come', bg = 'var(--sb-offwhite)' }) {
  return (
    <section className="section" style={{ background: bg }} aria-labelledby="faq-title">
      <div className="wrap two-col">
        <div>
          <p className="label">{label}</p>
          <h2 id="faq-title" style={{ fontSize: 'var(--fs-h2)' }}>{title}</h2>
          <p className="muted">Anything else? <a href={wa('Hi! I have a question before booking.')}>Ask us on WhatsApp</a>.</p>
        </div>
        <div className="faq">
          {items.map(([q, a]) => <details key={q}><summary>{q}</summary><div><p>{a}</p></div></details>)}
        </div>
      </div>
    </section>
  );
}

export function BookingBand({ title = <>Ready for your<br />first wave?</>, href = '/book', btn = 'Plan your stay' }) {
  return (
    <section className="booking-band has-wave-top" aria-labelledby="bb-title">
      <Wave color="var(--sb-ocean-deep)" n={1} />
      <div className="wrap">
        <h2 id="bb-title">{title}</h2>
        <p className="lead">Pick your dates and we'll confirm everything on WhatsApp.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" href={href}>{btn}</Link>
          <a className="btn btn-ghost" href={wa("Hi Mulki Surf Brothers! I'd like to book.")}>Chat on WhatsApp</a>
        </div>
        <p className="phone">Call or WhatsApp <a href={`tel:+${PHONE}`}>{PHONE_LABEL}</a></p>
        <p className="small" style={{ marginTop: '1rem', opacity: 0.8 }}>Free cancellation · No advance payment</p>
      </div>
    </section>
  );
}

export function PageHero({ band, label, lines, lead, img, alt, doodle }) {
  return (
    <section className={`page-hero ${band}`}>
      <div className="wrap page-hero-grid">
        <div>
          <div className="band-head"><span className="badge-icon"><Doodle name={doodle} /></span><p className="label" style={{ margin: 0 }}>{label}</p></div>
          <h1 className="poster">{lines.map((l) => <span key={l}>{l}</span>)}</h1>
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
