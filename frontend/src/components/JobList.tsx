import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  priceType: string;
  price: number;
  status: string;
  urgency: string;
  estimatedHours: number;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  startsAt?: string;
  endsAt?: string;
  address?: string;
  creator: {
    id: string;
    displayName: string;
    city?: string;
  };
}

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  emptyMessage?: string;
  showCreator?: boolean;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  loading = false,
  emptyMessage = "Inga jobb hittades",
  showCreator = true
}) => {
  const navigate = useNavigate();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="job-list loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Laddar jobb...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="job-list empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Inga jobb hittades</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-list">
      <div className="job-grid">
        {jobs.map(job => (
          <div
            key={job.id}
            className="job-card"
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <div className="job-card-header">
              <div className="job-title">
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span className={`status-badge ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <span className={`urgency-badge ${getUrgencyColor(job.urgency)}`}>
                    {job.urgency}
                  </span>
                </div>
              </div>
              <div className="job-price">
                <span className="price-amount">{job.price} SEK</span>
                <span className="price-type">
                  {job.priceType === 'hourly' ? 'per timme' : 'fast pris'}
                </span>
              </div>
            </div>

            <div className="job-card-body">
              <div className="job-description">
                <p>{truncateText(job.description, 150)}</p>
              </div>

              <div className="job-details">
                <div className="detail-item">
                  <span className="detail-label">Kategori:</span>
                  <span className="detail-value">{job.category}</span>
                </div>

                {job.estimatedHours && (
                  <div className="detail-item">
                    <span className="detail-label">Tid:</span>
                    <span className="detail-value">{job.estimatedHours} timmar</span>
                  </div>
                )}

                {job.address && (
                  <div className="detail-item">
                    <span className="detail-label">Plats:</span>
                    <span className="detail-value">{job.address}</span>
                  </div>
                )}

                {job.startsAt && (
                  <div className="detail-item">
                    <span className="detail-label">Start:</span>
                    <span className="detail-value">{formatDateTime(job.startsAt)}</span>
                  </div>
                )}
              </div>

              {showCreator && (
                <div className="job-creator">
                  <span className="creator-label">Uppdragsgivare:</span>
                  <span className="creator-name">{job.creator.displayName}</span>
                  {job.creator.city && (
                    <span className="creator-location">{job.creator.city}</span>
                  )}
                </div>
              )}
            </div>

            <div className="job-card-footer">
              <div className="job-stats">
                <div className="stat-item">
                  <span className="stat-icon">👁️</span>
                  <span className="stat-value">{job.viewCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📝</span>
                  <span className="stat-value">{job.applicationCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📅</span>
                  <span className="stat-value">{formatDate(job.createdAt)}</span>
                </div>
              </div>

              <div className="job-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job.id}`);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Visa detaljer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
