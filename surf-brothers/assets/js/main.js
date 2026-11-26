/* Mulki Surf Brothers — shared site script (header, footer, waves, doodles, motion) */
{
  const PHONE = '919972158288';
  const PHONE_LABEL = '+91 99721 58288';
  const WA = (text) => `https://wa.me/${PHONE}${text ? '?text=' + encodeURIComponent(text) : ''}`;
  window.SB = { PHONE, PHONE_LABEL, WA };
  document.documentElement.classList.add('js');

  const page = document.body.dataset.page || '';
  const navItems = [
    ['surf-lessons', 'Surf lessons', 'surf-lessons.html'],
    ['stay', 'Stay', 'stay.html'],
    ['packages', 'Packages', 'packages.html'],
    ['about', 'About', 'about.html'],
    ['gallery', 'Gallery', 'gallery.html'],
    ['contact', 'Contact', 'contact.html'],
  ];
  const navLinks = navItems.map(([k, l, h]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${l}</a>`).join('');

  const header = document.querySelector('[data-header]');
  if (header) {
    header.outerHTML = `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Mulki Surf Brothers home"><img src="assets/img/logo.png" alt="Mulki Surf Brothers logo" width="52" height="52"></a>
    <nav class="nav" aria-label="Main">${navLinks}</nav>
    <a class="btn btn-primary header-cta" href="book.html">Book</a>
    <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 7c6-1.5 12 1.5 18 0M3 12h18M3 17c6 1.5 12-1.5 18 0"/></svg>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="close" type="button" aria-label="Close menu">×</button>
  <nav aria-label="Mobile">${navLinks}<a href="index.html">Home</a></nav>
  <a class="btn btn-primary" href="book.html">Plan your stay</a>
</div>`;
  }

  const footer = document.querySelector('[data-footer]');
  if (footer) {
    footer.outerHTML = `
<footer class="site-footer">
  <svg class="wave wave-top" style="color:var(--sb-charcoal)" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" data-wave="2"></svg>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <img class="footer-logo" src="assets/img/logo.png" alt="Mulki Surf Brothers logo" width="96" height="96" loading="lazy">
        <p class="small" style="color:rgba(245,243,236,.75)">Surf lessons, riverside stays and good people in Mulki, Karnataka.</p>
      </div>
      <div>
        <h4>Visit</h4>
        <ul class="small">
          <li>Mulki Surf Brothers<br>Bappanadu, Mulki<br>Karnataka 574154</li>
        </ul>
      </div>
      <div>
        <h4>Talk to us</h4>
        <ul class="small">
          <li><a href="${WA('Hi Mulki Surf Brothers!')}">WhatsApp ${PHONE_LABEL}</a></li>
          <li><a href="tel:+${PHONE}">Call ${PHONE_LABEL}</a></li>
          <li><a href="https://www.instagram.com/surfbrothersmulki/">Instagram</a></li>
        </ul>
      </div>
      <div>
        <h4>Explore</h4>
        <ul class="small">${navItems.map(([, l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Mulki Surf Brothers</span>
      <span>Surf. Stay. Connect.</span>
    </div>
  </div>
</footer>
<a class="wa-float${page === 'book' ? ' on-book' : ''}" href="${WA('Hi Mulki Surf Brothers! I have a question.')}" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2s10.5 4.6 10.5 10.4S21.8 26 16 26zm5.8-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1s0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg>
</a>`;
  }

  // Header scroll state + mobile menu
  const hdr = document.querySelector('.site-header');
  const onScroll = () => hdr && hdr.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const menu = document.getElementById('mobile-menu');
  const menuBtn = document.querySelector('.menu-btn');
  if (menu && menuBtn) {
    const setMenu = (open) => {
      menu.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) menu.querySelector('.close').focus(); else menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(true));
    menu.querySelector('.close').addEventListener('click', () => setMenu(false));
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  // Wavy edges: three shapes used in rotation
  const WAVES = [
    'M0 40V20C90 6 180 4 270 14s180 26 270 18 180-30 270-28 180 24 270 26 180-14 270-22 90-2 90-2V40z',
    'M0 40V24C120 8 200 2 320 12s200 28 320 22 200-34 320-30 200 22 300 24 160-12 180-14V40z',
    'M0 40V16c80 10 160 22 260 18S440 6 540 8s180 26 300 26 200-24 300-26 200 14 300 18V40z',
  ];
  document.querySelectorAll('svg[data-wave]').forEach((s, i) => {
    const n = Number(s.dataset.wave || i) % 3;
    s.innerHTML = `<path d="${WAVES[n]}"/>`;
  });

  // Hand-drawn doodle icons (one stroke style)
  const D = {
    wave: '<path d="M4 28c4-5 8-5 11 0s8 5 11 0 8-5 11 0 6 4 7 3"/><path d="M6 36c4-3 7-3 10 0s7 3 10 0 7-3 10 0"/>',
    board: '<path d="M13 43c-4-3 1-21 11-32 4-4 9-7 10-6 2 1-1 6-4 10-9 11-12 31-17 28z"/><path d="M18 35l5 3"/><path d="M22 26c3-6 6-10 9-13"/>',
    sun: '<circle cx="24" cy="24" r="8.5"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4 4M33.5 33.5l4 4M37.5 10.5l-4 4M14.5 33.5l-4 4"/>',
    kayak: '<path d="M3 30c9 6 33 6 42 0-9-5-33-5-42 0z"/><path d="M11 13l26 29"/><path d="M8 9c2 0 5 3 5 5-2 0-5-3-5-5zM40 46c-2 0-5-3-5-5 2 0 5 3 5 5z"/>',
    palm: '<path d="M25 45c0-9 2-17-1-27"/><path d="M24 18c-5-6-12-6-17-2 6-1 11 1 13 5"/><path d="M24 18c4-7 12-8 17-4-6 0-11 2-13 6"/><path d="M24 18c-2-6-1-11 3-14 0 5 0 9-1 13"/><path d="M16 45h18"/>',
    fire: '<path d="M24 38c-7 0-10-5-9-10 1-5 5-6 6-12 5 4 9 9 9 13 2-1 2-4 2-6 3 3 4 8 2 11s-5 4-10 4z"/><path d="M10 43l28-5M10 38l28 5"/>',
    smile: '<path d="M24 5c11 0 19 8 19 19s-8 19-19 19S5 35 5 24 13 5 24 5z"/><path d="M17 19v3M31 19v3"/><path d="M15 29c4 6 14 6 18 0"/>',
    pin: '<path d="M24 44S11 31 11 20a13 13 0 0 1 26 0c0 11-13 24-13 24z"/><circle cx="24" cy="20" r="4.5"/>',
    cup: '<path d="M11 19h21v11a8 8 0 0 1-8 8h-5a8 8 0 0 1-8-8z"/><path d="M32 22h3a4 4 0 0 1 0 8h-3"/><path d="M17 8c-2 3 2 4 0 7M24 7c-2 3 2 4 0 7"/>',
    sparkle: '<path d="M18 6c1 8 3 10 11 11-8 1-10 3-11 11-1-8-3-10-11-11 8-1 10-3 11-11z"/><path d="M36 26c.6 4 1.6 5 5.6 5.6-4 .6-5 1.6-5.6 5.6-.6-4-1.6-5-5.6-5.6 4-.6 5-1.6 5.6-5.6z"/>',
    fish: '<path d="M5 24c8-10 22-10 30 0-8 10-22 10-30 0z"/><path d="M35 24l8-6v12z"/><circle cx="14" cy="22" r="1"/>',
    arrow: '<path d="M6 30c10-14 24-18 34-12"/><path d="M33 13l7 5-6 7"/>',
  };
  document.querySelectorAll('[data-doodle]').forEach((el) => {
    const k = el.dataset.doodle;
    el.innerHTML = `<svg class="doodle" viewBox="0 0 48 48" aria-hidden="true">${D[k] || ''}</svg>`;
  });

  // Reveal + draw-on-scroll
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in', 'drawn'); io.unobserve(e.target); } });
  }, { threshold: 0.2 }) : null;
  document.querySelectorAll('.reveal, .draw').forEach((el) => { if (io && !reduce) io.observe(el); else el.classList.add('in', 'drawn'); });

  // Video play/pause toggles + save-data handling
  const saveData = navigator.connection && navigator.connection.saveData;
  const PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  const PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg>';
  document.querySelectorAll('video[data-autoplay]').forEach((v) => {
    const btn = v.parentElement.querySelector('.video-toggle');
    const sync = () => { if (btn) { btn.innerHTML = v.paused ? PLAY : PAUSE; btn.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video'); } };
    if (!reduce && !saveData) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();
    if (btn) btn.addEventListener('click', () => { if (v.paused) v.play(); else v.pause(); });
  });

  // Ride line: draws in step with the hero clip
  const ride = document.querySelector('.ride-line');
  const heroVid = document.querySelector('.hero video');
  if (ride && heroVid) {
    const path = ride.querySelector('path'); const dot = ride.querySelector('circle');
    const len = path.getTotalLength();
    const tick = () => {
      const d = heroVid.duration || 8.5; const t = (heroVid.currentTime % d) / d;
      const p = Math.min(1, t * 1.15);
      path.style.strokeDashoffset = String(1 - p);
      const pt = path.getPointAtLength(len * p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      requestAnimationFrame(tick);
    };
    if (reduce) { path.style.strokeDashoffset = '0'; const pt = path.getPointAtLength(len); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); }
    else requestAnimationFrame(tick);
  }

  // Hide floating WhatsApp while a booking band is visible
  const wa = document.querySelector('.wa-float');
  const band = document.querySelector('.booking-band');
  if (wa && band && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => wa.classList.toggle('hide', e.isIntersecting), { threshold: 0.3 }).observe(band);
  }

  // Booking band WhatsApp links
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = WA(a.dataset.wa); });
  document.querySelectorAll('[data-phone]').forEach((a) => { a.href = `tel:+${PHONE}`; a.textContent = PHONE_LABEL; });

  // Interactive map
  const map = document.querySelector('[data-map]');
  if (map) {
    const spots = JSON.parse(document.getElementById('map-data').textContent);
    const card = document.querySelector('.map-card');
    const chips = document.querySelector('.map-chips');
    chips.innerHTML = spots.map((s, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}">${s.name}</button>`).join('');
    const show = (i) => {
      const s = spots[i];
      card.querySelector('img').src = s.img; card.querySelector('img').alt = s.alt;
      card.querySelector('h3').textContent = s.name; card.querySelector('p').textContent = s.text;
      map.querySelectorAll('.pin').forEach((p) => p.classList.toggle('active', Number(p.dataset.i) === i));
      chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)));
    };
    map.querySelectorAll('.pin').forEach((p) => {
      p.addEventListener('click', () => show(Number(p.dataset.i)));
      p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(Number(p.dataset.i)); } });
    });
    chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(Number(b.dataset.i)); });
    show(0);
  }

  // Gallery filter
  const gf = document.querySelector('.gallery-filter');
  if (gf) {
    gf.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      gf.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.f;
      document.querySelectorAll('.gallery-grid figure').forEach((fig) => { fig.hidden = f !== 'all' && fig.dataset.cat !== f; });
    });
  }
}
