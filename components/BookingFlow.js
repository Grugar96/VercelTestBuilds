'use client';
import { useEffect, useMemo, useState } from 'react';
import Wavy from './Wavy';
import { DoodleSvg } from './Doodle';
import { wa, ROOMS, PACKAGE_DAYS, PACKAGE_PRICE, SURF_BUNDLES, PRIVATE_SESSION, MEALS, KAYAK, SKATE_HOUR, isGlowSeason, WEEKDAY_OFFER, ADVANCE_PER_PERSON, groupSurfPrice } from '@/lib/site';

// Four short steps: what & how long → when & who → make it yours → details & pay.
// Prices follow Kiran's Nov 2026 sheet. Payment is not wired yet: Harsha's booking engine
// (availability hold + Razorpay) plugs in at the last step.

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const DAY = 86400000;
const toKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmt = (d, o = { weekday: 'short', day: 'numeric', month: 'short' }) => d.toLocaleDateString('en-IN', o);
const isWeekdayOffer = (d) => { const w = d.getDay(); return w >= 1 && w <= 4; }; // Mon–Thu
const inSurfSeason = (d) => { const m = d.getMonth(); return m >= 8 || m <= 4; }; // Sep–May

// Full moons: mean synodic month from a known full moon (21 Jan 2000, 04:40 UTC). Good to within a day.
const SYNODIC = 29.530588853;
const FM0 = Date.UTC(2000, 0, 21, 4, 40) + 5.5 * 3600000; // in IST
function fullMoonsBetween(a, b) {
  const out = []; let k = Math.floor((a.getTime() - FM0) / (SYNODIC * DAY)) - 1;
  for (;;) { const t = new Date(FM0 + k * SYNODIC * DAY); const d = new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()); if (d > b) break; if (d >= a) out.push(d); k++; }
  return out;
}
const isFullMoon = (d) => fullMoonsBetween(addDays(d, 0), addDays(d, 0)).length > 0;

const STEPS = ['What & how long', 'When & who', 'Make it yours', 'Details & pay'];
const PKG_NOTE = { 3: 'A first taste', 5: 'Best for first-timers', 7: 'Real progress', 10: 'Live the surf life' };

function Calendar({ value, onPick, span, offerTags }) {
  const today = useMemo(() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }, []);
  const [month, setMonth] = useState(() => { const b = value || addDays(today, 1); return new Date(b.getFullYear(), b.getMonth(), 1); });
  const [hover, setHover] = useState(null);
  const start = hover || value;
  const end = start ? addDays(start, span - 1) : null;
  const months = [month, new Date(month.getFullYear(), month.getMonth() + 1, 1)];
  return (
    <div className="bk-cal">
      <div className="bk-cal-nav">
        <button type="button" aria-label="Previous month" disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
        <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="bk-cal-months">
        {months.map((m, mi) => {
          const first = (m.getDay() + 6) % 7; const n = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
          return (
            <div className={`bk-month${mi ? ' second' : ''}`} key={toKey(m)}>
              <p className="bk-month-name">{fmt(m, { month: 'long', year: 'numeric' })}</p>
              <div className="bk-grid" role="grid" onMouseLeave={() => setHover(null)}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="bk-dow">{d}</span>)}
                {Array.from({ length: first }, (_, i) => <span key={'e' + i} />)}
                {Array.from({ length: n }, (_, i) => {
                  const d = new Date(m.getFullYear(), m.getMonth(), i + 1);
                  const off = d <= today || !inSurfSeason(d) || !inSurfSeason(addDays(d, span - 1));
                  const inRange = start && d >= start && d <= end;
                  const cls = ['bk-day', inRange && 'in', start && +d === +start && 'first', end && +d === +end && 'last', off && 'off'].filter(Boolean).join(' ');
                  return (
                    <button type="button" key={i} className={cls} disabled={off} aria-pressed={!!(value && +d === +value)}
                      aria-label={`${fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })}${offerTags && isWeekdayOffer(d) ? ', ₹1,000 off' : ''}${isFullMoon(d) ? ', full moon' : ''}`}
                      onMouseEnter={() => !off && setHover(d)} onClick={() => onPick(d)}>
                      <span>{i + 1}</span>
                      {!off && offerTags && isWeekdayOffer(d) && <i className="bk-tag">-1k</i>}
                      {isFullMoon(d) && <i className="bk-moon" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="bk-legend">{offerTags && <><i className="bk-tag">-1k</i> ₹1,000 off Mon–Thu arrivals</>}<span><i className="bk-moon" /> full moon</span><span className="muted">Surf season Sep–May</span></p>
    </div>
  );
}

function Stepper({ value, set, min = 1, max = 12, label }) {
  return (
    <div className="bk-stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => set(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label}`}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => set(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`}>+</button>
    </div>
  );
}

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState('stay'); // stay | surf
  const [days, setDays] = useState(5);
  const [surfMode, setSurfMode] = useState('group'); // group | private
  const [sessions, setSessions] = useState(1);
  const [surfDays, setSurfDays] = useState(3);
  const [start, setStart] = useState(null);
  const [guests, setGuests] = useState(1);
  const [room, setRoom] = useState('camp');
  const [meals, setMeals] = useState('none');
  const [extras, setExtras] = useState({ night: false, moon: false, day: false, skate: false });
  const [skateHours, setSkateHours] = useState(1);
  const [pay, setPay] = useState('advance');
  const [form, setForm] = useState({ name: '', email: '', phone: '', levels: ['Beginner'], others: [], ecName: '', ecPhone: '', waiver: false });
  const [done, setDone] = useState(false);

  // Pre-fill from links like /book?type=stay&days=5&room=ac&date=2026-12-08&guests=2
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get('type'); const d = Number(q.get('days')); const r = q.get('room'); const dt = q.get('date'); const g = Number(q.get('guests'));
    if (t === 'surf' || t === 'stay' || t === 'package') setType(t === 'surf' ? 'surf' : 'stay');
    if (t === 'surf' && SURF_BUNDLES[d]) setSurfDays(d);
    if (t !== 'surf' && PACKAGE_DAYS.includes(d)) setDays(d);
    if (r === 'ac' || r === 'camp') setRoom(r);
    if (g > 0 && g <= 12) setGuests(g);
    const pr = q.get('program'); if (t === 'surf' && (pr === 'private' || pr === 'group')) setSurfMode(pr);
    const ad = q.get('addon'); if (ad === 'kayak-night') setExtras((x) => ({ ...x, night: true }));
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const okDate = dt && /^\d{4}-\d{2}-\d{2}$/.test(dt) && fromKey(dt) > now && inSurfSeason(fromKey(dt));
    if (okDate) setStart(fromKey(dt));
    if (t || ad) setStep(okDate ? 2 : 1);
  }, []);

  const span = type === 'stay' ? days : surfMode === 'group' ? surfDays : sessions; // calendar days covered
  const end = start ? addDays(start, span - 1) : null;
  useEffect(() => { if (start && end && !inSurfSeason(end)) setStart(null); }, [start, end]); // length changed so the trip now runs into monsoon
  const moons = start ? fullMoonsBetween(addDays(start, -1), addDays(end, 1)) : [];
  const moonNight = moons[0];
  const glow = start ? (isGlowSeason(start) || isGlowSeason(end)) : isGlowSeason();

  const lines = useMemo(() => {
    const L = [];
    if (type === 'stay') {
      L.push([`${ROOMS[room].short} · ${days}D/${days - 1}N × ${guests}`, PACKAGE_PRICE[room][days] * guests]);
      if (meals !== 'none') L.push([`${MEALS[meals].name} · ${days} days × ${guests}`, MEALS[meals].rate * days * guests]);
      if (start && isWeekdayOffer(start)) L.push([`Mon–Thu arrival`, -WEEKDAY_OFFER]);
    } else if (surfMode === 'group') {
      L.push([`Group lessons · ${surfDays} day${surfDays > 1 ? 's' : ''} × ${guests}`, groupSurfPrice(surfDays) * guests]);
    } else {
      L.push([`Private 1:1 · ${sessions} session${sessions > 1 ? 's' : ''} × ${guests}`, PRIVATE_SESSION * sessions * guests]);
    }
    if (extras.night) L.push([`Night kayak × ${guests}`, KAYAK.night * guests]);
    if (extras.moon && moonNight) L.push([`Full-moon kayak × ${guests}`, KAYAK.moon * guests]);
    if (extras.day) L.push([`Morning kayak × ${guests}`, KAYAK.day * guests]);
    if (extras.skate) L.push([`Surfskate · ${skateHours} hr × ${guests}`, SKATE_HOUR * skateHours * guests]);
    return L;
  }, [type, room, days, guests, meals, start, surfMode, surfDays, sessions, extras, skateHours, moonNight]);
  const total = lines.reduce((a, [, v]) => a + v, 0);
  const canAdvance = type === 'stay';
  const advance = Math.min(total, ADVANCE_PER_PERSON * guests);
  const dueNow = canAdvance && pay === 'advance' ? advance : total;

  const valid = [
    true,
    !!start,
    true,
    form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.replace(/\D/g, '').length >= 10 && form.ecName.trim() && form.ecPhone.replace(/\D/g, '').length >= 10 && form.waiver && form.others.slice(0, guests - 1).every((n) => n && n.trim()) && form.others.length >= guests - 1,
  ];
  const next = () => { if (step < 3) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } else setDone(true); };
  const toggle = (k) => setExtras((e) => ({ ...e, [k]: !e[k] }));
  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const summaryText = [
    'Hi Mulki Surf Brothers! Booking request:',
    type === 'stay' ? `${ROOMS[room].short} · ${days}D/${days - 1}N` : surfMode === 'group' ? `Group lessons · ${surfDays} days` : `Private lessons · ${sessions} sessions`,
    start ? `From ${fmt(start)} · ${guests} guest${guests > 1 ? 's' : ''}` : '',
    ...lines.slice(1).map(([k]) => k),
    `Total ${inr(total)} · paying ${pay === 'advance' && canAdvance ? 'advance ' + inr(advance) : 'in full'}`,
    `${form.name} · ${form.phone} · ${form.email}`,
  ].filter(Boolean).join('\n');

  if (done) {
    return (
      <div className="bk-done">
        <DoodleSvg name="tick" className="doodle bk-done-icon" />
        <Wavy as="p" className="label eyebrow">almost there</Wavy>
        <h2>Your booking is ready to pay</h2>
        <p>{type === 'stay' ? `${ROOMS[room].short}, ${days} days` : surfMode === 'group' ? `Group lessons, ${surfDays} days` : `Private lessons, ${sessions} sessions`} for {guests} {guests > 1 ? 'guests' : 'guest'}, from {fmt(start)}. Paying now: <b>{inr(dueNow)}</b>.</p>
        <p className="muted small">Online payment is being connected right now. Until it's live, send this booking to us and we'll confirm it and share a payment link. Nothing has been charged.</p>
        <a className="btn btn-primary" href={wa(summaryText)}>Send my booking</a>
        <button type="button" className="btn btn-secondary" onClick={() => setDone(false)}>Back to details</button>
      </div>
    );
  }

  return (
    <div className="bk">
      <ol className="bk-steps" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? 'now' : i < step ? 'done' : ''}>
            <button type="button" disabled={i > step} onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}>
              <span className="n">{i < step ? '✓' : i + 1}</span><span className="t">{s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="bk-body">
        <div className="bk-main">
          {step === 0 && (
            <section aria-labelledby="bk-h0">
              <h2 id="bk-h0">What are you booking?</h2>
              <div className="bk-tabs" role="tablist">
                <button type="button" role="tab" aria-selected={type === 'stay'} onClick={() => setType('stay')}><DoodleSvg name="house" /> Stay &amp; Surf</button>
                <button type="button" role="tab" aria-selected={type === 'surf'} onClick={() => setType('surf')}><DoodleSvg name="board" /> Surf only</button>
              </div>
              {type === 'stay' ? (
                <>
                  <p className="bk-hint">Stay, daily surf lessons, ice baths and bonfire nights, in one price.</p>
                  <div className="bk-cards four">
                    {PACKAGE_DAYS.map((d) => (
                      <button type="button" key={d} className={`bk-card${days === d ? ' on' : ''}`} aria-pressed={days === d} onClick={() => setDays(d)}>
                        {d === 5 && <Wavy className="bk-pick">best for first-timers</Wavy>}
                        <b>{d}D / {d - 1}N</b>
                        <span className="bk-sub">{PKG_NOTE[d]}</span>
                        <span className="bk-price">from {inr(PACKAGE_PRICE.camp[d])}<small>/person</small></span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="bk-hint">Staying elsewhere? Two-hour lessons with board and instructor.</p>
                  <div className="bk-seg" role="radiogroup" aria-label="Lesson type">
                    <button type="button" role="radio" aria-checked={surfMode === 'group'} onClick={() => setSurfMode('group')}>Group lessons</button>
                    <button type="button" role="radio" aria-checked={surfMode === 'private'} onClick={() => setSurfMode('private')}>Private 1:1</button>
                  </div>
                  {surfMode === 'group' ? (
                    <div className="bk-cards five">
                      {Object.keys(SURF_BUNDLES).map(Number).map((d) => (
                        <button type="button" key={d} className={`bk-card${surfDays === d ? ' on' : ''}`} aria-pressed={surfDays === d} onClick={() => setSurfDays(d)}>
                          {d === 3 && <Wavy className="bk-pick">most picked</Wavy>}
                          <b>{d} day{d > 1 ? 's' : ''}</b>
                          <span className="bk-price">{inr(SURF_BUNDLES[d])}<small>/person</small></span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bk-row">
                      <div><b>How many sessions?</b><p className="muted small">{inr(PRIVATE_SESSION)} per person per session</p></div>
                      <Stepper value={sessions} set={setSessions} max={10} label="sessions" />
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="bk-h1">
              <h2 id="bk-h1">When are you coming?</h2>
              <p className="bk-hint">Tap your first day. {type === 'stay' ? `We fill in the ${days - 1} nights for you.` : 'Lessons run on consecutive mornings.'}</p>
              <Calendar value={start} onPick={setStart} span={span} offerTags={type === 'stay'} />
              <div className="bk-when" aria-live="polite">
                {start ? (
                  <p><b>{fmt(start)}</b> → <b>{fmt(type === 'stay' ? addDays(start, days - 1) : end)}</b> <span className="muted">· {type === 'stay' ? `${days - 1} nights` : `${span} morning${span > 1 ? 's' : ''}`}</span>
                    {type === 'stay' && isWeekdayOffer(start) && <span className="bk-badge">₹1,000 off, Mon–Thu arrival</span>}</p>
                ) : <p className="muted">No date picked yet.</p>}
              </div>
              <div className="bk-row">
                <div><b>Guests</b><p className="muted small">Everyone in one booking</p></div>
                <Stepper value={guests} set={setGuests} label="guests" />
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="bk-h2">
              <h2 id="bk-h2">{type === 'stay' ? 'Make it yours' : 'Add something extra?'}</h2>
              {type === 'stay' && (
                <>
                  <h3 className="bk-h3">Where you'll sleep</h3>
                  <div className="bk-cards two">
                    {['camp', 'ac'].map((r) => (
                      <button type="button" key={r} className={`bk-card bk-room${room === r ? ' on' : ''}`} aria-pressed={room === r} onClick={() => setRoom(r)}>
                        <img src={ROOMS[r].img} alt="" />
                        <b>{ROOMS[r].short}</b>
                        <span className="bk-sub">{r === 'camp' ? 'Tents under the palms' : 'Air-conditioned rooms'}</span>
                        <span className="bk-price">{r === 'camp' ? 'In the price' : <>+{inr(PACKAGE_PRICE.ac[days] - PACKAGE_PRICE.camp[days])}<small>/person</small></>}</span>
                      </button>
                    ))}
                  </div>
                  <h3 className="bk-h3">Meals</h3>
                  <div className="bk-seg" role="radiogroup" aria-label="Meals">
                    {Object.entries(MEALS).map(([k, m]) => (
                      <button type="button" role="radio" key={k} aria-checked={meals === k} onClick={() => setMeals(k)}>{k === 'none' ? 'No meals' : `${k === 'veg' ? 'Veg' : 'Non-veg'} · ${inr(m.rate)}/day`}</button>
                    ))}
                  </div>
                </>
              )}
              <h3 className="bk-h3">Extras <span className="muted small">optional</span></h3>
              <ul className="bk-extras">
                <li className={`featured${extras.night ? ' on' : ''}`}>
                  <span className="bk-x-icon"><DoodleSvg name="sparkle" /></span>
                  <div><b>Night kayak <Wavy className="bk-only">only with Surf Brothers</Wavy></b>{glow && <span className="bk-glow">✦ glow season: good chance of bioluminescence</span>}<p>Paddle the Shambhavi after dark. {glow ? 'It’s bioluminescence season: on dark nights every stroke can light the water blue.' : 'Bioluminescence season is usually October to March.'} Timing follows the tide.</p></div>
                  <span className="bk-x-price">{inr(KAYAK.night)}<small>/person</small></span>
                  <button type="button" className="bk-toggle" aria-pressed={extras.night} onClick={() => toggle('night')}><span className="sr-only">Add night kayak</span></button>
                </li>
                {moonNight && (
                  <li className={extras.moon ? 'on' : ''}>
                    <span className="bk-x-icon"><DoodleSvg name="sun" /></span>
                    <div><b>Full-moon kayak</b><p>Full moon on {fmt(moonNight)}. We go out that night or the nights either side, depending on cloud. Same price as a night trip.</p></div>
                    <span className="bk-x-price">{inr(KAYAK.moon)}<small>/person</small></span>
                    <button type="button" className="bk-toggle" aria-pressed={extras.moon} onClick={() => toggle('moon')}><span className="sr-only">Add full-moon kayak</span></button>
                  </li>
                )}
                <li className={extras.skate ? 'on' : ''}>
                  <span className="bk-x-icon"><DoodleSvg name="wave" /></span>
                  <div><b>Surfskate session</b><p>A skateboard that turns like a surfboard. Repeat your turns and pumping on land, so they come easier in the water.{extras.skate && <span className="bk-inline"> Hours: <Stepper value={skateHours} set={setSkateHours} max={5} label="hours" /></span>}</p></div>
                  <span className="bk-x-price">{inr(SKATE_HOUR)}<small>/hr</small></span>
                  <button type="button" className="bk-toggle" aria-pressed={extras.skate} onClick={() => toggle('skate')}><span className="sr-only">Add surfskate session</span></button>
                </li>
                <li className={extras.day ? 'on' : ''}>
                  <span className="bk-x-icon"><DoodleSvg name="kayak" /></span>
                  <div><b>Morning kayak</b><p>Through the mangroves on the river. Timing follows the tide.</p></div>
                  <span className="bk-x-price">{inr(KAYAK.day)}<small>/person</small></span>
                  <button type="button" className="bk-toggle" aria-pressed={extras.day} onClick={() => toggle('day')}><span className="sr-only">Add morning kayak</span></button>
                </li>
              </ul>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="bk-h3">
              <h2 id="bk-h3">Your details</h2>
              <div className="bk-form">
                <label>Full name<input value={form.name} onChange={(e) => setF('name', e.target.value)} autoComplete="name" /></label>
                <label>Email<input type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} autoComplete="email" /></label>
                <label>Mobile<input type="tel" value={form.phone} onChange={(e) => setF('phone', e.target.value)} autoComplete="tel" placeholder="+91" /></label>
                <label>Your surf level<select value={form.levels[0]} onChange={(e) => setF('levels', [e.target.value, ...form.levels.slice(1)])}><option>Beginner</option><option>Been a few times</option><option>Confident</option></select></label>
                {Array.from({ length: guests - 1 }, (_, i) => (
                  <div className="bk-guest" key={i}>
                    <label>Guest {i + 2} name<input value={form.others[i] || ''} onChange={(e) => { const o = [...form.others]; o[i] = e.target.value; setF('others', o); }} /></label>
                    <label>Surf level<select value={form.levels[i + 1] || 'Beginner'} onChange={(e) => { const l = [...form.levels]; l[i + 1] = e.target.value; setF('levels', l); }}><option>Beginner</option><option>Been a few times</option><option>Confident</option></select></label>
                  </div>
                ))}
                <label>Emergency contact<input value={form.ecName} onChange={(e) => setF('ecName', e.target.value)} placeholder="Name" /></label>
                <label>Their phone<input type="tel" value={form.ecPhone} onChange={(e) => setF('ecPhone', e.target.value)} placeholder="+91" /></label>
              </div>
              {canAdvance && (
                <div className="bk-pay" role="radiogroup" aria-label="Payment">
                  <button type="button" role="radio" aria-checked={pay === 'advance'} onClick={() => setPay('advance')}><b>Pay {inr(advance)} now</b><span>{inr(ADVANCE_PER_PERSON)} per person, rest ({inr(total - advance)}) at check-in</span></button>
                  <button type="button" role="radio" aria-checked={pay === 'full'} onClick={() => setPay('full')}><b>Pay {inr(total)} now</b><span>Nothing due at the hostel</span></button>
                </div>
              )}
              {!canAdvance && <p className="bk-hint">Lessons are paid in full to confirm.</p>}
              <label className="bk-check"><input type="checkbox" checked={form.waiver} onChange={(e) => setF('waiver', e.target.checked)} /> {canAdvance ? 'I accept the liability waiver for everyone in this booking, and that the advance is non-refundable.' : 'I accept the liability waiver for everyone in this booking.'}</label>
            </section>
          )}

          <div className="bk-nav">
            {step > 0 && <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
            <button type="button" className="btn btn-primary" disabled={!valid[step]} onClick={next}>
              {step < 3 ? 'Continue' : `Continue to payment · ${inr(dueNow)}`}
            </button>
          </div>
        </div>

        <aside className="bk-summary" aria-label="Your booking">
          <Wavy as="p" className="label eyebrow">your trip</Wavy>
          <p className="bk-s-when">{start ? <>{fmt(start)} → {fmt(type === 'stay' ? addDays(start, days - 1) : end)}</> : 'Pick your dates'} · {guests} {guests > 1 ? 'guests' : 'guest'}</p>
          <ul>{lines.map(([k, v]) => <li key={k}><span>{k}</span><span className={v < 0 ? 'neg' : ''}>{v < 0 ? '−' + inr(-v) : inr(v)}</span></li>)}</ul>
          <p className="bk-total"><span>Total</span><b>{inr(total)}</b></p>
          {canAdvance && <p className="bk-due muted small">{inr(advance)} advance to book · rest at check-in</p>}
        </aside>
      </div>

      <div className="bk-bar">
        <div><b>{inr(total)}</b><span>{start ? fmt(start) : 'Pick dates'} · {guests} {guests > 1 ? 'guests' : 'guest'}</span></div>
        <button type="button" className="btn btn-primary" disabled={!valid[step]} onClick={next}>{step < 3 ? 'Continue' : 'Pay'}</button>
      </div>
    </div>
  );
}
