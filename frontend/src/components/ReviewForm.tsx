import React, { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  bookingId: string;
  revieweeId: string;
  revieweeName?: string;
  jobTitle?: string;
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  revieweeId,
  revieweeName,
  jobTitle,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validateForm = () => {
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = 'Välj en betyg';
    }
    
    if (comment.trim().length < 10) {
      newErrors.comment = 'Kommentaren måste vara minst 10 tecken lång';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Mycket dåligt';
      case 2: return 'Dåligt';
      case 3: return 'Okej';
      case 4: return 'Bra';
      case 5: return 'Utmärkt';
      default: return '';
    }
  };

  return (
    <div className="review-form">
      <div className="review-form-header">
        <h3>Skriv en recension</h3>
        <p>Dela din upplevelse av {revieweeName || 'denna person'}</p>
        {jobTitle && (
          <p className="review-form-job">För jobb: {jobTitle}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="review-form-content">
        <div className="form-group">
          <label className="form-label">Betyg *</label>
          <div className="rating-input">
            <StarRating
              rating={rating}
              interactive
              onRatingChange={setRating}
              size="lg"
            />
            {rating > 0 && (
              <span className="rating-text">{getRatingText(rating)}</span>
            )}
          </div>
          {errors.rating && (
            <span className="form-error">{errors.rating}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="comment" className="form-label">
            Kommentar *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Berätta om din upplevelse. Vad gick bra? Vad kunde ha varit bättre?"
            className={`form-textarea ${errors.comment ? 'form-error' : ''}`}
            rows={4}
            maxLength={1000}
          />
          <div className="form-help">
            {comment.length}/1000 tecken
          </div>
          {errors.comment && (
            <span className="form-error">{errors.comment}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || rating === 0 || comment.trim().length < 10}
          >
            {isLoading ? 'Skickar...' : 'Skicka recension'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
