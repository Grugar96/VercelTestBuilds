'use client';
import { useEffect, useRef, useState } from 'react';

const PAUSE = <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>;
const PLAY = <svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" /></svg>;

// Muted looping video with a pause button and an optional ride line that follows the tracked surfer (like a GPS trail on the wave).
export default function AutoVideo({ src, poster, label, track = null, preload = 'none', children }) {
  const ref = useRef(null);
  const pathRef = useRef(null);
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
    if (track && pathRef.current) {
      const path = pathRef.current; const g = gRef.current;
      const chaikin = (pts, n = 3) => {
        let p = pts;
        for (let k = 0; k < n; k++) {
          const q = [p[0]];
          for (let i = 0; i < p.length - 1; i++) {
            const [x0, y0] = p[i]; const [x1, y1] = p[i + 1];
            q.push([x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25], [x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75]);
          }
          q.push(p[p.length - 1]); p = q;
        }
        return p;
      };
      const draw = (t) => {
        const f = Math.round(t * track.fps);
        const r = track.rides.find((x) => f >= x.start && f < x.start + x.world.length);
        if (!r) { g.style.opacity = '0'; return; }
        const k = f - r.start; const [cx, cy] = r.cam[k];
        const upto = Math.min(r.world.length, k + track.lead + 1);
        const pts = [...r.pre, ...r.world.slice(0, upto)].filter((_, i, a) => i % 2 === 0 || i === a.length - 1).map(([x, y]) => [x - cx, y - cy]);
        const sm = chaikin(pts);
        path.setAttribute('d', 'M' + sm.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L'));
        const fadeIn = Math.min(1, k / 8); const fadeOut = Math.min(1, (r.world.length - 1 - k) / 10);
        g.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)));
      };
      const tick = () => { draw(v.currentTime || 0); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    return () => { v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause); if (raf) cancelAnimationFrame(raf); };
  }, [track]);

  return (
    <>
      <video ref={ref} muted loop playsInline preload={preload} poster={poster} aria-label={label}>
        <source src={src} type="video/mp4" />
      </video>
      {track && (
        <svg className="ride-line" viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g ref={gRef} style={{ opacity: 0 }}><path ref={pathRef} d="M0 0" /></g>
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
