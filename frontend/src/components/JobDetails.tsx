import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobApplicationForm from './JobApplicationForm';
import PaymentButton from './PaymentButton';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import { reviewsApi } from '../services/reviewsApi';

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
  requiredSkills?: string;
  specialInstructions?: string;
  minAge?: number;
  maxAge?: number;
  requiresBackgroundCheck: boolean;
  creator: {
    id: string;
    displayName: string;
    city?: string;
  };
}

interface User {
  id: string;
  role: string;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob();
      loadUser();
      loadBooking();
    }
  }, [id]);

  useEffect(() => {
    if (booking && user) {
      checkReviewStatus();
    }
  }, [booking, user]);

  const loadJob = async () => {
    try {
      const response = await fetch(`/api/job/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
        
        // Check if user has already applied
        checkApplicationStatus(data.id);
      } else {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error loading job:', error);
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && id) {
        const response = await fetch(`/api/booking/job/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        }
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    }
  };

  const checkApplicationStatus = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`/api/job/${jobId}/applications/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHasApplied(data.length > 0);
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    setHasApplied(true);
    // Reload job to update application count
    loadJob();
    loadBooking();
  };

  const handlePaymentSuccess = () => {
    // Reload booking to update payment status
    loadBooking();
  };

  const checkReviewStatus = async () => {
    if (!booking || !user) return;
    
    try {
      const status = await reviewsApi.canUserReview(booking.id);
      setCanReview(status.canReview);
      setHasReviewed(status.hasReviewed);
    } catch (error) {
      console.error('Error checking review status:', error);
    }
  };

  const handleReviewSubmit = async (review: { rating: number; comment: string }) => {
    if (!booking || !user) return;
    
    try {
      setReviewLoading(true);
      
      const revieweeId = user.id === booking.customerId ? booking.youthId : booking.customerId;
      
      await reviewsApi.createReview({
        bookingId: booking.id,
        revieweeId: revieweeId,
        rating: review.rating,
        comment: review.comment
      });
      
      setShowReviewForm(false);
      setHasReviewed(true);
      setCanReview(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setReviewLoading(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Laddar jobb...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error-container">
        <h2>Jobb hittades inte</h2>
        <p>Det jobb du letar efter finns inte eller har tagits bort.</p>
        <button onClick={() => navigate('/jobs')} className="btn btn-primary">
          Tillbaka till jobb
        </button>
      </div>
    );
  }

  if (showApplicationForm) {
    return (
      <JobApplicationForm
        jobId={job.id}
        jobTitle={job.title}
        jobPrice={job.price}
        jobPriceType={job.priceType}
        onSuccess={handleApplicationSuccess}
        onCancel={() => setShowApplicationForm(false)}
      />
    );
  }

  const canApply = user?.role === 'youth' && job.status === 'open' && !hasApplied;
  const isOwner = user?.id === job.creator.id;
  const canPay = booking && booking.status === 'confirmed' && user?.id === booking.customerId && booking.paymentStatus !== 'paid';
  const showReviews = job.status === 'completed' || booking?.status === 'completed';

  return (
    <div className="job-details">
      <div className="job-header">
        <div className="job-title-section">
          <h1>{job.title}</h1>
          <div className="job-meta">
            <span className={`status-badge ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
            <span className={`urgency-badge ${getUrgencyColor(job.urgency)}`}>
              {job.urgency} prioritet
            </span>
            <span className="category-badge">{job.category}</span>
          </div>
        </div>

        <div className="job-actions">
          {isOwner ? (
            <div className="owner-actions">
              <button
                onClick={() => navigate(`/jobs/${job.id}/edit`)}
                className="btn btn-secondary"
              >
                Redigera
              </button>
              <button
                onClick={() => navigate('/dashboard/jobs')}
                className="btn btn-primary"
              >
                Hantera jobb
              </button>
            </div>
          ) : canApply ? (
            <button
              onClick={() => setShowApplicationForm(true)}
              className="btn btn-primary btn-large"
            >
              Ansök om jobbet
            </button>
          ) : hasApplied ? (
            <div className="applied-status">
              <span className="applied-badge">Du har ansökt</span>
            </div>
          ) : (
            <div className="cannot-apply">
              <p>Du kan inte ansöka om detta jobb</p>
            </div>
          )}
        </div>
      </div>

      <div className="job-content">
        <div className="job-main">
          <div className="job-description">
            <h2>Beskrivning</h2>
            <p>{job.description}</p>
          </div>

          {job.requiredSkills && (
            <div className="job-requirements">
              <h3>Erforderliga färdigheter</h3>
              <p>{job.requiredSkills}</p>
            </div>
          )}

          {job.specialInstructions && (
            <div className="job-instructions">
              <h3>Särskilda instruktioner</h3>
              <p>{job.specialInstructions}</p>
            </div>
          )}

          <div className="job-creator">
            <h3>Uppdragsgivare</h3>
            <div className="creator-info">
              <span className="creator-name">{job.creator.displayName}</span>
              {job.creator.city && (
                <span className="creator-location">{job.creator.city}</span>
              )}
            </div>
          </div>
        </div>

        <div className="job-sidebar">
          <div className="job-info-card">
            <h3>Jobbinformation</h3>
            
            <div className="info-item">
              <label>Pris:</label>
              <span className="price">
                {job.price} SEK {job.priceType === 'hourly' ? 'per timme' : 'fast pris'}
              </span>
            </div>

            {job.estimatedHours && (
              <div className="info-item">
                <label>Uppskattad tid:</label>
                <span>{job.estimatedHours} timmar</span>
              </div>
            )}

            {job.address && (
              <div className="info-item">
                <label>Plats:</label>
                <span>{job.address}</span>
              </div>
            )}

            {job.startsAt && (
              <div className="info-item">
                <label>Startdatum:</label>
                <span>{formatDate(job.startsAt)}</span>
              </div>
            )}

            {job.endsAt && (
              <div className="info-item">
                <label>Slutdatum:</label>
                <span>{formatDate(job.endsAt)}</span>
              </div>
            )}

            {(job.minAge || job.maxAge) && (
              <div className="info-item">
                <label>Ålderskrav:</label>
                <span>
                  {job.minAge && job.maxAge 
                    ? `${job.minAge}-${job.maxAge} år`
                    : job.minAge 
                    ? `Minst ${job.minAge} år`
                    : `Högst ${job.maxAge} år`
                  }
                </span>
              </div>
            )}

            {job.requiresBackgroundCheck && (
              <div className="info-item">
                <label>Bakgrundskontroll:</label>
                <span className="required">Krävs</span>
              </div>
            )}

            <div className="info-item">
              <label>Publicerad:</label>
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>

          <div className="job-stats">
            <h3>Statistik</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{job.viewCount}</span>
                <span className="stat-label">Visningar</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{job.applicationCount}</span>
                <span className="stat-label">Ansökningar</span>
              </div>
            </div>
          </div>

          {canApply && (
            <div className="apply-card">
              <h3>Intresserad?</h3>
              <p>Skicka en ansökan och berätta varför du är rätt person för detta jobb.</p>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="btn btn-primary btn-full"
              >
                Ansök nu
              </button>
            </div>
          )}

          {canPay && (
            <div className="payment-card">
              <h3>Betalning</h3>
              <p>Din bokning är bekräftad. Betala nu för att slutföra processen.</p>
              <PaymentButton
                bookingId={booking.id}
                amount={booking.totalAmount || job.price}
                onPaymentSuccess={handlePaymentSuccess}
                className="btn-full"
              />
            </div>
          )}

          {booking && booking.paymentStatus === 'paid' && (
            <div className="payment-status-card">
              <h3>Betalning slutförd</h3>
              <p>✓ Betalningen är genomförd och bokningen är bekräftad.</p>
            </div>
          )}

          {canReview && (
            <div className="review-card">
              <h3>Skriv en recension</h3>
              <p>Dela din upplevelse av detta jobb.</p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn btn-primary btn-full"
              >
                Skriv recension
              </button>
            </div>
          )}

          {hasReviewed && (
            <div className="review-status-card">
              <h3>Recension skickad</h3>
              <p>✓ Tack för din recension!</p>
            </div>
          )}
        </div>
      </div>

      {showReviewForm && booking && user && (
        <div className="review-form-modal">
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Skriv en recension</h3>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <ReviewForm
                  bookingId={booking.id}
                  revieweeId={user.id === booking.customerId ? booking.youthId : booking.customerId}
                  revieweeName={user.id === booking.customerId ? booking.youthName : booking.customerName}
                  jobTitle={job.title}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                  isLoading={reviewLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showReviews && (
        <div className="job-reviews-section">
          <h2>Recensioner</h2>
          <ReviewList
            userId={job.creator.id}
            showSummary={true}
            showFilters={true}
            maxReviews={5}
          />
        </div>
      )}
    </div>
  );
};

export default JobDetails;
