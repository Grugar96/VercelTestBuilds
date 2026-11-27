import { Shaka, Surfer, Kayaker, WaveStrip } from '@/components/kit/Kit';

export const metadata = { title: 'Motion kit', robots: { index: false, follow: false } };

const ITEMS = [
  ['Shaka', 'The hand sign. Wiggles twice per loop with lime motion ticks.', Shaka],
  ['Surfer', 'Silhouette riding a lime board, bobbing over drifting waves with spray.', Surfer],
  ['Kayaker', 'Silhouette paddling a lime kayak, bobbing on the water.', Kayaker],
];

export default function KitPage() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="label">Brand motion kit</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Filler animations for reels and the website</h1>
        <p className="muted">Hand-drawn style, brand colours, seamless loops (figures 4 s, waves 8 s). Light ink on footage or dark bands, dark ink on light backgrounds. Reel-ready transparent videos are in the GitHub repo under <code>brand/motion/</code>.</p>
        <div className="kit-grid">
          {ITEMS.map(([name, desc, C]) => (
            <article key={name} className="kit-card">
              <div className="kit-swatch light"><C tone="light" size={200} /></div>
              <div className="kit-swatch dark"><C tone="dark" size={200} /></div>
              <h3>{name}</h3><p className="small muted">{desc}</p>
            </article>
          ))}
        </div>
        <h3 style={{ marginTop: '2.5rem' }}>Wave strip</h3>
        <p className="small muted">Four layers drifting at different speeds. Use along the bottom of a frame or as a transition.</p>
        <div style={{ background: 'var(--sb-charcoal)', borderRadius: 16, overflow: 'hidden', marginTop: '1rem' }}><WaveStrip /></div>
      </div>
    </section>
  );
}
