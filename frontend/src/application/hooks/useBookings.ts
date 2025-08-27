import { useState, useEffect } from 'react';
import { Booking } from '@/domain/models/Booking';
import { BookingService } from '@/infrastructure/services/BookingService';

const bookingService = new BookingService();

export const useBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingService.getUserBookings(userId);
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings([...bookings, newBooking]);
      return newBooking;
    } catch (err) {
      throw new Error('Failed to create booking');
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await bookingService.cancelBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      throw new Error('Failed to cancel booking');
    }
  };

  return { bookings, loading, error, createBooking, cancelBooking };
};