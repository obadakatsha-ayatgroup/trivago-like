import { Hotel, Room } from '../models/Hotel';
import { SearchCriteria, SearchFilters } from '../models/Search';

export interface IHotelService {
  searchHotels(criteria: SearchCriteria, filters?: SearchFilters): Promise<Hotel[]>;
  getHotelById(id: string): Promise<Hotel>;
  getAvailableRooms(hotelId: string, checkIn: Date, checkOut: Date): Promise<Room[]>;
  getNearbyHotels(latitude: number, longitude: number, radius: number): Promise<Hotel[]>;
}