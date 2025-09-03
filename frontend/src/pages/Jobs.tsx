import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import JobSearchFilters from '../components/JobSearchFilters';
import JobList from '../components/JobList';
import LoadingSpinner from '../components/LoadingSpinner';

interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  priceType: string;
  price: number;
  status: string;
  urgency: string;
  estimatedHours: number;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  startsAt?: string;
  endsAt?: string;
  address?: string;
  creator: {
    id: string;
    displayName: string;
    city?: string;
  };
}

interface SearchFilters {
  query: string;
  category: string;
  priceType: string;
  minPrice: number;
  maxPrice: number;
  urgency: string;
  location: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    priceType: searchParams.get('priceType') || '',
    minPrice: parseInt(searchParams.get('minPrice') || '0'),
    maxPrice: parseInt(searchParams.get('maxPrice') || '0'),
    urgency: searchParams.get('urgency') || '',
    location: searchParams.get('location') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  });

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/job/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        // Fallback categories
        setCategories([
          { id: '1', name: 'Hushållsarbete', description: 'Städning, tvätt, matlagning', icon: '🏠', color: '#3B82F6' },
          { id: '2', name: 'Trädgård & Utomhus', description: 'Trädgårdsarbete, snöröjning', icon: '🌱', color: '#10B981' },
          { id: '3', name: 'Djurvård', description: 'Hundvandring, kattvakt', icon: '🐕', color: '#F59E0B' },
          { id: '4', name: 'Undervisning', description: 'Läxhjälp, språklektioner', icon: '📚', color: '#8B5CF6' },
          { id: '5', name: 'Tekniskt Stöd', description: 'IT-hjälp, installationer', icon: '💻', color: '#EF4444' },
          { id: '6', name: 'Evenemangshjälp', description: 'Festhjälp, catering', icon: '🎉', color: '#EC4899' }
        ]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Use fallback categories
      setCategories([
        { id: '1', name: 'Hushållsarbete', description: 'Städning, tvätt, matlagning', icon: '🏠', color: '#3B82F6' },
        { id: '2', name: 'Trädgård & Utomhus', description: 'Trädgårdsarbete, snöröjning', icon: '🌱', color: '#10B981' },
        { id: '3', name: 'Djurvård', description: 'Hundvandring, kattvakt', icon: '🐕', color: '#F59E0B' },
        { id: '4', name: 'Undervisning', description: 'Läxhjälp, språklektioner', icon: '📚', color: '#8B5CF6' },
        { id: '5', name: 'Tekniskt Stöd', description: 'IT-hjälp, installationer', icon: '💻', color: '#EF4444' },
        { id: '6', name: 'Evenemangshjälp', description: 'Festhjälp, catering', icon: '🎉', color: '#EC4899' }
      ]);
    }
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.priceType) params.append('priceType', filters.priceType);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice > 0) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.urgency) params.append('urgency', filters.urgency);
      if (filters.location) params.append('location', filters.location);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);
      params.append('page', currentPage.toString());
      params.append('limit', '12');
      
      const response = await fetch(`/api/job?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } else {
        // Mock data for development
        const mockJobs: Job[] = [
          {
            id: '1',
            title: 'Städning av lägenhet',
            description: 'Behöver hjälp med städning av min 3:a i centrala Stockholm. Inkluderar badrum, kök och vardagsrum.',
            category: 'Hushållsarbete',
            priceType: 'hourly',
            price: 150,
            status: 'open',
            urgency: 'medium',
            estimatedHours: 4,
            viewCount: 23,
            applicationCount: 5,
            createdAt: new Date().toISOString(),
            address: 'Stockholm, Sverige',
            creator: {
              id: '1',
              displayName: 'Anna Svensson',
              city: 'Stockholm'
            }
          },
          {
            id: '2',
            title: 'Hundvandring',
            description: 'Behöver någon som kan gå ut med min golden retriever 2 gånger per dag under veckan.',
            category: 'Djurvård',
            priceType: 'fixed',
            price: 800,
            status: 'open',
            urgency: 'high',
            estimatedHours: 10,
            viewCount: 45,
            applicationCount: 8,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            address: 'Göteborg, Sverige',
            creator: {
              id: '2',
              displayName: 'Erik Johansson',
              city: 'Göteborg'
            }
          },
          {
            id: '3',
            title: 'Läxhjälp i matematik',
            description: 'Min dotter behöver hjälp med matematik på gymnasienivå. Vi bor i Malmö.',
            category: 'Undervisning',
            priceType: 'hourly',
            price: 200,
            status: 'open',
            urgency: 'low',
            estimatedHours: 6,
            viewCount: 12,
            applicationCount: 3,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            address: 'Malmö, Sverige',
            creator: {
              id: '3',
              displayName: 'Maria Andersson',
              city: 'Malmö'
            }
          }
        ];
        
        setJobs(mockJobs);
        setTotalPages(1);
        setTotalCount(mockJobs.length);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Kunde inte ladda jobb. Försök igen senare.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load jobs when filters change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.priceType) params.set('priceType', newFilters.priceType);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice > 0) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.urgency) params.set('urgency', newFilters.urgency);
    if (newFilters.location) params.set('location', newFilters.location);
    params.set('sortBy', newFilters.sortBy);
    params.set('sortOrder', newFilters.sortOrder);
    
    setSearchParams(params);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadJobs();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error && !loading) {
    return (
      <div className="jobs-container">
        <div className="container-wide">
          <div className="jobs-error">
            <div className="error-icon">⚠️</div>
            <h3>Ett fel uppstod</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Försök igen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      {/* Header */}
      <div className="jobs-header">
        <div className="container-wide">
          <div className="jobs-header-content">
            <div>
              <h1 className="jobs-title">Bläddra Bland Jobb</h1>
              <p className="jobs-subtitle">Hitta perfekta jobbmöjligheter för dig</p>
            </div>
            <button
              onClick={() => navigate('/jobs/create')}
              className="jobs-cta-button"
            >
              Skapa nytt jobb
            </button>
          </div>
        </div>
      </div>

      <div className="container-wide">
        {/* Search and Filters */}
        <JobSearchFilters
          categories={categories}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Results Summary */}
        {!loading && (
          <div className="jobs-results-summary">
            <p className="results-text">
              Visar <span className="font-semibold">{jobs.length}</span> av <span className="font-semibold">{totalCount}</span> jobb
              {filters.category && (
                <> i kategorin <span className="font-semibold">{filters.category}</span></>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="jobs-loading">
            <LoadingSpinner size="lg" text="Hämtar jobb..." />
          </div>
        )}

        {/* Jobs List */}
        {!loading && (
          <JobList
            jobs={jobs}
            loading={loading}
            emptyMessage="Inga jobb hittades med de valda filtren. Prova att ändra dina söktermer."
            showCreator={true}
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="jobs-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Föregående
            </button>
            
            <div className="pagination-info">
              Sida {currentPage} av {totalPages}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Nästa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
