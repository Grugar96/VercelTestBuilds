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

const START = 988, END = 1000;

export default function StatCards() {
  const ref = useRef(null);
  const run = useInView(ref);
  // Like the reference: the number ticks up by one each time the surfer finishes a ride across the ring.
  const [n, setN] = useState(START);
  useEffect(() => { if (run && window.matchMedia('(prefers-reduced-motion: reduce)').matches) setN(END); }, [run]);
  const onRide = (e) => { if (e.target === e.currentTarget) setN((v) => Math.min(END, v + 1)); };
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
            <b aria-label={`${END.toLocaleString('en-IN')}+`}>{n.toLocaleString('en-IN')}{n >= END ? '+' : ''}</b>
            <div className="sc-ring" aria-hidden="true"><div className="sc-rider"><div className="sc-move" onAnimationIteration={onRide}><WarliSurfer tone="dark" variant="woman" size={120} title="" /></div></div></div>
            <span>{students.label}</span>
          </div>
        </article>
      </div>
    </section>
  );
}
