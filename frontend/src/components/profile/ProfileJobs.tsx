import React from 'react';
import { Job } from '../../services/api';

interface ProfileJobsProps {
  jobs: Job[];
  onJobClick: (jobId: string) => void;
  isOwner: boolean;
}

const ProfileJobs: React.FC<ProfileJobsProps> = ({ jobs, onJobClick, isOwner }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {isOwner ? 'Mina jobb' : 'Publicerade jobb'}
      </h2>
      
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {isOwner ? 'Du har inte publicerat några jobb än.' : 'Inga jobb publicerade än.'}
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onJobClick(job.id)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{job.category}</span>
                    <span>{job.location}</span>
                    <span>{job.budget} kr</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' :
                      job.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status === 'active' ? 'Aktiv' :
                       job.status === 'completed' ? 'Slutförd' : 'Inaktiv'}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right text-sm text-gray-500">
                  <div>{job.applicationCount || 0} ansökningar</div>
                  <div>{job.viewCount || 0} visningar</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileJobs;
