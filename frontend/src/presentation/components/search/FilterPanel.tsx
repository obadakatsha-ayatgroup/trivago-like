// src/presentation/components/search/FilterPanel.tsx
/**
 * Filter panel for refining search results
 */
import React from 'react';
import { SearchFilters, SortOption } from '@/domain/models/Search';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      rating
    });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFilterChange({
      ...filters,
      sortBy
    });
  };

  const handleStarsToggle = (star: number) => {
    const newStars = filters.stars.includes(star)
      ? filters.stars.filter(s => s !== star)
      : [...filters.stars, star];
    onFilterChange({
      ...filters,
      stars: newStars
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({
      ...filters,
      amenities: newAmenities
    });
  };

  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input
            type="number"
            value={filters.priceRange.min}
            onChange={(e) => handlePriceChange(Number(e.target.value), filters.priceRange.max)}
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.priceRange.max}
            onChange={(e) => handlePriceChange(filters.priceRange.min, Number(e.target.value))}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Star Rating</h4>
        <div className="star-buttons">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={filters.stars.includes(star) ? 'active' : ''}
              onClick={() => handleStarsToggle(star)}
            >
              {star} ★
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Guest Rating</h4>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={filters.rating}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
        />
        <span>{filters.rating}+</span>
      </div>

      <div className="filter-section">
        <h4>Amenities</h4>
        <div className="amenity-checkboxes">
          {['WiFi', 'Pool', 'Parking', 'Gym', 'Spa', 'Restaurant'].map(amenity => (
            <label key={amenity}>
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
        >
          <option value={SortOption.PRICE_ASC}>Price: Low to High</option>
          <option value={SortOption.PRICE_DESC}>Price: High to Low</option>
          <option value={SortOption.RATING}>Rating</option>
          <option value={SortOption.DISTANCE}>Distance</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;