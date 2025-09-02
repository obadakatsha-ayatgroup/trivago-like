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
  
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    stars: [],
    amenities: [],
    sortBy: SortOption.PRICE_ASC
  });

  // Parse URL parameters only once when location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const destination = urlParams.get('destination');
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');
    const guests = urlParams.get('guests');
    const rooms = urlParams.get('rooms');
    
    if (destination && destination.trim() && checkIn && checkOut) {
      setSearchCriteria({
        destination: destination.trim(),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: guests ? parseInt(guests) : 2,
        rooms: rooms ? parseInt(rooms) : 1
      });
    } else {
      setSearchCriteria(null);
    }
  }, [location.search]);

  // Only call useHotels when we have search criteria
  const { hotels, loading, error } = useHotels(searchCriteria || undefined, filters);

  const handleSearch = useCallback((criteria: SearchCriteria) => {
    if (!criteria.destination || !criteria.destination.trim()) {
      alert('Please enter a destination');
      return;
    }

    // Update URL with search parameters
    const params = new URLSearchParams();
    params.set('destination', criteria.destination.trim());
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

  const handleQuickSearch = useCallback((destination: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    handleSearch({
      destination,
      checkIn: tomorrow,
      checkOut: dayAfter,
      guests: 2,
      rooms: 1
    });
  }, [handleSearch]);

  return (
    <div className="search-page">
      {/* Search Header */}
      <div className="search-page__header">
        <div className="container">
          <SearchBar onSearch={handleSearch} initialCriteria={searchCriteria} />
        </div>
      </div>

      {/* Content */}
      {searchCriteria ? (
        // Show search results
        <div className="search-page__results">
          <div className="container">
            <div className="search-results">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
              <div className="search-results__content">
                <div className="search-results__header">
                  <h2>Hotels in {searchCriteria.destination}</h2>
                  {!loading && hotels.length > 0 && (
                    <p>{hotels.length} hotels found</p>
                  )}
                </div>

                {loading && (
                  <div className="search-loading">
                    <div className="loading">
                      <div className="loading__spinner"></div>
                      <p>Searching for hotels in {searchCriteria.destination}...</p>
                    </div>
                  </div>
                )}
                
                {error && !loading && (
                  <div className="search-error">
                    <h3>Something went wrong</h3>
                    <p>We couldn't load hotels. Please try again.</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                  </div>
                )}
                
                {!loading && !error && (
                  hotels.length > 0 ? (
                    <HotelList 
                      hotels={hotels}
                      loading={loading}
                      error={error}
                      onHotelSelect={handleHotelSelect}
                    />
                  ) : (
                    <div className="no-results">
                      <h3>No hotels found</h3>
                      <p>No hotels found in {searchCriteria.destination}.</p>
                      <p>Try a different destination or adjust your filters.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Show welcome message
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
                      onClick={() => handleQuickSearch(city)}
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