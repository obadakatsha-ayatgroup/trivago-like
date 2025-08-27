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
    const roomType = bookingData.roomId.split('_')[1] || 'standard';
    
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
    const backendRequest = this.mapToBackendRequest(bookingData);
    const backendResponse = await this.post<BackendBookingResponse>('/bookings', backendRequest);
    return this.mapToFrontendBooking(backendResponse);
  }

  async getBookingById(id: string): Promise<Booking> {
    const backendResponse = await this.get<BackendBookingResponse>(`/bookings/${id}`);
    return this.mapToFrontendBooking(backendResponse);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const backendResponse = await this.get<BackendBookingResponse[]>(`/bookings/user/${userId}`);
    return backendResponse.map(booking => this.mapToFrontendBooking(booking));
  }

  async cancelBooking(id: string): Promise<void> {
    await this.post<void>(`/bookings/${id}/cancel`);
  }

  // async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  //   // Backend doesn't support partial updates, would need full booking data
  //   throw new Error('Booking updates not supported by backend API');
  // }
}