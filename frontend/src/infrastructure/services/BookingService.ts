import { IBookingService } from '@/domain/interfaces/IBookingService';
import { Booking } from '@/domain/models/Booking';
import { BookingApi } from '../api/BookingApi';

export class BookingService implements IBookingService {
  private bookingApi: BookingApi;

  constructor() {
    this.bookingApi = new BookingApi();
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    try {
      return await this.bookingApi.createBooking(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      return await this.bookingApi.getBookingById(id);
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      return await this.bookingApi.getUserBookings(userId);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async cancelBooking(id: string): Promise<void> {
    try {
      await this.bookingApi.cancelBooking(id);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    try {
      return await this.bookingApi.updateBooking(id, updates);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }
}