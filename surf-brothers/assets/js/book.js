/* Mulki Surf Brothers — booking flow
   Prices come from the current price list; confirm with the owner before launch. */
{
  const PRICES = {
    room: {
      camp: { name: 'Riverside camping', short: 'Camping', rate: 800, img: 'assets/img/palms-evening.jpg', alt: 'Palm trees by the camping area at sunset', desc: 'Tents under the palms, a few steps from the river.', feats: ['Under the palms', 'Shared bathrooms', 'Wi-Fi'] },
      nonac: { name: 'Non-AC dorm', short: 'Non-AC dorm', rate: 1000, img: 'assets/img/board-hostel.jpg', alt: 'The hostel dorm entrance with a painted surfboard', desc: 'Wooden bunks with ceiling fans and the river breeze.', feats: ['Ceiling fans', 'Lockers', 'Wi-Fi'] },
      ac: { name: 'AC dorm', short: 'AC dorm', rate: 1200, img: 'assets/img/board-art.jpg', alt: 'Close-up of the mandala art on a hostel surfboard', desc: 'Air-conditioned bunks for the hot afternoons.', feats: ['Air conditioning', 'Lockers', 'Wi-Fi'] },
    },
    pkg: {
      3: { name: '3-day Surf escape', nights: 3, program: 6000, room: 'camp' },
      5: { name: '5-day Surf mastery', nights: 5, program: 9000, room: 'nonac' },
      7: { name: '7-day Surf immersion', nights: 7, program: 11000, room: 'ac' },
    },
    surf: {
      group: { name: 'Group session', price: 2000, per: 'session', days: 1, sessions: true, desc: 'Small group with an instructor. About 2 hours.' },
      private: { name: 'Private 1:1 session', price: 3000, per: 'session', days: 1, sessions: true, desc: 'Just you and an instructor.' },
      p3: { name: '3-day program', price: 6000, per: 'guest', days: 3, desc: 'Three consecutive mornings, from first pop-up to riding whitewash.' },
      p5: { name: '5-day program', price: 9000, per: 'guest', days: 5, desc: 'Five mornings: paddling, positioning and reading waves.' },
      p7: { name: '7-day program', price: 11000, per: 'guest', days: 7, desc: 'A full week of coaching.' },
      p10: { name: '10-day program', price: 15000, per: 'guest', days: 10, desc: 'Ten mornings for real independence.' },
    },
    meals: { none: { name: 'No meal plan', rate: 0 }, veg: { name: 'Veg full board', rate: 500 }, nonveg: { name: 'Non-veg full board', rate: 600 } },
    kayakDay: 600, kayakNight: 700,
  };
  const TYPES = {
    package: { name: 'Surf + Stay package', img: 'assets/img/sunset-walk.jpg', alt: 'A surfer walking into the sea at sunset with a board', desc: 'Lessons, a bed by the river and breakfast, bundled.', from: 'From ₹8,400 / guest' },
    surf: { name: 'Surf lessons only', img: 'assets/img/beach-theory.jpg', alt: 'Students learning on the sand before a surf session', desc: 'Already staying nearby? Join a session or a program.', from: 'From ₹2,000 / session' },
    stay: { name: 'Stay only', img: 'assets/img/river-dusk.jpg', alt: 'The Shambhavi river at dusk', desc: 'Camping or a dorm bed by the Shambhavi river.', from: 'From ₹800 / night' },
  };
  const SEASON_OFF = [5, 6, 7]; // June, July, August (0-based months) — off-season for surfing

  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = (d) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
  const parseISO = (s) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null; const [y, m, d] = s.split('-').map(Number); const r = new Date(y, m - 1, d); return isNaN(r) ? null : r; };
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
  const fmt = (d) => d ? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';
  const nightsBetween = (a, b) => (a && b) ? Math.round((b - a) / 86400000) : 0;

  // ---------- state ----------
  const q = new URLSearchParams(location.search);
  const S = {
    type: TYPES[q.get('type')] ? q.get('type') : null,
    pkg: PRICES.pkg[q.get('pkg')] ? Number(q.get('pkg')) : 5,
    program: PRICES.surf[q.get('program')] ? q.get('program') : null,
    sessions: 1,
    guests: Math.min(12, Math.max(1, Number(q.get('guests')) || 1)),
    checkin: parseISO(q.get('in')), checkout: parseISO(q.get('out')),
    room: PRICES.room[q.get('room')] ? q.get('room') : null,
    meals: 'none', kayakDay: false, kayakNight: q.get('addon') === 'kayak-night',
    name: '', phone: '', note: '', sent: false,
  };
  if (S.type === 'package' && !S.room) S.room = PRICES.pkg[S.pkg].room;
  if (S.checkin && S.checkin < today) { S.checkin = null; S.checkout = null; }

  const stepsFor = () => {
    const s = [['what', 'What']];
    if (S.type === 'surf') s.push(['program', 'Lessons']);
    s.push(['guests', 'Guests'], ['dates', 'Dates']);
    if (S.type !== 'surf') s.push(['stay', 'Stay']);
    s.push(['extras', 'Extras'], ['review', 'Send']);
    return s;
  };
  let step = S.type ? (S.type === 'surf' && !S.program ? 'program' : 'guests') : 'what';

  // ---------- pricing ----------
  const stayNights = () => {
    if (S.type === 'package') return PRICES.pkg[S.pkg].nights;
    if (S.type === 'stay') return nightsBetween(S.checkin, S.checkout);
    return 0;
  };
  const lines = () => {
    const L = []; const g = S.guests;
    if (!S.type) return L;
    if (S.type === 'package') {
      const p = PRICES.pkg[S.pkg];
      L.push([`${p.nights}-day surf program × ${g}`, p.program * g]);
      if (S.room) L.push([`${PRICES.room[S.room].short}, ${p.nights} nights × ${g}`, PRICES.room[S.room].rate * p.nights * g]);
      L.push(['Breakfast every day', 0]);
    }
    if (S.type === 'surf' && S.program) {
      const p = PRICES.surf[S.program];
      if (p.sessions) L.push([`${p.name} × ${S.sessions} × ${g}`, p.price * S.sessions * g]);
      else L.push([`${p.name} × ${g}`, p.price * g]);
    }
    if (S.type === 'stay' && S.room) {
      const n = stayNights();
      if (n) L.push([`${PRICES.room[S.room].short}, ${n} night${n > 1 ? 's' : ''} × ${g}`, PRICES.room[S.room].rate * n * g]);
    }
    const n = stayNights();
    if (S.meals !== 'none' && n) L.push([`${PRICES.meals[S.meals].name}, ${n} days × ${g}`, PRICES.meals[S.meals].rate * n * g]);
    if (S.kayakDay) L.push([`Day kayaking × ${g}`, PRICES.kayakDay * g]);
    if (S.kayakNight) L.push([`Night kayaking × ${g}`, PRICES.kayakNight * g]);
    return L;
  };
  const total = () => lines().reduce((a, [, v]) => a + v, 0);

  // ---------- validity ----------
  const valid = (k) => {
    switch (k) {
      case 'what': return !!S.type;
      case 'program': return !!S.program;
      case 'guests': return S.guests >= 1;
      case 'dates': return S.type === 'stay' ? !!(S.checkin && S.checkout && S.checkout > S.checkin) : !!S.checkin;
      case 'stay': return !!S.room;
      case 'extras': return true;
      case 'review': return S.name.trim().length > 1 && /^[6-9]\d{9}$/.test(S.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''));
      default: return true;
    }
  };
  const firstInvalid = () => stepsFor().find(([k]) => !valid(k));
  const nextLabel = () => ({ what: 'Choose lessons', program: 'Choose guests', guests: 'Choose dates', dates: S.type === 'surf' ? 'Add extras' : 'Choose your bed', stay: 'Add extras', extras: 'Review & send', review: 'Send on WhatsApp' }[step] || 'Continue');

  // ---------- URL state ----------
  const syncURL = () => {
    const p = new URLSearchParams();
    if (S.type) p.set('type', S.type);
    if (S.type === 'package') p.set('pkg', S.pkg);
    if (S.program) p.set('program', S.program);
    if (S.guests > 1) p.set('guests', S.guests);
    if (S.checkin) p.set('in', iso(S.checkin));
    if (S.checkout && S.type === 'stay') p.set('out', iso(S.checkout));
    if (S.room) p.set('room', S.room);
    history.replaceState(null, '', `${location.pathname}${p.toString() ? '?' + p : ''}`);
  };

  // ---------- render: stepper ----------
  const stepperEl = document.querySelector('.stepper');
  const panel = document.querySelector('.step-panel');
  const summaryEl = document.querySelector('.summary');
  const bar = document.querySelector('.mobile-bar');

  const renderStepper = () => {
    const steps = stepsFor(); const idx = steps.findIndex(([k]) => k === step);
    stepperEl.innerHTML = steps.map(([k, l], i) => {
      const reachable = i <= idx || steps.slice(0, i).every(([kk]) => valid(kk));
      const done = i < idx;
      return `<li><button type="button" data-step="${k}" ${k === step ? 'aria-current="step"' : ''} class="${done ? 'done' : ''}" ${reachable ? '' : 'disabled'}><span>${done ? '✓' : i + 1}</span>${l}</button></li>`;
    }).join('');
  };

  // ---------- render: panels ----------
  let calStart = (() => { const d = S.checkin || today; return new Date(d.getFullYear(), d.getMonth(), 1); })();

  const monthHTML = (y, m) => {
    const first = new Date(y, m, 1); const days = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // Monday first
    let cells = ''; let row = '';
    for (let i = 0; i < lead; i++) row += '<td></td>';
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d);
      const off = dt < today || (S.type !== 'stay' && SEASON_OFF.includes(m));
      const end = S.type === 'stay' ? S.checkout : (S.checkin ? addDays(S.checkin, S.type === 'package' ? PRICES.pkg[S.pkg].nights : Math.max(0, (PRICES.surf[S.program] || { days: 1 }).days - 1)) : null);
      const isStart = S.checkin && +dt === +S.checkin; const isEnd = end && +dt === +end && !isStart;
      const inRange = S.checkin && end && dt > S.checkin && dt < end;
      const cls = [isStart && 'start', isEnd && 'end', inRange && 'in-range', +dt === +today && 'today'].filter(Boolean).join(' ');
      const label = dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) + (off ? ', unavailable' : '');
      row += `<td><button type="button" data-date="${iso(dt)}" class="${cls}" ${off ? 'disabled' : ''} aria-label="${label}" ${isStart || isEnd ? 'aria-pressed="true"' : ''}>${d}</button></td>`;
      if ((lead + d) % 7 === 0) { cells += `<tr>${row}</tr>`; row = ''; }
    }
    if (row) cells += `<tr>${row}</tr>`;
    const name = first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    return `<div class="month"><h3>${name}</h3><table><thead><tr>${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((x) => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${cells}</tbody></table></div>`;
  };

  const choiceCard = (attrs, img, alt, title, desc, extra, checked) =>
    `<button type="button" class="choice" role="radio" aria-checked="${checked}" ${attrs}>${img ? `<img src="${img}" alt="${alt}" loading="lazy">` : ''}<div class="body"><h3>${title}</h3><p>${desc}</p>${extra || ''}</div></button>`;

  const renderPanel = () => {
    let h = '';
    if (step === 'what') {
      h = `<h2>What are you booking?</h2><p class="muted">Pick one. You can add kayaking and meals later.</p>
      <div class="choice-grid" role="radiogroup" aria-label="Booking type">${Object.entries(TYPES).map(([k, t]) => choiceCard(`data-type="${k}"`, t.img, t.alt, t.name, t.desc, `<span class="from">${t.from}</span>`, S.type === k)).join('')}</div>
      ${S.type === 'package' ? `<h2 style="margin-top:2rem">How many days?</h2><div class="option-list" role="radiogroup" aria-label="Package length">${Object.entries(PRICES.pkg).map(([k, p]) => `<button type="button" class="option-row noimg" role="radio" aria-checked="${S.pkg === Number(k)}" data-pkg="${k}"><div><h3>${p.name}</h3><p>${p.nights} nights, ${p.nights}-day surf program, breakfast daily. Default bed: ${PRICES.room[p.room].short}.</p></div><div class="opt-price">${inr(p.program + PRICES.room[p.room].rate * p.nights)}<small>per guest</small></div></button>`).join('')}</div>` : ''}`;
    }
    if (step === 'program') {
      h = `<h2>Which lessons?</h2><p class="muted">Sessions run in the morning, 8–11 AM. Exact times follow the tide and are confirmed the evening before.</p>
      <div class="option-list" role="radiogroup" aria-label="Lesson type">${Object.entries(PRICES.surf).map(([k, p]) => `<button type="button" class="option-row noimg" role="radio" aria-checked="${S.program === k}" data-program="${k}"><div><h3>${p.name}</h3><p>${p.desc}</p></div><div class="opt-price">${inr(p.price)}<small>per ${p.per === 'session' ? 'session / guest' : 'guest'}</small></div></button>`).join('')}</div>
      ${S.program && PRICES.surf[S.program].sessions ? `<div class="counter" style="margin-top:1.25rem"><div><b>Number of sessions</b><div class="small muted">One session per morning</div></div><div class="ctrl"><button type="button" data-sess="-1" aria-label="One fewer session" ${S.sessions <= 1 ? 'disabled' : ''}>−</button><output aria-live="polite">${S.sessions}</output><button type="button" data-sess="1" aria-label="One more session" ${S.sessions >= 10 ? 'disabled' : ''}>+</button></div></div>` : ''}
      <p class="small muted" style="margin-top:1rem">Need 11 days or more? <a href="${SB.WA('Hi! I want a custom surf program of 11+ days.')}">Ask us on WhatsApp</a>.</p>`;
    }
    if (step === 'guests') {
      h = `<h2>How many guests?</h2><p class="muted">Including you. For groups bigger than 12, <a href="${SB.WA('Hi! We are a group of more than 12.')}">message us</a>.</p>
      <div class="counter"><div><b>Guests</b><div class="small muted">Everyone in your group, including you</div></div><div class="ctrl"><button type="button" data-g="-1" aria-label="One fewer guest" ${S.guests <= 1 ? 'disabled' : ''}>−</button><output aria-live="polite">${S.guests}</output><button type="button" data-g="1" aria-label="One more guest" ${S.guests >= 12 ? 'disabled' : ''}>+</button></div></div>`;
    }
    if (step === 'dates') {
      const pkgN = S.type === 'package' ? PRICES.pkg[S.pkg].nights : 0;
      const lead = S.type === 'stay' ? 'Tap your check-in date, then your check-out date.' : S.type === 'package' ? `Tap your check-in date. Your ${pkgN}-night package sets the check-out.` : 'Tap the day of your first session.';
      const prevOK = calStart > new Date(today.getFullYear(), today.getMonth(), 1);
      h = `<h2>When are you coming?</h2><p class="muted">${lead}</p>
      <div class="cal-wrap"><div class="cal-nav"><button type="button" data-cal="-1" aria-label="Previous month" ${prevOK ? '' : 'disabled'}>←</button><span class="small muted">${S.checkin ? `${fmt(S.checkin)}${S.type === 'stay' ? ` → ${S.checkout ? fmt(S.checkout) : 'pick check-out'}` : S.type === 'package' ? ` → ${fmt(addDays(S.checkin, pkgN))}` : ''}` : 'No date picked yet'}</span><button type="button" data-cal="1" aria-label="Next month">→</button></div>
      ${monthHTML(calStart.getFullYear(), calStart.getMonth())}${monthHTML(calStart.getFullYear(), calStart.getMonth() + 1)}</div>
      <p class="cal-note">${S.type === 'stay' ? 'Check-in from 1:00 PM, check-out by 11:00 AM.' : 'Surf season runs September to May, so June to August are greyed out.'}</p>`;
    }
    if (step === 'stay') {
      const n = stayNights();
      h = `<h2>Where do you want to sleep?</h2><p class="muted">${S.type === 'package' ? 'Your package comes with a default bed. Switch it here and the price updates.' : `Prices are per guest per night${n ? `, for ${n} night${n > 1 ? 's' : ''}` : ''}.`}</p>
      <div class="option-list" role="radiogroup" aria-label="Accommodation">${Object.entries(PRICES.room).map(([k, r]) => `<button type="button" class="option-row" role="radio" aria-checked="${S.room === k}" data-room="${k}"><img src="${r.img}" alt="${r.alt}" loading="lazy"><div><h3>${r.name}</h3><p>${r.desc}</p><div class="feats">${r.feats.map((f) => `<span>· ${f}</span>`).join('')}</div></div><div class="opt-price">${inr(r.rate)}<small>per guest / night</small></div></button>`).join('')}</div>`;
    }
    if (step === 'extras') {
      const n = stayNights();
      h = `<h2>Anything to add?</h2><p class="muted">All optional. Prices are per guest.</p>
      ${n ? `<h3 style="margin-top:1rem">Meals</h3><div class="option-list" role="radiogroup" aria-label="Meal plan">${Object.entries(PRICES.meals).map(([k, m]) => `<button type="button" class="option-row noimg" role="radio" aria-checked="${S.meals === k}" data-meals="${k}"><div><h3>${m.name}</h3><p>${k === 'none' ? (S.type === 'package' ? 'Breakfast is already included.' : 'Eat out in Mulki or order in.') : 'Home-cooked coastal meals through the day.'}</p></div><div class="opt-price">${m.rate ? inr(m.rate) + '<small>per guest / day</small>' : '—'}</div></button>`).join('')}</div>` : ''}
      <h3 style="margin-top:1.5rem">On the river</h3><div class="option-list">
        <button type="button" class="option-row" role="checkbox" aria-checked="${S.kayakDay}" data-toggle="kayakDay"><img src="assets/img/kayak-river.jpg" alt="Kayaks on the Shambhavi river" loading="lazy"><div><h3>Day kayaking</h3><p>Through the mangroves. Timing follows the tide.</p></div><div class="opt-price">${inr(PRICES.kayakDay)}<small>per guest</small></div></button>
        <button type="button" class="option-row" role="checkbox" aria-checked="${S.kayakNight}" data-toggle="kayakNight"><img src="assets/img/river-dusk.jpg" alt="The river at dusk" loading="lazy"><div><h3>Night kayaking</h3><p>See the river glow in bioluminescence season.</p></div><div class="opt-price">${inr(PRICES.kayakNight)}<small>per guest</small></div></button>
      </div>`;
    }
    if (step === 'review') {
      if (S.sent) {
        h = `<div class="sent"><h2>Almost done</h2><p>Your request is ready. Tap below to send it to us on WhatsApp. We'll reply to confirm availability and the final price.</p><pre>${esc(message())}</pre><a class="btn btn-primary" href="${SB.WA(message())}" target="_blank" rel="noopener">Open WhatsApp</a> <button class="btn btn-secondary" type="button" data-edit>Edit request</button><p class="small muted" style="margin-top:1rem">WhatsApp didn't open? Call or message ${SB.PHONE_LABEL}.</p></div>`;
      } else {
        h = `<h2>Your details</h2><p class="muted">We use these only to reply to your request.</p>
        <form novalidate data-form>
          <div class="field" id="f-name"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required value="${esc(S.name)}"><span class="err">Please add your name.</span></div>
          <div class="field" id="f-phone"><label for="phone">WhatsApp number</label><input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="98xxxxxxxx" required value="${esc(S.phone)}"><span class="err">Enter a 10-digit Indian mobile number.</span></div>
          <div class="field"><label for="note">Anything we should know? <span class="muted">(optional)</span></label><textarea id="note" name="note" rows="3" placeholder="Arrival time, surf experience, dietary needs…">${esc(S.note)}</textarea></div>
        </form>
        <p class="small muted">Nothing is charged online. Prices and availability are confirmed on WhatsApp.</p>`;
      }
    }
    const steps = stepsFor(); const idx = steps.findIndex(([k]) => k === step);
    h += `<div class="step-actions">${idx > 0 && !S.sent ? '<button type="button" class="btn btn-secondary" data-back>Back</button>' : ''}</div>`;
    panel.innerHTML = h;
  };

  const message = () => {
    const L = lines().filter(([, v]) => v > 0);
    const dates = S.type === 'stay' ? `${fmt(S.checkin)} → ${fmt(S.checkout)}` : S.type === 'package' ? `${fmt(S.checkin)} → ${fmt(addDays(S.checkin, PRICES.pkg[S.pkg].nights))}` : `from ${fmt(S.checkin)}`;
    return [
      'Hi Mulki Surf Brothers! Booking request:',
      `• ${S.type === 'package' ? PRICES.pkg[S.pkg].name : TYPES[S.type].name}`,
      `• Guests: ${S.guests}`,
      `• Dates: ${dates}`,
      ...L.map(([k, v]) => `• ${k}: ${inr(v)}`),
      `• Estimated total: ${inr(total())}`,
      `Name: ${S.name.trim()}`,
      `Phone: ${S.phone.trim()}`,
      S.note.trim() ? `Note: ${S.note.trim()}` : '',
    ].filter(Boolean).join('\n');
  };

  // ---------- render: summary ----------
  const summaryRows = () => {
    const rows = [];
    if (S.type) rows.push(['Booking', S.type === 'package' ? PRICES.pkg[S.pkg].name : TYPES[S.type].name]);
    rows.push(['Guests', String(S.guests)]);
    if (S.checkin) {
      if (S.type === 'stay') { rows.push(['Check-in', fmt(S.checkin)]); rows.push(['Check-out', S.checkout ? fmt(S.checkout) : '—']); if (stayNights()) rows.push(['Nights', String(stayNights())]); }
      else if (S.type === 'package') { rows.push(['Check-in', fmt(S.checkin)]); rows.push(['Check-out', fmt(addDays(S.checkin, PRICES.pkg[S.pkg].nights))]); }
      else rows.push(['First session', fmt(S.checkin)]);
    }
    return rows;
  };
  const dl = (rows) => `<dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
  const renderSummary = () => {
    const L = lines();
    const body = S.type ? `${dl(summaryRows())}${L.length ? `<div class="lines">${dl(L.map(([k, v]) => [k, v ? inr(v) : 'Included']))}</div>` : ''}` : '<p class="empty">Your choices will show up here.</p>';
    const btnDisabled = (!valid(step) && step !== 'review') || S.sent;
    summaryEl.innerHTML = `<h2>Your trip</h2>${body}<div class="total"><span>Total<small>estimate, confirmed on WhatsApp</small></span><span>${inr(total())}</span></div><button class="btn btn-primary" type="button" data-next ${btnDisabled ? 'aria-disabled="true"' : ''}>${nextLabel()}</button>${S.type === 'package' ? '<p class="note">Breakfast included every day.</p>' : ''}`;
    bar.querySelector('.tot b').textContent = inr(total());
    bar.querySelector('.breakdown').innerHTML = `${dl(summaryRows())}${L.length ? `<div style="border-top:1px solid var(--sb-line);margin-top:.6rem;padding-top:.6rem">${dl(L.map(([k, v]) => [k, v ? inr(v) : 'Included']))}</div>` : ''}`;
    const mb = bar.querySelector('[data-next]'); mb.textContent = S.sent ? 'Request ready' : nextLabel();
    if (btnDisabled) mb.setAttribute('aria-disabled', 'true'); else mb.removeAttribute('aria-disabled');
  };

  const render = (focus) => {
    renderStepper(); renderPanel(); renderSummary(); syncURL();
    if (focus) { const h2 = panel.querySelector('h2'); if (h2) { h2.setAttribute('tabindex', '-1'); h2.focus({ preventScroll: true }); } window.scrollTo({ top: Math.max(0, stepperEl.getBoundingClientRect().top + scrollY - 90), behavior: 'smooth' }); }
  };

  const go = (k) => { step = k; render(true); };
  const next = () => {
    if (step === 'review') { submit(); return; }
    if (!valid(step)) return;
    const steps = stepsFor(); const i = steps.findIndex(([k]) => k === step);
    if (i < steps.length - 1) go(steps[i + 1][0]);
  };
  const back = () => { const steps = stepsFor(); const i = steps.findIndex(([k]) => k === step); if (i > 0) go(steps[i - 1][0]); };

  const phoneOK = () => /^[6-9]\d{9}$/.test(S.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''));
  const submit = () => {
    const form = panel.querySelector('[data-form]'); if (!form) return;
    S.name = form.name.value; S.phone = form.phone.value; S.note = form.note.value;
    const okName = S.name.trim().length > 1; const okPhone = phoneOK();
    document.getElementById('f-name').classList.toggle('invalid', !okName);
    document.getElementById('f-phone').classList.toggle('invalid', !okPhone);
    if (!okName) { form.name.focus(); return; }
    if (!okPhone) { form.phone.focus(); return; }
    const missing = firstInvalid(); if (missing && missing[0] !== 'review') { go(missing[0]); return; }
    S.sent = true; render(true);
  };

  // ---------- events ----------
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a'); if (!t) return;
    if (t.matches('[data-next]')) { if (t.getAttribute('aria-disabled') === 'true') return; next(); return; }
    if (t.matches('[data-back]')) { back(); return; }
    if (t.matches('[data-edit]')) { S.sent = false; render(true); return; }
    if (t.dataset.step) { go(t.dataset.step); return; }
    if (t.dataset.type) {
      if (S.type !== t.dataset.type) { S.type = t.dataset.type; S.room = S.type === 'package' ? PRICES.pkg[S.pkg].room : null; S.checkout = null; if (S.type !== 'surf') S.program = null; if (S.type === 'surf') { S.meals = 'none'; } }
      render(); return;
    }
    if (t.dataset.pkg) { S.pkg = Number(t.dataset.pkg); S.room = PRICES.pkg[S.pkg].room; render(); return; }
    if (t.dataset.program) { S.program = t.dataset.program; S.sessions = 1; render(); return; }
    if (t.dataset.sess) { S.sessions = Math.min(10, Math.max(1, S.sessions + Number(t.dataset.sess))); render(); return; }
    if (t.dataset.g) { S.guests = Math.min(12, Math.max(1, S.guests + Number(t.dataset.g))); render(); return; }
    if (t.dataset.cal) { calStart = new Date(calStart.getFullYear(), calStart.getMonth() + Number(t.dataset.cal), 1); render(); return; }
    if (t.dataset.date) {
      const d = parseISO(t.dataset.date);
      if (S.type === 'stay') {
        if (!S.checkin || S.checkout || d <= S.checkin) { S.checkin = d; S.checkout = null; } else { S.checkout = d; }
      } else { S.checkin = d; }
      render(); return;
    }
    if (t.dataset.room) { S.room = t.dataset.room; render(); return; }
    if (t.dataset.meals) { S.meals = t.dataset.meals; render(); return; }
    if (t.dataset.toggle) { S[t.dataset.toggle] = !S[t.dataset.toggle]; render(); return; }
  });
  document.addEventListener('input', (e) => {
    if (!e.target.closest('[data-form]')) return;
    S[e.target.name] = e.target.value; renderSummary();
    e.target.closest('.field') && e.target.closest('.field').classList.remove('invalid');
  });
  document.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  bar.querySelector('.tot').addEventListener('click', (e) => { const o = bar.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', String(o)); });

  render();
}
