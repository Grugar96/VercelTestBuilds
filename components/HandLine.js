// "Find your flow": the letters write in one by one, then keep riding a slow swell,
// with a lime line flowing underneath like a ribbon of water.
export default function HandLine({ text = 'Find your flow', className = '' }) {
  const letters = [...text];
  return (
    <span className={`flow-line draw ${className}`} role="img" aria-label={text}>
      <span className="flow-text" aria-hidden="true">
        {letters.map((c, i) => (
          <span key={i} style={{ '--i': i }}>{c === ' ' ? '\u00A0' : c}</span>
        ))}
      </span>
      <svg className="flow-wave" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 12 C25 2 50 2 75 12 S125 22 150 12 S200 2 225 12 S275 22 300 12 S350 2 375 12 S425 22 450 12 S500 2 525 12 S575 22 600 12 S650 2 675 12 S725 22 750 12 S800 2 800 12" />
      </svg>
    </span>
  );
}
