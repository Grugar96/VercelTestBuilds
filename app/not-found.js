import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="wrap">
        <p className="label">Wiped out</p>
        <h1 className="poster" style={{ fontSize: 'clamp(3rem, 2rem + 6vw, 7rem)' }}>Page not found.</h1>
        <p className="lead" style={{ marginInline: 'auto', marginTop: '1rem' }}>That wave didn't break. Paddle back to the beach and try again.</p>
        <Link className="btn btn-primary" href="/">Back home</Link>
      </div>
    </section>
  );
}
