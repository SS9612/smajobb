import React from 'react';

const ServiceProviderTiers: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Vi har en mängd olika kvalificerade ungdomar och experter i vårt system för att betjäna dig
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Från enkla extrajobb till specialiserade uppgifter - hitta rätt person för dina behov
          </p>
        </div>

        {/* Three Service Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Ungdom (Youth) */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Illustration Placeholder */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-blue-600 text-2xl">👨‍🎓</div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Ungdom</h3>
            
            {/* Features List */}
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Verifierad identitet och ålder i systemet</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Grundläggande säkerhetsutbildning genomförd</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Perfekt för enkla extrajobb och vardagstjänster</span>
              </li>
            </ul>
            
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-auto">
              Visa alla jobb →
            </button>
          </div>

          {/* Card 2: Erfaren (Experienced) */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Illustration Placeholder */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-green-600 text-2xl">👨‍💼</div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Erfaren</h3>
            
            {/* Features List */}
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Verifierad identitet och referenser</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Godkänd säkerhets- och kvalitetskontroll</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Specialutbildning i kundservice och säkerhet</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Perfekt för mer krävande uppgifter</span>
              </li>
            </ul>
            
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors mt-auto">
              Visa alla jobb →
            </button>
          </div>

          {/* Card 3: Professionell (Professional) */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Illustration Placeholder */}
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-purple-600 text-2xl">👨‍🔬</div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Professionell</h3>
            
            {/* Features List */}
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Verifierad identitet och omfattande bakgrundskontroll</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Avancerade säkerhets- och kvalitetsprov</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Specialutbildning i ledarskap och projektledning</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Screening för avancerad expertis</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Perfekt för komplexa och storskaliga uppgifter</span>
              </li>
            </ul>
            
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors mt-auto">
              Visa alla jobb →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProviderTiers;
