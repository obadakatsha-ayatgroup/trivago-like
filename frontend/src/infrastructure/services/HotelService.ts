import { IHotelService } from '@/domain/interfaces/IHotelService';
import { Hotel, Room } from '@/domain/models/Hotel';
import { SearchCriteria, SearchFilters } from '@/domain/models/Search';
import { HotelApi } from '../api/HotelApi';

export class HotelService implements IHotelService {
  private hotelApi: HotelApi;

  constructor() {
    this.hotelApi = new HotelApi();
  }

  async searchHotels(criteria: SearchCriteria, filters?: SearchFilters): Promise<Hotel[]> {
    try {
      return await this.hotelApi.searchHotels(criteria, filters);
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  async getHotelById(id: string): Promise<Hotel> {
    try {
      return await this.hotelApi.getHotelById(id);
    } catch (error) {
      console.error('Error fetching hotel:', error);
      throw error;
    }
  }

  async getAvailableRooms(hotelId: string, checkIn: Date, checkOut: Date): Promise<Room[]> {
    try {
      return await this.hotelApi.getAvailableRooms(hotelId, checkIn, checkOut);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  async getNearbyHotels(latitude: number, longitude: number, radius: number): Promise<Hotel[]> {
    try {
      return await this.hotelApi.getNearbyHotels(latitude, longitude, radius);
    } catch (error) {
      console.error('Error fetching nearby hotels:', error);
      throw error;
    }
  }
}