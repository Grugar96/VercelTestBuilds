const WAVES = [
  'M0 40V20C90 6 180 4 270 14s180 26 270 18 180-30 270-28 180 24 270 26 180-14 270-22 90-2 90-2V40z',
  'M0 40V24C120 8 200 2 320 12s200 28 320 22 200-34 320-30 200 22 300 24 160-12 180-14V40z',
  'M0 40V16c80 10 160 22 260 18S440 6 540 8s180 26 300 26 200-24 300-26 200 14 300 18V40z',
];

// Wavy section edge. Place inside a section with `has-wave-top`; colour = that section's background.
export default function Wave({ color, n = 0, bottom = false }) {
  return (
    <svg className={`wave ${bottom ? 'wave-bottom' : 'wave-top'}`} style={{ color }} viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
      <path d={WAVES[n % 3]} />
    </svg>
  );
}
