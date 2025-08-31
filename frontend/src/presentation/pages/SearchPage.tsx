import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchCriteria, SearchFilters, SortOption } from '@/domain/models/Search';
import { useHotels } from '@/application/hooks/useHotels';
import SearchBar from '@/presentation/components/search/SearchBar';
import FilterPanel from '@/presentation/components/search/FilterPanel';
import HotelList from '@/presentation/components/hotel/HotelList';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const getInitialCriteria = (): SearchCriteria | null => {
    const destination = urlParams.get('destination');
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');
    const guests = urlParams.get('guests');
    const rooms = urlParams.get('rooms');
    
    if (destination && checkIn && checkOut) {
      return {
        destination,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: guests ? parseInt(guests) : 2,
        rooms: rooms ? parseInt(rooms) : 1
      };
    }
    return null;
  };
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(getInitialCriteria());
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    stars: [],
    amenities: [],
    sortBy: SortOption.PRICE_ASC
  });

  const { hotels, loading, error } = useHotels(searchCriteria || undefined, filters);

  // Update search criteria when URL changes
  useEffect(() => {
    const newCriteria = getInitialCriteria();
    if (newCriteria) {
      setSearchCriteria(newCriteria);
    }
  }, [location.search]);

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
    <div className="search-page">
      {/* Search Header */}
      <div className="search-page__header">
        <div className="container">
          <SearchBar onSearch={handleSearch} initialCriteria={searchCriteria} />
        </div>
      </div>

      {/* Search Results */}
      {searchCriteria ? (
        <div className="search-page__results">
          <div className="container">
            <div className="search-results">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
              <div className="search-results__content">
                {loading && (
                  <div className="search-loading">
                    <div className="loading">
                      <div className="loading__spinner"></div>
                      <p>Searching for the best hotels in {searchCriteria.destination}...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="search-error">
                    <h3>Oops! Something went wrong</h3>
                    <p>We couldn't find hotels for your search. Please try again with different criteria.</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                  </div>
                )}
                
                {!loading && !error && (
                  <>
                    {hotels.length > 0 ? (
                      <HotelList 
                        hotels={hotels}
                        loading={loading}
                        error={error}
                        onHotelSelect={handleHotelSelect}
                      />
                    ) : (
                      <div className="no-results">
                        <h3>No hotels found</h3>
                        <p>We couldn't find any hotels matching your criteria in {searchCriteria.destination}.</p>
                        <p>Try adjusting your filters or search for a different destination.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="search-page__empty">
          <div className="container">
            <div className="empty-state">
              <h2>Find Your Perfect Stay</h2>
              <p>Search for hotels, resorts, and accommodations worldwide</p>
              <div className="popular-searches">
                <h3>Popular Destinations</h3>
                <div className="quick-search-buttons">
                  {['Paris', 'London', 'New York', 'Tokyo', 'Barcelona', 'Dubai'].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const dayAfter = new Date();
                        dayAfter.setDate(dayAfter.getDate() + 2);
                        
                        handleSearch({
                          destination: city,
                          checkIn: tomorrow,
                          checkOut: dayAfter,
                          guests: 2,
                          rooms: 1
                        });
                      }}
                      className="quick-search-btn"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;