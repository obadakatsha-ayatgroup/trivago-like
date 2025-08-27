import React from 'react';
import { useHotels } from '../hooks/useHotels';
import HotelList from '@/presentation/components/hotel/HotelList';
import { SearchCriteria, SearchFilters } from '@/domain/models/Search';

interface HotelListControllerProps {
  criteria: SearchCriteria;
  filters: SearchFilters;
}

const HotelListController: React.FC<HotelListControllerProps> = ({ criteria, filters }) => {
  const { hotels, loading, error } = useHotels(criteria, filters);

  const handleHotelSelect = (hotelId: string) => {
    window.location.href = `/hotels/${hotelId}`;
  };

  return (
    <HotelList
      hotels={hotels}
      loading={loading}
      error={error}
      onHotelSelect={handleHotelSelect}
    />
  );
};

export default HotelListController;