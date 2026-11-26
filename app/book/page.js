import BookingFlow from '@/components/BookingFlow';

export const metadata = { title: 'Plan your stay', description: 'Choose surf lessons, a riverside bed or a Surf + Stay package in Mulki and send your booking request on WhatsApp.' };

export default function Book() {
  return (
    <div className="book-page">
      <div className="wrap">
        <p className="label">Mulki Surf Brothers · booking request</p>
        <h1>Plan your stay</h1>
        <p className="muted" style={{ margin: 0 }}>One choice at a time. Nothing is charged here: we confirm availability and the final price with you on WhatsApp.</p>
        <BookingFlow />
      </div>
    </div>
  );
}
