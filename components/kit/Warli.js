// Mulki Surf Brothers — Warli-style figures (draft).
// Inspired by Warli folk painting: two triangles meeting at the waist, a round head,
// thin line limbs, a single flat colour, framed by zigzag borders.
// tone="light" = charcoal paint for light backgrounds, tone="dark" = off-white paint for blue/dark bands and footage.
// Only the figures move (gentle loops); water and ground lines stay still.

const a11y = (title) => (title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true });
const pts = (a) => a.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');

// Painted-wall texture: a few speckles knocked out, lighter than the stamp grain.
function Paint({ id }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="11" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 18.2" result="speck" />
      <feComposite in="SourceGraphic" in2="speck" operator="in" />
    </filter>
  );
}

// One Warli person. (x, y) is the waist where the two triangles meet.
// arms/legs: polylines relative to the left/right shoulder and left/right hip.
export function Person({ x, y, s = 1, woman = false, facing = 1, arms = [[], []], legs = [[], []], bun, limb = 3.4, className = '' }) {
  const T = 24 * s, W = 12 * s, B = (woman ? 20 : 15) * s, W2 = (woman ? 13 : 10) * s, r = 7.6 * s, neck = 3 * s;
  const sh = [[x - W + 1.5 * s, y - T + 1.5 * s], [x + W - 1.5 * s, y - T + 1.5 * s]];
  const hp = [[x - W2 * 0.7, y + B - 1], [x + W2 * 0.7, y + B - 1]];
  const hy = y - T - neck - r;
  const line = (base, rel) => (rel.length ? `M${pts([base, ...rel.map(([dx, dy]) => [base[0] + dx, base[1] + dy])])}` : '');
  const showBun = bun ?? woman;
  return (
    <g className={className}>
      <path className="ink-fill" d={`M${x - W} ${y - T} L${x + W} ${y - T} L${x} ${y} Z M${x} ${y} L${x - W2} ${y + B} L${x + W2} ${y + B} Z`} />
      <rect className="ink-fill" x={x - 1.6 * s} y={y - T - neck - 1} width={3.2 * s} height={neck + 2} />
      <circle className="ink-fill" cx={x} cy={hy} r={r} />
      {showBun && <circle className="ink-fill" cx={x - facing * r * 0.95} cy={hy - r * 0.45} r={r * 0.52} />}
      <path className="ink-stroke" strokeWidth={limb * s} d={`${line(sh[0], arms[0])} ${line(sh[1], arms[1])} ${line(hp[0], legs[0])} ${line(hp[1], legs[1])}`} />
    </g>
  );
}

const water = (y, x0 = 10, x1 = 230, amp = 4, step = 22) => {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += step) d += ` q${step / 4} ${-amp} ${step / 2} 0 t${step / 2} 0`;
  return d;
};

function Frame({ kind, tone, size, ratio = 200 / 240, vb = '0 0 240 200', className, title, children }) {
  const id = `wp-${kind}-${tone}`;
  return (
    <svg className={`kit warli kit-${tone} warli-${kind} ${className || ''}`} viewBox={vb} width={size} height={size * ratio} {...a11y(title)}>
      <defs><Paint id={id} /></defs>
      <g filter={`url(#${id})`}>{children}</g>
    </svg>
  );
}

// ---------------- Surfer (man / woman — alternate) ----------------
export function WarliSurfer({ tone = 'light', variant = 'man', size = 240, className, title, noWater = false }) {
  const woman = variant === 'woman';
  const label = title === undefined ? `${woman ? 'Woman' : 'Man'} surfing, Warli style` : title;
  return (
    <Frame kind={`surf-${variant}`} tone={tone} size={size} className={className} title={label}>
      {!noWater && <path className="line" d={water(184, 20, 220, 4)} />}
      {!noWater && <path className="line" d={water(194, 50, 190, 3)} style={{ opacity: 0.5 }} />}
      <g className="w-ride">
        <path className="ink-fill" d="M24 162 C64 155 168 155 216 163 C206 171 64 172 24 162Z" />
        <path className="ink-fill" d="M48 166 L42 176 L58 167Z" />
        <Person x={122} y={woman ? 113 : 116} s={1.1} woman={woman}
          arms={[[[-16, 9], [-33, 2]], [[17, 9], [34, 0]]]}
          legs={woman ? [[[-11, 15], [-15, 29]], [[12, 15], [16, 29]]] : [[[-12, 14], [-17, 30]], [[14, 14], [18, 30]]]} />
      </g>
      <g className="w-spray ink-fill"><circle cx="222" cy="156" r="2.6" /><circle cx="230" cy="147" r="2" /><circle cx="216" cy="146" r="1.6" /></g>
    </Frame>
  );
}

// ---------------- Kayaker ----------------
export function WarliKayaker({ tone = 'light', size = 240, className, title = 'Person kayaking, Warli style' }) {
  return (
    <Frame kind="kayak" tone={tone} size={size} className={className} title={title}>
      <path className="line" d={water(160, 10, 230, 4)} />
      <path className="line" d={water(176, 40, 200, 3)} style={{ opacity: 0.5 }} />
      <g className="w-bob">
        <path className="ink-fill" d="M120 112 L104 86 L136 86 Z" />
        <rect className="ink-fill" x="118.2" y="80" width="3.6" height="7" />
        <circle className="ink-fill" cx="120" cy="72" r="8.4" />
        <path className="ink-fill" d="M14 118 C70 110 172 110 226 116 C202 138 52 142 14 118Z" />
        <path className="ink-fill" d="M70 118 L170 118 L120 113Z" style={{ opacity: 0 }} />
        <g className="w-paddle">
          <path className="ink-stroke" strokeWidth="3.4" d="M106 88 L96 96 L94 102 M134 88 L144 96 L146 102" />
          <path className="ink-stroke" strokeWidth="3" d="M46 102 L194 102" />
          <path className="ink-fill" d="M30 102 C34 94 44 94 48 102 C44 110 34 110 30 102Z M192 102 C196 94 206 94 210 102 C206 110 196 110 192 102Z" />
        </g>
      </g>
    </Frame>
  );
}

// ---------------- Skater ----------------
export function WarliSkater({ tone = 'light', size = 240, className, title = 'Person skateboarding, Warli style' }) {
  return (
    <Frame kind="skate" tone={tone} size={size} className={className} title={title}>
      <path className="line dash" d="M10 186 H230" />
      <g className="w-speed"><path className="line" d="M20 96 H46 M12 116 H40 M24 136 H44" /></g>
      <g className="w-skate">
        <Person x={128} y={112} s={1.1}
          arms={[[[-14, 10], [-30, 4]], [[16, 8], [32, 14]]]}
          legs={[[[-13, 14], [-18, 31]], [[13, 14], [19, 31]]]} />
        <path className="ink-fill" d="M82 160 C84 165 88 167 94 167 L170 167 C176 167 180 165 182 160 C178 163 174 163 170 163 L94 163 C90 163 86 163 82 160Z" />
        <circle className="ink-fill" cx="100" cy="175" r="6.5" /><circle className="ink-fill" cx="164" cy="175" r="6.5" />
      </g>
    </Frame>
  );
}

// ---------------- Coconut tree ----------------
function frond(cx, cy, ex, ey, bx, by, n = 9, tick = 11, side = 1) {
  // quadratic curve crown -> tip, with leaflets hanging off it
  let d = `M${cx} ${cy} Q${bx} ${by} ${ex} ${ey}`;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    const px = (1 - t) ** 2 * cx + 2 * (1 - t) * t * bx + t * t * ex;
    const py = (1 - t) ** 2 * cy + 2 * (1 - t) * t * by + t * t * ey;
    const tx = 2 * (1 - t) * (bx - cx) + 2 * t * (ex - bx), ty = 2 * (1 - t) * (by - cy) + 2 * t * (ey - by);
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len * side, ny = tx / len * side;
    const L = tick * (1 - t * 0.5);
    d += ` M${px.toFixed(1)} ${py.toFixed(1)} l${(nx * L + tx / len * 3).toFixed(1)} ${(Math.abs(ny * L) + 3).toFixed(1)}`;
  }
  return d;
}
export function WarliPalm({ tone = 'light', size = 200, className, title = 'Coconut tree, Warli style' }) {
  return (
    <Frame kind="palm" tone={tone} size={size} ratio={1} vb="0 0 200 200" className={className} title={title}>
      <path className="ink-fill" d="M96 62 C100 100 94 150 84 194 L100 194 C108 150 108 100 104 62Z" />
      <path className="ink-stroke" strokeWidth="2" d="M90 180 L100 180 M92 160 L103 160 M95 140 L105 140 M97 120 L106 120 M98 100 L106 100 M99 82 L105 82" style={{ opacity: 0 }} />
      <g className="w-fronds">
        <path className="ink-stroke" strokeWidth="2.6" d={[
          frond(100, 60, 178, 92, 146, 36, 10, 12, 1),
          frond(100, 60, 22, 92, 54, 36, 10, 12, -1),
          frond(100, 60, 160, 128, 140, 72, 8, 10, 1),
          frond(100, 60, 40, 128, 60, 72, 8, 10, -1),
          frond(100, 60, 140, 18, 122, 26, 6, 9, 1),
          frond(100, 60, 60, 18, 78, 26, 6, 9, -1),
        ].join(' ')} />
        <circle className="ink-fill" cx="93" cy="68" r="6" /><circle className="ink-fill" cx="107" cy="68" r="6" /><circle className="ink-fill" cx="100" cy="76" r="6" />
      </g>
    </Frame>
  );
}

// ---------------- Dance circle around the bonfire (bonfire nights) ----------------
export function WarliCircle({ tone = 'light', size = 240, className, title = 'People dancing around a bonfire, Warli style' }) {
  const N = 10, R = 72;
  const people = Array.from({ length: N }, (_, i) => {
    const a = (360 / N) * i;
    return (
      <g key={i} transform={`rotate(${a} 120 120) translate(0 ${-R})`}>
        <Person x={120} y={120 + 4} s={0.7} woman={i % 2 === 1} bun={false}
          arms={[[[-10, 2]], [[10, 2]]]} legs={[[[-6, 14]], [[6, 14]]]} limb={3} />
      </g>
    );
  });
  return (
    <Frame kind="circle" tone={tone} size={size} ratio={1} vb="0 0 240 240" className={className} title={title}>
      <g className="w-ring">
        {people}
      </g>
      <g className="w-fire ink-fill">
        <path d="M120 98 C132 112 136 124 128 136 C126 126 122 122 120 116 C118 124 112 128 112 136 C104 124 110 110 120 98Z" />
        <path className="ink-stroke" strokeWidth="3" d="M100 146 L140 136 M100 136 L140 146" />
      </g>
    </Frame>
  );
}

// ---------------- Frieze: a row of everyday Mulki moments, like a painted wall ----------------
function Vignette({ x, children }) { return <g transform={`translate(${x} 0)`} className="w-vig">{children}</g>; }
export function WarliFrieze({ tone = 'dark', className = '', title = 'Painted frieze of Mulki life: carrying boards, chai, cycling, music, kayaking, the Surf Brothers jeep' }) {
  const id = `wp-frieze-${tone}`;
  return (
    <svg className={`kit warli kit-${tone} warli-frieze ${className}`} viewBox="0 0 1450 170" preserveAspectRatio="xMidYMid meet" {...a11y(title)}>
      <defs><Paint id={id} /></defs>
      <g filter={`url(#${id})`}>
        {/* 1. woman carrying a board on her head */}
        <Vignette x={0}>
          <path className="ink-fill" d="M30 46 C54 41 106 41 132 46 C110 51 54 51 30 46Z" />
          <Person x={80} y={104} s={1} woman
            arms={[[[-6, -18], [-2, -34]], [[6, -18], [2, -34]]]}
            legs={[[[-6, 18], [-12, 34]], [[6, 16], [14, 34]]]} />
        </Vignette>
        {/* 2. man walking with a board under his arm */}
        <Vignette x={150}>
          <path className="ink-fill" d="M98 52 C106 70 108 124 100 150 C92 124 92 70 98 52Z" />
          <Person x={66} y={108} s={1}
            arms={[[[-10, 12], [-18, 24]], [[14, 4], [26, 14], [30, 2]]]}
            legs={[[[-10, 16], [-16, 32]], [[10, 16], [18, 32]]]} />
        </Vignette>
        {/* 3. two friends with chai */}
        <Vignette x={290}>
          <Person x={50} y={108} s={1}
            arms={[[[-10, 14], [-12, 28]], [[14, 6], [22, -4]]]}
            legs={[[[-6, 18], [-8, 34]], [[6, 18], [8, 34]]]} />
          <Person x={116} y={108} s={1} woman facing={-1}
            arms={[[[-14, 6], [-22, -4]], [[10, 14], [12, 28]]]}
            legs={[[[-6, 16], [-8, 30]], [[6, 16], [8, 30]]]} />
          <path className="ink-fill" d="M72 72 h10 l-2 10 h-6Z M86 72 h10 l-2 10 h-6Z" />
          <path className="ink-stroke" strokeWidth="2" d="M77 66 q3 -4 0 -8 M91 66 q3 -4 0 -8" />
        </Vignette>
        {/* 4. cycling */}
        <Vignette x={460}>
          <circle className="ink-stroke" strokeWidth="3.4" cx="38" cy="140" r="17" />
          <circle className="ink-stroke" strokeWidth="3.4" cx="118" cy="140" r="17" />
          <path className="ink-stroke" strokeWidth="3.4" d="M38 140 L66 104 L104 104 L118 140 M66 104 L78 140 L104 104 M100 96 L104 104 M60 100 L72 100" />
          <Person x={72} y={84} s={0.95}
            arms={[[[8, 10], [26, 14]], [[10, 8], [26, 14]]]}
            legs={[[[2, 18], [6, 40]], [[10, 14], [12, 38]]]} />
        </Vignette>
        {/* 5. music by the fire */}
        <Vignette x={620}>
          <Person x={66} y={110} s={1}
            arms={[[[10, 10], [24, 6]], [[8, 14], [18, 20]]]}
            legs={[[[-14, 8], [-22, 26], [-4, 30]], [[14, 8], [22, 26], [4, 30]]]} />
          <path className="ink-fill" d="M88 112 a13 13 0 1 0 0.1 0Z" transform="translate(-6 -4)" />
          <path className="ink-stroke" strokeWidth="3" d="M90 106 L130 80" />
          <path className="ink-fill" d="M140 140 C150 128 154 118 148 108 C146 116 142 118 140 124 C138 118 134 116 134 110 C128 120 130 132 140 140Z" />
          <path className="ink-stroke" strokeWidth="3" d="M124 148 L156 140 M124 140 L156 148" />
        </Vignette>
        {/* 6. kayaking on the river */}
        <Vignette x={820}>
          <path className="ink-fill" d="M110 98 L96 74 L124 74 Z" />
          <rect className="ink-fill" x="108.4" y="68" width="3.2" height="7" />
          <circle className="ink-fill" cx="110" cy="61" r="7.6" />
          <path className="ink-fill" d="M20 104 C66 96 160 96 206 102 C186 122 56 126 20 104Z" />
          <path className="ink-stroke" strokeWidth="3.2" d="M98 76 L88 84 L86 90 M122 76 L132 84 L134 90 M40 90 L182 90" />
          <path className="ink-fill" d="M26 90 C30 83 38 83 42 90 C38 97 30 97 26 90Z M180 90 C184 83 192 83 196 90 C192 97 184 97 180 90Z" />
          <path className="line" d={water(136, 20, 210, 4)} />
        </Vignette>
        {/* 7. the Surf Brothers jeep, board on the roll bar */}
        <Vignette x={1090}>
          <Person x={118} y={92} s={0.78}
            arms={[[[10, 4], [24, 2]], [[12, 6], [26, 4]]]}
            legs={[[], []]} />
          <path className="ink-fill" d="M26 44 C40 35 124 33 162 41 C124 48 40 50 26 44Z" />
          <path className="ink-stroke" strokeWidth="3.4" d="M42 102 L46 52 L104 52 L108 102 M134 100 L146 56" />
          <path className="ink-fill" d="M18 100 L132 100 L138 94 L198 98 L206 108 L206 136 L18 136 Z" />
          <circle className="knock-fill" cx="58" cy="138" r="23" />
          <circle className="knock-fill" cx="166" cy="138" r="23" />
          <circle className="ink-stroke" strokeWidth="7" cx="58" cy="138" r="15" />
          <circle className="ink-stroke" strokeWidth="7" cx="166" cy="138" r="15" />
          <circle className="ink-fill" cx="58" cy="138" r="4.5" />
          <circle className="ink-fill" cx="166" cy="138" r="4.5" />
          <path className="knock" strokeWidth="3" d="M152 108 L190 108 M152 116 L190 116 M152 124 L190 124" />
          <circle className="knock" strokeWidth="3" cx="198" cy="112" r="4" />
          <path className="ink-stroke" strokeWidth="3" d="M206 118 L214 118" />
        </Vignette>
        {/* 8. shaka wave goodbye */}
        <Vignette x={1340}>
          <Person x={42} y={108} s={1}
            arms={[[[-12, 12], [-14, 28]], [[12, -10], [16, -28]]]}
            legs={[[[-6, 18], [-10, 34]], [[6, 18], [10, 34]]]} />
          <circle className="ink-fill" cx="69" cy="55" r="4" />
          <path className="ink-stroke" strokeWidth="2.6" d="M66 54 L60 50 M71 52 L75 44" />
        </Vignette>
      </g>
    </svg>
  );
}

// ---------------- Zigzag border (the triangle band around Warli walls) ----------------
export function Zigzag({ color = 'var(--sb-offwhite)', flip = false, height = 18, className = '' }) {
  const enc = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='18' viewBox='0 0 24 18'><path d='${flip ? 'M0 18 L12 0 L24 18 Z' : 'M0 0 L12 18 L24 0 Z'}' fill='black'/></svg>`);
  return (
    <div aria-hidden="true" className={`zigzag ${className}`} style={{ height, background: color, WebkitMask: `url("data:image/svg+xml,${enc}") repeat-x 0 0 / 24px ${height}px`, mask: `url("data:image/svg+xml,${enc}") repeat-x 0 0 / 24px ${height}px` }} />
  );
}
