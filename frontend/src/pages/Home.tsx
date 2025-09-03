import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Populära jobb');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Populära jobb', icon: '🚀' },
    { name: 'Trädgård & Utomhus', icon: '🌱' },
    { name: 'Hushållsarbete', icon: '🏠' },
    { name: 'Djurvård', icon: '🐕' },
    { name: 'Undervisning', icon: '📚' },
    { name: 'Tekniskt Stöd', icon: '💻' },
    { name: 'Evenemangshjälp', icon: '🎉' },
    { name: 'Transport', icon: '🚗' }
  ];

  const popularJobs = [
    {
      id: 1,
      title: 'Gräsklippning & Trädgårdsskötsel',
      category: 'Trädgård'
    },
    {
      id: 2,
      title: 'Barnpassning & Lekaktiviteter',
      category: 'Barnpassning'
    },
    {
      id: 3,
      title: 'Hundpromenering & Djurvård',
      category: 'Djurvård'
    },
    {
      id: 4,
      title: 'Hemstädning & Organisering',
      category: 'Hushåll'
    },
    {
      id: 5,
      title: 'Läxhjälp & Studiestöd',
      category: 'Undervisning'
    },
    {
      id: 6,
      title: 'Datorhjälp & Tekniskt Stöd',
      category: 'Teknik'
    },
    {
      id: 7,
      title: 'Flytthjälp & Möbelbärning',
      category: 'Transport'
    },
    {
      id: 8,
      title: 'Butikshjälp & Kundservice',
      category: 'Butik'
    }
  ];



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search - could navigate to jobs page with search query
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background decoration */}
        <div className="hero-background">
          <div className="hero-background-pattern"></div>
        </div>
        
        {/* Header with search */}
        <div className="container-wide hero-content" style={{paddingTop: '3rem', paddingBottom: '4rem'}}>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="hero-title">
              Kompletta frilanstjänster inom
            </h1>
            <h2 className="hero-subtitle">
              Ungdomsarbete
            </h2>
            <p className="hero-description">
              Hitta pålitlig hjälp för dina vardagsbehov
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sök efter ungdomsjobb, t.ex. gräsklippning, barnpassning..."
                  className="search-input"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="search-button"
                >
                  Sök
                </button>
              </div>
              
              {/* Quick search suggestions */}
              <div className="search-suggestions">
                {['Gräsklippning', 'Barnpassning', 'Hundrastning', 'Städning'].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className="search-suggestion"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Jobs Section */}
      <section className="popular-jobs-section">
        <div className="container-wide">
          {/* 3D Centered White Content Block */}
          <div className="card">
            <div className="card-body">
              {/* Section Title */}
              <div className="popular-jobs-header">
                <h2 className="popular-jobs-title">
                  <span className="mr-2 text-lg sm:text-xl">🚀</span>
                  Populära jobb
                </h2>
              </div>

              {/* Horizontal Category Navigation */}
              <div className="category-nav">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`category-button ${activeCategory === category.name ? 'active' : ''}`}
                  >
                    <span className="text-sm sm:text-base">{category.icon}</span>
                    <span className="text-xs sm:text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Job Grid */}
              <div className="jobs-grid">
                {popularJobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-card-content">
                      <div className="job-category">
                        {job.category}
                      </div>
                      <h3 className="job-title">
                        {job.title}
                      </h3>
                      <button className="job-button">
                        Se detaljer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More Link */}
              <div className="text-right">
                <Link
                  to="/jobs"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-base transition-colors duration-200"
                >
                  Se mer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Features Banner Section */}
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

      {/* Why Use Smajobb Section */}
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

      {/* How It Works Section */}
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

      {/* Promotional/Advertising Section */}
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

      {/* Service Provider Tiers Section */}
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

      {/* Service Provider Cards Section */}
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

      {/* Footer */}
      <footer className="footer">
        <div className="container-wide">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-brand">
              <h3 className="footer-logo">Småjobb</h3>
              <p className="footer-description">
                Sveriges ledande plattform för ungdomsanställning. Vi kopplar samman ungdomar med arbetsgivare för säkra och pålitliga jobbmöjligheter.
              </p>
              <div className="social-links">
                <button className="social-button" aria-label="Twitter">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="social-button" aria-label="Facebook">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </button>
                <button className="social-button" aria-label="LinkedIn">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="social-button" aria-label="Pinterest">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* For Customers */}
            <div>
              <h4 className="footer-section-title">För Kunder</h4>
              <ul className="footer-links">
                <li><a href="/jobs" className="footer-link">Hitta Ungdomar</a></li>
                <li><a href="/how-it-works" className="footer-link">Så Här Fungerar Det</a></li>
                <li><a href="/security" className="footer-link">Säkerhet & Skydd</a></li>
                <li><a href="/pricing" className="footer-link">Priser</a></li>
                <li><a href="/support" className="footer-link">Kundservice</a></li>
                <li><a href="/faq" className="footer-link">Vanliga Frågor</a></li>
              </ul>
            </div>

            {/* For Youth Workers */}
            <div>
              <h4 className="footer-section-title">För Ungdomar</h4>
              <ul className="footer-links">
                <li><a href="/jobs" className="footer-link">Hitta Jobb</a></li>
                <li><a href="/register" className="footer-link">Skapa Profil</a></li>
                <li><a href="/verification" className="footer-link">BankID Verifiering</a></li>
                <li><a href="/training" className="footer-link">Säkerhetsutbildning</a></li>
                <li><a href="/payments" className="footer-link">Betalningar</a></li>
                <li><a href="/support" className="footer-link">Support</a></li>
              </ul>
            </div>

            {/* Company & Legal */}
            <div>
              <h4 className="footer-section-title">Företag & Juridik</h4>
              <ul className="footer-links">
                <li><a href="/about" className="footer-link">Om Småjobb</a></li>
                <li><a href="/careers" className="footer-link">Karriär</a></li>
                <li><a href="/press" className="footer-link">Press</a></li>
                <li><a href="/privacy" className="footer-link">Integritetspolicy</a></li>
                <li><a href="/terms" className="footer-link">Användarvillkor</a></li>
                <li><a href="/cookies" className="footer-link">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2024 Småjobb AB. Alla rättigheter förbehållna.
            </div>
            <div className="trust-badges">
              <div className="trust-badge">
                <svg className="trust-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Säker betalning</span>
              </div>
              <div className="trust-badge">
                <svg className="trust-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>BankID verifierat</span>
              </div>
              <div className="trust-badge">
                <svg className="trust-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
