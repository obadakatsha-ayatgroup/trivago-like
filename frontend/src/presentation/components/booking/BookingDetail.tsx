import React from 'react';
import { Booking } from '@/domain/models/Booking';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface BookingDetailProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

const BookingDetail: React.FC<BookingDetailProps> = ({ booking, onCancel }) => {
  return (
    <div className="booking-detail">
      <h2>Booking Details</h2>
      <div className="booking-info">
        <div className="info-row">
          <span>Booking ID:</span>
          <span>{booking.id}</span>
        </div>
        <div className="info-row">
          <span>Status:</span>
          <span className={`status status--${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </div>
        <div className="info-row">
          <span>Check-in:</span>
          <span>{formatDate(booking.checkIn)}</span>
        </div>
        <div className="info-row">
          <span>Check-out:</span>
          <span>{formatDate(booking.checkOut)}</span>
        </div>
        <div className="info-row">
          <span>Guests:</span>
          <span>{booking.guests}</span>
        </div>
        <div className="info-row">
          <span>Total Price:</span>
          <span>{formatCurrency(booking.totalPrice, 'USD')}</span>
        </div>
        {booking.specialRequests && (
          <div className="special-requests">
            <h3>Special Requests</h3>
            <p>{booking.specialRequests}</p>
          </div>
        )}
      </div>
      {booking.status === 'CONFIRMED' && onCancel && (
        <button 
          className="cancel-button" 
          onClick={() => onCancel(booking.id)}
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

export default BookingDetail;