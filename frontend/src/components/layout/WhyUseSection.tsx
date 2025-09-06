import React from 'react';

const WhyUseSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Varför använda småjobb?
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            Vi har ett komplett utbud av frilanstjänster för att möta både affärs- och livsstilsbehov.
          </p>
        </div>

        {/* Three Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Block 1: Primary Source */}
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="text-blue-600 text-2xl">👥</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Den främsta källan för frilansare och tjänster
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Samla alla tjänster på ett ställe för att hjälpa dig att uppnå dina affärs- och livsstilsmål.
            </p>
          </div>

          {/* Block 2: Employment Guarantee */}
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="text-blue-600 text-2xl">🛡️</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Anställningsgaranti
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dina pengar är skyddade från det att en frilansare börjar arbeta tills de får ett tillfredsställande jobb.
            </p>
          </div>

          {/* Block 3: Complete All Work */}
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="text-blue-600 text-2xl">✅</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Slutför allt arbete du behöver. Var säker på att välja småjobb.
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Möt vår armé av kvalificerade frilansare som är redo att möta alla företags behov och täcka alla typer av arbetsuppgifter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUseSection;
