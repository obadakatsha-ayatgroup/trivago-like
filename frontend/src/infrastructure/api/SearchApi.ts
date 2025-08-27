import { ApiClient } from './ApiClient';
import { SearchCriteria } from '@/domain/models/Search';

export class SearchApi extends ApiClient {
  async getPopularDestinations(): Promise<string[]> {
    return this.get<string[]>('/search/destinations/popular');
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    return this.get<string[]>('/search/suggestions', { params: { query } });
  }

  async saveSearchHistory(userId: string, criteria: SearchCriteria): Promise<void> {
    return this.post<void>(`/users/${userId}/search-history`, criteria);
  }

  async getRecentSearches(userId: string): Promise<SearchCriteria[]> {
    return this.get<SearchCriteria[]>(`/users/${userId}/search-history`);
  }
}