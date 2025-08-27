import React from 'react';
import { Hotel } from '@/domain/models/Hotel';
import HotelCard from './HotelCard';
import Loading from '../common/Loading';

interface HotelListProps {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
  onHotelSelect: (hotelId: string) => void;
}

const HotelList: React.FC<HotelListProps> = ({ 
  hotels, 
  loading, 
  error, 
  onHotelSelect 
}) => {
  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (hotels.length === 0) return <div className="no-results">No hotels found</div>;

  return (
    <div className="hotel-list">
      <div className="hotel-list__header">
        <h2>{hotels.length} hotels found</h2>
      </div>
      <div className="hotel-list__grid">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onClick={onHotelSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default HotelList;