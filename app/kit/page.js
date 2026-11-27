import { Shaka, Surfer, Kayaker, Palm, Skater, WaveStrip } from '@/components/kit/Kit';
import { WarliSurfer, WarliKayaker, WarliSkater, WarliPalm, WarliCircle, WarliFrieze, Zigzag } from '@/components/kit/Warli';

export const metadata = { title: 'Motion kit', robots: { index: false, follow: false } };

const SurferMan = (p) => <Surfer variant="man" {...p} />;
const SurferWoman = (p) => <Surfer variant="woman" {...p} />;
const WMan = (p) => <WarliSurfer variant="man" {...p} />;
const WWoman = (p) => <WarliSurfer variant="woman" {...p} />;
const WARLI = [
  ['Surfer — man', 'Warli figure riding a longboard. Water stays still; only the rider moves.', WMan],
  ['Surfer — woman', 'Same ride, with the hair bun. Alternate with the man.', WWoman],
  ['Kayaker', 'Paddle rocks side to side, boat bobs, water still.', WarliKayaker],
  ['Skater', 'Rolls with speed lines.', WarliSkater],
  ['Coconut tree', 'Fronds sway.', WarliPalm],
  ['Bonfire circle', 'Friends dancing around the fire, turning slowly. For evenings and bonfire nights.', WarliCircle],
];
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
        <p className="label">Draft · Warli style</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Warli-style figures</h1>
        <p className="muted">Inspired by Warli wall painting: two triangles meeting at the waist, a round head, thin line limbs, one flat colour, framed by zigzag borders. Same off-white / charcoal paint as the rest of the brand.</p>
        <div className="kit-grid">
          {WARLI.map(([name, desc, C]) => (
            <article key={name} className="kit-card">
              <div className="kit-swatch light"><C tone="light" size={200} /></div>
              <div className="kit-swatch dark"><C tone="dark" size={200} /></div>
              <h3>{name}</h3><p className="small muted">{desc}</p>
            </article>
          ))}
        </div>
        <h3 style={{ marginTop: '2.5rem' }}>Frieze</h3>
        <p className="small muted">A painted wall of everyday Mulki moments: carrying boards, chai, cycling, music by the fire, kayaking, a wave goodbye. Shown on laterite red (draft colour) and Deep Ocean.</p>
        <div className="frieze-band" style={{ borderRadius: 16, overflow: 'hidden', marginTop: '1rem' }}><Zigzag /><div className="frieze-scroll"><WarliFrieze /></div><Zigzag flip /></div>
        <div className="frieze-band" style={{ background: 'var(--sb-ocean-deep)', borderRadius: 16, overflow: 'hidden', marginTop: '1rem' }}><Zigzag /><div className="frieze-scroll"><WarliFrieze /></div><Zigzag flip /></div>
        <hr style={{ margin: '3rem 0', border: 0, borderTop: '1px solid var(--sb-line)' }} />
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
