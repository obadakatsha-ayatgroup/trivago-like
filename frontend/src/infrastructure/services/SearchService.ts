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
      throw error;
    }
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      return await this.searchApi.getSearchSuggestions(query);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      throw error;
    }
  }

  async saveSearchHistory(userId: string, criteria: SearchCriteria): Promise<void> {
    try {
      await this.searchApi.saveSearchHistory(userId, criteria);
    } catch (error) {
      console.error('Error saving search history:', error);
      throw error;
    }
  }

  async getRecentSearches(userId: string): Promise<SearchCriteria[]> {
    try {
      return await this.searchApi.getRecentSearches(userId);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      throw error;
    }
  }
}