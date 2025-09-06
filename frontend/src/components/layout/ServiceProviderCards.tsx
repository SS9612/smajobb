import React from 'react';

const ServiceProviderCards: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-600">
            Populära tjänster från våra ungdomsleverantörer
          </h2>
          <p className="text-gray-600 mt-2">
            Upptäck kvalificerade ungdomar som erbjuder olika tjänster
          </p>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide" id="serviceCards">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 2 timmar</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 199 kr</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 1 timme</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 299 kr</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 30 min</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 399 kr</div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 45 min</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 249 kr</div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 1 timme</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 349 kr</div>
              </div>
            </div>

            {/* Additional cards for scrolling */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 15 min</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 179 kr</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 min-w-[280px] flex-shrink-0">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">Placeholder Namn</div>
                  <div className="text-sm text-gray-500">Svar inom 2 timmar</div>
                </div>
              </div>
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="font-medium text-gray-900 mb-2">Placeholder Tjänsttitel</div>
              <div className="text-sm text-gray-600 mb-2">Placeholder beskrivning</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">⭐ 0.0 (0)</div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">Från 449 kr</div>
              </div>
            </div>
          </div>

          {/* Left Scroll Arrow */}
          <button 
            onClick={() => {
              const container = document.getElementById('serviceCards');
              if (container) {
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Scroll Arrow */}
          <button 
            onClick={() => {
              const container = document.getElementById('serviceCards');
              if (container) {
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceProviderCards;
