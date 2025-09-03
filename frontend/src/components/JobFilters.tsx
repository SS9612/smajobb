import React, { useState, useEffect } from 'react';
import { searchApi, SearchFilters, JobSearchRequest } from '../services/searchApi';

interface JobFiltersProps {
  filters: JobSearchRequest;
  onFiltersChange: (filters: JobSearchRequest) => void;
  availableFilters?: SearchFilters;
  className?: string;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  availableFilters,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<JobSearchRequest>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof JobSearchRequest, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof JobSearchRequest, value: string, checked: boolean) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters: JobSearchRequest = {
      query: localFilters.query,
      page: 1,
      pageSize: localFilters.pageSize
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return Object.entries(localFilters).some(([key, value]) => {
      if (key === 'query' || key === 'page' || key === 'pageSize') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    });
  };

  const formatPrice = (price: number) => {
    return `${price} SEK`;
  };

  return (
    <div className={`job-filters ${className}`}>
      <div className="filters-header">
        <h3>Filtrera jobb</h3>
        <div className="filters-actions">
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="btn btn-secondary btn-sm"
            >
              Rensa filter
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-outline btn-sm"
          >
            {isExpanded ? 'Dölj' : 'Visa'} filter
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filters-content">
          {/* Category Filter */}
          {availableFilters?.categories && availableFilters.categories.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Kategori</label>
              <div className="filter-options">
                {availableFilters.categories.map(category => (
                  <label key={category} className="filter-option">
                    <input
                      type="checkbox"
                      checked={(localFilters.category || '') === category}
                      onChange={(e) => handleFilterChange('category', e.target.checked ? category : '')}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Type Filter */}
          {availableFilters?.priceTypes && availableFilters.priceTypes.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Pristyp</label>
              <div className="filter-options">
                {availableFilters.priceTypes.map(priceType => (
                  <label key={priceType} className="filter-option">
                    <input
                      type="checkbox"
                      checked={(localFilters.priceType || '') === priceType}
                      onChange={(e) => handleFilterChange('priceType', e.target.checked ? priceType : '')}
                    />
                    <span>{priceType === 'hourly' ? 'Per timme' : 'Fast pris'}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          {availableFilters?.priceRange && (
            <div className="filter-group">
              <label className="filter-label">Prisintervall</label>
              <div className="price-range">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="price-input"
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="price-input"
                  />
                </div>
                <div className="price-range-info">
                  {formatPrice(availableFilters.priceRange.min)} - {formatPrice(availableFilters.priceRange.max)}
                </div>
              </div>
            </div>
          )}

          {/* Urgency Filter */}
          {availableFilters?.urgencies && availableFilters.urgencies.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Prioritet</label>
              <div className="filter-options">
                {availableFilters.urgencies.map(urgency => (
                  <label key={urgency} className="filter-option">
                    <input
                      type="checkbox"
                      checked={(localFilters.urgency || '') === urgency}
                      onChange={(e) => handleFilterChange('urgency', e.target.checked ? urgency : '')}
                    />
                    <span>{urgency === 'high' ? 'Hög' : urgency === 'medium' ? 'Medium' : 'Låg'}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Status Filter */}
          {availableFilters?.statuses && availableFilters.statuses.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <div className="filter-options">
                {availableFilters.statuses.map(status => (
                  <label key={status} className="filter-option">
                    <input
                      type="checkbox"
                      checked={(localFilters.status || '') === status}
                      onChange={(e) => handleFilterChange('status', e.target.checked ? status : '')}
                    />
                    <span>{status === 'open' ? 'Öppna' : status === 'in_progress' ? 'Pågående' : status === 'completed' ? 'Slutförda' : 'Avbrutna'}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Skills Filter */}
          {availableFilters?.skills && availableFilters.skills.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Färdigheter</label>
              <div className="filter-options skills-filter">
                {availableFilters.skills.slice(0, 10).map(skill => (
                  <label key={skill} className="filter-option skill-option">
                    <input
                      type="checkbox"
                      checked={(localFilters.skills || []).includes(skill)}
                      onChange={(e) => handleArrayFilterChange('skills', skill, e.target.checked)}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Datumintervall</label>
            <div className="date-range">
              <input
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                className="date-input"
              />
              <span className="date-separator">till</span>
              <input
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                className="date-input"
              />
            </div>
          </div>

          {/* Age Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Ålderskrav</label>
            <div className="age-range">
              <input
                type="number"
                placeholder="Min ålder"
                value={localFilters.minAge || ''}
                onChange={(e) => handleFilterChange('minAge', e.target.value ? parseInt(e.target.value) : undefined)}
                className="age-input"
              />
              <span className="age-separator">-</span>
              <input
                type="number"
                placeholder="Max ålder"
                value={localFilters.maxAge || ''}
                onChange={(e) => handleFilterChange('maxAge', e.target.value ? parseInt(e.target.value) : undefined)}
                className="age-input"
              />
            </div>
          </div>

          {/* Background Check Filter */}
          <div className="filter-group">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={localFilters.requiresBackgroundCheck || false}
                onChange={(e) => handleFilterChange('requiresBackgroundCheck', e.target.checked || undefined)}
              />
              <span>Kräver bakgrundskontroll</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
