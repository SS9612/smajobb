import React, { useState } from 'react';
import { jobApi } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedRate: '',
    availableFrom: '',
    availableTo: '',
    additionalInfo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Personligt brev är obligatoriskt';
    }

    if (!formData.proposedRate.trim()) {
      newErrors.proposedRate = 'Föreslaget pris är obligatoriskt';
    } else if (isNaN(Number(formData.proposedRate)) || Number(formData.proposedRate) <= 0) {
      newErrors.proposedRate = 'Föreslaget pris måste vara ett giltigt nummer';
    }

    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Tillgänglig från är obligatoriskt';
    }

    if (!formData.availableTo) {
      newErrors.availableTo = 'Tillgänglig till är obligatoriskt';
    }

    if (formData.availableFrom && formData.availableTo) {
      const fromDate = new Date(formData.availableFrom);
      const toDate = new Date(formData.availableTo);
      if (fromDate >= toDate) {
        newErrors.availableTo = 'Tillgänglig till måste vara efter tillgänglig från';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const applicationData = {
        message: formData.coverLetter,
        proposedPrice: formData.proposedRate ? parseFloat(formData.proposedRate) : undefined
      };
      await jobApi.applyToJob(jobId, applicationData);
      onSuccess();
    } catch (error: any) {
      console.error('Application failed:', error);
      setErrors({ general: 'Ansökan misslyckades. Försök igen.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Ansök på jobbet</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
            Personligt brev *
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.coverLetter ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Berätta varför du är rätt person för detta jobb..."
          />
          {errors.coverLetter && (
            <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
          )}
        </div>

        <div>
          <label htmlFor="proposedRate" className="block text-sm font-medium text-gray-700 mb-2">
            Föreslaget pris (kr) *
          </label>
          <input
            type="number"
            id="proposedRate"
            name="proposedRate"
            value={formData.proposedRate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.proposedRate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ange ditt föreslagna pris"
          />
          {errors.proposedRate && (
            <p className="mt-1 text-sm text-red-600">{errors.proposedRate}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-2">
              Tillgänglig från *
            </label>
            <input
              type="date"
              id="availableFrom"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.availableFrom ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.availableFrom && (
              <p className="mt-1 text-sm text-red-600">{errors.availableFrom}</p>
            )}
          </div>

          <div>
            <label htmlFor="availableTo" className="block text-sm font-medium text-gray-700 mb-2">
              Tillgänglig till *
            </label>
            <input
              type="date"
              id="availableTo"
              name="availableTo"
              value={formData.availableTo}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.availableTo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.availableTo && (
              <p className="mt-1 text-sm text-red-600">{errors.availableTo}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
            Ytterligare information
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Eventuell ytterligare information..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Skickar ansökan...</span>
              </div>
            ) : (
              'Skicka ansökan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
