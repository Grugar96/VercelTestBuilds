// Handwritten phrase that writes itself when scrolled into view (stroke draws, then ink fills).
// Caveat stands in for Brilanys Signature; swap the <text> for the exported SVG path later.
export default function HandLine({ text = 'Find your flow', width = 340, className = '' }) {
  return (
    <svg className={`hand-svg draw ${className}`} viewBox={`0 0 ${width} 92`} width={width} role="img" aria-label={text}>
      <text x="6" y="58">{text}</text>
      <path pathLength="1" d={`M10 76c${width * 0.25} -10 ${width * 0.55} -12 ${width * 0.9} -4`} />
    </svg>
  );
}
