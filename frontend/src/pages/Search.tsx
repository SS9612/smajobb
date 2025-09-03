import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobFilters from '../components/JobFilters';
import SearchResults from '../components/SearchResults';
import SortDropdown from '../components/SortDropdown';
import { searchApi, JobSearchRequest, SearchFilters, Job } from '../services/searchApi';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableFilters, setAvailableFilters] = useState<SearchFilters | null>(null);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<JobSearchRequest>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    priceType: searchParams.get('priceType') || '',
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    urgency: searchParams.get('urgency') || '',
    status: searchParams.get('status') || 'open',
    location: searchParams.get('location') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: 1,
    pageSize: 20
  });

  const loadPopularData = async () => {
    try {
      const [searches, categories] = await Promise.all([
        searchApi.getPopularSearches(8),
        searchApi.getPopularCategories(8)
      ]);
      setPopularSearches(searches);
      setPopularCategories(categories);
    } catch (error) {
      console.error('Error loading popular data:', error);
    }
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchRequest: JobSearchRequest = {
        ...filters,
        page: currentPage
      };
      
      const result = await searchApi.searchJobs(searchRequest);
      
      setJobs(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setAvailableFilters(result.availableFilters || null);
      
      // Log search for analytics
      if (searchRequest.query) {
        await searchApi.logSearch(searchRequest.query, JSON.stringify(searchRequest));
      }
      
    } catch (err: any) {
      console.error('Error loading jobs:', err);
      setError('Kunde inte ladda jobb. Försök igen senare.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  // Load popular data on mount
  useEffect(() => {
    loadPopularData();
  }, []);

  // Load jobs when filters or page change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.priceType) params.set('priceType', filters.priceType);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.urgency) params.set('urgency', filters.urgency);
    if (filters.status && filters.status !== 'open') params.set('status', filters.status);
    if (filters.location) params.set('location', filters.location);
    if (filters.sortBy && filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [filters, currentPage, setSearchParams]);

  const handleSearch = (query: string) => {
    const newFilters = { ...filters, query, page: 1 };
    setFilters(newFilters);
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: JobSearchRequest) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const newFilters = { ...filters, sortBy, sortOrder, page: 1 };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePopularSearch = (search: string) => {
    handleSearch(search);
  };



  return (
    <div className="search-page-container">
      <div className="container-wide">
        {/* Header */}
        <div className="search-page-header">
          <h1>Avancerad sökning</h1>
          <p>Hitta exakt det jobb du letar efter med våra kraftfulla sökverktyg</p>
        </div>

        <div className="search-page-content">
          {/* Search Section */}
          <div className="search-section">
            <SearchBar
              placeholder="Sök efter jobb, kategorier eller färdigheter..."
              onSearch={handleSearch}
              initialValue={searchQuery}
              className="main-search-bar"
            />
          </div>

          {/* Popular Searches */}
          {!searchQuery && popularSearches.length > 0 && (
            <div className="popular-searches">
              <h3>Populära sökningar</h3>
              <div className="popular-tags">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="popular-tag"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Categories */}
          {!searchQuery && popularCategories.length > 0 && (
            <div className="popular-categories">
              <h3>Populära kategorier</h3>
              <div className="popular-tags">
                {popularCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleFiltersChange({ ...filters, category, page: 1 })}
                    className="popular-tag"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Sort */}
          <div className="filters-sort-section">
            <div className="filters-sort-content">
              <JobFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableFilters={availableFilters || undefined}
                className="main-job-filters"
              />
              
              <div className="sort-section">
                <SortDropdown
                  value={filters.sortBy || 'createdAt'}
                  order={(filters.sortOrder as 'asc' | 'desc') || 'desc'}
                  onChange={handleSortChange}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-section">
            <SearchResults
              jobs={jobs}
              loading={loading}
              error={error}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
