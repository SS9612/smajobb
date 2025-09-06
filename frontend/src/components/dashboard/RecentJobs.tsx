import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../services/jobsApi';

interface RecentJobsProps {
  jobs: Job[];
  onJobClick: (jobId: string) => void;
}

const RecentJobs: React.FC<RecentJobsProps> = ({ jobs, onJobClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'completed':
        return 'Slutförd';
      case 'cancelled':
        return 'Avbruten';
      default:
        return 'Okänd';
    }
  };

  const formatPrice = (budget: number, priceType: string) => {
    if (priceType === 'hourly') {
      return `${budget} kr/timme`;
    }
    return `${budget} kr`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Senaste jobb</h3>
        <Link
          to="/jobs/manage"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Visa alla →
        </Link>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <p className="text-gray-500 mb-4">Inga jobb hittades</p>
          <Link
            to="/jobs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Skapa första jobbet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job.id}
              onClick={() => onJobClick(job.id)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{job.category}</span>
                    <span>{job.location}</span>
                    <span>{formatPrice(job.budget, job.priceType)}</span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {getStatusText(job.status)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {job.applicationCount || 0} ansökningar
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJobs;
