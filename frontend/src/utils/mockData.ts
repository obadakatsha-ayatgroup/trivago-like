import { Hotel } from '@/domain/models/Hotel';
import { Booking, BookingStatus } from '@/domain/models/Booking';

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Palace Hotel',
    description: 'A luxurious 5-star hotel in the heart of Paris with stunning views of the Eiffel Tower and world-class amenities.',
    rating: 9.2,
    stars: 5,
    address: {
      street: '123 Champs-Élysées',
      city: 'Paris',
      country: 'France',
      postalCode: '75008'
    },
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1578774204375-51d5c86de3d2?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service'],
    rooms: [
      {
        id: '1_deluxe_0',
        hotelId: '1',
        type: 'Deluxe Room',
        capacity: 2,
        price: 250,
        amenities: ['WiFi', 'Mini Bar', 'City View'],
        available: true
      },
      {
        id: '1_suite_0',
        hotelId: '1',
        type: 'Presidential Suite',
        capacity: 4,
        price: 500,
        amenities: ['WiFi', 'Mini Bar', 'Balcony', 'Butler Service'],
        available: true
      }
    ],
    pricePerNight: 250,
    currency: 'EUR',
    availability: true
  },
  {
    id: '2',
    name: 'Tokyo Bay Resort',
    description: 'Modern waterfront hotel with panoramic bay views, authentic Japanese cuisine, and traditional spa services.',
    rating: 8.8,
    stars: 4,
    address: {
      street: '1-1-1 Shibaura',
      city: 'Tokyo',
      country: 'Japan',
      postalCode: '108-0023'
    },
    coordinates: {
      latitude: 35.6762,
      longitude: 139.6503
    },
    images: [
      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    amenities: ['WiFi', 'Restaurant', 'Spa', 'Business Center'],
    rooms: [
      {
        id: '2_standard_0',
        hotelId: '2',
        type: 'Standard Room',
        capacity: 2,
        price: 180,
        amenities: ['WiFi', 'Tea Set'],
        available: true
      },
      {
        id: '2_bay_view_0',
        hotelId: '2',
        type: 'Bay View Room',
        capacity: 2,
        price: 220,
        amenities: ['WiFi', 'Tea Set', 'Bay View'],
        available: true
      }
    ],
    pricePerNight: 180,
    currency: 'JPY',
    availability: true
  },
  {
    id: '3',
    name: 'Manhattan Downtown Hotel',
    description: 'Stylish boutique hotel in the financial district, walking distance to Wall Street and Brooklyn Bridge.',
    rating: 8.5,
    stars: 4,
    address: {
      street: '85 West Street',
      city: 'New York',
      country: 'USA',
      postalCode: '10006'
    },
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
    ],
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Business Center'],
    rooms: [
      {
        id: '3_city_0',
        hotelId: '3',
        type: 'City View Room',
        capacity: 2,
        price: 320,
        amenities: ['WiFi', 'City View', 'Coffee Machine'],
        available: true
      }
    ],
    pricePerNight: 320,
    currency: 'USD',
    availability: true
  },
  {
    id: '4',
    name: 'Royal London Hotel',
    description: 'Classic British elegance meets modern comfort in this historic hotel near Hyde Park and Buckingham Palace.',
    rating: 9.0,
    stars: 5,
    address: {
      street: '1 Park Lane',
      city: 'London',
      country: 'United Kingdom',
      postalCode: 'W1K 1QA'
    },
    coordinates: {
      latitude: 51.5074,
      longitude: -0.1278
    },
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Concierge'],
    rooms: [
      {
        id: '4_royal_0',
        hotelId: '4',
        type: 'Royal Suite',
        capacity: 4,
        price: 450,
        amenities: ['WiFi', 'Park View', 'Butler Service', 'Fireplace'],
        available: true
      }
    ],
    pricePerNight: 450,
    currency: 'GBP',
    availability: true
  },
  {
    id: '5',
    name: 'Barcelona Beach Resort',
    description: 'Mediterranean paradise with private beach access, rooftop terrace, and authentic Catalan cuisine.',
    rating: 8.7,
    stars: 4,
    address: {
      street: 'Passeig Marítim de la Barceloneta',
      city: 'Barcelona',
      country: 'Spain',
      postalCode: '08003'
    },
    coordinates: {
      latitude: 41.3851,
      longitude: 2.1734
    },
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1559599238-1c2c0cb9d7d5?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar'],
    rooms: [
      {
        id: '5_ocean_0',
        hotelId: '5',
        type: 'Ocean View Room',
        capacity: 2,
        price: 280,
        amenities: ['WiFi', 'Ocean View', 'Balcony'],
        available: true
      }
    ],
    pricePerNight: 280,
    currency: 'EUR',
    availability: true
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    hotelId: '1',
    roomId: '1_deluxe_0',
    checkIn: new Date('2024-03-15'),
    checkOut: new Date('2024-03-18'),
    guests: 2,
    totalPrice: 750,
    status: BookingStatus.CONFIRMED,
    createdAt: new Date('2024-02-15'),
    specialRequests: 'Late check-in requested'
  },
  {
    id: '2',
    userId: '1',
    hotelId: '2',
    roomId: '2_bay_view_0',
    checkIn: new Date('2024-04-20'),
    checkOut: new Date('2024-04-25'),
    guests: 2,
    totalPrice: 1100,
    status: BookingStatus.PENDING,
    createdAt: new Date('2024-02-20')
  }
];

export const popularDestinations = [
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
    hotelsCount: 1250
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    hotelsCount: 980
  },
  {
    city: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    hotelsCount: 1500
  },
  {
    city: 'London',
    country: 'UK',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    hotelsCount: 750
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400',
    hotelsCount: 620
  },
  {
    city: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
    hotelsCount: 450
  }
];