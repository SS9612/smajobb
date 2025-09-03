import React from 'react';
import StarRating from './StarRating';

interface ReviewSummaryProps {
  summary: {
    userId: string;
    averageRating: number;
    totalReviews: number;
    ratingCounts: number; // 5-star reviews
    ratingCount4: number; // 4-star reviews
    ratingCount3: number; // 3-star reviews
    ratingCount2: number; // 2-star reviews
    ratingCount1: number; // 1-star reviews
  };
  showDetails?: boolean;
  compact?: boolean;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  summary,
  showDetails = true,
  compact = false
}) => {
  const getRatingPercentage = (count: number) => {
    if (summary.totalReviews === 0) return 0;
    return Math.round((count / summary.totalReviews) * 100);
  };

  if (compact) {
    return (
      <div className="review-summary-compact">
        <div className="summary-rating-compact">
          <StarRating rating={summary.averageRating} size="sm" showValue />
        </div>
        <div className="summary-count-compact">
          {summary.totalReviews} recension{summary.totalReviews !== 1 ? 'er' : ''}
        </div>
      </div>
    );
  }

  return (
    <div className="review-summary">
      <div className="summary-header">
        <div className="summary-rating">
          <StarRating rating={summary.averageRating} size="lg" showValue />
          <div className="summary-count">
            {summary.totalReviews} recension{summary.totalReviews !== 1 ? 'er' : ''}
          </div>
        </div>
      </div>

      {showDetails && summary.totalReviews > 0 && (
        <div className="summary-details">
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = star === 5 ? summary.ratingCounts :
                           star === 4 ? summary.ratingCount4 :
                           star === 3 ? summary.ratingCount3 :
                           star === 2 ? summary.ratingCount2 :
                           summary.ratingCount1;
              const percentage = getRatingPercentage(count);
              
              return (
                <div key={star} className="rating-bar">
                  <span className="rating-label">{star} stjärnor</span>
                  <div className="rating-progress">
                    <div 
                      className="rating-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {summary.totalReviews === 0 && (
        <div className="no-reviews">
          <p>Inga recensioner ännu</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
