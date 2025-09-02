import { useState, useEffect, useCallback, useRef } from 'react';
import { Hotel } from '@/domain/models/Hotel';
import { SearchCriteria, SearchFilters } from '@/domain/models/Search';
import { HotelService } from '@/infrastructure/services/HotelService';

const hotelService = new HotelService();

export const useHotels = (criteria?: SearchCriteria, filters?: SearchFilters) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track previous values and prevent unnecessary re-renders
  const prevCriteriaRef = useRef<string>('');
  const prevFiltersRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHotels = useCallback(async (searchCriteria: SearchCriteria, searchFilters?: SearchFilters) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await hotelService.searchHotels(searchCriteria, searchFilters);
      
      // Only update state if request wasn't cancelled
      if (!abortControllerRef.current.signal.aborted) {
        setHotels(data);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && !abortControllerRef.current?.signal.aborted) {
        setError('Failed to fetch hotels');
        console.error('Error fetching hotels:', err);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!criteria) {
      // If no criteria, clear hotels and don't make request
      setHotels([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Create stable string representations for comparison
    const criteriaString = JSON.stringify({
      destination: criteria.destination,
      checkIn: criteria.checkIn.toISOString(),
      checkOut: criteria.checkOut.toISOString(),
      guests: criteria.guests,
      rooms: criteria.rooms
    });
    
    const filtersString = JSON.stringify(filters || {});

    // Only fetch if criteria or filters have actually changed
    if (criteriaString !== prevCriteriaRef.current || filtersString !== prevFiltersRef.current) {
      prevCriteriaRef.current = criteriaString;
      prevFiltersRef.current = filtersString;
      
      fetchHotels(criteria, filters);
    }

    // Cleanup function to cancel request on unmount or criteria change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [criteria, filters, fetchHotels]);

  // Manual refetch function
  const refetch = useCallback(() => {
    if (criteria) {
      fetchHotels(criteria, filters);
    }
  }, [criteria, filters, fetchHotels]);

  return { hotels, loading, error, refetch };
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
        console.error('Error fetching hotel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  return { hotel, loading, error };
};