// src/presentation/pages/HotelPage.tsx
/**
 * Hotel detail page
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useHotel } from '@/application/hooks/useHotels';
import HotelDetail from '@/presentation/components/hotel/HotelDetail';
import Loading from '@/presentation/components/common/Loading';

const HotelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hotel, loading, error } = useHotel(id || '');

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="hotel-page">
      <HotelDetail hotel={hotel} />
    </div>
  );
};

export default HotelPage;