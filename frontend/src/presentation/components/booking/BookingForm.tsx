import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking, BookingStatus } from '@/domain/models/Booking';
import { useBookings } from '@/application/hooks/useBookings';
import { useApp } from '@/application/context/AppContext';

interface BookingFormProps {
  hotelId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  hotelId, 
  roomId, 
  checkIn, 
  checkOut, 
  price 
}) => {
  const navigate = useNavigate();
  const { user } = useApp();
  const { createBooking } = useBookings(user?.id);
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
        userId: user.id,
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests,
        totalPrice: price,
        status: BookingStatus.PENDING,
        specialRequests
      };

      await createBooking(bookingData);
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Complete Your Booking</h2>
      
      <div className="form-group">
        <label htmlFor="guests">Number of Guests</label>
        <input
          id="guests"
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="special-requests">Special Requests (Optional)</label>
        <textarea
          id="special-requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={4}
        />
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p>Check-in: {checkIn.toLocaleDateString()}</p>
        <p>Check-out: {checkOut.toLocaleDateString()}</p>
        <p>Total Price: ${price}</p>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
};

export default BookingForm;