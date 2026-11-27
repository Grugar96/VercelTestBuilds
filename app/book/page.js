import BookingFlow from '@/components/BookingFlow';

export const metadata = { title: 'Book your stay', description: 'Book a Stay & Surf package or surf lessons in Mulki: pick your days, your dates and any extras, then pay online.' };

export default function Book() {
  return (
    <div className="book-page">
      <div className="wrap">
        <h1>Book your trip</h1>
        <div className="booking-flow"><BookingFlow /></div>
      </div>
    </div>
  );
}
