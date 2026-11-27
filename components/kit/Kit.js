// Mulki Surf Brothers motion kit: hand-drawn style filler animations.
// tone="light" = charcoal ink for light backgrounds, tone="dark" = off-white ink for footage / dark bands.
// Every animation loops seamlessly in 4 s (see .kit-* rules in app/globals.css).

const WAVE_LINE = (y, amp, w = 400) => {
  let d = `M-200 ${y}`;
  for (let x = -200; x < w + 200; x += 50) d += ` q12.5 ${-amp} 25 0 t25 0`;
  return d;
};

export function Shaka({ tone = 'light', size = 200, className = '', title = 'Shaka hand sign' }) {
  return (
    <svg className={`kit kit-${tone} kit-shaka ${className}`} viewBox="0 0 200 200" width={size} height={size} {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <g className="kit-motion">
        <path className="accent" d="M8 22l-6-10M4 46l-4-2M194 46l6 2M196 30l4-6" />
      </g>
      <g className="kit-hand">
        {/* traced from a photo of the crew's shaka: thumb out left, pinky up right, three fingers curled over the palm */}
        <path className="ink" d="M68 184 C66 166 66 140 60 120 C54 100 44 82 32 64 C24 52 16 44 13 37 C11 31 17 30 23 33 C34 40 46 54 56 69 C60 74 63 76 67 77" />
        <path className="ink" d="M67 77 C64 66 65 52 70 42 C74 33 84 30 90 37 C94 32 104 30 110 37 C114 42 117 46 117 47 C122 46 132 48 138 54 C143 60 145 70 144 79 C150 60 158 38 166 18 C169 10 173 6 179 7 C186 9 189 15 187 22 C182 44 172 68 160 88 C156 100 156 116 152 136 C148 152 140 162 128 170 C127 176 126 180 126 184" />
        <path className="ink thin" d="M90 38 C91 56 90 74 88 90 M115 46 C114 66 110 84 106 98 M138 58 C134 76 126 94 116 106" />
        <path className="ink thin" d="M76 88 C78 96 88 97 90 90 M96 98 C98 105 106 106 107 99 M112 106 C114 112 122 112 123 105" />
        <path className="ink thin" d="M72 124 C94 120 118 122 140 132" />
        <path className="ink" d="M62 186 H132" />
      </g>
    </svg>
  );
}

export function Surfer({ tone = 'light', size = 240, className = '', title = 'Surfer riding a wave' }) {
  return (
    <svg className={`kit kit-${tone} kit-surfer ${className}`} viewBox="0 0 240 200" width={size} height={size * 200 / 240} {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <g className="kit-waves">
        <path className="line" d={WAVE_LINE(172, 7, 240)} />
        <path className="line thin" d={WAVE_LINE(188, 5, 240)} />
      </g>
      <g className="kit-crest">
        <path className="crest" d="M-20 168 C10 160 30 132 26 100 C24 82 40 70 58 78 C48 84 44 98 52 114 C66 140 100 156 150 162 C175 166 200 170 230 172 L230 174 L-20 174Z" />
        <path className="crest-line" d="M58 78 C44 84 42 100 50 116 C62 138 92 152 130 158" />
      </g>
      <g className="kit-rider">
        <path className="board" d="M34 158 C80 140 170 140 214 150 C170 166 82 170 34 158Z" />
        <g className="fill">
          <circle cx="122" cy="52" r="11" />
          <path className="limb torso" d="M120 66 L112 104" />
          <path className="limb arm" d="M118 74 L84 64 M116 76 L156 88" />
          <path className="limb leg" d="M112 104 L92 124 L86 150 M112 104 L138 122 L146 148" />
        </g>
        <g className="kit-spray"><circle cx="214" cy="140" r="3" /><circle cx="224" cy="132" r="2.4" /><circle cx="206" cy="130" r="2" /></g>
      </g>
    </svg>
  );
}

export function Kayaker({ tone = 'light', size = 240, className = '', title = 'Person kayaking' }) {
  return (
    <svg className={`kit kit-${tone} kit-kayaker ${className}`} viewBox="0 0 240 200" width={size} height={size * 200 / 240} {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <g className="kit-waves">
        <path className="line" d={WAVE_LINE(160, 5, 240)} />
        <path className="line thin" d={WAVE_LINE(178, 4, 240)} />
      </g>
      <g className="kit-boat">
        <g className="fill">
          <circle cx="120" cy="82" r="10" />
          <path className="limb torso" d="M120 95 L118 130" />
        </g>
        <g className="kit-paddle">
          <path className="limb arm" d="M119 104 L100 118 M119 104 L138 116" />
          <path className="paddle" d="M60 86 L180 150" />
          <ellipse className="fill blade" cx="56" cy="84" rx="12" ry="6" transform="rotate(28 56 84)" />
          <ellipse className="fill blade" cx="184" cy="152" rx="12" ry="6" transform="rotate(28 184 152)" />
        </g>
        <path className="board" d="M30 134 C80 156 160 156 210 134 C160 124 80 124 30 134Z" />
      </g>
    </svg>
  );
}

export function WaveStrip({ className = '', title = 'Animated waves' }) {
  const P = (amp, base) => { let d = `M0 ${base}`; for (let x = 0; x < 2880; x += 360) d += ` Q${x + 90} ${base - amp} ${x + 180} ${base} T${x + 360} ${base}`; return d + ' V160 H0 Z'; };
  const L = (amp, base) => { let d = `M0 ${base}`; for (let x = 0; x < 2880; x += 360) d += ` Q${x + 90} ${base - amp} ${x + 180} ${base} T${x + 360} ${base}`; return d; };
  return (
    <div className={`kit-wavestrip ${className}`} {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <svg className="w1" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="#1F6F8B" d={P(26, 60)} /></svg>
      <svg className="w2" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="#3B96B5" d={P(20, 84)} /></svg>
      <svg className="w3" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="none" stroke="#CFDE58" strokeWidth="6" strokeLinecap="round" d={L(16, 104)} /></svg>
      <svg className="w4" viewBox="0 0 2880 160" preserveAspectRatio="none"><path fill="#F5F3EC" d={P(14, 124)} /></svg>
    </div>
  );
}
