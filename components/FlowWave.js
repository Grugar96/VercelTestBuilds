'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WarliSurfer } from './kit/Warli';

// Foot of the booking band. The lime water itself swells up into a curling wave that travels left to
// right; the white line is the water's own surface, so it runs up the back, over the lip and down again.
// A Warli surfer rides the face just ahead of the curl. Everything is one shape, redrawn each frame.

function frame(W, H, t, cx) {
  const A = H * 0.58;                 // wave height above the water line
  const L = A * 0.85;                 // lip reach
  const wBack = A * 1.7;
  // hollow face: concave drop from the crest that flattens out ahead of the wave
  const swell = (x) => {
    const d = x - cx;
    const g = A * Math.exp(-((d / wBack) ** 2));
    if (d <= 0) return g;
    const u = d / (2.1 * L);
    const face = u >= 1 ? 0 : A * (1 - u) ** 2.4;
    const k = Math.min(1, d / (0.35 * L)); const sm = k * k * (3 - 2 * k); // round the crest
    return g + (face - g) * sm;
  };
  const sea = (base, amp, len, speed, k = 0) => (x) => base + amp * Math.sin((x / len) * 2 * Math.PI + t * speed) - k * swell(x);
  const back = sea(H * 0.34, H * 0.06, 380, 0.0007, 0.3);
  const lime = sea(H * 0.7, H * 0.04, 520, -0.0009, 1);
  const flow1 = sea(H * 0.79, H * 0.03, 520, -0.0009, 0.72);
  const flow2 = sea(H * 0.87, H * 0.025, 520, -0.0009, 0.48);
  const front = sea(H * 0.95, H * 0.03, 360, 0.0012, 0);
  const step = 8;
  const pts = (f, x0 = 0, x1 = W) => { const a = []; for (let x = x0; x < x1; x += step) a.push(`${x.toFixed(1)} ${f(x).toFixed(1)}`); a.push(`${x1.toFixed(1)} ${f(x1).toFixed(1)}`); return a; };
  const area = (f) => `M0 ${H} L${pts(f).join(' L')} L${W} ${H}Z`;
  const top = lime(cx);
  const P = (u, v) => `${(cx + u * L).toFixed(1)} ${(top + v * L).toFixed(1)}`;
  // lip: grows from the back of the crest, throws forward and curls in
  const s0 = cx - 0.25 * L;
  const m = (lime(s0 + 1) - lime(s0 - 1)) / 2, kx = 0.45 * L;
  const c1 = `${(s0 + kx).toFixed(1)} ${(lime(s0) + m * kx).toFixed(1)}`;
  const outer = `M${s0.toFixed(1)} ${lime(s0).toFixed(1)} C${c1} ${P(1.1, -0.36)} ${P(1.42, 0.22)} C${P(1.55, 0.5)} ${P(1.32, 0.78)} ${P(1.12, 0.62)} C${P(1.0, 0.52)} ${P(1.08, 0.4)} ${P(1.2, 0.46)}`;
  const inner = `C${P(1.05, 0.3)} ${P(0.55, 0.0)} ${P(0, 0)}`; // underside of the lip, back to the face
  const lip = `${outer} L${P(1.12, 0.62)} ${inner}Z`;
  // inside of the tube: under the lip, above the face
  const tubeFace = pts(lime, cx, cx + 1.3 * L);
  const tube = `M${P(0, 0)} C${P(0.55, 0.0)} ${P(1.05, 0.3)} ${P(1.25, 0.6)} L${tubeFace.reverse().join(' L')}Z`;
  const line = `M${pts(lime, 0, s0).join(' L')} ` + outer.slice(outer.indexOf('C')) + ` M${pts(lime, cx + 1.3 * L, W).join(' L')}`;
  // surfer in the pocket, upright, board on the face
  const sx = cx + 0.95 * L, sy = lime(sx);
  const slope = Math.atan2(lime(sx + 6) - lime(sx - 6), 12) * 180 / Math.PI;
  const spray = [[1.5, -0.05, 3.2], [1.62, 0.12, 2.4], [1.38, -0.22, 2.2], [1.7, 0.32, 1.8], [-0.1, -0.38, 2], [0.35, -0.5, 1.6]]
    .map(([u, v, r]) => [cx + u * L, top + v * L, r * (H / 200)]);
  return { back: area(back), lime: area(lime), flow1: `M${pts(flow1).join(' L')}`, flow2: `M${pts(flow2).join(' L')}`, front: area(front), lip, tube, line, sx, sy, slope: Math.max(-8, Math.min(16, slope * 0.45)), size: A * 0.95, spray };
}

export default function FlowWave({ variant = 'woman' }) {
  const box = useRef(null);
  const [dim, setDim] = useState({ W: 1440, H: 200 });
  const [f, setF] = useState(() => frame(1440, 220, 0, 1440 * 0.55));
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
    if (reduce) { setF(frame(W, H, 0, W * 0.55)); return; }
    let raf, visible = true, t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(box.current);
    const tick = (now) => {
      if (visible) {
        const t = now - t0;
        const span = W + H * 2.6; // crest starts off-screen left and leaves off-screen right
        const dur = Math.max(9000, span / 0.085); // same speed on every screen, ~85 px a second
        const cx = -H * 1.2 + ((t % dur) / dur) * span;
        setF(frame(W, H, t, cx));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [dim]);
  const surfer = useMemo(() => <WarliSurfer tone="light" variant={variant} size={240} noWater title="" />, [variant]);
  const { W, H } = dim;
  const w = f.size, h = w * (200 / 240);
  return (
    <div className="sea-flow" ref={box} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
        <path className="fw-back" d={f.back} />
        <path className="fw-lime" d={f.lime} />
        <path className="fw-flow" d={f.flow1} />
        <path className="fw-flow f2" d={f.flow2} />
        <path className="fw-tube" d={f.tube} />
        <path className="fw-lime fw-lip" d={f.lip} />
        <path className="fw-line" d={f.line} />
        {f.spray.map(([x, y, r], k) => <circle key={k} className="fw-drop" cx={x} cy={y} r={r} />)}
        <path className="fw-front" d={f.front} />
      </svg>
      <div className="fw-surfer" style={{ width: w, height: h, transform: `translate(${f.sx - w * 0.5}px, ${f.sy - h * 0.84}px) rotate(${f.slope}deg)` }}>
        {surfer}
      </div>
    </div>
  );
}
