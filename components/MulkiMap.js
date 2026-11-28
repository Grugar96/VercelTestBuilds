'use client';
import { useEffect, useRef, useState } from 'react';
import Wavy from './Wavy';
import { MAP_SPOTS } from '@/lib/site';
import { DOODLE_PATHS } from './Doodle';
import { Person } from './kit/Warli';

// Warli-style map of the Surf Brothers corner of Mulki. Positions come from real coordinates
// (see MAP_SPOTS in lib/site.js); shapes of the coast and river are drawn by hand around them.
const SEA = 'M0 0H166C160 30 154 60 150 92C144 160 136 230 130 300C126 360 120 420 117 470C115 495 113 510 112 520H0Z';
const SAND = 'M166 0C160 30 154 60 150 92C144 160 136 230 130 300C126 360 120 420 117 470C115 495 113 510 112 520H160C164 470 172 420 180 360C188 300 196 220 200 160C204 120 196 104 184 100L178 0Z';
const RIVER = 'M400 26C350 30 300 48 262 66C232 80 200 86 176 90L150 92L152 104C176 104 196 110 208 130C224 156 232 200 236 250C240 300 236 360 226 420C220 460 214 494 210 520H236C240 494 246 460 252 420C262 360 266 300 262 250C258 196 248 148 230 120C246 108 270 98 300 86C336 72 368 60 400 56Z';

function ripples(d, n, x0, y0, dx, dy) {
  return Array.from({ length: n }, (_, k) => <path key={k} d={`M${x0 + dx * k} ${y0 + dy * k} ${d}`} />);
}

export default function MulkiMap() {
  const [i, setI] = useState(null); // nothing open until someone taps a pin
  const [touched, setTouched] = useState(false); // hide the 'tap me' hints after the first tap
  const pick = (k) => { setI(k); setTouched(true); };
  const box = useRef(null);
  useEffect(() => {
    if (i === null) return;
    const close = (e) => { if (box.current && !box.current.querySelector('svg').contains(e.target) && !e.target.closest('.map-pop')) setI(null); };
    const esc = (e) => { if (e.key === 'Escape') setI(null); };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [i]);
  const s = MAP_SPOTS[i ?? 1]; // the side card on desktop falls back to home base
  return (
    <div className="wrap map-grid">
      <div className="map-text reveal">
        <Wavy as="p" className="label eyebrow">where everything is</Wavy>
        <h2 style={{ fontSize: 'var(--fs-h2)' }}>Everything is a short walk, paddle or jeep ride away</h2>
        <p className="muted">Tap a place on the map to see what happens there.</p>
      </div>
      <div className="map-card map-card-side" aria-live="polite" key={s.name}>
        <img src={s.img} alt={s.alt} width="120" height="100" />
        <div><h3>{s.name}</h3><p>{s.text}</p></div>
      </div>
      <div className="map-box warli-map reveal" ref={box}>
        {i !== null && <div className={`map-card map-pop ${s.y > 260 ? 'above' : 'below'}`} aria-live="polite" key={'pop' + s.name}
          style={{ '--py': `${(s.y / 520) * 100}%`, '--px': `${(s.x / 400) * 100}%` }}>
          <img src={s.img} alt="" width="84" height="72" />
          <div><h3>{s.name}</h3><p>{s.text}</p></div>
        </div>}
        <svg viewBox="0 0 400 520" role="group" aria-label="Map of the Surf Brothers area in Mulki">
          <defs>
            <filter id="map-paint" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="4" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 19" result="speck" />
              <feComposite in="SourceGraphic" in2="speck" operator="in" />
            </filter>
          </defs>
          <rect width="400" height="520" fill="#F5F3EC" />
          <g filter="url(#map-paint)">
            <path d={SEA} fill="#3B96B5" />
            <path d={SAND} fill="#D8B991" />
            <path d={RIVER} fill="#1F6F8B" />
            {/* Hejamadi sandspit on the far side of the river mouth */}
            <path d="M120 0H178C170 22 160 44 146 62C136 74 124 80 112 82C118 56 120 28 120 0Z" fill="#D8B991" />
            {/* Warli water marks: rows of small waves on the sea, ticks on the river */}
            <g className="map-ink-light" fill="none" strokeWidth="2" strokeLinecap="round">
              {[30, 80, 130, 180, 230, 280, 330, 380, 430, 480].map((y, r) => ripples('q8 -7 16 0 t16 0', 3, 8 + (r % 2) * 14, y, 40, 0))}
              {ripples('l6 -6', 7, 222, 180, 2, 40)}
              {ripples('l6 -6', 5, 270, 60, 26, -6)}
            </g>
            {/* palms and huts on land, Warli style */}
            <g className="map-ink">
              {[[310, 150], [350, 210], [330, 330], [370, 400], [280, 140], [350, 480]].map(([x, y], k) => (
                <g key={k} transform={`translate(${x} ${y})`}>
                  <path d="M-1 0C0 -8 0 -16 -2 -24h3C3 -16 3 -8 2 0z" />
                  <path className="map-stroke" d="M0 -24c-4 -4 -10 -4 -13 -1M0 -24c4 -5 10 -5 13 -1M0 -24c-2 -5 0 -8 3 -10M0 -24c-3 3 -4 6 -4 9M0 -24c3 3 5 5 5 9" />
                </g>
              ))}
              <path d="M300 226l12 -10 12 10zM302 226h20v12h-20z" />
              <path d="M326 236l9 -8 9 8zM328 236h14v9h-14z" />
            </g>
            {/* jeep route from the hostel to the surf point */}
            {/* jeep route: no shortcut over the water, it loops round by road and over the bridge (~15 min) */}
            <path className="map-route" d="M282 268C302 330 300 420 276 468C264 492 248 506 226 509C202 512 184 500 172 482C162 466 154 454 148 450" />
            <path className="map-bridge" d="M214 500v16M238 500v16M212 504h28M212 512h28" />
            <g className="map-jeep" transform="translate(281 372)">
              <path d="M-20 4h28l3-4h12l3 5v9h-46z" />
              <path className="map-stroke" d="M-15 4l1-10h14l1 10M10 0l3-9" />
              <circle cx="-11" cy="15" r="5.5" /><circle cx="15" cy="15" r="5.5" />
              <circle className="hub" cx="-11" cy="15" r="2" /><circle className="hub" cx="15" cy="15" r="2" />
            </g>
            <text className="map-hand map-note" x="318" y="428" textAnchor="middle" transform="rotate(-8 318 428)">15 min</text>
            <text className="map-hand map-note" x="318" y="446" textAnchor="middle" transform="rotate(-8 318 446)">jeep ride</text>
            {/* little Warli people doing their thing */}
            <g className="map-ink map-ink-on-dark" transform="translate(76 432)"><path d="M-22 22C-10 18 10 18 24 22C14 26 -12 26 -22 22Z" /><Person x={0} y={10} s={0.48} arms={[[[-9, 4]], [[9, 4]]]} legs={[[[-5, 8]], [[5, 8]]]} limb={3} /></g>
            <g className="map-kayak" transform="translate(249 346) rotate(-76)"><path className="hull" d="M-20 4C-8 0 8 0 20 4C12 10 -12 10 -20 4Z" /><path d="M0 2l-6 -9h12z" /><circle cx="0" cy="-11" r="3" /><path className="paddle" d="M-14 6L14 -10" /></g>
          </g>
          <text x="40" y="300" className="map-hand map-sea" transform="rotate(-84 40 300)">Arabian Sea</text>
          <text x="300" y="44" className="map-hand map-river" transform="rotate(-14 300 44)">Shambhavi</text>
          <text x="232" y="430" className="map-hand map-river" transform="rotate(-80 232 430)">backwater</text>
          <text x="156" y="300" className="map-hand map-sand" transform="rotate(-84 156 300)">Sasihitlu beach</text>
          <g className="map-north" transform="translate(370 488)"><path d="M0 -16l6 14h-12z" /><text y="12" textAnchor="middle">N</text></g>
          {MAP_SPOTS.map((m, k) => (
            <g key={m.name} className={`pin${k === i ? ' active' : ''}`} tabIndex={0} role="button" aria-label={m.name} aria-pressed={k === i}
              onClick={() => pick(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } }}>
              <circle className="hit" cx={m.x} cy={m.y} r="28" />
              {!touched && <circle className="ring" cx={m.x} cy={m.y} r="17" style={{ animationDelay: `${k * 0.45}s` }} />}
              <circle className="bg" cx={m.x} cy={m.y} r="17" />
              <g transform={`translate(${m.x - 12} ${m.y - 12}) scale(.5)`}>{DOODLE_PATHS[m.icon]}</g>
              <text x={m.lx} y={m.ly} textAnchor={m.anchor || 'start'}>{m.name}</text>
            </g>
          ))}
          {!touched && (() => { const m = MAP_SPOTS[1]; return (
            <g className="map-hint" transform={`translate(${m.x + 8} ${m.y + 10})`} aria-hidden="true">
              <g className="hand">
                <path d="M6 2c2.2 0 3.5 1.6 3.5 3.6v9.2l1.5-.9c1.7-1 3.7-.3 4.4 1.4l.2.5 1.6-.7c1.6-.7 3.4 0 4.1 1.6l.3.7 1.2-.4c1.7-.5 3.4.5 3.8 2.2.8 3.7.5 7.7-1.3 11L23 36c-1.3 2.4-3.8 3.9-6.5 3.9h-3.6c-2.6 0-5-1.3-6.4-3.5L1.4 28.9c-1-1.5-.6-3.5.9-4.5 1.3-.9 3.1-.7 4.2.4l-4.1-1V5.6C2.4 3.6 3.8 2 6 2z" />
              </g>
              <text x="34" y="44" className="map-hand hint-text" transform="rotate(-8 34 44)">tap me</text>
            </g>
          ); })()}
        </svg>
      </div>
    </div>
  );
}
