import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
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
  );
};

export default HeroSection;
