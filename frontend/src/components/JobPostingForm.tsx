import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi as jobApi } from '../services/jobsApi';
import LoadingSpinner from './LoadingSpinner';
import JobBasicInfo from './forms/JobBasicInfo';
import JobPricing from './forms/JobPricing';
import JobRequirements from './forms/JobRequirements';

interface JobPostingFormData {
  title: string;
  description: string;
  category: string;
  priceType: 'hourly' | 'fixed';
  budget: string;
  estimatedHours: string;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  requirements: string[];
  deadline: string;
}

const JobPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobPostingFormData>({
    title: '',
    description: '',
    category: '',
    priceType: 'fixed',
    budget: '',
    estimatedHours: '',
    urgency: 'medium',
    location: '',
    requirements: [],
    deadline: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRequirementAdd = (requirement: string) => {
    if (requirement && !formData.requirements.includes(requirement)) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }));
    }
  };

  const handleRequirementRemove = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Jobbtitel är obligatorisk';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beskrivning är obligatorisk';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Beskrivningen måste vara minst 50 tecken';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori är obligatorisk';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Plats är obligatorisk';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Pris är obligatoriskt';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Pris måste vara ett giltigt nummer större än 0';
    }

    if (!formData.estimatedHours.trim()) {
      newErrors.estimatedHours = 'Uppskattad tid är obligatorisk';
    } else if (isNaN(Number(formData.estimatedHours)) || Number(formData.estimatedHours) <= 0) {
      newErrors.estimatedHours = 'Uppskattad tid måste vara ett giltigt nummer större än 0';
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
      const jobData = {
        ...formData,
        budget: Number(formData.budget),
        estimatedHours: Number(formData.estimatedHours),
        deadline: formData.deadline || undefined
      };
      
      await jobApi.createJob(jobData);
      navigate('/jobs');
    } catch (error) {
      console.error('Failed to create job:', error);
      setErrors({ general: 'Kunde inte skapa jobbet. Försök igen.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Skapa nytt jobb</h1>
            <p className="text-gray-600 mt-1">Fyll i formuläret för att publicera ditt jobb</p>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <JobBasicInfo
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <JobPricing
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <JobRequirements
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onRequirementAdd={handleRequirementAdd}
              onRequirementRemove={handleRequirementRemove}
            />

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
                    <span className="ml-2">Skapar jobb...</span>
                  </div>
                ) : (
                  'Publicera jobb'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;