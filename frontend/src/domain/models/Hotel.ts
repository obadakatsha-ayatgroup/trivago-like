export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  stars: number;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  amenities: string[];
  rooms: Room[];
  pricePerNight: number;
  currency: string;
  availability: boolean;
}

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  available: boolean;
}