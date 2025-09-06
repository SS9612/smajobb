import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Steps */}
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-8">
              Börja enkelt anställa frilansare med småjobb
            </h2>
            
            {/* Steps Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600 text-sm">🔍</div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">1. Hitta rätt frilansare</h3>
                </div>
                <p className="text-gray-600 text-base ml-11">Bedöms baserat på prestation, förmågor och recensioner.</p>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600 text-sm">💬</div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">2. Diskutera detaljer</h3>
                </div>
                <p className="text-gray-600 text-base ml-11">Beskriv jobbet så att frilansare kan skapa offerter.</p>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600 text-sm">💳</div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">3. Betala via småjobb</h3>
                </div>
                <p className="text-gray-600 text-base ml-11">Småjobb-garanti: Få jobbet garanterat</p>
              </div>

              {/* Step 4 */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600 text-sm">✅</div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">4. Godkänn arbete och granska</h3>
                </div>
                <p className="text-gray-600 text-base ml-11">Granska godkänt och granskat arbete.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Video Placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Video Placeholder */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center relative overflow-hidden">
                {/* Large Number 4 */}
                <div className="text-white text-8xl font-bold mb-4">4</div>
                
                {/* Placeholder Text */}
                <div className="text-white text-lg mb-2">Video Tutorial</div>
                <div className="text-white text-sm opacity-80">Kommer snart</div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-black bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all duration-200 cursor-pointer">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
