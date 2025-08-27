import React from 'react';
import { Booking } from '@/domain/models/Booking';
import { formatDate } from '@/utils/helpers';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className="booking-card">
      <div className="booking-card__header">
        <h3>Booking #{booking.id}</h3>
        <span className={`status status--${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
      </div>
      <div className="booking-card__details">
        <p>Check-in: {formatDate(booking.checkIn)}</p>
        <p>Check-out: {formatDate(booking.checkOut)}</p>
        <p>Guests: {booking.guests}</p>
        <p>Total: ${booking.totalPrice}</p>
      </div>
    </div>
  );
};

export default BookingCard;