import React, { useState } from 'react';

interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface SearchFilters {
  query: string;
  category: string;
  priceType: string;
  minPrice: number;
  maxPrice: number;
  urgency: string;
  location: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface JobSearchFiltersProps {
  categories: JobCategory[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading?: boolean;
}

const JobSearchFilters: React.FC<JobSearchFiltersProps> = ({
  categories,
  filters,
  onFiltersChange,
  onSearch,
  loading = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (name: string, value: string | number) => {
    onFiltersChange({
      ...filters,
      [name]: value
    });
  };

  const handleReset = () => {
    onFiltersChange({
      query: '',
      category: '',
      priceType: '',
      minPrice: 0,
      maxPrice: 0,
      urgency: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="job-search-filters">
      <form onSubmit={handleSubmit} className="search-form">
        {/* Main Search */}
        <div className="search-main">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Sök jobb..."
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Söker...' : 'Sök'}
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <div className="filter-group">
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Alla kategorier</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priceType">Pristyp</label>
            <select
              id="priceType"
              value={filters.priceType}
              onChange={(e) => handleInputChange('priceType', e.target.value)}
              className="filter-select"
            >
              <option value="">Alla pristyper</option>
              <option value="hourly">Per timme</option>
              <option value="fixed">Fast pris</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="urgency">Prioritet</label>
            <select
              id="urgency"
              value={filters.urgency}
              onChange={(e) => handleInputChange('urgency', e.target.value)}
              className="filter-select"
            >
              <option value="">Alla prioriteringar</option>
              <option value="high">Hög</option>
              <option value="medium">Medium</option>
              <option value="low">Låg</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortBy">Sortera efter</label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="createdAt">Datum</option>
              <option value="price">Pris</option>
              <option value="urgency">Prioritet</option>
              <option value="viewCount">Popularitet</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="advanced-toggle">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn btn-link"
          >
            {showAdvanced ? 'Dölj' : 'Visa'} avancerade filter
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="location">Plats</label>
                <input
                  type="text"
                  id="location"
                  placeholder="Stad eller område"
                  value={filters.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="sortOrder">Sorteringsordning</label>
                <select
                  id="sortOrder"
                  value={filters.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  className="filter-select"
                >
                  <option value="desc">Fallande</option>
                  <option value="asc">Stigande</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="minPrice">Minsta pris (SEK)</label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value) || 0)}
                  className="filter-input"
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="maxPrice">Högsta pris (SEK)</label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Ingen gräns"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value) || 0)}
                  className="filter-input"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Actions */}
        <div className="filter-actions">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Rensa filter
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Söker...' : 'Sök jobb'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobSearchFilters;
