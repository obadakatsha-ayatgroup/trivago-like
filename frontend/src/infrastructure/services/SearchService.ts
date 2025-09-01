import { ISearchService } from '@/domain/interfaces/ISearchService';
import { SearchCriteria } from '@/domain/models/Search';
import { SearchApi } from '../api/SearchApi';

export class SearchService implements ISearchService {
  private searchApi: SearchApi;

  constructor() {
    this.searchApi = new SearchApi();
  }

  async getPopularDestinations(): Promise<string[]> {
    try {
      return await this.searchApi.getPopularDestinations();
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      // Fallback destinations
      return ['Paris', 'Tokyo', 'New York', 'London', 'Barcelona'];
    }
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      return await this.searchApi.getSearchSuggestions(query);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      // Simple fallback based on query
      const destinations = ['Paris', 'Tokyo', 'New York', 'London', 'Barcelona', 'Dubai', 'Sydney', 'Rome'];
      return destinations.filter(dest => 
        dest.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
    }
  }

  async saveSearchHistory(userId: string, criteria: SearchCriteria): Promise<void> {
    try {
      await this.searchApi.saveSearchHistory(userId, criteria);
    } catch (error) {
      console.error('Error saving search history:', error);
      // For now, just store in localStorage as fallback
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      history.unshift({
        ...criteria,
        checkIn: criteria.checkIn.toISOString(),
        checkOut: criteria.checkOut.toISOString(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 5)));
    }
  }

  async getRecentSearches(userId: string): Promise<SearchCriteria[]> {
    try {
      return await this.searchApi.getRecentSearches(userId);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      // Fallback to localStorage
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      return history.map((item: any) => ({
        ...item,
        checkIn: new Date(item.checkIn),
        checkOut: new Date(item.checkOut)
      }));
    }
  }
}