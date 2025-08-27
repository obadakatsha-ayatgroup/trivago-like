import { Hotel, Room } from '@/domain/models/Hotel';

interface BackendHotelResponse {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    postal_code?: string;
  };
  category: string;
  star_rating: number;
  amenities: string[];
  rooms: Array<{
    room_type: string;
    price_per_night: number;
    capacity: number;
    available_count: number;
    description: string;
  }>;
  images: string[];
  check_in_time: string;
  check_out_time: string;
  policies: Record<string, string>;
  minimum_price: number;
  available_rooms: number;
  created_at: string;
  updated_at: string;
}

export class HotelMapper {
  static toFrontendModel(backendHotel: BackendHotelResponse): Hotel {
    // Generate room IDs (backend doesn't provide them)
    const rooms: Room[] = backendHotel.rooms.map((room, index) => ({
      id: `${backendHotel.id}_${room.room_type}_${index}`,
      hotelId: backendHotel.id,
      type: room.room_type,
      capacity: room.capacity,
      price: room.price_per_night,
      amenities: [], // Backend doesn't provide room-specific amenities
      available: room.available_count > 0
    }));

    return {
      id: backendHotel.id,
      name: backendHotel.name,
      description: backendHotel.description,
      rating: 8.5, // Backend doesn't provide guest rating, using default
      stars: backendHotel.star_rating,
      address: {
        street: backendHotel.location.address,
        city: backendHotel.location.city,
        country: backendHotel.location.country,
        postalCode: backendHotel.location.postal_code || ''
      },
      coordinates: {
        latitude: backendHotel.location.latitude,
        longitude: backendHotel.location.longitude
      },
      images: backendHotel.images,
      amenities: backendHotel.amenities,
      rooms: rooms,
      pricePerNight: backendHotel.minimum_price,
      currency: 'USD', // Backend doesn't specify currency
      availability: backendHotel.available_rooms > 0
    };
  }

  static toBackendSearchParams(criteria: any, filters?: any) {
    return {
      destination: criteria.destination,
      check_in: criteria.checkIn?.toISOString().split('T')[0],
      check_out: criteria.checkOut?.toISOString().split('T')[0],
      guests: criteria.guests,
      min_price: filters?.priceRange?.min,
      max_price: filters?.priceRange?.max,
      amenities: filters?.amenities,
      min_rating: filters?.rating ? Math.ceil(filters.rating / 2) : undefined, // Convert 10-point to 5-point scale
      page: 0,
      page_size: 50
    };
  }
}