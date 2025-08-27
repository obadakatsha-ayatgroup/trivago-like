import { ApiClient } from './ApiClient';
import { Booking } from '@/domain/models/Booking';

export class BookingApi extends ApiClient {
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    return this.post<Booking>('/bookings', bookingData);
  }

  async getBookingById(id: string): Promise<Booking> {
    return this.get<Booking>(`/bookings/${id}`);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.get<Booking[]>(`/bookings/user/${userId}`);
  }

  async cancelBooking(id: string): Promise<void> {
    return this.delete<void>(`/bookings/${id}/cancel`);
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    return this.put<Booking>(`/bookings/${id}`, updates);
  }
}