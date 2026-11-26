'use client';
import { useState } from 'react';
import { GALLERY } from '@/lib/site';

const FILTERS = [['all', 'All'], ['surf', 'Surf'], ['stay', 'Stay'], ['river', 'River'], ['life', 'Life']];

export default function GalleryGrid() {
  const [f, setF] = useState('all');
  return (
    <>
      <div className="gallery-filter" role="group" aria-label="Filter photos" style={{ marginTop: '3rem' }}>
        {FILTERS.map(([k, l]) => <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>)}
      </div>
      <div className="gallery-grid">
        {GALLERY.map((g) => (
          <figure key={g.src} hidden={f !== 'all' && g.cat !== f}>
            <img src={g.src} alt={g.alt} loading="lazy" />
            <figcaption>{g.caption}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
