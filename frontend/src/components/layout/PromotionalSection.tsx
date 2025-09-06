import React from 'react';

const PromotionalSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-600">
            Intressanta erbjudanden
          </h2>
          <p className="text-gray-600 mt-2">
            Upptäck specialerbjudanden och kampanjer för ungdomsjobb
          </p>
        </div>

        {/* Three Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1 - Pink/Purple Theme */}
          <div className="bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="font-bold text-lg mb-4">Future Advertisement</h3>
              <div className="text-sm opacity-90">
                Placeholder för framtida reklam
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-2 right-2 w-16 h-16 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 bg-white opacity-10 rounded-full"></div>
          </div>

          {/* Banner 2 - Blue/Purple Theme */}
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="font-bold text-lg mb-4">Future Advertisement</h3>
              <div className="text-sm opacity-90">
                Placeholder för framtida reklam
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-white opacity-10 rounded-full"></div>
          </div>

          {/* Banner 3 - Orange/Beige Theme */}
          <div className="bg-gradient-to-br from-orange-200 to-amber-300 rounded-2xl p-6 text-gray-800 relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="font-bold text-lg mb-4">Future Advertisement</h3>
              <div className="text-sm text-gray-600">
                Placeholder för framtida reklam
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-2 right-2 w-16 h-16 bg-white opacity-20 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 bg-white opacity-20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;
