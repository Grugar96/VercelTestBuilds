'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WarliSurfer } from './kit/Warli';

// Foot of the booking band. The lime water itself swells up into a curling wave that travels left to
// right; the white line is the water's own surface, so it runs up the back, over the lip and down again.
// A Warli surfer rides the face just ahead of the curl. Everything is one shape, redrawn each frame.
const TRAVEL = 20000; // ms for the swell to cross the band

function frame(W, H, t, cx) {
  const A = H * 0.46;                       // swell height
  const L = A * 0.78;                       // lip size
  const wBack = A * 1.7, wFront = A * 0.62; // gentle back, steep face
  const swell = (x) => { const d = x - cx; return A * Math.exp(-((d / (d < 0 ? wBack : wFront)) ** 2)); };
  const sea = (base, amp, len, speed, k = 0) => (x) => base + amp * Math.sin((x / len) * 2 * Math.PI + t * speed) - k * swell(x);
  const back = sea(H * 0.36, H * 0.07, 380, 0.0007, 0.35);
  const lime = sea(H * 0.6, H * 0.045, 520, -0.0009, 1);
  const front = sea(H * 0.86, H * 0.04, 360, 0.0012, 0);
  const step = 8;
  const pts = (f, x0 = 0, x1 = W) => { const a = []; for (let x = x0; x <= x1; x += step) a.push(`${x.toFixed(1)} ${f(x).toFixed(1)}`); a.push(`${x1.toFixed(1)} ${f(x1).toFixed(1)}`); return a; };
  const area = (f) => `M0 ${H} L${pts(f).join(' L')} L${W} ${H}Z`;
  // the lip grows out of the crest and pitches forward
  const py = lime(cx);
  const s0 = cx - 0.15 * L;
  const lipOuter = `M${s0} ${lime(s0)} C${cx + 0.2 * L} ${py - 0.3 * L} ${cx + 0.85 * L} ${py - 0.16 * L} ${cx + 0.98 * L} ${py + 0.3 * L} C${cx + 1.04 * L} ${py + 0.58 * L} ${cx + 0.72 * L} ${py + 0.66 * L} ${cx + 0.63 * L} ${py + 0.46 * L} C${cx + 0.58 * L} ${py + 0.34 * L} ${cx + 0.7 * L} ${py + 0.3 * L} ${cx + 0.75 * L} ${py + 0.4 * L}`;
  const backToFace = pts(lime, s0, cx + 0.5 * L).reverse();
  const lipFill = `${lipOuter} L${(cx + 0.5 * L).toFixed(1)} ${lime(cx + 0.5 * L).toFixed(1)} L${backToFace.join(' L')}Z`;
  // white surface line: the lime top up to the crest, then the lip's outer edge
  const line = `M${pts(lime, 0, s0).join(' L')} ` + lipOuter.slice(lipOuter.indexOf('C')) + ` M${pts(lime, cx + 0.5 * L, W).join(' L')}`;
  // surfer low on the face, ahead of the curl, board along the water
  const sx = cx + 1.02 * L, sy = lime(sx);
  const slope = Math.atan2(lime(sx + 6) - lime(sx - 6), 12) * 180 / Math.PI;
  return { back: area(back), lime: area(lime), front: area(front), lip: lipFill, line, sx, sy, slope, size: A * 1.25 };
}

export default function FlowWave({ variant = 'woman' }) {
  const box = useRef(null);
  const [dim, setDim] = useState({ W: 1440, H: 200 });
  const [f, setF] = useState(() => frame(1440, 200, 0, 1440 * 0.62));
  useEffect(() => {
    const el = box.current; if (!el) return;
    const measure = () => setDim({ W: Math.max(320, el.clientWidth), H: Math.max(120, el.clientHeight) });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const { W, H } = dim;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setF(frame(W, H, 0, W * 0.62)); return; }
    let raf, visible = true, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(box.current);
    const tick = (now) => {
      if (visible) {
        const t = now - t0;
        const span = W + H * 1.8; // crest starts off-screen left and leaves off-screen right
        const cx = -H * 0.9 + ((t % TRAVEL) / TRAVEL) * span;
        setF(frame(W, H, t, cx));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [dim]);
  const surfer = useMemo(() => <WarliSurfer tone="dark" variant={variant} size={240} noWater title="" />, [variant]);
  const { W, H } = dim;
  const w = f.size, h = w * (200 / 240);
  return (
    <div className="sea-flow" ref={box} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
        <path className="fw-back" d={f.back} />
        <path className="fw-lime" d={f.lime} />
        <path className="fw-lime fw-lip" d={f.lip} />
        <path className="fw-line" d={f.line} />
        <path className="fw-front" d={f.front} />
      </svg>
      <div className="fw-surfer" style={{ width: w, height: h, transform: `translate(${f.sx - w * 0.5}px, ${f.sy - h * 0.86}px) rotate(${f.slope}deg)` }}>
        {surfer}
      </div>
    </div>
  );
}
