'use client';
import Wavy from './Wavy';
import { useEffect, useRef, useState } from 'react';
import { DoodleSvg } from './Doodle';
import { WarliSurfer } from './kit/Warli';
import { PROOF } from '@/lib/site';

// Dawn-Patrol-style number cards. Digits roll like an odometer; on the video card the ring fills once
// per ride and the count steps up by one each time it closes. Numbers are placeholders until confirmed.
function useInView(ref, threshold = 0.45) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [ref, threshold]);
  return seen;
}

// Odometer: each digit is a 0–9 column that slides to its value. Non-digits render as-is.
export function Roll({ value, run = true, stagger = 90, className = '' }) {
  const chars = String(value).split('');
  return (
    <b className={`roll ${className}`} aria-label={String(value)}>
      {chars.map((ch, i) => /\d/.test(ch) ? (
        <span className="roll-col" key={i} aria-hidden="true">
          <span className="roll-strip" style={{ transform: `translateY(-${run ? Number(ch) * 10 : 0}%)`, transitionDelay: `${i * stagger}ms` }}>
            {'0123456789'.split('').map((d) => <span key={d}>{d}</span>)}
          </span>
        </span>
      ) : <span className="roll-ch" key={i} aria-hidden="true">{ch}</span>)}
    </b>
  );
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

const START = 988, END = 1000, RIDE = 1600;

function Card({ className, children }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return <article ref={ref} className={`stat-card ${className}${seen ? ' in' : ''}`}>{children(seen)}</article>;
}

function CountCard({ label }) {
  const ref = useRef(null);
  const run = useInView(ref);
  const [n, setN] = useState(START);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(END); return; }
    const t = setInterval(() => setN((v) => { if (v + 1 >= END) clearInterval(t); return Math.min(END, v + 1); }), RIDE);
    return () => clearInterval(t);
  }, [run]);
  const done = n >= END;
  return (
    <article ref={ref} className={`stat-card sc-count${run ? ' go' : ''}${done ? ' done' : ''}`} style={{ '--ride': `${RIDE}ms` }}>
      <Clip src="/video/hero-surf.mp4" poster="/img/hero-poster.jpg" label="Students riding waves in Mulki" />
      <div className="sc-over">
        <b className="sc-num" aria-label={`${END}+ ${label}`}>
          <Roll value={n} stagger={0} />{done && <span className="roll-ch" aria-hidden="true">+</span>}
        </b>
        <div className="sc-ring" aria-hidden="true">
          <svg viewBox="0 0 100 100"><circle className="sc-track" cx="50" cy="50" r="46" /><circle key={n} className="sc-fill" cx="50" cy="50" r="46" pathLength="100" /></svg>
          <div className="sc-rider"><WarliSurfer tone="dark" variant="woman" size={120} noWater title="" /></div>
        </div>
        <span>{label}</span>
      </div>
    </article>
  );
}

export default function StatCards() {
  const [rating, students, ratio] = [PROOF[0], PROOF[1], PROOF[3]];
  return (
    <section className="stat-cards" aria-label="Surf Brothers in numbers">
      <div className="wrap stat-grid">
        <Card className="sc-warm">{(on) => (<>
          <DoodleSvg name="wave" className="doodle sc-icon" />
          <Roll value={rating.value} run={on} /><span>{rating.label}</span>
        </>)}</Card>
        <Card className="sc-video">{() => (<>
          <Clip src="/video/beach-drill.mp4" poster="/img/drill-poster.jpg" label="Pop-up drills on the sand" />
          <Wavy className="sc-tag hand">pop-up drills</Wavy>
        </>)}</Card>
        <Card className="sc-light">{(on) => (<>
          <DoodleSvg name="group" className="doodle sc-icon" />
          <Roll value={ratio.value} run={on} /><span>Max students per ISA-certified coach</span>
        </>)}</Card>
        <CountCard label={students.label} />
      </div>
    </section>
  );
}
