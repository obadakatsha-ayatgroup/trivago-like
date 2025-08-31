import { useState, useEffect } from 'react';
import { Booking } from '@/domain/models/Booking';
import { BookingService } from '@/infrastructure/services/BookingService';

const bookingService = new BookingService();

export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingService.getUserBookings(userId);
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings');
        setBookings([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      return newBooking;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw new Error('Failed to create booking');
    }
  };

  const cancelBooking = async (id: string): Promise<void> => {
    try {
      await bookingService.cancelBooking(id);
      // Update the booking status in the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id 
            ? { ...booking, status: 'CANCELLED' as any } 
            : booking
        )
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw new Error('Failed to cancel booking');
    }
  };

  const getBookingById = async (id: string): Promise<Booking | null> => {
    try {
      return await bookingService.getBookingById(id);
    } catch (err) {
      console.error('Error fetching booking:', err);
      return null;
    }
  };

  return { 
    bookings, 
    loading, 
    error, 
    createBooking, 
    cancelBooking, 
    getBookingById 
  };
};