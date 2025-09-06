import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PopularJobsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Populära jobb');

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

  return (
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
  );
};

export default PopularJobsSection;
