import { useState, useEffect, useCallback } from 'react';
import { Hotel } from '@/domain/models/Hotel';
import { SearchCriteria, SearchFilters } from '@/domain/models/Search';
import { HotelService } from '@/infrastructure/services/HotelService';

const hotelService = new HotelService();

export const useHotels = (criteria?: SearchCriteria, filters?: SearchFilters) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  // src/application/hooks/useHotels.ts (continued)
 const [error, setError] = useState<string | null>(null);

 const fetchHotels = useCallback(async () => {
   if (!criteria) return;
   
   setLoading(true);
   setError(null);
   try {
     const data = await hotelService.searchHotels(criteria, filters);
     setHotels(data);
   } catch (err) {
     setError('Failed to fetch hotels');
     console.error(err);
   } finally {
     setLoading(false);
   }
 }, [criteria, filters]);

 useEffect(() => {
   fetchHotels();
 }, [fetchHotels]);

 return { hotels, loading, error, refetch: fetchHotels };
};

export const useHotel = (id: string) => {
 const [hotel, setHotel] = useState<Hotel | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   const fetchHotel = async () => {
     if (!id) return;
     
     setLoading(true);
     setError(null);
     try {
       const data = await hotelService.getHotelById(id);
       setHotel(data);
     } catch (err) {
       setError('Failed to fetch hotel details');
       console.error(err);
     } finally {
       setLoading(false);
     }
   };

   fetchHotel();
 }, [id]);

 return { hotel, loading, error };
};