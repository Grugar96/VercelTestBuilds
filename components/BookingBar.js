'use client';
import { useState } from 'react';
import { PACKAGE_DAYS, PACKAGE_PRICE } from '@/lib/site';

// Quick start in the hero: days, arrival and guests, then straight into the booking flow with it all filled in.
export default function BookingBar() {
  const [days, setDays] = useState(5);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();
  const href = `/book?type=stay&days=${days}&guests=${guests}${date ? `&date=${date}` : ''}`;
  return (
    <form className="book-bar" action="/book" onSubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
      <label><span>Stay &amp; surf</span>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
          {PACKAGE_DAYS.map((d) => <option key={d} value={d}>{d} days · from ₹{PACKAGE_PRICE.camp[d].toLocaleString('en-IN')}</option>)}
        </select>
      </label>
      <label><span>Arriving</span><input type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <label className="bb-guests"><span>Guests</span>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select>
      </label>
      <button type="submit" className="btn btn-primary">Check dates</button>
    </form>
  );
}
