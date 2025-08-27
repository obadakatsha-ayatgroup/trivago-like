export interface SearchCriteria {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
}

export interface SearchFilters {
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  stars: number[];
  amenities: string[];
  sortBy: SortOption;
}

export enum SortOption {
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  RATING = 'RATING',
  DISTANCE = 'DISTANCE'
}