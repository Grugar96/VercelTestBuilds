'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WarliSurfer } from './kit/Warli';

// Foot of the booking band: the sea rises into one big curling wave (after a hand-drawn surf poster),
// foam spilling off the lip, and a Warli surfer riding on top of the crest. The wave travels left to
// right; everything is one shape redrawn each frame so the swell is part of the flowing water.

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const cubicD = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]),
    3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]),
  ];
};
const sstep = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const f1 = (n) => n.toFixed(1);
const pt = ([x, y]) => `${f1(x)} ${f1(y)}`;

function frame(W, H, t, cx) {
  const A = H * 0.52;               // wave height
  const L = A * 0.8;                // lip reach
  const wBack = A * 1.6;
  const swell = (x) => {
    const d = x - cx;
    const g = A * Math.exp(-((d / wBack) ** 2));
    if (d <= 0) return g;
    const u = d / (1.9 * L);
    const face = u >= 1 ? 0 : A * (1 - u) ** 2.4;
    return g + (face - g) * sstep(0, 0.35 * L, d);
  };
  const sea = (x) => H * 0.8 + H * 0.035 * Math.sin((x / 520) * 2 * Math.PI - t * 0.0009) - swell(x);
  const front = (x) => H * 0.95 + H * 0.03 * Math.sin((x / 360) * 2 * Math.PI + t * 0.0012);
  const step = 8;
  const pts = (f, x0 = 0, x1 = W) => { const a = []; for (let x = x0; x < x1; x += step) a.push(`${f1(x)} ${f1(f(x))}`); a.push(`${f1(x1)} ${f1(f(x1))}`); return a; };
  const area = (f) => `M0 ${H} L${pts(f).join(' L')} L${W} ${H}Z`;

  const top = sea(cx);
  const P = (u, v) => [cx + u * L, top + v * L];
  // lip: from the back of the swell, over the crest, throwing forward and down
  const b0x = cx - 0.55 * L;
  const B0 = [b0x, sea(b0x)];
  const m = (sea(b0x + 1) - sea(b0x - 1)) / 2;
  const C1 = [b0x + 0.55 * L, B0[1] + m * 0.55 * L];
  const C2 = P(1.25, -0.5);
  const T = P(1.55, 0.52);
  const fpx = cx + 0.62 * L, Fp = [fpx, sea(fpx)];   // where the underside meets the hollow face
  const U1 = P(1.36, 0.26), U2 = P(1.0, 0.32);
  const outerD = `M${pt(B0)} C${pt(C1)} ${pt(C2)} ${pt(T)}`;
  const underD = `C${pt(U1)} ${pt(U2)} ${pt(Fp)}`;
  const faceBack = pts(sea, b0x, fpx).reverse();
  const lip = `${outerD} ${underD} L${faceBack.join(' L')}Z`;
  // the hollow under the lip, shaded deeper
  const faceUp = pts(sea, cx, fpx).reverse();
  const hollow = `M${pt(T)} ${underD} L${faceUp.join(' L')} C${pt(P(0.5, -0.12))} ${pt(P(1.2, 0.02))} ${pt(T)}Z`;
  const streaks = [0.12, 0.3, 0.48, 0.66, 0.82].map((s, k) => {
    const a = cubic(T, U1, U2, Fp, s);
    const ex = a[0] - (0.06 + 0.04 * k) * L;
    const e = [ex, Math.max(a[1] + 0.25 * L, sea(ex) - 0.04 * L)];
    return `M${pt([a[0] - 0.02 * L, a[1] + 0.05 * L])} Q${pt([a[0] - 0.02 * L, (a[1] + e[1]) / 2])} ${pt(e)}`;
  }).join(' ');
  // foam crest: a white band along the top of the lip with a bubbly lower edge
  const N = 70, outer = [], inner = [], bubbles = [];
  let crest = { y: Infinity };
  for (let i = 0; i <= N; i++) {
    const s = 0.08 + (0.92 * i) / N;
    const p = cubic(B0, C1, C2, T, s);
    const d = cubicD(B0, C1, C2, T, s); const len = Math.hypot(d[0], d[1]) || 1;
    const n = [-d[1] / len, d[0] / len];   // inward (into the water)
    const th = 0.27 * L * sstep(0.06, 0.34, s) * (1 - 0.25 * sstep(0.9, 1, s)) * (1 + 0.22 * Math.sin(s * 47 + 1.3));
    outer.push(p); inner.push([p[0] + n[0] * th, p[1] + n[1] * th]);
    if (th > 2) { bubbles.push([p[0] + n[0] * th, p[1] + n[1] * th, th * (0.13 + 0.07 * ((i * 7) % 3))]); if (i % 2) bubbles.push([p[0] + n[0] * th * 1.32, p[1] + n[1] * th * 1.32, th * 0.07]); }
    if (p[1] < crest.y) crest = { x: p[0], y: p[1], a: Math.atan2(d[1], d[0]) * 180 / Math.PI };
  }
  const foam = `M${outer.map(pt).join(' L')} L${inner.reverse().map(pt).join(' L')}Z`;
  const r = H / 220;
  const spray = [[1.62, 0.3, 3.2], [1.7, 0.45, 2.4], [1.58, 0.52, 2.6], [1.76, 0.24, 2], [1.66, 0.62, 1.8], [1.52, 0.6, 2.2], [1.82, 0.4, 1.6]]
    .map(([u, v, s]) => { const p = P(u, v); return [p[0], p[1], s * r]; });
  // white streaks on the flat water ahead of the wave
  const flat = [[2.0, 3.1, 0.02], [2.4, 3.6, 0.13], [2.1, 2.7, 0.22]].map(([a, b, dy]) => {
    const x0 = cx + a * L, x1 = cx + b * L;
    return `M${pts((x) => sea(x) + dy * L, x0, x1).join(' L')}`;
  }).join(' ');
  const line = `M${pts(sea, 0, b0x).join(' L')} M${pts(sea, cx + 1.9 * L, W).join(' L')}`;
  return { sea: area(sea), front: area(front), lip, hollow, streaks, foam, bubbles, spray, flat, line,
    sx: crest.x, sy: crest.y, slope: Math.max(-6, Math.min(24, crest.a + 12)), size: A * 1.0 };
}

export default function FlowWave({ variant = 'woman' }) {
  const box = useRef(null);
  const [dim, setDim] = useState({ W: 1440, H: 230 });
  const [f, setF] = useState(() => frame(1440, 230, 0, 1440 * 0.5));
  useEffect(() => {
    const el = box.current; if (!el) return;
    const measure = () => setDim({ W: Math.max(320, el.clientWidth), H: Math.max(120, el.clientHeight) });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const { W, H } = dim;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setF(frame(W, H, 0, W * 0.5)); return; }
    let raf, visible = true; const t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(box.current);
    const tick = (now) => {
      if (visible) {
        const t = now - t0;
        const span = W + H * 2.6;
        const dur = Math.max(9000, span / 0.085); // ~85 px a second on every screen
        setF(frame(W, H, t, -H * 1.1 + ((t % dur) / dur) * span));
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
        <defs>
          <linearGradient id="fw-hollow-g" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#185A72" />
            <stop offset="0.55" stopColor="#1F6F8B" />
            <stop offset="1" stopColor="#3B96B5" />
          </linearGradient>
        </defs>
        <path className="fw-sea" d={f.sea} />
        <path className="fw-sea" d={f.lip} />
        <path className="fw-hollow" d={f.hollow} />
        <path className="fw-streak" d={f.streaks} />
        <path className="fw-line" d={f.line} />
        <path className="fw-flat" d={f.flat} />
        <path className="fw-foam" d={f.foam} />
        {f.bubbles.map(([x, y, rr], k) => <circle key={'b' + k} className="fw-drop" cx={x} cy={y} r={rr} />)}
        {f.spray.map(([x, y, rr], k) => <circle key={'s' + k} className="fw-drop" cx={x} cy={y} r={rr} />)}
        <path className="fw-front" d={f.front} />
      </svg>
      <div className="fw-surfer" style={{ width: w, height: h, transform: `translate(${f.sx - w * 0.5}px, ${f.sy - h * 0.76}px) rotate(${f.slope}deg)` }}>
        {surfer}
      </div>
    </div>
  );
}
