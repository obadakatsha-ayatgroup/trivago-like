// src/presentation/pages/SearchPage.tsx
/**
 * Search page with full search functionality
 */
import React from 'react';
import SearchController from '@/application/controllers/SearchController';

const SearchPage: React.FC = () => {
  return (
    <div className="search-page">
      <div className="search-page__container">
        <h1>Find Your Perfect Stay</h1>
        <SearchController />
      </div>
    </div>
  );
};

export default SearchPage;