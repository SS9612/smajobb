import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ReviewList from '../components/ReviewList';
import ReviewSummary from '../components/ReviewSummary';
import { reviewsApi, ReviewSummary as ReviewSummaryType } from '../services/reviewsApi';

const Reviews: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [summary, setSummary] = useState<ReviewSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const summaryData = await reviewsApi.getReviewSummary(user!.id);
      setSummary(summaryData);
    } catch (err: any) {
      setError('Kunde inte ladda recensionssammanfattning');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadSummary();
  }, [isLoading, user, loadSummary]);

  if (loading) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Laddar recensioner...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">
          <div className="error-container">
            <h2>Åtkomst nekad</h2>
            <p>Du måste vara inloggad för att se dina recensioner.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mina recensioner</h2>
          </div>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {summary && (
            <div className="reviews-summary-section">
              <ReviewSummary summary={summary} showDetails={true} />
            </div>
          )}

          <div className="reviews-content">
            <ReviewList
              userId={user.id}
              showSummary={false}
              showFilters={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
