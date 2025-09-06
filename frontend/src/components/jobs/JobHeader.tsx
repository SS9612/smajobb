import React from 'react';
import { Job } from '../../services/api';

interface JobHeaderProps {
  job: Job;
  onApply: () => void;
  onSave: () => void;
  onShare: () => void;
  isApplied: boolean;
  isSaved: boolean;
  isOwner: boolean;
}

const JobHeader: React.FC<JobHeaderProps> = ({
  job,
  onApply,
  onSave,
  onShare,
  isApplied,
  isSaved,
  isOwner
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">
              {job.category} • {job.location}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.status === 'active' ? 'bg-green-100 text-green-800' :
              job.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status === 'active' ? 'Aktiv' : 
               job.status === 'completed' ? 'Slutförd' : 'Inaktiv'}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {job.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.estimatedHours} timmar
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {job.budget} kr
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(job.createdAt).toLocaleDateString('sv-SE')}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0 lg:ml-6">
          {!isOwner && (
            <>
              <button
                onClick={onApply}
                disabled={isApplied}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isApplied
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isApplied ? 'Ansökt' : 'Ansök nu'}
              </button>
              
              <button
                onClick={onSave}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSaved
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSaved ? 'Sparad' : 'Spara'}
              </button>
            </>
          )}
          
          <button
            onClick={onShare}
            className="px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Dela
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
