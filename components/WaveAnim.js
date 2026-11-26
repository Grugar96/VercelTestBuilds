// Animated 2D waves: periodic paths that drift sideways at different speeds.
const P = (amp, base) => {
  let d = `M0 ${base}`;
  for (let x = 0; x < 2880; x += 360) d += ` Q${x + 90} ${base - amp} ${x + 180} ${base} T${x + 360} ${base}`;
  return d + ' V80 H0 Z';
};
export default function WaveAnim({ back = 'var(--sb-ocean-deep)', front = 'var(--sb-offwhite)', mid, className = '' }) {
  return (
    <div className={`wave-anim ${className}`} aria-hidden="true">
      <svg className="l1" viewBox="0 0 2880 80" preserveAspectRatio="none" style={{ color: back }}><path d={P(14, 34)} /></svg>
      {mid && <svg className="l2" viewBox="0 0 2880 80" preserveAspectRatio="none" style={{ color: mid }}><path d={P(10, 46)} /></svg>}
      <svg className="l3" viewBox="0 0 2880 80" preserveAspectRatio="none" style={{ color: front }}><path d={P(9, 56)} /></svg>
    </div>
  );
}
