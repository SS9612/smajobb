import React from 'react';

interface JobPricingProps {
  formData: {
    priceType: 'fixed' | 'hourly';
    budget: string;
    estimatedHours: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const JobPricing: React.FC<JobPricingProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Pris och tid</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prisstyp *
        </label>
        <select
          value={formData.priceType}
          onChange={onInputChange}
          name="priceType"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.priceType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="fixed">Fast pris</option>
          <option value="hourly">Timpris</option>
        </select>
        {errors.priceType && (
          <p className="mt-1 text-sm text-red-600">{errors.priceType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.priceType === 'fixed' ? 'Fast pris (kr) *' : 'Timpris (kr) *'}
          </label>
          <input
            type="number"
            value={formData.budget}
            onChange={onInputChange}
            name="budget"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.budget ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={formData.priceType === 'fixed' ? 'T.ex. 500' : 'T.ex. 150'}
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Uppskattad tid (timmar) *
          </label>
          <input
            type="number"
            value={formData.estimatedHours}
            onChange={onInputChange}
            name="estimatedHours"
            min="0.5"
            step="0.5"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.estimatedHours ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="T.ex. 2"
          />
          {errors.estimatedHours && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedHours}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tips för prissättning
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Kolla vad andra liknande jobb kostar</li>
                <li>Ta hänsyn till komplexitet och tid</li>
                <li>Ungdomar får ofta 100-300 kr/timme</li>
                <li>Fast pris fungerar bra för enkla uppgifter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPricing;
