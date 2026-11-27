import Wavy from './Wavy';
import { HAPPENINGS } from '@/lib/site';

// Snake layout: first row left to right, second row right to left, joined by one hand-drawn route line
// that passes behind every print (desktop). Phones get a simple two-column stack.
const ROW1 = [[10, 30, -5, 'm'], [29, 24, 3, 's'], [49, 32, -3, 'm'], [69, 23, 4, 's'], [89, 31, -4, 'm']];
const ROW2 = [[89, 72, 3, 's'], [69, 79, -4, 'm'], [49, 70, 2, 's'], [29, 78, -3, 'm'], [10, 71, 5, 's']];
const POS = [...ROW1, ...ROW2];

function routePath(points) {
  // Catmull-Rom through the print centres, in a 1000x1000 box, with a lead-in and a tail.
  const p = [[-20, 120], ...points.map(([x, y]) => [x * 10, y * 10]), [-20, 880]];
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export default function Happenings() {
  return (
    <section className="section happenings" aria-labelledby="hp-title">
      <div className="wrap hp-head">
        <div>
          <Wavy as="p" className="label eyebrow">the best part</Wavy>
          <h2 id="hp-title">Everything that happens here</h2>
        </div>
        <p className="lead">People turn up on their own and leave with a group chat. Here's roughly how the days go.</p>
      </div>
      <div className="wrap hp-board">
        <svg className="hp-route draw" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d={routePath(POS.slice(0, HAPPENINGS.length))} />
        </svg>
        <ol className="hp-list">
          {HAPPENINGS.map(([time, cap, img, alt], i) => {
            const [x, y, r, size] = POS[i] || [50, 50, 0, 's'];
            return (
              <li key={cap} className={`hp-print ${size}`} style={{ '--x': `${x}%`, '--y': `${y}%`, '--r': `${r}deg` }}>
                <figure>
                  <img src={`/img/${img}`} alt={alt} loading="lazy" />
                  <figcaption><Wavy className="hp-time">{time}</Wavy><Wavy>{cap}</Wavy></figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
