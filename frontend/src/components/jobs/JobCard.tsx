import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../services/api';

interface JobCardProps {
  job: Job;
  onSave: (jobId: string) => void;
  onUnsave: (jobId: string) => void;
  isSaved: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onUnsave,
  isSaved
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Hög';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Låg';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">{job.category}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
              {getUrgencyText(job.urgency)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <Link 
              to={`/jobs/${job.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {job.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {job.description}
          </p>
        </div>
        
        <button
          onClick={() => isSaved ? onUnsave(job.id) : onSave(job.id)}
          className={`ml-4 p-2 rounded-lg transition-colors ${
            isSaved 
              ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200' 
              : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.estimatedHours} timmar
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {formatPrice(job.budget, job.priceType)}
          </div>
          <div className="text-xs">
            {job.applicationCount || 0} ansökningar
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Publicerad {new Date(job.createdAt).toLocaleDateString('sv-SE')}
        </div>
        
        <Link
          to={`/jobs/${job.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Visa detaljer →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
