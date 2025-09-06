import React from 'react';
import { Job } from '../../services/api';

interface JobDescriptionProps {
  job: Job;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Beskrivning</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>
      
      {job.requirements && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Krav</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}
      
      {job.benefits && job.benefits.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Fördelar</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobDescription;
