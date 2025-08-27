import { Booking } from '../models/Booking';

export interface IBookingService {
  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking>;
  getBookingById(id: string): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  cancelBooking(id: string): Promise<void>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking>;
}