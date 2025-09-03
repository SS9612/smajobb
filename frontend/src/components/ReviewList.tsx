import React, { useState, useEffect } from 'react';
import { reviewsApi, Review } from '../services/reviewsApi';
import ReviewCard from './ReviewCard';
import ReviewSummary from './ReviewSummary';

interface ReviewListProps {
  userId: string;
  showSummary?: boolean;
  showFilters?: boolean;
  maxReviews?: number;
  compact?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  userId,
  showSummary = true,
  showFilters = false,
  maxReviews,
  compact = false
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    loadReviews();
    if (showSummary) {
      loadSummary();
    }
  }, [userId, page, filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const reviewsData = await reviewsApi.getReviewsByUser(userId, page, 20);
      
      if (page === 1) {
        setReviews(reviewsData);
      } else {
        setReviews(prev => [...prev, ...reviewsData]);
      }

      setHasMore(reviewsData.length === 20);
    } catch (err: any) {
      setError('Kunde inte ladda recensioner');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const summaryData = await reviewsApi.getReviewSummary(userId);
      setSummary(summaryData);
    } catch (err: any) {
      console.error('Error loading review summary:', err);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.rating.toString() === filter;
  });

  const displayReviews = maxReviews 
    ? filteredReviews.slice(0, maxReviews)
    : filteredReviews;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="review-list-loading">
        <div className="loading-spinner"></div>
        <p>Laddar recensioner...</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {showSummary && summary && (
        <div className="review-summary-section">
          <ReviewSummary summary={summary} compact={compact} />
        </div>
      )}

      {showFilters && (
        <div className="review-filters">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="all">Alla betyg</option>
            <option value="5">5 stjärnor</option>
            <option value="4">4 stjärnor</option>
            <option value="3">3 stjärnor</option>
            <option value="2">2 stjärnor</option>
            <option value="1">1 stjärna</option>
          </select>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="reviews-container">
        {displayReviews.length > 0 ? (
          <>
            {displayReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                compact={compact}
              />
            ))}
            
            {!maxReviews && hasMore && (
              <div className="load-more-section">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  {loading ? 'Laddar...' : 'Ladda fler recensioner'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-reviews">
            <p>Inga recensioner hittades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
