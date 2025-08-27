import React from 'react';
import { useApp } from '@/application/context/AppContext';
import BookingList from '@/presentation/components/booking/BookingList';
import { useBookings } from '@/application/hooks/useBookings';

const BookingsPage: React.FC = () => {
  const { user } = useApp();
  const { bookings, loading, error } = useBookings(user?.id);

  if (!user) {
    return (
      <div className="bookings-page">
        <p>Please log in to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      <BookingList bookings={bookings} loading={loading} error={error} />
    </div>
  );
};

export default BookingsPage;