import React from 'react';

interface JobFiltersProps {
  filters: {
    category: string;
    location: string;
    priceType: string;
    urgency: string;
    sortBy: string;
  };
  onFilterChange: (filter: string, value: string) => void;
  onClearFilters: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const categories = [
    'Alla kategorier',
    'Trädgårdsarbete',
    'Hundpassning',
    'Barnpassning',
    'Städning',
    'Datorhjälp',
    'Läxhjälp',
    'Flytthjälp',
    'Sociala Medier',
    'Enklare Matlagning',
    'Butikshjälp',
    'Cykelreparation'
  ];

  const priceTypes = [
    'Alla pristyper',
    'Fast pris',
    'Timpris'
  ];

  const urgencyLevels = [
    'Alla prioriteringar',
    'Låg',
    'Medium',
    'Hög'
  ];

  const sortOptions = [
    'Senaste först',
    'Äldsta först',
    'Pris (låg till hög)',
    'Pris (hög till låg)',
    'Prioritet (hög till låg)'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtrera jobb</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Rensa filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plats
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="T.ex. Stockholm"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prisstyp
          </label>
          <select
            value={filters.priceType}
            onChange={(e) => onFilterChange('priceType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioritet
          </label>
          <select
            value={filters.urgency}
            onChange={(e) => onFilterChange('urgency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {urgencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sortera
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
