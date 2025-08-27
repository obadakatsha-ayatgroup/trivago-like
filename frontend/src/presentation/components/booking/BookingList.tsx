import React from 'react';
import { Booking } from '@/domain/models/Booking';
import BookingCard from './BookingCard';
import Loading from '../common/Loading';

interface BookingListProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, loading, error }) => {
  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;
  if (bookings.length === 0) return <div>No bookings found.</div>;

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default BookingList;