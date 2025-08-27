import React from 'react';
import { useParams } from 'react-router-dom';
import { useHotel } from '../hooks/useHotels';
import HotelDetail from '@/presentation/components/hotel/HotelDetail';
import Loading from '@/presentation/components/common/Loading';

const HotelDetailController: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hotel, loading, error } = useHotel(id || '');

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return <HotelDetail hotel={hotel} />;
};

export default HotelDetailController;