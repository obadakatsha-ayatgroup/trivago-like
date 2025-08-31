import { ApiClient } from './ApiClient';
import { Hotel, Room } from '@/domain/models/Hotel';
import { SearchCriteria, SearchFilters } from '@/domain/models/Search';
import { HotelMapper } from './mappers/HotelMapper';

interface BackendSearchResponse {
  hotels: any[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export class HotelApi extends ApiClient {
  async searchHotels(criteria: SearchCriteria, filters?: SearchFilters): Promise<Hotel[]> {
    const params = HotelMapper.toBackendSearchParams(criteria, filters);
    const response = await this.get<BackendSearchResponse>('/search/hotels', { params });
    
    return response.hotels.map(hotel => HotelMapper.toFrontendModel(hotel));
  }

  async getHotelById(id: string): Promise<Hotel> {
    const backendHotel = await this.get<any>(`/hotels/${id}`);
    return HotelMapper.toFrontendModel(backendHotel);
  }

  async getAvailableRooms(hotelId: string, checkIn: Date, checkOut: Date): Promise<Room[]> {
    // Backend doesn't have separate rooms endpoint, get from hotel details
    const hotel = await this.getHotelById(hotelId);
    return hotel.rooms.filter(room => room.available);
  }

  async getNearbyHotels(lat: number, lng: number, radius: number): Promise<Hotel[]> {
    // Backend doesn't have nearby hotels endpoint yet, return empty for now
    console.warn('Nearby hotels not implemented in backend yet');
    return [];
  }
}