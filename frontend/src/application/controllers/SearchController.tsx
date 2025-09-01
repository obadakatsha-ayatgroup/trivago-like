import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchCriteria, SearchFilters, SortOption } from '@/domain/models/Search';
import { useHotels } from '../hooks/useHotels';
import SearchBar from '@/presentation/components/search/SearchBar';
import FilterPanel from '@/presentation/components/search/FilterPanel';
import HotelList from '@/presentation/components/hotel/HotelList';

const SearchController: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial search criteria from URL params
  const urlParams = new URLSearchParams(location.search);
  const initialDestination = urlParams.get('destination') || '';
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(
    initialDestination ? {
      destination: initialDestination,
      checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      guests: 2,
      rooms: 1
    } : null
  );
  
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
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set('destination', criteria.destination);
    params.set('checkIn', criteria.checkIn.toISOString().split('T')[0]);
    params.set('checkOut', criteria.checkOut.toISOString().split('T')[0]);
    params.set('guests', criteria.guests.toString());
    params.set('rooms', criteria.rooms.toString());
    
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [navigate]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handleHotelSelect = useCallback((hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
  }, [navigate]);

  return (
    <div className="search-controller">
      <div className="search-controller__search-bar">
        <SearchBar onSearch={handleSearch} initialCriteria={searchCriteria} />
      </div>
      
      {searchCriteria && (
        <div className="search-controller__results">
          <div className="search-results">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            <div className="search-results__content">
              {loading && <div className="search-loading">Searching for the best hotels...</div>}
              {error && <div className="search-error">Search failed: {error}</div>}
              {!loading && !error && searchCriteria && (
                <HotelList 
                  hotels={hotels}
                  loading={loading}
                  error={error}
                  onHotelSelect={handleHotelSelect}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {!searchCriteria && (
        <div className="search-controller__empty">
          <h2>Find Your Perfect Stay</h2>
          <p>Search for hotels in your favorite destinations</p>
        </div>
      )}
    </div>
  );
};

export default SearchController;