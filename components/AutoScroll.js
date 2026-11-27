'use client';
import { useEffect, useRef } from 'react';

// Horizontal row that drifts on its own on phones (or whenever it overflows), pauses while
// someone touches it, and loops back to the start. People can still swipe it themselves.
export default function AutoScroll({ children, className = '', speed = 0.35, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf, pausedUntil = 0, visible = false, pos = el.scrollLeft;
    const pause = (ms = 3500) => { pausedUntil = performance.now() + ms; };
    const onUser = () => { pause(); pos = el.scrollLeft; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.2 });
    io.observe(el);
    const tick = (t) => {
      const max = el.scrollWidth - el.clientWidth;
      if (visible && max > 4 && t > pausedUntil) {
        pos += speed;
        if (pos >= max) { pos = 0; el.scrollTo({ left: 0, behavior: 'smooth' }); pause(1600); }
        else el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    el.addEventListener('pointerdown', onUser); el.addEventListener('touchstart', onUser, { passive: true }); el.addEventListener('wheel', onUser, { passive: true });
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener('pointerdown', onUser); el.removeEventListener('touchstart', onUser); el.removeEventListener('wheel', onUser); };
  }, [speed]);
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
