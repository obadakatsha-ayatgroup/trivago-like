import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { useHotel } from '@/application/hooks/useHotels';
import { useBookings } from '@/application/hooks/useBookings';
import { Booking, BookingStatus } from '@/domain/models/Booking';
import Loading from '@/presentation/components/common/Loading';

const NewBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createBooking } = useBookings(user?.id);
  
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel(hotelId || '');
  
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    return dayAfter.toISOString().split('T')[0];
  });
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!hotelId || !roomId) {
      navigate('/search');
      return;
    }
  }, [isAuthenticated, hotelId, roomId, navigate]);

  if (hotelLoading) return <Loading />;
  if (hotelError || !hotel) return <div className="error">Hotel not found</div>;
  if (!isAuthenticated || !user) return <div className="error">Please log in to book</div>;

  const selectedRoom = hotel.rooms.find(room => room.id === roomId);
  if (!selectedRoom) {
    return <div className="error">Room not found</div>;
  }

  const calculateTotal = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * nights;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
        userId: user.id,
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice: calculateTotal(),
        status: BookingStatus.PENDING,
        specialRequests: specialRequests || undefined
      };

      await createBooking(bookingData);
      alert('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-container">
          <div className="booking-details">
            <h1>Complete Your Booking</h1>
            
            <div className="hotel-info">
              <h2>{hotel.name}</h2>
              <p>{hotel.address.city}, {hotel.address.country}</p>
              <div className="room-info">
                <h3>{selectedRoom.type}</h3>
                <p>Capacity: {selectedRoom.capacity} guests</p>
                <p className="price">${selectedRoom.price} per night</p>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="check-in">Check-in Date</label>
                  <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="check-out">Check-out Date</label>
                  <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  required
                >
                  {[...Array(selectedRoom.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="special-requests">Special Requests (Optional)</label>
                <textarea
                  id="special-requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                  placeholder="Any special requirements or requests..."
                />
              </div>

              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-row">
                  <span>Check-in:</span>
                  <span>{new Date(checkIn).toLocaleDateString()}</span>
                </div>
                <div className="summary-row">
                  <span>Check-out:</span>
                  <span>{new Date(checkOut).toLocaleDateString()}</span>
                </div>
                <div className="summary-row">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="book-now-btn">
                {loading ? 'Processing...' : `Book Now - $${calculateTotal()}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBookingPage;