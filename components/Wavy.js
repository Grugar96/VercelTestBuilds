// Caveat text that rides a slow swell, letter by letter (same motion as "Find your flow").
// Server-safe: the split happens at render, so React owns every span.
export default function Wavy({ children, as: Tag = 'span', className = '', ...rest }) {
  if (typeof children !== 'string') return <Tag className={className} {...rest}>{children}</Tag>;
  let i = 0;
  const words = children.split(/(\s+)/);
  return (
    <Tag className={`wavy ${className}`} aria-label={children} {...rest}>
      {words.map((w, k) => (/^\s+$/.test(w) ? ' ' : (
        <span className="wv" key={k} aria-hidden="true">
          {[...w].map((c) => <span key={i} style={{ '--i': i++ }}>{c}</span>)}
        </span>
      )))}
    </Tag>
  );
}
