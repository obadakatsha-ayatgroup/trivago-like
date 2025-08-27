import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchCriteria, SearchFilters, SortOption } from '@/domain/models/Search';
import { useHotels } from '../hooks/useHotels';
import SearchBar from '@/presentation/components/search/SearchBar';
import FilterPanel from '@/presentation/components/search/FilterPanel';
import HotelList from '@/presentation/components/hotel/HotelList';

const SearchController: React.FC = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    stars: [],
    amenities: [],
    sortBy: SortOption.PRICE_ASC
  });

  const { hotels, loading, error } = useHotels(searchCriteria || undefined, filters);

  const handleSearch = useCallback((criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  }, []);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handleHotelSelect = useCallback((hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
  }, [navigate]);

  return (
    <div className="search-controller">
      <SearchBar onSearch={handleSearch} initialCriteria={searchCriteria} />
      <div className="search-results">
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        <HotelList 
          hotels={hotels}
          loading={loading}
          error={error}
          onHotelSelect={handleHotelSelect}
        />
      </div>
    </div>
  );
};

export default SearchController;