import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobsApi as jobApi, Job } from '../services/jobsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import JobFilters from '../components/jobs/JobFilters';
import JobCard from '../components/jobs/JobCard';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    category: 'Alla kategorier',
    location: '',
    priceType: 'Alla pristyper' as 'Alla pristyper' | 'fixed' | 'hourly',
    urgency: 'Alla prioriteringar' as 'Alla prioriteringar' | 'low' | 'medium' | 'high',
    sortBy: 'Senaste först'
  });

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const query = searchParams.get('q') || '';
      const filterParams: any = { ...filters, query };
      
      // Map Swedish sortBy values to English
      if (filterParams.sortBy === 'Senaste först') {
        filterParams.sortBy = 'createdAt';
      } else if (filterParams.sortBy === 'Pris (lägst först)') {
        filterParams.sortBy = 'price';
        filterParams.sortOrder = 'asc';
      } else if (filterParams.sortBy === 'Pris (högst först)') {
        filterParams.sortBy = 'price';
        filterParams.sortOrder = 'desc';
      } else if (filterParams.sortBy === 'Prioritet') {
        filterParams.sortBy = 'urgency';
      }
      
      // Remove filter values that are not valid for the API
      if (filterParams.priceType === 'Alla pristyper') {
        delete filterParams.priceType;
      }
      if (filterParams.urgency === 'Alla prioriteringar') {
        delete filterParams.urgency;
      }
      if (filterParams.category === 'Alla kategorier') {
        delete filterParams.category;
      }
      const jobsData = await jobApi.getJobs(filterParams);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Kunde inte ladda jobb');
    } finally {
      setLoading(false);
    }
  }, [searchParams, filters]);

  const loadSavedJobs = useCallback(async () => {
    try {
      // TODO: Implement saved jobs endpoint in backend
      // For now, return empty array to prevent errors
      setSavedJobs(new Set());
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({ ...prev, [filter]: value as any }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'Alla kategorier',
      location: '',
      priceType: 'Alla pristyper' as 'Alla pristyper' | 'fixed' | 'hourly',
      urgency: 'Alla prioriteringar' as 'Alla prioriteringar' | 'low' | 'medium' | 'high',
      sortBy: 'Senaste först'
    });
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await jobApi.saveJob(jobId);
      setSavedJobs(prev => new Set(Array.from(prev).concat(jobId)));
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    try {
      await jobApi.unsaveJob(jobId);
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Laddar jobb..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fel vid laddning</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => loadJobs()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.get('q') ? `Sökresultat för "${searchParams.get('q')}"` : 'Alla jobb'}
          </h1>
          <p className="text-gray-600">
            {jobs.length} jobb hittades
          </p>
        </div>

        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Inga jobb hittades
            </h3>
            <p className="text-gray-500 mb-6">
              Prova att ändra dina filter eller sök efter något annat.
            </p>
            <button
              onClick={() => navigate('/jobs/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Skapa nytt jobb
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleSaveJob}
                onUnsave={handleUnsaveJob}
                isSaved={savedJobs.has(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;