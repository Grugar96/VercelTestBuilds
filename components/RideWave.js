import { WarliSurfer } from './kit/Warli';

// Bottom of the booking band: brand-colour waves drifting, a white line wave running through them,
// and one Warli surfer riding a curling wave from left to right across the band.
const P = (amp, base, len = 360) => {
  let d = `M0 ${base}`;
  for (let x = 0; x < 2880; x += len) d += ` Q${x + len / 4} ${base - amp} ${x + len / 2} ${base} T${x + len} ${base}`;
  return d;
};
export default function RideWave({ back = 'var(--sb-ocean)', mid = 'var(--sb-lime)', front = 'var(--sb-charcoal)', variant = 'woman' }) {
  return (
    <div className="ride-wave" aria-hidden="true">
      <svg className="rw-layer rw1" viewBox="0 0 2880 120" preserveAspectRatio="none" style={{ color: back }}><path d={P(16, 52) + ' V120 H0 Z'} /></svg>
      <div className="rw-rider">
        <svg className="rw-crest" viewBox="0 0 260 150">
          <path className="rw-crest-body" d="M0 150 C34 148 56 122 76 88 C96 52 120 26 148 24 C176 22 196 42 190 64 C185 80 164 82 161 69 C159 60 166 56 173 59 C178 98 214 136 260 150 Z" />
          <path className="rw-face" d="M173 59 C178 98 214 136 260 150" />
          <path className="rw-foam" d="M76 88 C96 52 120 26 148 24 C176 22 196 42 190 64 C185 80 164 82 161 69 C159 60 166 56 173 59" />
          <g className="rw-spray"><circle cx="198" cy="30" r="3" /><circle cx="206" cy="46" r="2.2" /><circle cx="188" cy="16" r="2" /><circle cx="236" cy="128" r="2.4" /><circle cx="226" cy="118" r="1.8" /></g>
        </svg>
        <div className="rw-surfer"><WarliSurfer tone="dark" variant={variant} size={130} noWater title="" /></div>
      </div>
      <svg className="rw-layer rw2" viewBox="0 0 2880 120" preserveAspectRatio="none" style={{ color: mid }}><path d={P(11, 74, 480) + ' V120 H0 Z'} /></svg>
      <svg className="rw-layer rw-line" viewBox="0 0 2880 120" preserveAspectRatio="none"><path d={P(6, 86, 240)} /></svg>
      <svg className="rw-layer rw3" viewBox="0 0 2880 120" preserveAspectRatio="none" style={{ color: front }}><path d={P(9, 96) + ' V120 H0 Z'} /></svg>
    </div>
  );
}
