import { SearchCriteria } from '../models/Search';

export interface ISearchService {
  getPopularDestinations(): Promise<string[]>;
  getSearchSuggestions(query: string): Promise<string[]>;
  saveSearchHistory(userId: string, criteria: SearchCriteria): Promise<void>;
  getRecentSearches(userId: string): Promise<SearchCriteria[]>;
}