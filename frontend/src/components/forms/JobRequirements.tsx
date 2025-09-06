import React from 'react';

interface JobRequirementsProps {
  formData: {
    requirements: string[];
    urgency: 'low' | 'medium' | 'high';
    deadline: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRequirementAdd: (requirement: string) => void;
  onRequirementRemove: (requirement: string) => void;
}

const JobRequirements: React.FC<JobRequirementsProps> = ({
  formData,
  errors,
  onInputChange,
  onRequirementAdd,
  onRequirementRemove
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        onRequirementAdd(value);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Krav och förutsättningar</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Krav för ansökaren
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.requirements.map((requirement, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {requirement}
              <button
                type="button"
                onClick={() => onRequirementRemove(requirement)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="T.ex. Körkort, erfarenhet av trädgårdsarbete, tillgång till verktyg"
          onKeyPress={handleKeyPress}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Tryck Enter för att lägga till ett krav
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioritet *
          </label>
          <select
            value={formData.urgency}
            onChange={onInputChange}
            name="urgency"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.urgency ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="low">Låg - Kan vänta några dagar</option>
            <option value="medium">Medium - Behövs inom 1-2 dagar</option>
            <option value="high">Hög - Behövs idag/imorgon</option>
          </select>
          {errors.urgency && (
            <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sista ansökningsdag
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={onInputChange}
            name="deadline"
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Lämna tomt för att acceptera ansökningar tills jobbet är fyllt
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobRequirements;
