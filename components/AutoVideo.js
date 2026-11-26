'use client';
import { useEffect, useRef, useState } from 'react';

const PAUSE = <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>;
const PLAY = <svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" /></svg>;

// Muted looping video with a pause button and an optional "ride line" that draws in step with the clip.
export default function AutoVideo({ src, poster, label, ride = false, preload = 'none', children }) {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const onPlay = () => setPaused(false); const onPause = () => setPaused(true);
    v.addEventListener('play', onPlay); v.addEventListener('pause', onPause);
    if (!reduce && !saveData) { v.muted = true; v.play().catch(() => {}); }

    let raf;
    if (ride && pathRef.current) {
      const path = pathRef.current; const dot = dotRef.current; const len = path.getTotalLength();
      const place = (p) => { path.style.strokeDashoffset = String(1 - p); const pt = path.getPointAtLength(len * p); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); };
      if (reduce) place(1);
      else {
        const tick = () => { const d = v.duration || 8.5; place(Math.min(1, ((v.currentTime % d) / d) * 1.15)); raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      }
    }
    return () => { v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause); if (raf) cancelAnimationFrame(raf); };
  }, [ride]);

  return (
    <>
      <video ref={ref} muted loop playsInline preload={preload} poster={poster} aria-label={label}>
        <source src={src} type="video/mp4" />
      </video>
      {ride && (
        <svg className="ride-line" viewBox="0 0 90 160" preserveAspectRatio="none" aria-hidden="true">
          <path ref={pathRef} pathLength="1" d="M-4 104 C 12 98, 24 92, 38 86 S 64 70, 94 66" />
          <circle ref={dotRef} r="2.2" cx="-4" cy="104" />
        </svg>
      )}
      {children}
      <button className="video-toggle" type="button" aria-label={paused ? 'Play video' : 'Pause video'}
        onClick={() => { const v = ref.current; if (v.paused) v.play(); else v.pause(); }}>
        {paused ? PLAY : PAUSE}
      </button>
    </>
  );
}
