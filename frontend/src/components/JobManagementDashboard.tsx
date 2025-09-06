import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi as jobApi, Job } from '../services/jobsApi';
import LoadingSpinner from './LoadingSpinner';
import JobStats from './jobs/JobStats';
import JobManagementTable from './jobs/JobManagementTable';

const JobManagementDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalApplications: 0
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await jobApi.getUserJobs();
      setJobs(jobsData);
      
      // Calculate stats
      const activeJobs = jobsData.filter(job => job.status === 'active');
      const completedJobs = jobsData.filter(job => job.status === 'completed');
      const totalEarnings = completedJobs.reduce((sum, job) => sum + job.budget, 0);
      const totalApplications = jobsData.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
      
      setStats({
        totalJobs: jobsData.length,
        activeJobs: activeJobs.length,
        completedJobs: completedJobs.length,
        totalEarnings,
        averageRating: 4.5, // This would come from reviews
        totalApplications
      });
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Kunde inte ladda jobb');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await jobApi.updateJobStatus(jobId, newStatus);
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus as any } : job
      ));
      
      // Recalculate stats
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus as any } : job
      );
      const activeJobs = updatedJobs.filter(job => job.status === 'active');
      const completedJobs = updatedJobs.filter(job => job.status === 'completed');
      const totalEarnings = completedJobs.reduce((sum, job) => sum + job.budget, 0);
      
      setStats(prev => ({
        ...prev,
        activeJobs: activeJobs.length,
        completedJobs: completedJobs.length,
        totalEarnings
      }));
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort detta jobb?')) {
      try {
        await jobApi.deleteJob(jobId);
        setJobs(prev => prev.filter(job => job.id !== jobId));
        
        // Recalculate stats
        const updatedJobs = jobs.filter(job => job.id !== jobId);
        const activeJobs = updatedJobs.filter(job => job.status === 'active');
        const completedJobs = updatedJobs.filter(job => job.status === 'completed');
        const totalEarnings = completedJobs.reduce((sum, job) => sum + job.budget, 0);
        const totalApplications = updatedJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
        
        setStats({
          totalJobs: updatedJobs.length,
          activeJobs: activeJobs.length,
          completedJobs: completedJobs.length,
          totalEarnings,
          averageRating: 4.5,
          totalApplications
        });
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Laddar jobbhantering..." />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jobbhantering</h1>
              <p className="text-gray-600 mt-1">Hantera dina publicerade jobb</p>
            </div>
            <button
              onClick={() => navigate('/jobs/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Skapa nytt jobb
            </button>
          </div>
        </div>

        <JobStats stats={stats} />

        <JobManagementTable
          jobs={jobs}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default JobManagementDashboard;