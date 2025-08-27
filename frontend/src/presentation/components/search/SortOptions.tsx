import React from 'react';
import { SortOption } from '@/domain/models/Search';
import { SORT_OPTIONS } from '@/utils/constants';

interface SortOptionsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="sort-options">
      <label htmlFor="sort">Sort by:</label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        {Object.entries(SORT_OPTIONS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions;