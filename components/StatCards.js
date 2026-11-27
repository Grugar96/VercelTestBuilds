'use client';
import Wavy from './Wavy';
import { useEffect, useRef, useState } from 'react';
import { DoodleSvg } from './Doodle';
import { WarliSurfer } from './kit/Warli';
import { PROOF } from '@/lib/site';

// Dawn-Patrol-style number cards: colour, video, light, and a video card where a Warli surfer
// rides across while the student count climbs. Numbers are placeholders until confirmed (see lib/site.js).
function useInView(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, [ref]);
  return seen;
}

function Count({ to, run, suffix = '' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return; }
    let raf; const t0 = performance.now(); const dur = 2600;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); setN(Math.round(to * (1 - Math.pow(1 - k, 2.2)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{n.toLocaleString('en-IN')}{suffix}</>;
}

function Clip({ src, poster, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { v.muted = true; v.play().catch(() => {}); } else v.pause(); }, { threshold: 0.2 });
    io.observe(v); return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />;
}

export default function StatCards() {
  const ref = useRef(null);
  const run = useInView(ref);
  const [rating, students, ratio] = [PROOF[0], PROOF[1], PROOF[3]];
  return (
    <section className="stat-cards" aria-label="Surf Brothers in numbers" ref={ref}>
      <div className="wrap stat-grid">
        <article className="stat-card sc-lime">
          <DoodleSvg name="wave" className="doodle sc-icon" />
          <b>{rating.value}</b><span>{rating.label}</span>
        </article>
        <article className="stat-card sc-video">
          <Clip src="/video/beach-drill.mp4" poster="/img/drill-poster.jpg" label="Pop-up drills on the sand" />
          <Wavy className="sc-tag hand">pop-up drills</Wavy>
        </article>
        <article className="stat-card sc-light">
          <DoodleSvg name="smile" className="doodle sc-icon" />
          <b>{ratio.value}</b><span>Max students per ISA-certified coach</span>
        </article>
        <article className={`stat-card sc-count${run ? ' go' : ''}`}>
          <Clip src="/video/hero-surf.mp4" poster="/img/hero-poster.jpg" label="Students riding waves in Mulki" />
          <div className="sc-over">
            <b><Count to={1000} run={run} suffix="+" /></b><span>{students.label}</span>
          </div>
          <div className="sc-rider"><WarliSurfer tone="dark" variant="woman" size={120} title="" /></div>
        </article>
      </div>
    </section>
  );
}
