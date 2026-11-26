'use client';
import { useEffect, useRef, useState } from 'react';

const PAUSE = <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>;
const PLAY = <svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" /></svg>;

// Muted looping video with a pause button and an optional "ride line" that draws in step with the clip.
export default function AutoVideo({ src, poster, label, ride = false, preload = 'none', children }) {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const gRef = useRef(null);
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
      const path = pathRef.current; const dot = dotRef.current; const ring = ringRef.current; const g = gRef.current;
      const lerpKeys = (keys, t) => {
        if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
        for (let k = 1; k < keys.length; k++) if (t <= keys[k][0]) {
          const [t0, x0, y0] = keys[k - 1]; const [t1, x1, y1] = keys[k]; const f = (t - t0) / (t1 - t0);
          return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
        }
        const l = keys[keys.length - 1]; return [l[1], l[2]];
      };
      const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
      const draw = (t) => {
        const seg = ride.find((s) => t >= s.start && t <= s.end);
        if (!seg) { g.style.opacity = '0'; return; }
        const [hx, hy] = lerpKeys(seg.keys, t);
        const [fx, fy] = seg.from; const [c1x, c1y] = seg.c1; const [c2x, c2y] = seg.c2;
        path.setAttribute('d', `M${fx} ${fy} C${c1x} ${c1y} ${c2x} ${c2y} ${hx} ${hy}`);
        const p = reduce ? 1 : ease((t - seg.start) / 1.1);
        path.style.strokeDashoffset = String(1 - p);
        const len = path.getTotalLength(); const pt = path.getPointAtLength(len * p);
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); ring.setAttribute('cx', pt.x); ring.setAttribute('cy', pt.y);
        const fadeIn = Math.min(1, (t - seg.start) / 0.25); const fadeOut = Math.min(1, (seg.end - t) / 0.35);
        g.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)));
      };
      const tick = () => { draw(v.currentTime || 0); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    return () => { v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause); if (raf) cancelAnimationFrame(raf); };
  }, [ride]);

  return (
    <>
      <video ref={ref} muted loop playsInline preload={preload} poster={poster} aria-label={label}>
        <source src={src} type="video/mp4" />
      </video>
      {ride && (
        <svg className="ride-line" viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="rideFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#CFDE58" stopOpacity="0" />
              <stop offset=".45" stopColor="#CFDE58" stopOpacity=".55" />
              <stop offset="1" stopColor="#CFDE58" stopOpacity="1" />
            </linearGradient>
          </defs>
          <g ref={gRef} style={{ opacity: 0 }}>
            <path ref={pathRef} pathLength="1" d="M0 0" />
            <circle ref={ringRef} className="ring" r="16" cx="0" cy="0" />
            <circle ref={dotRef} r="7" cx="0" cy="0" />
          </g>
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
