import { ApiClient } from './ApiClient';
import { Hotel, Room } from '@/domain/models/Hotel';
import { SearchCriteria, SearchFilters } from '@/domain/models/Search';

export class HotelApi extends ApiClient {
  async searchHotels(criteria: SearchCriteria, filters?: SearchFilters): Promise<Hotel[]> {
    const params = {
      ...criteria,
      checkIn: criteria.checkIn.toISOString(),
      checkOut: criteria.checkOut.toISOString(),
      ...filters
    };
    return this.get<Hotel[]>('/search/hotels', { params });
  }

  async getHotelById(id: string): Promise<Hotel> {
    return this.get<Hotel>(`/hotels/${id}`);
  }

  async getAvailableRooms(hotelId: string, checkIn: Date, checkOut: Date): Promise<Room[]> {
    return this.get<Room[]>(`/hotels/${hotelId}/rooms`, {
      params: {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString()
      }
    });
  }

  async getNearbyHotels(lat: number, lng: number, radius: number): Promise<Hotel[]> {
    return this.get<Hotel[]>('/hotels/nearby', {
      params: { lat, lng, radius }
    });
  }
}