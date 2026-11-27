import { Shaka, Surfer, Kayaker, Palm, Skater, WaveStrip } from '@/components/kit/Kit';

export const metadata = { title: 'Motion kit', robots: { index: false, follow: false } };

const SurferMan = (p) => <Surfer variant="man" {...p} />;
const SurferWoman = (p) => <Surfer variant="woman" {...p} />;
const ITEMS = [
  ['Shaka', 'Traced from the crew\'s own shaka. Wiggles twice per loop with lime motion ticks.', Shaka],
  ['Surfer — man', 'Rides a longboard over drifting water with spray. Alternate with the woman.', SurferMan],
  ['Surfer — woman', 'Same ride, hair in the wind. Alternate with the man.', SurferWoman],
  ['Coconut tree', 'Fronds sway in the breeze.', Palm],
  ['Kayaker', 'Paddles left-right, bobbing on the water.', Kayaker],
  ['Skater', 'Rolls along with speed lines.', Skater],
];

export default function KitPage() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="label">Brand motion kit</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Filler animations for reels and the website</h1>
        <p className="muted">Solid stamp-style silhouettes with a printed grain, seamless loops (figures 4 s, waves 8 s). Light ink on footage or dark bands, dark ink on light backgrounds. Reel-ready transparent videos are in the GitHub repo under <code>brand/motion/</code>.</p>
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
