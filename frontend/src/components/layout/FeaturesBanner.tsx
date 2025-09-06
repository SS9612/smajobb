import React from 'react';

const FeaturesBanner: React.FC = () => {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Dark Rounded Banner */}
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              {/* Left Side - Logo and Text */}
              <div className="flex-1 mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Småjobb
                  </h2>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-lg md:text-xl font-medium">
                    Nya kategorier lanseras
                  </p>
                  <p className="text-gray-300 text-base md:text-lg">
                    Alla möjligheter för ungdomar att hitta extrajobb
                  </p>
                </div>
              </div>

              {/* Right Side - CTA Button */}
              <div className="flex-shrink-0">
                <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Utforska nu
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-4 right-8 opacity-20">
              <div className="w-16 h-16 bg-yellow-400 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBanner;
