import React from 'react';
import { Job } from '../../services/api';

interface JobDetailsProps {
  job: Job;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Jobbdetaljer</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Kategori</h3>
            <p className="mt-1 text-sm text-gray-900">{job.category}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Plats</h3>
            <p className="mt-1 text-sm text-gray-900">{job.location}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Budget</h3>
            <p className="mt-1 text-sm text-gray-900">{job.budget} kr</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Uppskattad tid</h3>
            <p className="mt-1 text-sm text-gray-900">{job.estimatedHours} timmar</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              job.status === 'active' ? 'bg-green-100 text-green-800' :
              job.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status === 'active' ? 'Aktiv' : 
               job.status === 'completed' ? 'Slutförd' : 'Inaktiv'}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Publicerad</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(job.createdAt).toLocaleDateString('sv-SE')}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Sista ansökningsdag</h3>
            <p className="mt-1 text-sm text-gray-900">
              {job.deadline ? new Date(job.deadline).toLocaleDateString('sv-SE') : 'Ingen deadline'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Antal ansökningar</h3>
            <p className="mt-1 text-sm text-gray-900">{job.applicationCount || 0}</p>
          </div>
        </div>
      </div>
      
      {job.tags && job.tags.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Taggar</h3>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
