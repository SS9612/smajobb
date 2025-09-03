import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../services/searchApi';

interface SearchResultsProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  jobs,
  loading,
  error,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, priceType: string) => {
    return `${price} SEK ${priceType === 'hourly' ? 'per timme' : 'fast pris'}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low': return 'urgency-low';
      default: return 'urgency-default';
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="pagination-btn"
        >
          Föregående
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-btn"
        >
          Nästa
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  if (loading) {
    return (
      <div className={`search-results loading ${className}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Söker jobb...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`search-results error ${className}`}>
        <div className="error-container">
          <h3>Ett fel uppstod</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className={`search-results empty ${className}`}>
        <div className="empty-container">
          <h3>Inga jobb hittades</h3>
          <p>Prova att ändra dina sökkriterier eller filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`search-results ${className}`}>
      <div className="results-header">
        <h2>
          {totalCount} jobb hittades
          {totalCount > 0 && (
            <span className="results-count">
              (sida {currentPage} av {totalPages})
            </span>
          )}
        </h2>
      </div>

      <div className="results-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
              <div className="job-title-section">
                <h3>
                  <Link to={`/jobs/${job.id}`} className="job-title-link">
                    {job.title}
                  </Link>
                </h3>
                <div className="job-meta">
                  <span className={`status-badge ${getStatusColor(job.status)}`}>
                    {job.status === 'open' ? 'Öppen' : 
                     job.status === 'in_progress' ? 'Pågående' :
                     job.status === 'completed' ? 'Slutförd' : 'Avbruten'}
                  </span>
                  <span className={`urgency-badge ${getUrgencyColor(job.urgency)}`}>
                    {job.urgency === 'high' ? 'Hög prioritet' :
                     job.urgency === 'medium' ? 'Medium prioritet' : 'Låg prioritet'}
                  </span>
                  <span className="category-badge">{job.category}</span>
                </div>
              </div>
              <div className="job-price">
                <span className="price-amount">{formatPrice(job.price, job.priceType)}</span>
                {job.estimatedHours && (
                  <span className="estimated-hours">~{job.estimatedHours}h</span>
                )}
              </div>
            </div>

            <div className="job-card-body">
              {job.description && (
                <p className="job-description">
                  {job.description.length > 200 
                    ? `${job.description.substring(0, 200)}...` 
                    : job.description}
                </p>
              )}

              <div className="job-details">
                {job.address && (
                  <div className="job-detail">
                    <span className="detail-icon">📍</span>
                    <span>{job.address}</span>
                  </div>
                )}
                {job.startsAt && (
                  <div className="job-detail">
                    <span className="detail-icon">📅</span>
                    <span>Start: {formatDate(job.startsAt)}</span>
                  </div>
                )}
                {job.requiredSkills && (
                  <div className="job-detail">
                    <span className="detail-icon">🔧</span>
                    <span>{job.requiredSkills}</span>
                  </div>
                )}
              </div>

              <div className="job-card-footer">
                <div className="job-stats">
                  <span className="stat">
                    <span className="stat-icon">👁️</span>
                    {job.viewCount} visningar
                  </span>
                  <span className="stat">
                    <span className="stat-icon">📝</span>
                    {job.applicationCount} ansökningar
                  </span>
                </div>
                <div className="job-creator">
                  <span>Av {job.creatorName}</span>
                  <span className="job-date">{formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default SearchResults;
