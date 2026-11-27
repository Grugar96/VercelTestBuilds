'use client';
import Wavy from './Wavy';
import { useState } from 'react';
import { MAP_SPOTS } from '@/lib/site';
import { DOODLE_PATHS } from './Doodle';

// Illustrated, not-to-scale map of Mulki with tappable pins.
export default function MulkiMap() {
  const [i, setI] = useState(0);
  const s = MAP_SPOTS[i];
  return (
    <div className="wrap map-grid">
      <div className="reveal">
        <Wavy as="p" className="label eyebrow">{"where everything is"}</Wavy>
        <h2 style={{ fontSize: 'var(--fs-h2)' }}>Everything is a short walk, paddle or auto ride away</h2>
        <p className="muted">Tap a pin to see what happens there.</p>
        <div className="map-chips" role="group" aria-label="Places">
          {MAP_SPOTS.map((m, k) => <button key={m.name} type="button" aria-pressed={k === i} onClick={() => setI(k)}>{m.name}</button>)}
        </div>
        <div className="map-card" aria-live="polite">
          <img src={s.img} alt={s.alt} width="120" height="100" />
          <div><h3>{s.name}</h3><p>{s.text}</p></div>
        </div>
      </div>
      <div className="map-box reveal">
        <svg viewBox="0 0 500 400" role="group" aria-label="Illustrated map of Mulki, not to scale">
          <defs><pattern id="ripples" width="40" height="18" patternUnits="userSpaceOnUse"><path d="M2 10c6-6 12-6 18 0s12 6 18 0" fill="none" stroke="#F5F3EC" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" /></pattern></defs>
          <rect width="500" height="400" fill="#EEF0E2" />
          <path d="M0 0H150C138 60 160 120 140 180S120 300 150 400H0z" fill="#3B96B5" />
          <path d="M0 0H150C138 60 160 120 140 180S120 300 150 400H0z" fill="url(#ripples)" />
          <path d="M150 0C138 60 160 120 140 180S120 300 150 400H178C150 300 168 240 168 180S166 60 178 0z" fill="#D8B991" />
          <path d="M500 70C440 80 400 120 360 140S290 160 250 200 190 250 150 262L152 290C196 276 236 244 268 222S340 182 380 166 450 112 500 104z" fill="#1F6F8B" />
          <g fill="none" stroke="#231F20" strokeWidth="2" strokeLinecap="round" opacity=".55">
            <path d="M210 330c0-10 1-16-1-24M209 306c-5-4-11-3-14 0M209 306c4-5 10-5 14-1" />
            <path d="M300 300c0-10 1-16-1-24M299 276c-5-4-11-3-14 0M299 276c4-5 10-5 14-1" />
            <path d="M240 90c0-10 1-16-1-24M239 66c-5-4-11-3-14 0M239 66c4-5 10-5 14-1" />
            <path d="M440 260c0-10 1-16-1-24M439 236c-5-4-11-3-14 0M439 236c4-5 10-5 14-1" />
          </g>
          <text x="20" y="250" className="map-hand" fontSize="24" fill="#F5F3EC" transform="rotate(-90 40 250)">Arabian Sea</text>
          <text x="400" y="128" className="map-hand" fontSize="20" fill="#F5F3EC" transform="rotate(-24 400 128)">Shambhavi</text>
          <text x="490" y="392" textAnchor="end" fontSize="12" fill="#5C5859">Not to scale</text>
          {MAP_SPOTS.map((m, k) => (
            <g key={m.name} className={`pin${k === i ? ' active' : ''}`} tabIndex={0} role="button" aria-label={m.name}
              onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setI(k); } }}>
              <circle className="bg" cx={m.x} cy={m.y} r="20" />
              <g transform={`translate(${m.x - 16} ${m.y - 16}) scale(.67)`} fill="none" stroke="#231F20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{DOODLE_PATHS[m.icon]}</g>
              <text x={m.lx} y={m.ly}>{m.name}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
