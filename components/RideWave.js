import { WarliSurfer } from './kit/Warli';

// A Warli surfer on a curling wave that rises out of a white line wave. Used at the foot of the booking
// band (riding across the brand waves) and inside the "students coached" ring on the number cards.
const P = (amp, base, len = 360) => {
  let d = `M0 ${base}`;
  for (let x = 0; x < 2880; x += len) d += ` Q${x + len / 4} ${base - amp} ${x + len / 2} ${base} T${x + len} ${base}`;
  return d;
};

export function Rider({ variant = 'woman', className = '' }) {
  return (
    <div className={`rw-rider ${className}`}>
      <svg className="rw-crest" viewBox="0 0 260 150" preserveAspectRatio="xMidYMax meet">
        <path className="rw-crest-body" d="M0 150 C34 148 56 122 76 88 C96 52 120 26 148 24 C176 22 196 42 190 64 C185 80 164 82 161 69 C159 60 166 56 173 59 C178 98 214 136 260 150 Z" />
        <path className="rw-foam" d="M0 150 C34 148 56 122 76 88 C96 52 120 26 148 24 C176 22 196 42 190 64 C185 80 164 82 161 69 C159 60 166 56 173 59 C178 98 214 136 260 150" />
        <g className="rw-spray"><circle cx="198" cy="30" r="3" /><circle cx="206" cy="46" r="2.2" /><circle cx="188" cy="16" r="2" /></g>
      </svg>
      <div className="rw-surfer"><WarliSurfer tone="dark" variant={variant} size={130} noWater title="" /></div>
    </div>
  );
}

export function LineWave({ className = '', base = 86, amp = 6, len = 240 }) {
  return <svg className={`rw-layer rw-line ${className}`} viewBox="0 0 2880 120" preserveAspectRatio="none"><path d={P(amp, base, len)} /></svg>;
}

export default function RideWave({ back = 'var(--sb-ocean)', mid = 'var(--sb-lime)', front = 'var(--sb-charcoal)', variant = 'woman' }) {
  return (
    <div className="ride-wave" aria-hidden="true">
      <svg className="rw-layer rw1" viewBox="0 0 2880 120" preserveAspectRatio="none" style={{ color: back }}><path d={P(16, 52) + ' V120 H0 Z'} /></svg>
      <svg className="rw-layer rw2" viewBox="0 0 2880 120" preserveAspectRatio="none" style={{ color: mid }}><path d={P(11, 74, 480) + ' V120 H0 Z'} /></svg>
      <svg className="rw-layer rw3" viewBox="0 0 2880 120" preserveAspectRatio="none" style={{ color: front }}><path d={P(9, 100) + ' V120 H0 Z'} /></svg>
      <LineWave />
      <Rider variant={variant} className="rw-travel" />
    </div>
  );
}
