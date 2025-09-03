import React from 'react';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewerName?: string;
    jobTitle?: string;
    isVerified: boolean;
  };
  showJobTitle?: boolean;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showJobTitle = true,
  compact = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <div className="review-card-compact">
        <div className="review-header-compact">
          <div className="review-rating-compact">
            <StarRating rating={review.rating} size="sm" />
            <span className="review-date-compact">{formatDate(review.createdAt)}</span>
          </div>
          {review.isVerified && (
            <span className="verified-badge">✓ Verifierad</span>
          )}
        </div>
        {review.comment && (
          <p className="review-comment-compact">{review.comment}</p>
        )}
        {showJobTitle && review.jobTitle && (
          <p className="review-job-compact">För: {review.jobTitle}</p>
        )}
      </div>
    );
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-info">
          <div className="review-rating">
            <StarRating rating={review.rating} size="md" showValue />
          </div>
          <div className="review-meta">
            <span className="reviewer-name">{review.reviewerName || 'Anonym'}</span>
            <span className="review-date">{formatDate(review.createdAt)}</span>
            {review.isVerified && (
              <span className="verified-badge">✓ Verifierad</span>
            )}
          </div>
        </div>
      </div>
      
      {review.comment && (
        <div className="review-comment">
          <p>{review.comment}</p>
        </div>
      )}
      
      {showJobTitle && review.jobTitle && (
        <div className="review-job">
          <span className="job-label">För jobb:</span>
          <span className="job-title">{review.jobTitle}</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
