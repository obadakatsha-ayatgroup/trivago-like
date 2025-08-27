import React from 'react';
import { useApp } from '../context/AppContext';
import { useBookings } from '../hooks/useBookings';
import BookingList from '@/presentation/components/booking/BookingList';

const BookingController: React.FC = () => {
  const { user } = useApp();
  const { bookings, loading, error, cancelBooking } = useBookings(user?.id);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully');
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  if (!user) {
    return <div>Please login to view bookings</div>;
  }

  return (
    <div className="booking-controller">
      <h2>Your Bookings</h2>
      <BookingList 
        bookings={bookings} 
        loading={loading} 
        error={error}
      />
    </div>
  );
};

export default BookingController;