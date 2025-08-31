import { ApiClient } from './ApiClient';
import { Booking, BookingStatus } from '@/domain/models/Booking';

interface BackendBookingRequest {
  hotel_id: string;
  user_id: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  special_requests?: string;
}

interface BackendBookingResponse {
  id: string;
  hotel_id: string;
  hotel_name: string;
  user_id: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  total_price: number;
  nights_count: number;
  status: string;
  payment_status: string;
  special_requests?: string;
  can_cancel: boolean;
  created_at: string;
  updated_at: string;
}

export class BookingApi extends ApiClient {
  private mapToFrontendBooking(backendBooking: BackendBookingResponse): Booking {
    return {
      id: backendBooking.id,
      userId: backendBooking.user_id,
      hotelId: backendBooking.hotel_id,
      roomId: `${backendBooking.hotel_id}_${backendBooking.room_type}_0`, // Generate room ID
      checkIn: new Date(backendBooking.check_in_date),
      checkOut: new Date(backendBooking.check_out_date),
      guests: backendBooking.guests_count,
      totalPrice: backendBooking.total_price,
      status: this.mapBookingStatus(backendBooking.status),
      createdAt: new Date(backendBooking.created_at),
      specialRequests: backendBooking.special_requests
    };
  }

  private mapBookingStatus(backendStatus: string): BookingStatus {
    switch (backendStatus.toLowerCase()) {
      case 'pending':
        return BookingStatus.PENDING;
      case 'confirmed':
        return BookingStatus.CONFIRMED;
      case 'cancelled':
        return BookingStatus.CANCELLED;
      case 'completed':
        return BookingStatus.COMPLETED;
      default:
        return BookingStatus.PENDING;
    }
  }

  private mapToBackendRequest(bookingData: Omit<Booking, 'id' | 'createdAt'>): BackendBookingRequest {
    // Extract room type from roomId (assuming format: hotelId_roomType_index)
    const roomTypeParts = bookingData.roomId.split('_');
    const roomType = roomTypeParts.length > 1 ? roomTypeParts[1] : 'Standard Room';
    
    return {
      hotel_id: bookingData.hotelId,
      user_id: bookingData.userId,
      room_type: roomType,
      check_in_date: bookingData.checkIn.toISOString().split('T')[0],
      check_out_date: bookingData.checkOut.toISOString().split('T')[0],
      guests_count: bookingData.guests,
      special_requests: bookingData.specialRequests
    };
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    try {
      const backendRequest = this.mapToBackendRequest(bookingData);
      const backendResponse = await this.post<BackendBookingResponse>('/bookings', backendRequest);
      return this.mapToFrontendBooking(backendResponse);
    } catch (error) {
      console.error('API Error creating booking:', error);
      throw new Error('Failed to create booking. Please try again.');
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const backendResponse = await this.get<BackendBookingResponse>(`/bookings/${id}`);
      return this.mapToFrontendBooking(backendResponse);
    } catch (error) {
      console.error('API Error fetching booking:', error);
      throw new Error('Failed to fetch booking details.');
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const backendResponse = await this.get<BackendBookingResponse[]>(`/bookings/user/${userId}`);
      return backendResponse.map((booking: BackendBookingResponse) => this.mapToFrontendBooking(booking));
    } catch (error) {
      console.error('API Error fetching user bookings:', error);
      // Return empty array instead of throwing to prevent breaking the UI
      return [];
    }
  }

  async cancelBooking(id: string): Promise<void> {
    try {
      await this.post<void>(`/bookings/${id}/cancel`);
    } catch (error) {
      console.error('API Error cancelling booking:', error);
      throw new Error('Failed to cancel booking. Please try again.');
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    // Backend doesn't support partial updates yet
    throw new Error('Booking updates not supported by backend API');
  }
}