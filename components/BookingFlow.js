'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PRICES, BOOKING_TYPES as TYPES, PHONE_LABEL, wa } from '@/lib/site';

const SEASON_OFF = [5, 6, 7]; // June–August: no surf lessons
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const iso = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const parseISO = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null;
  const [y, m, d] = s.split('-').map(Number); const r = new Date(y, m - 1, d);
  return isNaN(r) ? null : r;
};
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmt = (d) => (d ? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—');
const nightsBetween = (a, b) => (a && b ? Math.round((b - a) / 86400000) : 0);
const cleanPhone = (p) => p.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

const INITIAL = { type: null, pkg: 5, program: null, sessions: 1, guests: 1, checkin: null, checkout: null, room: null, meals: 'none', kayakDay: false, kayakNight: false, name: '', phone: '', note: '' };

export default function BookingFlow() {
  const [S, setS] = useState(INITIAL);
  const [step, setStep] = useState('what');
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState(null);
  const [calStart, setCalStart] = useState(null);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [barOpen, setBarOpen] = useState(false);
  const panelRef = useRef(null);
  const stepperRef = useRef(null);
  const set = (patch) => setS((s) => ({ ...s, ...patch }));

  // Read the URL once on the client (keeps the page static, no Suspense needed)
  useEffect(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0); setToday(t);
    const q = new URLSearchParams(window.location.search);
    const type = TYPES[q.get('type')] ? q.get('type') : null;
    const pkg = PRICES.pkg[q.get('pkg')] ? Number(q.get('pkg')) : 5;
    let checkin = parseISO(q.get('in')); let checkout = parseISO(q.get('out'));
    if (checkin && checkin < t) { checkin = null; checkout = null; }
    const program = PRICES.surf[q.get('program')] ? q.get('program') : null;
    const room = PRICES.room[q.get('room')] ? q.get('room') : (type === 'package' ? PRICES.pkg[pkg].room : null);
    setS((s) => ({ ...s, type, pkg, program, room, checkin, checkout, guests: Math.min(12, Math.max(1, Number(q.get('guests')) || 1)), kayakNight: q.get('addon') === 'kayak-night' }));
    setStep(type ? (type === 'surf' && !program ? 'program' : 'guests') : 'what');
    const d = checkin || t; setCalStart(new Date(d.getFullYear(), d.getMonth(), 1));
    setReady(true);
  }, []);

  const steps = useMemo(() => {
    const s = [['what', 'What']];
    if (S.type === 'surf') s.push(['program', 'Lessons']);
    s.push(['guests', 'Guests'], ['dates', 'Dates']);
    if (S.type !== 'surf') s.push(['stay', 'Stay']);
    s.push(['extras', 'Extras'], ['review', 'Send']);
    return s;
  }, [S.type]);
  const idx = steps.findIndex(([k]) => k === step);

  const stayNights = S.type === 'package' ? PRICES.pkg[S.pkg].nights : S.type === 'stay' ? nightsBetween(S.checkin, S.checkout) : 0;
  const endDate = !S.checkin ? null
    : S.type === 'stay' ? S.checkout
    : S.type === 'package' ? addDays(S.checkin, PRICES.pkg[S.pkg].nights)
    : addDays(S.checkin, Math.max(0, ((S.program && PRICES.surf[S.program].days) || 1) - 1));

  const lines = useMemo(() => {
    const L = []; const g = S.guests;
    if (S.type === 'package') {
      const p = PRICES.pkg[S.pkg];
      L.push([`${p.nights}-day surf program × ${g}`, p.program * g]);
      if (S.room) L.push([`${PRICES.room[S.room].short}, ${p.nights} nights × ${g}`, PRICES.room[S.room].rate * p.nights * g]);
      L.push(['Breakfast every day', 0]);
    }
    if (S.type === 'surf' && S.program) {
      const p = PRICES.surf[S.program];
      L.push(p.sessions ? [`${p.name} × ${S.sessions} × ${g}`, p.price * S.sessions * g] : [`${p.name} × ${g}`, p.price * g]);
    }
    if (S.type === 'stay' && S.room && stayNights) L.push([`${PRICES.room[S.room].short}, ${stayNights} night${stayNights > 1 ? 's' : ''} × ${g}`, PRICES.room[S.room].rate * stayNights * g]);
    if (S.meals !== 'none' && stayNights) L.push([`${PRICES.meals[S.meals].name}, ${stayNights} days × ${g}`, PRICES.meals[S.meals].rate * stayNights * g]);
    if (S.kayakDay) L.push([`Day kayaking × ${g}`, PRICES.kayakDay * g]);
    if (S.kayakNight) L.push([`Night kayaking × ${g}`, PRICES.kayakNight * g]);
    return L;
  }, [S, stayNights]);
  const total = lines.reduce((a, [, v]) => a + v, 0);

  const valid = (k) => {
    switch (k) {
      case 'what': return !!S.type;
      case 'program': return !!S.program;
      case 'guests': return S.guests >= 1;
      case 'dates': return S.type === 'stay' ? !!(S.checkin && S.checkout && S.checkout > S.checkin) : !!S.checkin;
      case 'stay': return !!S.room;
      default: return true;
    }
  };

  // Keep choices in the URL so a link can be shared
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (S.type) p.set('type', S.type);
    if (S.type === 'package') p.set('pkg', S.pkg);
    if (S.program) p.set('program', S.program);
    if (S.guests > 1) p.set('guests', S.guests);
    if (S.checkin) p.set('in', iso(S.checkin));
    if (S.checkout && S.type === 'stay') p.set('out', iso(S.checkout));
    if (S.room) p.set('room', S.room);
    window.history.replaceState(null, '', `${window.location.pathname}${p.toString() ? '?' + p : ''}`);
  }, [S, ready]);

  const go = (k) => {
    setStep(k); setBarOpen(false);
    requestAnimationFrame(() => {
      const h = panelRef.current?.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      const top = stepperRef.current ? stepperRef.current.getBoundingClientRect().top + window.scrollY - 90 : 0;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  };
  const message = () => {
    const dates = S.type === 'stay' ? `${fmt(S.checkin)} → ${fmt(S.checkout)}` : S.type === 'package' ? `${fmt(S.checkin)} → ${fmt(endDate)}` : `from ${fmt(S.checkin)}`;
    return ['Hi Mulki Surf Brothers! Booking request:',
      `• ${S.type === 'package' ? PRICES.pkg[S.pkg].name : TYPES[S.type].name}`,
      `• Guests: ${S.guests}`, `• Dates: ${dates}`,
      ...lines.filter(([, v]) => v > 0).map(([k, v]) => `• ${k}: ${inr(v)}`),
      `• Estimated total: ${inr(total)}`, `Name: ${S.name.trim()}`, `Phone: ${S.phone.trim()}`,
      S.note.trim() ? `Note: ${S.note.trim()}` : ''].filter(Boolean).join('\n');
  };
  const submit = () => {
    const e = { name: S.name.trim().length < 2, phone: !/^[6-9]\d{9}$/.test(cleanPhone(S.phone)) };
    setErrors(e);
    if (e.name) { document.getElementById('name')?.focus(); return; }
    if (e.phone) { document.getElementById('phone')?.focus(); return; }
    const missing = steps.find(([k]) => !valid(k)); if (missing) { go(missing[0]); return; }
    setSent(true); go('review');
  };
  const next = () => {
    if (step === 'review') { submit(); return; }
    if (!valid(step)) return;
    if (idx < steps.length - 1) go(steps[idx + 1][0]);
  };
  const nextLabel = { what: S.type === 'surf' ? 'Choose lessons' : 'Choose guests', program: 'Choose guests', guests: 'Choose dates', dates: S.type === 'surf' ? 'Add extras' : 'Choose your bed', stay: 'Add extras', extras: 'Review & send', review: 'Send on WhatsApp' }[step];
  const nextDisabled = (!valid(step) && step !== 'review') || sent;

  const pickType = (type) => {
    if (type === S.type) return;
    set({ type, room: type === 'package' ? PRICES.pkg[S.pkg].room : null, checkout: null, program: type === 'surf' ? S.program : null, meals: type === 'surf' ? 'none' : S.meals });
  };
  const pickDate = (d) => {
    if (S.type === 'stay') {
      if (!S.checkin || S.checkout || d <= S.checkin) set({ checkin: d, checkout: null }); else set({ checkout: d });
    } else set({ checkin: d });
  };

  const summaryRows = [];
  if (S.type) summaryRows.push(['Booking', S.type === 'package' ? PRICES.pkg[S.pkg].name : TYPES[S.type].name]);
  summaryRows.push(['Guests', String(S.guests)]);
  if (S.checkin) {
    if (S.type === 'surf') summaryRows.push(['First session', fmt(S.checkin)]);
    else { summaryRows.push(['Check-in', fmt(S.checkin)]); summaryRows.push(['Check-out', endDate ? fmt(endDate) : '—']); if (stayNights) summaryRows.push(['Nights', String(stayNights)]); }
  }
  const dl = (rows) => <dl>{rows.map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}</dl>;
  const priceRows = lines.map(([k, v]) => [k, v ? inr(v) : 'Included']);

  if (!ready) return <div className="book-grid"><section className="step-panel"><p className="muted">Loading…</p></section></div>;

  // ---------- panels ----------
  const renderMonth = (y, m) => {
    const first = new Date(y, m, 1); const days = new Date(y, m + 1, 0).getDate(); const lead = (first.getDay() + 6) % 7;
    const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(y, m, i + 1))];
    const rows = []; for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return (
      <div className="month" key={`${y}-${m}`}>
        <h3>{first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3>
        <table><thead><tr>{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((x) => <th key={x} scope="col">{x}</th>)}</tr></thead>
          <tbody>{rows.map((r, ri) => <tr key={ri}>{r.map((dt, ci) => {
            if (!dt) return <td key={ci} />;
            const off = dt < today || (S.type !== 'stay' && SEASON_OFF.includes(dt.getMonth()));
            const isStart = S.checkin && +dt === +S.checkin; const isEnd = endDate && +dt === +endDate && !isStart;
            const inRange = S.checkin && endDate && dt > S.checkin && dt < endDate;
            const cls = [isStart && 'start', isEnd && 'end', inRange && 'in-range', +dt === +today && 'today'].filter(Boolean).join(' ');
            return <td key={ci}><button type="button" className={cls} disabled={off} aria-pressed={isStart || isEnd ? 'true' : undefined}
              aria-label={dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) + (off ? ', unavailable' : '')}
              onClick={() => pickDate(dt)}>{dt.getDate()}</button></td>;
          })}</tr>)}</tbody></table>
      </div>
    );
  };

  let panel = null;
  if (step === 'what') panel = (<>
    <h2>What are you booking?</h2><p className="muted">Pick one. You can add kayaking and meals later.</p>
    <div className="choice-grid" role="radiogroup" aria-label="Booking type">
      {Object.entries(TYPES).map(([k, t]) => (
        <button key={k} type="button" className="choice" role="radio" aria-checked={S.type === k} onClick={() => pickType(k)}>
          <img src={t.img} alt={t.alt} loading="lazy" /><div className="body"><h3>{t.name}</h3><p>{t.desc}</p><span className="from">{t.from}</span></div>
        </button>))}
    </div>
    {S.type === 'package' && (<>
      <h2 style={{ marginTop: '2rem' }}>How many days?</h2>
      <div className="option-list" role="radiogroup" aria-label="Package length">
        {Object.entries(PRICES.pkg).map(([k, p]) => (
          <button key={k} type="button" className="option-row noimg" role="radio" aria-checked={S.pkg === Number(k)} onClick={() => set({ pkg: Number(k), room: p.room })}>
            <div><h3>{p.name}</h3><p>{p.nights} nights, {p.nights}-day surf program, breakfast daily. Default bed: {PRICES.room[p.room].short}.</p></div>
            <div className="opt-price">{inr(p.program + PRICES.room[p.room].rate * p.nights)}<small>per guest</small></div>
          </button>))}
      </div></>)}
  </>);

  if (step === 'program') {
    const p = S.program && PRICES.surf[S.program];
    panel = (<>
      <h2>Which lessons?</h2><p className="muted">Sessions run in the morning, 8–11 AM. Exact times follow the tide and are confirmed the evening before.</p>
      <div className="option-list" role="radiogroup" aria-label="Lesson type">
        {Object.entries(PRICES.surf).map(([k, x]) => (
          <button key={k} type="button" className="option-row noimg" role="radio" aria-checked={S.program === k} onClick={() => set({ program: k, sessions: 1 })}>
            <div><h3>{x.name}</h3><p>{x.desc}</p></div>
            <div className="opt-price">{inr(x.price)}<small>per {x.per === 'session' ? 'session / guest' : 'guest'}</small></div>
          </button>))}
      </div>
      {p && p.sessions && (
        <div className="counter" style={{ marginTop: '1.25rem' }}>
          <div><b>Number of sessions</b><div className="small muted">One session per morning</div></div>
          <div className="ctrl">
            <button type="button" aria-label="One fewer session" disabled={S.sessions <= 1} onClick={() => set({ sessions: S.sessions - 1 })}>−</button>
            <output aria-live="polite">{S.sessions}</output>
            <button type="button" aria-label="One more session" disabled={S.sessions >= 10} onClick={() => set({ sessions: S.sessions + 1 })}>+</button>
          </div>
        </div>)}
      <p className="small muted" style={{ marginTop: '1rem' }}>Need 11 days or more? <a href={wa('Hi! I want a custom surf program of 11+ days.')}>Ask us on WhatsApp</a>.</p>
    </>);
  }

  if (step === 'guests') panel = (<>
    <h2>How many guests?</h2><p className="muted">Including you. For groups bigger than 12, <a href={wa('Hi! We are a group of more than 12.')}>message us</a>.</p>
    <div className="counter">
      <div><b>Guests</b><div className="small muted">Everyone in your group, including you</div></div>
      <div className="ctrl">
        <button type="button" aria-label="One fewer guest" disabled={S.guests <= 1} onClick={() => set({ guests: S.guests - 1 })}>−</button>
        <output aria-live="polite">{S.guests}</output>
        <button type="button" aria-label="One more guest" disabled={S.guests >= 12} onClick={() => set({ guests: S.guests + 1 })}>+</button>
      </div>
    </div>
  </>);

  if (step === 'dates') {
    const prevOK = calStart > new Date(today.getFullYear(), today.getMonth(), 1);
    const lead = S.type === 'stay' ? 'Tap your check-in date, then your check-out date.' : S.type === 'package' ? `Tap your check-in date. Your ${PRICES.pkg[S.pkg].nights}-night package sets the check-out.` : 'Tap the day of your first session.';
    const shownLabel = !S.checkin ? 'No date picked yet' : S.type === 'surf' ? fmt(S.checkin) : `${fmt(S.checkin)} → ${endDate ? fmt(endDate) : 'pick check-out'}`;
    panel = (<>
      <h2>When are you coming?</h2><p className="muted">{lead}</p>
      <div className="cal-wrap">
        <div className="cal-nav">
          <button type="button" aria-label="Previous month" disabled={!prevOK} onClick={() => setCalStart(new Date(calStart.getFullYear(), calStart.getMonth() - 1, 1))}>←</button>
          <span className="small muted">{shownLabel}</span>
          <button type="button" aria-label="Next month" onClick={() => setCalStart(new Date(calStart.getFullYear(), calStart.getMonth() + 1, 1))}>→</button>
        </div>
        {renderMonth(calStart.getFullYear(), calStart.getMonth())}
        {renderMonth(calStart.getFullYear(), calStart.getMonth() + 1)}
      </div>
      <p className="cal-note">{S.type === 'stay' ? 'Check-in from 1:00 PM, check-out by 11:00 AM.' : 'Surf season runs September to May, so June to August are greyed out.'}</p>
    </>);
  }

  if (step === 'stay') panel = (<>
    <h2>Where do you want to sleep?</h2>
    <p className="muted">{S.type === 'package' ? 'Your package comes with a default bed. Switch it here and the price updates.' : `Prices are per guest per night${stayNights ? `, for ${stayNights} night${stayNights > 1 ? 's' : ''}` : ''}.`}</p>
    <div className="option-list" role="radiogroup" aria-label="Accommodation">
      {Object.entries(PRICES.room).map(([k, r]) => (
        <button key={k} type="button" className="option-row" role="radio" aria-checked={S.room === k} onClick={() => set({ room: k })}>
          <img src={r.img} alt={r.alt} loading="lazy" />
          <div><h3>{r.name}</h3><p>{r.desc}</p><div className="feats">{r.feats.map((f) => <span key={f}>· {f}</span>)}</div></div>
          <div className="opt-price">{inr(r.rate)}<small>per guest / night</small></div>
        </button>))}
    </div>
  </>);

  if (step === 'extras') panel = (<>
    <h2>Anything to add?</h2><p className="muted">All optional. Prices are per guest.</p>
    {stayNights > 0 && (<>
      <h3 style={{ marginTop: '1rem' }}>Meals</h3>
      <div className="option-list" role="radiogroup" aria-label="Meal plan">
        {Object.entries(PRICES.meals).map(([k, m]) => (
          <button key={k} type="button" className="option-row noimg" role="radio" aria-checked={S.meals === k} onClick={() => set({ meals: k })}>
            <div><h3>{m.name}</h3><p>{k === 'none' ? (S.type === 'package' ? 'Breakfast is already included.' : 'Eat out in Mulki or order in.') : 'Home-cooked coastal Karnataka meals through the day.'}</p></div>
            <div className="opt-price">{m.rate ? <>{inr(m.rate)}<small>per guest / day</small></> : '—'}</div>
          </button>))}
      </div></>)}
    <h3 style={{ marginTop: '1.5rem' }}>On the river</h3>
    <div className="option-list">
      <button type="button" className="option-row" role="checkbox" aria-checked={S.kayakDay} onClick={() => set({ kayakDay: !S.kayakDay })}>
        <img src="/img/kayak-river.jpg" alt="Kayaks on the Shambhavi river" loading="lazy" /><div><h3>Day kayaking</h3><p>Through the mangroves. Timing follows the tide.</p></div>
        <div className="opt-price">{inr(PRICES.kayakDay)}<small>per guest</small></div></button>
      <button type="button" className="option-row" role="checkbox" aria-checked={S.kayakNight} onClick={() => set({ kayakNight: !S.kayakNight })}>
        <img src="/img/river-dusk.jpg" alt="The river at dusk" loading="lazy" /><div><h3>Night kayaking</h3><p>See the river glow in bioluminescence season.</p></div>
        <div className="opt-price">{inr(PRICES.kayakNight)}<small>per guest</small></div></button>
    </div>
  </>);

  if (step === 'review') panel = sent ? (
    <div className="sent">
      <h2>Almost done</h2>
      <p>Your request is ready. Tap below to send it to us on WhatsApp. We'll reply to confirm availability and the final price.</p>
      <pre>{message()}</pre>
      <a className="btn btn-primary" href={wa(message())} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>{' '}
      <button className="btn btn-secondary" type="button" onClick={() => setSent(false)}>Edit request</button>
      <p className="small muted" style={{ marginTop: '1rem' }}>WhatsApp didn't open? Call or message {PHONE_LABEL}.</p>
    </div>
  ) : (<>
    <h2>Your details</h2><p className="muted">We use these only to reply to your request.</p>
    <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <div className={`field${errors.name ? ' invalid' : ''}`}><label htmlFor="name">Your name</label>
        <input id="name" name="name" autoComplete="name" required value={S.name} onChange={(e) => { set({ name: e.target.value }); setErrors((x) => ({ ...x, name: false })); }} />
        <span className="err">Please add your name.</span></div>
      <div className={`field${errors.phone ? ' invalid' : ''}`}><label htmlFor="phone">WhatsApp number</label>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxxxxxxx" required value={S.phone} onChange={(e) => { set({ phone: e.target.value }); setErrors((x) => ({ ...x, phone: false })); }} />
        <span className="err">Enter a 10-digit Indian mobile number.</span></div>
      <div className="field"><label htmlFor="note">Anything we should know? <span className="muted">(optional)</span></label>
        <textarea id="note" name="note" rows={3} placeholder="Arrival time, surf experience, dietary needs…" value={S.note} onChange={(e) => set({ note: e.target.value })} /></div>
    </form>
    <p className="small muted">No advance payment and free cancellation. Prices and availability are confirmed on WhatsApp.</p>
  </>);

  return (
    <>
      <ol className="stepper" aria-label="Booking steps" ref={stepperRef}>
        {steps.map(([k, l], i) => {
          const reachable = i <= idx || steps.slice(0, i).every(([kk]) => valid(kk));
          const done = i < idx;
          return <li key={k}><button type="button" aria-current={k === step ? 'step' : undefined} className={done ? 'done' : ''} disabled={!reachable} onClick={() => go(k)}><span>{done ? '✓' : i + 1}</span>{l}</button></li>;
        })}
      </ol>
      <div className="book-grid">
        <section className="step-panel" aria-live="polite" ref={panelRef}>
          {panel}
          <div className="step-actions">{idx > 0 && !sent && <button type="button" className="btn btn-secondary" onClick={() => go(steps[idx - 1][0])}>Back</button>}</div>
        </section>
        <aside className="summary" aria-label="Booking summary">
          <h2>Your trip</h2>
          {S.type ? <>{dl(summaryRows)}{priceRows.length > 0 && <div className="lines">{dl(priceRows)}</div>}</> : <p className="empty">Your choices will show up here.</p>}
          <div className="total"><span>Total<small>estimate, confirmed on WhatsApp</small></span><span>{inr(total)}</span></div>
          <button className="btn btn-primary" type="button" aria-disabled={nextDisabled || undefined} onClick={() => !nextDisabled && next()}>{nextLabel}</button>
          {S.type === 'package' && <p className="note">Breakfast included every day.</p>}
        </aside>
      </div>
      <div className={`mobile-bar${barOpen ? ' open' : ''}`} aria-label="Booking total">
        <div className="breakdown">{dl(summaryRows)}{priceRows.length > 0 && <div style={{ borderTop: '1px solid var(--sb-line)', marginTop: '.6rem', paddingTop: '.6rem' }}>{dl(priceRows)}</div>}</div>
        <div className="row">
          <button className="tot" type="button" aria-expanded={barOpen} onClick={() => setBarOpen(!barOpen)}><b>{inr(total)}</b><span>See breakdown</span></button>
          <button className="btn btn-primary" type="button" aria-disabled={nextDisabled || undefined} onClick={() => !nextDisabled && next()}>{sent ? 'Request ready' : nextLabel}</button>
        </div>
      </div>
    </>
  );
}
