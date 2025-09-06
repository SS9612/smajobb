import React from 'react';

interface JobBasicInfoProps {
  formData: {
    title: string;
    description: string;
    category: string;
    location: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const JobBasicInfo: React.FC<JobBasicInfoProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  const categories = [
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Grundläggande information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jobbtitel *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={onInputChange}
          name="title"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="T.ex. Gräsklippning i trädgården"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Beskrivning *
        </label>
        <textarea
          value={formData.description}
          onChange={onInputChange}
          name="description"
          rows={6}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Beskriv jobbet i detalj. Vad behöver göras? Vilka krav finns? När ska det utföras?"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori *
          </label>
          <select
            value={formData.category}
            onChange={onInputChange}
            name="category"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Välj kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plats *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={onInputChange}
            name="location"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="T.ex. Stockholm, Göteborg, Malmö"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobBasicInfo;
