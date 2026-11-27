'use client';
import Wavy from './Wavy';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BOOKING_TYPES as TYPES, ROOMS, PACKAGE_DAYS, PACKAGE_PRICE, PACKAGES, PRIVATE_SESSION, MEALS, KAYAK,
  WEEKDAY_OFFER, ADVANCE_PER_PERSON, POLICY, SURF_INCLUDES, PACKAGE_INCLUDES, groupSurfPrice, PHONE_LABEL, wa,
} from '@/lib/site';
import { Shaka } from './kit/Kit';

const SEASON_OFF = [5, 6, 7]; // June–August: no surf
const inr = (n) => (n < 0 ? '−₹' : '₹') + Math.abs(Math.round(n)).toLocaleString('en-IN');
const iso = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
const parseISO = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null;
  const [y, m, d] = s.split('-').map(Number); const r = new Date(y, m - 1, d);
  return isNaN(r) ? null : r;
};
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmt = (d) => (d ? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—');
const cleanPhone = (p) => p.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
const isWeekdayCheckin = (d) => !!d && d.getDay() >= 1 && d.getDay() <= 4; // Mon–Thu
const MAX_SESSIONS = 30;

const INITIAL = { type: null, days: 5, program: 'group', guests: 1, checkin: null, dates: [], room: 'ac', meals: 'none', kayakDay: false, kayakNight: false, name: '', phone: '', note: '' };

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

  // Read the URL once on the client (keeps the page static)
  useEffect(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0); setToday(t);
    const q = new URLSearchParams(window.location.search);
    const type = TYPES[q.get('type')] ? q.get('type') : null;
    const days = PACKAGE_DAYS.includes(Number(q.get('days'))) ? Number(q.get('days')) : 5;
    let checkin = parseISO(q.get('in')); if (checkin && checkin < t) checkin = null;
    const dates = (q.get('dates') || '').split(',').map(parseISO).filter((d) => d && d >= t).slice(0, MAX_SESSIONS);
    const program = q.get('program') === 'private' ? 'private' : 'group';
    const room = ROOMS[q.get('room')] ? q.get('room') : 'ac';
    setS((s) => ({ ...s, type, days, program, room, checkin, dates, guests: Math.min(12, Math.max(1, Number(q.get('guests')) || 1)), kayakNight: q.get('addon') === 'kayak-night' }));
    setStep(type ? (type === 'surf' ? 'program' : 'guests') : 'what');
    const d = checkin || dates[0] || t; setCalStart(new Date(d.getFullYear(), d.getMonth(), 1));
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

  const nights = S.days - 1;
  const checkout = S.checkin ? addDays(S.checkin, nights) : null;
  const sortedDates = useMemo(() => [...S.dates].sort((a, b) => a - b), [S.dates]);
  const sessions = sortedDates.length;

  const lines = useMemo(() => {
    const L = []; const g = S.guests;
    if (S.type === 'package') {
      L.push([`${ROOMS[S.room].short} · ${S.days} days / ${nights} nights × ${g}`, PACKAGE_PRICE[S.room][S.days] * g]);
      if (S.meals !== 'none') L.push([`${MEALS[S.meals].name}, ${S.days} days × ${g}`, MEALS[S.meals].rate * S.days * g]);
      if (isWeekdayCheckin(S.checkin)) L.push([`Weekday offer (Mon–Thu check-in) × ${g}`, -WEEKDAY_OFFER * g]);
    }
    if (S.type === 'surf' && sessions) {
      if (S.program === 'private') L.push([`Private 1:1 × ${sessions} session${sessions > 1 ? 's' : ''} × ${g}`, PRIVATE_SESSION * sessions * g]);
      else L.push([`Group surf × ${sessions} session${sessions > 1 ? 's' : ''} × ${g}`, groupSurfPrice(sessions) * g]);
    }
    if (S.kayakDay) L.push([`Day kayaking × ${g}`, KAYAK.day * g]);
    if (S.kayakNight) L.push([`Night kayaking × ${g}`, KAYAK.night * g]);
    return L;
  }, [S, nights, sessions]);
  const total = lines.reduce((a, [, v]) => a + v, 0);
  const advance = S.type === 'package' ? ADVANCE_PER_PERSON * S.guests : 0;

  const valid = (k) => {
    switch (k) {
      case 'what': return !!S.type;
      case 'program': return !!S.program;
      case 'guests': return S.guests >= 1;
      case 'dates': return S.type === 'surf' ? sessions > 0 : !!S.checkin;
      case 'stay': return !!S.room;
      default: return true;
    }
  };

  // Keep choices in the URL so a link can be shared
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (S.type) p.set('type', S.type);
    if (S.type === 'package') { p.set('days', S.days); p.set('room', S.room); if (S.checkin) p.set('in', iso(S.checkin)); }
    if (S.type === 'surf') { p.set('program', S.program); if (sessions) p.set('dates', sortedDates.map(iso).join(',')); }
    if (S.guests > 1) p.set('guests', S.guests);
    window.history.replaceState(null, '', `${window.location.pathname}${p.toString() ? '?' + p : ''}`);
  }, [S, ready, sessions, sortedDates]);

  const go = (k) => {
    setStep(k); setBarOpen(false);
    requestAnimationFrame(() => {
      const h = panelRef.current?.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      const top = stepperRef.current ? stepperRef.current.getBoundingClientRect().top + window.scrollY - 90 : 0;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  };
  const bookingName = () => (S.type === 'package' ? `Stay & Surf, ${S.days} days / ${nights} nights (${ROOMS[S.room].short})` : `Surf only, ${S.program === 'private' ? 'private 1:1' : 'group sessions'}`);
  const message = () => {
    const when = S.type === 'package' ? `${fmt(S.checkin)} → ${fmt(checkout)}` : sortedDates.map(fmt).join(', ');
    return ['Hi Mulki Surf Brothers! Booking request:', `• ${bookingName()}`, `• Guests: ${S.guests}`, `• ${S.type === 'package' ? 'Dates' : 'Surf days'}: ${when}`,
      ...lines.map(([k, v]) => `• ${k}: ${inr(v)}`), `• Estimated total: ${inr(total)}`,
      S.type === 'package' ? `• Advance to confirm: ${inr(advance)} (rest at check-in)` : '• Full payment to confirm',
      `Name: ${S.name.trim()}`, `Phone: ${S.phone.trim()}`, S.note.trim() ? `Note: ${S.note.trim()}` : ''].filter(Boolean).join('\n');
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
  const nextLabel = { what: S.type === 'surf' ? 'Choose lessons' : 'Choose guests', program: 'Choose guests', guests: S.type === 'surf' ? 'Pick surf days' : 'Choose dates', dates: S.type === 'surf' ? 'Add extras' : 'Choose your room', stay: 'Add extras', extras: 'Review & send', review: 'Send on WhatsApp' }[step];
  const nextDisabled = (!valid(step) && step !== 'review') || sent;

  const pickType = (type) => { if (type !== S.type) set({ type, meals: type === 'surf' ? 'none' : S.meals }); };
  const pickDate = (d) => {
    if (S.type === 'package') { set({ checkin: d }); return; }
    const has = S.dates.some((x) => +x === +d);
    if (has) set({ dates: S.dates.filter((x) => +x !== +d) });
    else if (S.dates.length < MAX_SESSIONS) set({ dates: [...S.dates, d] });
  };

  const summaryRows = [];
  if (S.type) summaryRows.push(['Booking', S.type === 'package' ? `Stay & Surf · ${S.days} days` : TYPES.surf.name]);
  if (S.type === 'package') summaryRows.push(['Room', ROOMS[S.room].short]);
  if (S.type === 'surf') summaryRows.push(['Lessons', S.program === 'private' ? 'Private 1:1' : 'Group']);
  summaryRows.push(['Guests', String(S.guests)]);
  if (S.type === 'package' && S.checkin) { summaryRows.push(['Check-in', fmt(S.checkin)]); summaryRows.push(['Check-out', fmt(checkout)]); }
  if (S.type === 'surf' && sessions) summaryRows.push(['Surf days', sessions === 1 ? fmt(sortedDates[0]) : `${sessions} days, from ${fmt(sortedDates[0])}`]);
  const dl = (rows) => <dl>{rows.map(([k, v]) => [<dt key={k + 't'}>{k}</dt>, <dd key={k + 'd'}>{v}</dd>])}</dl>;
  const priceRows = lines.map(([k, v]) => [k, inr(v)]);
  const payNote = S.type === 'package'
    ? `Pay ${inr(advance)} advance (₹${ADVANCE_PER_PERSON.toLocaleString('en-IN')}/person, non-refundable) to confirm. The rest at check-in.`
    : S.type === 'surf' ? 'Full payment confirms the booking. No refund after booking.' : null;

  if (!ready) return <div className="book-grid"><section className="step-panel"><p className="muted">Loading…</p></section></div>;

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
            const off = dt < today || SEASON_OFF.includes(dt.getMonth());
            const cls = []; let pressed = false;
            if (S.type === 'package') {
              const isStart = S.checkin && +dt === +S.checkin; const isEnd = checkout && +dt === +checkout;
              if (isStart) cls.push('start'); if (isEnd) cls.push('end'); if (S.checkin && dt > S.checkin && dt < checkout) cls.push('in-range');
              pressed = !!isStart;
              if (!S.checkin && isWeekdayCheckin(dt) && !off) cls.push('offer');
            } else if (S.dates.some((x) => +x === +dt)) { cls.push('start'); pressed = true; }
            if (+dt === +today) cls.push('today');
            return <td key={ci}><button type="button" className={cls.join(' ')} disabled={off} aria-pressed={pressed}
              aria-label={dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) + (off ? ', unavailable' : '')}
              onClick={() => pickDate(dt)}>{dt.getDate()}</button></td>;
          })}</tr>)}</tbody></table>
      </div>
    );
  };

  let panel = null;
  if (step === 'what') panel = (<>
    <h2>What are you booking?</h2><p className="muted">Pick one. You can add meals and kayaking later.</p>
    <div className="choice-grid two" role="radiogroup" aria-label="Booking type">
      {Object.entries(TYPES).map(([k, t]) => (
        <button key={k} type="button" className="choice" role="radio" aria-checked={S.type === k} onClick={() => pickType(k)}>
          <img src={t.img} alt={t.alt} loading="lazy" /><div className="body"><h3>{t.name}</h3><p>{t.desc}</p><span className="from">{t.from}</span></div>
        </button>))}
    </div>
    {S.type === 'package' && (<>
      <h2 style={{ marginTop: '2rem' }}>How many days?</h2>
      <div className="option-list" role="radiogroup" aria-label="Package length">
        {PACKAGES.map((p) => (
          <button key={p.days} type="button" className="option-row noimg" role="radio" aria-checked={S.days === p.days} onClick={() => set({ days: p.days })}>
            <div><h3>{p.days} days / {p.days - 1} nights{p.tag ? <Wavy className="mini-tag">{p.tag}</Wavy> : null}</h3><p>Daily surf lessons, stay, bonfires and ice baths. Camping {p.camp} · AC hostel {p.ac}.</p></div>
            <div className="opt-price">{p.camp}<small>from / person</small></div>
          </button>))}
      </div>
      <p className="small muted" style={{ marginTop: '1rem' }}>Check in Monday to Thursday and get ₹{WEEKDAY_OFFER.toLocaleString('en-IN')} off per person, subject to availability.</p></>)}
  </>);

  if (step === 'program') panel = (<>
    <h2>Which lessons?</h2><p className="muted">Sessions are 2 hours, usually in the morning. Exact times follow the tide and are confirmed the evening before.</p>
    <div className="option-list" role="radiogroup" aria-label="Lesson type">
      <button type="button" className="option-row noimg" role="radio" aria-checked={S.program === 'group'} onClick={() => set({ program: 'group' })}>
        <div><h3>Group sessions</h3><p>Small batch with an instructor. Book 3, 5, 7 or 10 days for the bundle price: ₹6,000 · ₹10,000 · ₹13,000 · ₹17,000.</p></div>
        <div className="opt-price">₹2,000<small>per session / person</small></div></button>
      <button type="button" className="option-row noimg" role="radio" aria-checked={S.program === 'private'} onClick={() => set({ program: 'private' })}>
        <div><h3>Private 1:1 training</h3><p>Just you and an instructor.</p></div>
        <div className="opt-price">₹{PRIVATE_SESSION.toLocaleString('en-IN')}<small>per session / person</small></div></button>
    </div>
    <p className="small muted" style={{ marginTop: '1rem' }}>Includes: {SURF_INCLUDES.join(', ').toLowerCase()}. Guests staying elsewhere arrange their own travel to the surf location.</p>
  </>);

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
    const pkg = S.type === 'package';
    panel = (<>
      <h2>{pkg ? 'When are you checking in?' : 'Which days do you want to surf?'}</h2>
      <p className="muted">{pkg ? `Tap your check-in date. Your ${S.days}-day package sets the check-out.` : 'Tap every day you want a session, in any order. Tap again to remove one.'}</p>
      <div className="cal-wrap">
        <div className="cal-nav">
          <button type="button" aria-label="Previous month" disabled={!prevOK} onClick={() => setCalStart(new Date(calStart.getFullYear(), calStart.getMonth() - 1, 1))}>←</button>
          <span className="small muted">{pkg ? (S.checkin ? `${fmt(S.checkin)} → ${fmt(checkout)}` : 'No date picked yet') : `${sessions} day${sessions === 1 ? '' : 's'} picked`}</span>
          <button type="button" aria-label="Next month" onClick={() => setCalStart(new Date(calStart.getFullYear(), calStart.getMonth() + 1, 1))}>→</button>
        </div>
        {renderMonth(calStart.getFullYear(), calStart.getMonth())}
        {renderMonth(calStart.getFullYear(), calStart.getMonth() + 1)}
      </div>
      {!pkg && sessions > 0 && (
        <div className="date-chips" aria-label="Picked surf days">
          {sortedDates.map((d) => <button key={iso(d)} type="button" onClick={() => pickDate(d)} aria-label={`Remove ${fmt(d)}`}>{fmt(d)} <span aria-hidden="true">×</span></button>)}
          <button type="button" className="clear" onClick={() => set({ dates: [] })}>Clear all</button>
        </div>)}
      <p className="cal-note">
        {pkg ? (isWeekdayCheckin(S.checkin) ? '✓ Mon–Thu check-in: ₹1,000 off per person applied (subject to availability).' : 'Tip: Mon–Thu check-ins get ₹1,000 off per person (highlighted dates).') : 'Surf season runs September to May, so June to August are greyed out.'}
      </p>
    </>);
  }

  if (step === 'stay') panel = (<>
    <h2>Where do you want to sleep?</h2>
    <p className="muted">Price per person for your {S.days}-day / {nights}-night package, surf lessons included.</p>
    <div className="option-list" role="radiogroup" aria-label="Accommodation">
      {Object.entries(ROOMS).map(([k, r]) => (
        <button key={k} type="button" className="option-row" role="radio" aria-checked={S.room === k} onClick={() => set({ room: k })}>
          <img src={r.img} alt={r.alt} loading="lazy" />
          <div><h3>{r.name}</h3><p>{r.desc}</p><div className="feats">{r.feats.map((f) => <span key={f}>· {f}</span>)}</div></div>
          <div className="opt-price">{inr(PACKAGE_PRICE[k][S.days])}<small>per person</small></div>
        </button>))}
    </div>
    <p className="small muted" style={{ marginTop: '1rem' }}>Every package includes: {PACKAGE_INCLUDES.join(' · ')}.</p>
  </>);

  if (step === 'extras') panel = (<>
    <h2>Anything to add?</h2><p className="muted">All optional. Prices are per person.</p>
    {S.type === 'package' && (<>
      <h3 style={{ marginTop: '1rem' }}>Daily meals</h3>
      <div className="option-list" role="radiogroup" aria-label="Meal plan">
        {Object.entries(MEALS).map(([k, m]) => (
          <button key={k} type="button" className="option-row noimg" role="radio" aria-checked={S.meals === k} onClick={() => set({ meals: k })}>
            <div><h3>{m.name}</h3><p>{k === 'none' ? 'Use the open kitchen or eat out in Mulki.' : `Home-cooked meals every day of your stay (${S.days} days).`}</p></div>
            <div className="opt-price">{m.rate ? <>{inr(m.rate)}<small>per person / day</small></> : '—'}</div>
          </button>))}
      </div></>)}
    <h3 style={{ marginTop: '1.5rem' }}>On the river</h3>
    <div className="option-list">
      <button type="button" className="option-row" role="checkbox" aria-checked={S.kayakDay} onClick={() => set({ kayakDay: !S.kayakDay })}>
        <img src="/img/kayak-river.jpg" alt="Kayaks on the Shambhavi river" loading="lazy" /><div><h3>Day kayaking</h3><p>Through the mangroves. Timing follows the tide.</p></div>
        <div className="opt-price">{inr(KAYAK.day)}<small>per person</small></div></button>
      <button type="button" className="option-row" role="checkbox" aria-checked={S.kayakNight} onClick={() => set({ kayakNight: !S.kayakNight })}>
        <img src="/img/river-dusk.jpg" alt="The river at dusk" loading="lazy" /><div><h3>Night kayaking</h3><p>See the river glow in bioluminescence season.</p></div>
        <div className="opt-price">{inr(KAYAK.night)}<small>per person</small></div></button>
    </div>
  </>);

  if (step === 'review') panel = sent ? (
    <div className="sent">
      <Shaka size={110} title="" />
      <h2>Almost done</h2>
      <p>Your request is ready. Tap below to send it to us on WhatsApp. We'll confirm availability and share payment details.</p>
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
    <ul className="policy small">{(S.type === 'package' ? POLICY.package : POLICY.surf).map((p) => <li key={p}>{p}</li>)}<li>{POLICY.general}</li></ul>
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
          {payNote && <p className="note pay">{payNote}</p>}
          <button className="btn btn-primary" type="button" aria-disabled={nextDisabled || undefined} onClick={() => !nextDisabled && next()}>{nextLabel}</button>
        </aside>
      </div>
      <div className={`mobile-bar${barOpen ? ' open' : ''}`} aria-label="Booking total">
        <div className="breakdown">{dl(summaryRows)}{priceRows.length > 0 && <div style={{ borderTop: '1px solid var(--sb-line)', marginTop: '.6rem', paddingTop: '.6rem' }}>{dl(priceRows)}</div>}{payNote && <p className="small muted" style={{ margin: '.6rem 0 0' }}>{payNote}</p>}</div>
        <div className="row">
          <button className="tot" type="button" aria-expanded={barOpen} onClick={() => setBarOpen(!barOpen)}><b>{inr(total)}</b><span>See breakdown</span></button>
          <button className="btn btn-primary" type="button" aria-disabled={nextDisabled || undefined} onClick={() => !nextDisabled && next()}>{sent ? 'Request ready' : nextLabel}</button>
        </div>
      </div>
    </>
  );
}
