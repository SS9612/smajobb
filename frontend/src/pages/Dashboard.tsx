import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jobsApi as jobApi, Job } from '../services/jobsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentJobs from '../components/dashboard/RecentJobs';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
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
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const jobsData = await jobApi.getUserJobs(user?.id);
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
      console.error('Failed to load dashboard data:', error);
      setError('Kunde inte ladda instrumentpanelen');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Laddar instrumentpanel..." />
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
            onClick={() => loadDashboardData()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Du är inte inloggad</h1>
          <p className="text-gray-600 mb-6">Logga in för att se din instrumentpanel</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Logga in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Välkommen tillbaka, {user.firstName || user.displayName}!
          </h1>
          <p className="text-gray-600 mt-1">Här är en översikt av din aktivitet</p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentJobs
            jobs={jobs}
            onJobClick={handleJobClick}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Snabbåtgärder</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/jobs/create')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
              >
                Skapa nytt jobb
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-left"
              >
                Bläddra jobb
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-left"
              >
                Redigera profil
              </button>
              <button
                onClick={() => navigate('/notifications')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-left"
              >
                Visa notifikationer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;