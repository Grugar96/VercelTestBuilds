// Mulki Surf Brothers motion kit: solid stamp-style silhouettes with a printed grain.
// tone="light" = charcoal ink for light backgrounds, tone="dark" = off-white ink for footage / dark bands.
// Figures loop seamlessly every 4 s, the wave strip every 8 s (see .kit-* rules in app/globals.css).

const a11y = (title) => (title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true });

// Printed-ink grain: punches tiny speckles out of the silhouette so it reads like a stamp.
function Grain({ id }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="7" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -22 15.6" result="speck" />
      <feComposite in="SourceGraphic" in2="speck" operator="in" />
    </filter>
  );
}

const WAVE_LINE = (y, amp, w = 240) => {
  let d = `M-200 ${y}`;
  for (let x = -200; x < w + 200; x += 50) d += ` q12.5 ${-amp} 25 0 t25 0`;
  return d;
};

// ---------------- Shaka (traced from the crew's own shaka photo) ----------------
const SHAKA_OUTLINE = 'M66 186 C66 166 66 140 60 120 C54 100 44 82 32 64 C24 52 16 44 13 37 C11 31 17 28 24 32 C35 39 47 53 57 68 C61 73 63 75 66 75 C63 64 64 51 70 41 C75 32 85 30 90 37 C95 31 105 30 111 37 C114 41 117 45 118 46 C124 45 133 48 139 54 C143 59 145 68 145 77 C150 58 158 37 166 17 C169 9 174 5 180 6 C187 8 191 15 188 23 C183 45 173 69 161 89 C157 101 157 117 153 137 C149 153 141 162 130 170 C129 176 128 181 128 186 Z';

export function Shaka({ tone = 'light', size = 200, className = '', title = 'Shaka hand sign' }) {
  const id = `sbg-shaka-${tone}`;
  return (
    <svg className={`kit kit-${tone} kit-shaka ${className}`} viewBox="0 0 200 200" width={size} height={size} {...a11y(title)}>
      <defs>
        <Grain id={id} />
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <path d={SHAKA_OUTLINE} fill="#fff" />
          <path d="M90 40 C91 58 90 74 88 89 M115 48 C114 66 110 84 106 97 M138 59 C134 76 126 93 116 105 M76 88 C79 95 87 95 89 89 M96 98 C99 104 106 104 107 98 M112 106 C115 111 121 111 123 105 M74 126 C96 121 118 123 138 132" fill="none" stroke="#000" strokeWidth="3.2" strokeLinecap="round" />
        </mask>
      </defs>
      <g className="kit-motion"><path className="tick" d="M18 26l-8-12M10 50l-8-2M190 44l8 1M192 26l6-8" /></g>
      <g className="kit-hand" filter={`url(#${id})`}>
        <rect className="ink-fill" x="0" y="0" width="200" height="200" mask={`url(#${id}-m)`} />
      </g>
    </svg>
  );
}

// ---------------- Surfers (man / woman — alternate them) ----------------
const SURFER = {
  man: {
    head: <circle cx="126" cy="50" r="11" />,
    hair: <path d="M115 47 C116 36 132 34 137 44 C131 40 122 40 115 47Z" />,
    torso: 'M113 63 C120 59 131 61 135 67 C131 82 125 96 122 106 L104 104 C106 92 108 76 113 63Z',
    arms: 'M124 70 L146 84 L166 80 M119 70 L98 62 L78 68',
    legs: 'M112 104 L94 124 L86 150 M114 104 L136 126 L142 152',
  },
  woman: {
    head: <circle cx="124" cy="52" r="10" />,
    hair: <path d="M112 54 C109 38 132 34 136 47 C131 44 124 45 120 50 C114 56 110 62 102 68 C92 75 80 74 70 70 C80 70 88 66 94 62 C84 64 76 62 70 58 C82 58 94 56 102 50 C106 48 110 48 112 54Z" />,
    torso: 'M115 65 C121 62 129 63 132 69 C128 77 123 83 123 90 C125 96 125 102 122 108 L103 106 C103 100 107 94 111 88 C112 81 112 72 115 65Z',
    arms: 'M122 72 L144 82 L162 76 M118 72 L100 66 L82 74',
    legs: 'M113 104 L96 126 L88 150 M115 104 L136 126 L142 152',
  },
};

export function Surfer({ tone = 'light', variant = 'man', size = 240, className = '', title }) {
  const v = SURFER[variant] || SURFER.man;
  const id = `sbg-surf-${variant}-${tone}`;
  const label = title === undefined ? `${variant === 'woman' ? 'Woman' : 'Man'} surfing` : title;
  return (
    <svg className={`kit kit-${tone} kit-surfer ${className}`} viewBox="0 0 240 200" width={size} height={size * 200 / 240} {...a11y(label)}>
      <defs><Grain id={id} /></defs>
      <g className="kit-waves"><path className="line" d={WAVE_LINE(182, 6)} /></g>
      <g className="kit-rider" filter={`url(#${id})`}>
        <g className="ink-fill">
          <path d="M18 150 C50 140 140 146 226 170 C232 172 230 178 222 177 C140 172 52 164 22 158 C14 156 13 151 18 150Z" />
          <path d="M40 159 L34 170 L50 161Z" />
          {v.head}{v.hair}
          <path d={v.torso} />
        </g>
        <g className="ink-stroke">
          <path d={v.arms} strokeWidth="7.5" />
          <path d={v.legs} strokeWidth={variant === 'woman' ? 10 : 11} />
        </g>
      </g>
      <g className="kit-spray"><circle cx="226" cy="160" r="3.2" /><circle cx="234" cy="150" r="2.4" /><circle cx="220" cy="148" r="2" /></g>
    </svg>
  );
}

// ---------------- Coconut palm ----------------
export function Palm({ tone = 'light', size = 200, className = '', title = 'Coconut tree' }) {
  const id = `sbg-palm-${tone}`;
  const frond = (rot, len, droop) => (
    <path key={rot} transform={`rotate(${rot} 100 62)`}
      d={`M100 62 C${100 + len * 0.35} ${62 - 14} ${100 + len * 0.75} ${62 - 8 + droop * 0.3} ${100 + len} ${62 + droop} C${100 + len * 0.7} ${62 + 4 + droop * 0.4} ${100 + len * 0.35} ${62 + 6} 100 66Z`} />
  );
  return (
    <svg className={`kit kit-${tone} kit-palm ${className}`} viewBox="0 0 200 200" width={size} height={size} {...a11y(title)}>
      <defs><Grain id={id} /></defs>
      <g filter={`url(#${id})`} className="ink-fill">
        <path className="kit-trunk" d="M96 66 C98 100 92 140 84 192 L104 192 C108 140 108 100 104 66Z" />
        <g className="kit-fronds">
          {frond(-10, 78, 26)}{frond(-40, 70, 22)}{frond(-75, 54, 14)}
          {frond(190, 78, -26)}{frond(220, 70, -22)}{frond(255, 54, -14)}
          {frond(-100, 40, 8)}
        </g>
        <circle cx="94" cy="72" r="7" /><circle cx="106" cy="73" r="7" /><circle cx="100" cy="81" r="7" />
      </g>
    </svg>
  );
}

// ---------------- Kayaker ----------------
export function Kayaker({ tone = 'light', size = 240, className = '', title = 'Person kayaking' }) {
  const id = `sbg-kayak-${tone}`;
  return (
    <svg className={`kit kit-${tone} kit-kayaker ${className}`} viewBox="0 0 240 200" width={size} height={size * 200 / 240} {...a11y(title)}>
      <defs><Grain id={id} /></defs>
      <g className="kit-waves"><path className="line" d={WAVE_LINE(166, 5)} /><path className="line" d={WAVE_LINE(182, 4)} style={{ opacity: 0.55 }} /></g>
      <g className="kit-boat" filter={`url(#${id})`}>
        <g className="ink-fill">
          <circle cx="122" cy="80" r="11" />
          <path d="M18 134 C70 128 170 126 224 132 C190 152 60 156 18 134Z" />
        </g>
        <path className="ink-stroke" d="M121 92 L118 128" strokeWidth="18" />
        <g className="kit-paddle">
          <path className="ink-stroke" d="M120 100 L102 116 M120 100 L140 114" strokeWidth="9" />
          <path className="ink-stroke" d="M74 62 L168 172" strokeWidth="5" />
          <g className="ink-fill">
            <ellipse cx="70" cy="57" rx="14" ry="7" transform="rotate(50 70 57)" />
            <ellipse cx="172" cy="177" rx="14" ry="7" transform="rotate(50 172 177)" />
          </g>
        </g>
      </g>
    </svg>
  );
}

// ---------------- Skater ----------------
export function Skater({ tone = 'light', size = 240, className = '', title = 'Person skateboarding' }) {
  const id = `sbg-skate-${tone}`;
  return (
    <svg className={`kit kit-${tone} kit-skater ${className}`} viewBox="0 0 240 200" width={size} height={size * 200 / 240} {...a11y(title)}>
      <defs><Grain id={id} /></defs>
      <g className="kit-ground"><path className="line dash" d="M-100 186 H400" /></g>
      <g className="kit-speed"><path className="line" d="M18 92 H48 M10 112 H40 M22 132 H46" /></g>
      <g className="kit-skate" filter={`url(#${id})`}>
        <g className="ink-fill">
          <circle cx="132" cy="44" r="11" />
          <path d="M120 40 C122 28 142 28 146 40 L156 42 L146 46 C138 42 128 42 120 46Z" />
          <path d="M56 160 C60 166 70 168 78 168 L190 168 C198 168 206 164 210 156 C206 160 200 162 192 162 L78 162 C70 162 62 160 56 160Z" />
        </g>
        <path className="ink-fill" d="M121 57 C128 53 138 55 141 61 C138 75 132 89 129 100 L112 98 C114 86 116 70 121 57Z" />
        <path className="ink-stroke" d="M131 64 L154 78 L172 70 M126 64 L104 70 L86 62" strokeWidth="7.5" />
        <path className="ink-stroke" d="M122 98 L102 124 L96 160 M126 98 L150 122 L158 160" strokeWidth="11" />
        <g className="kit-wheels ink-fill"><circle cx="92" cy="178" r="8" /><circle cx="176" cy="178" r="8" /></g>
      </g>
    </svg>
  );
}

// ---------------- Wave strip ----------------
export function WaveStrip({ className = '', title = 'Animated waves' }) {
  const P = (amp, base) => { let d = `M0 ${base}`; for (let x = 0; x < 2880; x += 360) d += ` Q${x + 90} ${base - amp} ${x + 180} ${base} T${x + 360} ${base}`; return d + ' V160 H0 Z'; };
  const L = (amp, base) => { let d = `M0 ${base}`; for (let x = 0; x < 2880; x += 360) d += ` Q${x + 90} ${base - amp} ${x + 180} ${base} T${x + 360} ${base}`; return d; };
  return (
    <div className={`kit-wavestrip ${className}`} {...a11y(title)}>
      <svg className="w1" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="#1F6F8B" d={P(26, 60)} /></svg>
      <svg className="w2" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="#3B96B5" d={P(20, 84)} /></svg>
      <svg className="w3" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="none" stroke="#CFDE58" strokeWidth="6" strokeLinecap="round" d={L(16, 104)} /></svg>
      <svg className="w4" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="#F5F3EC" d={P(14, 124)} /></svg>
    </div>
  );
}
