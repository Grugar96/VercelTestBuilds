'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Scroll reveals, draw-on-scroll lines, and hiding the floating WhatsApp button over booking bands.
export default function ScrollEffects() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add('js');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.reveal:not(.in), .draw:not(.drawn)');
    let io;
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in', 'drawn'); io.unobserve(e.target); } });
      }, { threshold: 0.2 });
      els.forEach((el) => io.observe(el));
    } else els.forEach((el) => el.classList.add('in', 'drawn'));

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
    return () => { io?.disconnect(); bo?.disconnect(); };
  }, [pathname]);
  return null;
}
