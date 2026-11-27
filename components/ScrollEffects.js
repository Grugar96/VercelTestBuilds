'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Text inside these keeps its own motion (heroes) or re-renders often (booking, map, gallery filters).
const SKIP = '.hero, .page-hero, .booking-flow, form, .mulki-map, .map-section, .gallery-grid, .scatter, .kit, .wa-float, [data-noanim]';
const HEADS = 'h1, h2';
const TEXT = 'h3, .label, .lead, .section-head p, .band p, .booking-band p, .card p, .card .price, .ticks li, .faq summary, .hand, .stat, .proof div, .price-from, .fineprint, blockquote, .muted';

function countUp(el) {
  const m = el.textContent.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m || /:/.test(m[3])) return;
  const [, pre, num, post] = m;
  const end = parseFloat(num.replace(/,/g, ''));
  const dec = (num.split('.')[1] || '').length;
  const comma = num.includes(',');
  const fmt = (v) => pre + (comma ? Math.round(v).toLocaleString('en-IN') : v.toFixed(dec)) + post;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1200);
    el.textContent = fmt(end * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step); else el.textContent = pre + num + post;
  };
  requestAnimationFrame(step);
}

// Scroll reveals, text animation, draw-on-scroll lines, and hiding the floating WhatsApp button over booking bands.
export default function ScrollEffects() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add('js');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const main = document.getElementById('main');
    const ok = (el) => !el.closest(SKIP) && !el.classList.contains('ta') && !el.classList.contains('ta-h');
    if (main && !reduce) {
      main.querySelectorAll(HEADS).forEach((el) => ok(el) && el.classList.add('ta-h'));
      main.querySelectorAll(TEXT).forEach((el) => {
        if (!ok(el) || el.closest('.ta')) return; // animate the outer block only
        el.classList.add('ta');
      });
      main.querySelectorAll('.proof b').forEach((el) => el.setAttribute('data-count', ''));
    }
    const els = document.querySelectorAll('.reveal:not(.in), .draw:not(.drawn), .ta:not(.in)');
    // Clipped headings have no visible area, so watch their parent block instead.
    const heads = [...document.querySelectorAll('.ta-h:not(.in)')];
    let io, ho;
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        let i = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          if (el.matches('.ta')) el.style.setProperty('--d', `${Math.min(i++ * 0.08, 0.48)}s`);
          el.classList.add('in', 'drawn');
          el.querySelectorAll('[data-count]').forEach((n) => { n.removeAttribute('data-count'); countUp(n); });
          io.unobserve(el);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
      els.forEach((el) => io.observe(el));
      const byParent = new Map();
      heads.forEach((h) => { const box = h.parentElement; if (!byParent.has(box)) byParent.set(box, []); byParent.get(box).push(h); });
      ho = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (byParent.get(e.target) || []).forEach((h) => h.classList.add('in'));
          ho.unobserve(e.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
      byParent.forEach((_, box) => ho.observe(box));
    } else { els.forEach((el) => el.classList.add('in', 'drawn')); heads.forEach((h) => h.classList.add('in')); }

    const wa = document.querySelector('.wa-float');
    const band = document.querySelector('.booking-band');
    let bo;
    if (wa) {
      wa.classList.toggle('on-book', pathname === '/book');
      wa.classList.remove('hide');
      if (band && 'IntersectionObserver' in window) {
        bo = new IntersectionObserver(([e]) => wa.classList.toggle('hide', e.isIntersecting), { threshold: 0.3 });
        bo.observe(band);
      }
    }
    return () => { io?.disconnect(); ho?.disconnect(); bo?.disconnect(); };
  }, [pathname]);
  return null;
}
