import Wavy from '@/components/Wavy';
import Link from 'next/link';
import { WaveStrip } from '@/components/kit/Kit';
import { WarliSurfer } from '@/components/kit/Warli';

export default function NotFound() {
  return (
    <section className="section notfound" style={{ textAlign: 'center', paddingBottom: 0 }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'center' }}><WarliSurfer variant="woman" size={240} title="" /></div>
        <Wavy as="p" className="label eyebrow">{"Wiped out"}</Wavy>
        <h1 className="poster" style={{ fontSize: 'clamp(3rem, 2rem + 6vw, 7rem)' }}>Page not found.</h1>
        <p className="lead" style={{ marginInline: 'auto', marginTop: '1rem' }}>That wave didn't break. Paddle back to the beach and try again.</p>
        <Link className="btn btn-primary" href="/">Back home</Link>
      </div>
      <div style={{ marginTop: '3rem', background: 'var(--sb-charcoal)' }}><WaveStrip title="" /></div>
    </section>
  );
}
