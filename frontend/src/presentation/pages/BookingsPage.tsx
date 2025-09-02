import React from 'react';
import { useAuth } from '@/application/context/AuthContext';
import { useBookings } from '@/application/hooks/useBookings';
import BookingList from '@/presentation/components/booking/BookingList';
import Loading from '@/presentation/components/common/Loading';
import { Link } from 'react-router-dom';

const BookingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { bookings, loading, error, cancelBooking } = useBookings(user?.id);

  if (!isAuthenticated || !user) {
    return (
      <div className="bookings-page">
        <div className="container">
          <div className="auth-required">
            <h2>Sign In Required</h2>
            <p>Please <Link to="/login">sign in</Link> to view your bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        alert('Booking cancelled successfully');
      } catch (err) {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  return (
    <div className="bookings-page">
      <div className="container">
        <h1>My Bookings</h1>
        <p className="bookings-subtitle">
          Manage your hotel reservations and view booking history
        </p>

        {loading && <Loading />}
        
        {error && (
          <div className="error-message">
            <h3>Unable to load bookings</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-bookings">
            <h3>No bookings found</h3>
            <p>You haven't made any hotel reservations yet.</p>
            <Link to="/search">
              <button>Search Hotels</button>
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <>
            <div className="bookings-stats">
              <p>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="booking-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card__header">
                    <h3>Booking #{booking.id.slice(0, 8)}</h3>
                    <span className={`status status--${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-card__details">
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Check-in</span>
                      <span className="booking-detail-value">
                        {booking.checkIn.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Check-out</span>
                      <span className="booking-detail-value">
                        {booking.checkOut.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Guests</span>
                      <span className="booking-detail-value">{booking.guests}</span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Total Price</span>
                      <span className="booking-detail-value">${booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="special-requests">
                      <h4>Special Requests:</h4>
                      <p>{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="booking-actions">
                    {booking.status === 'CONFIRMED' && (
                      <button 
                        className="cancel-button"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'PENDING' && (
                      <div className="booking-status-info">
                        <p>Your booking is being processed. You'll receive a confirmation email soon.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;