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
  const fx = cx + 1.55 * L, fy = lime(fx);            // where the lip pours back onto the face
  const F = `${fx.toFixed(1)} ${fy.toFixed(1)}`;
  const outer = `M${s0.toFixed(1)} ${lime(s0).toFixed(1)} C${c1} ${P(1.12, -0.38)} ${P(1.45, 0.12)} C${P(1.78, 0.36)} ${P(1.74, 0.66)} ${F}`;
  const under = `C${P(1.42, 0.5)} ${P(1.16, 0.12)} ${P(0.6, 0.02)} C${P(0.35, -0.01)} ${P(0.15, 0)} ${P(0, 0)}`; // underside of the lip
  const lip = `${outer} ${under}Z`;
  // inside of the curl: under the lip, above the face
  const tubeFace = pts(lime, cx, fx);
  const tube = `M${F} ${under} L${tubeFace.join(' L')}Z`;
  const innerLine = `M${P(1.3, 0.5)} C${P(1.14, 0.24)} ${P(0.75, 0.12)} ${P(0.3, 0.12)}`;
  const line = `M${pts(lime, 0, s0).join(' L')} ` + outer.slice(outer.indexOf('C')) + ` M${pts(lime, fx, W).join(' L')}`;
  // surfer in the pocket, upright, board on the face
  const sx = cx + 0.95 * L, sy = lime(sx);
  const slope = Math.atan2(lime(sx + 6) - lime(sx - 6), 12) * 180 / Math.PI;
  const spray = [[1.58, -0.12, 3], [1.72, 0.05, 2.2], [1.4, -0.3, 2], [1.78, 0.42, 2.6], [1.88, 0.5, 1.8], [1.7, 0.62, 2.2], [0.3, -0.48, 1.6]]
    .map(([u, v, r]) => [cx + u * L, top + v * L, r * (H / 200)]);
  const foam = [[-0.06, -0.02, 6], [0.04, -0.05, 5], [0.12, 0, 4.5], [-0.14, 0.02, 4], [0.2, -0.02, 3], [0.06, 0.03, 4.5]]
    .map(([u, v, r]) => [fx + u * L, fy + v * L, r * (H / 200)]);
  const curlLine = `M${P(1.36, 0.05)} C${P(1.54, 0.22)} ${P(1.56, 0.44)} ${P(1.47, 0.56)}`;
  return { back: area(back), lime: area(lime), flow1: `M${pts(flow1).join(' L')}`, flow2: `M${pts(flow2).join(' L')}`, front: area(front), lip, tube, innerLine, line, sx, sy, slope: Math.max(-8, Math.min(16, slope * 0.45)), size: A * 0.85, spray, foam, curlLine };
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
        <defs>
          <linearGradient id="fw-tube-g" x1="1" y1="0" x2="0.15" y2="1">
            <stop offset="0" stopColor="#A9BA3B" />
            <stop offset="0.6" stopColor="#BFD04B" />
            <stop offset="1" stopColor="#CFDE58" />
          </linearGradient>
        </defs>
        <path className="fw-lime" d={f.tube} />
        <path className="fw-tube" d={f.tube} />
        <path className="fw-inner" d={f.innerLine} />
        <path className="fw-lime fw-lip" d={f.lip} />
        <path className="fw-line" d={f.line} />
        <path className="fw-inner" d={f.curlLine} />
        {f.foam.map(([x, y, r], k) => <circle key={'f' + k} className="fw-drop" cx={x} cy={y} r={r} />)}
        {f.spray.map(([x, y, r], k) => <circle key={k} className="fw-drop" cx={x} cy={y} r={r} />)}
        <path className="fw-front" d={f.front} />
      </svg>
      <div className="fw-surfer" style={{ width: w, height: h, transform: `translate(${f.sx - w * 0.5}px, ${f.sy - h * 0.84}px) rotate(${f.slope}deg)` }}>
        {surfer}
      </div>
    </div>
  );
}
