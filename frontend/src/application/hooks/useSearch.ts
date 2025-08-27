import { useState, useEffect } from 'react';
import { SearchCriteria } from '@/domain/models/Search';
import { SearchService } from '@/infrastructure/services/SearchService';
import { useApp } from '../context/AppContext';

const searchService = new SearchService();

export const useSearch = () => {
  const { user } = useApp();
  const [popularDestinations, setPopularDestinations] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchCriteria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const destinations = await searchService.getPopularDestinations();
        setPopularDestinations(destinations);
      } catch (error) {
        console.error('Failed to fetch popular destinations:', error);
      }
    };

    fetchPopularDestinations();
  }, []);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      if (!user?.id) return;
      
      try {
        const searches = await searchService.getRecentSearches(user.id);
        setRecentSearches(searches);
      } catch (error) {
        console.error('Failed to fetch recent searches:', error);
      }
    };

    fetchRecentSearches();
  }, [user?.id]);

  const getSearchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchService.getSearchSuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (criteria: SearchCriteria) => {
    if (!user?.id) return;
    
    try {
      await searchService.saveSearchHistory(user.id, criteria);
      setRecentSearches([criteria, ...recentSearches.slice(0, 4)]);
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  return {
    popularDestinations,
    suggestions,
    recentSearches,
    loading,
    getSearchSuggestions,
    saveSearch
  };
};