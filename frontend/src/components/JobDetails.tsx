import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobApi, Job, User, userApi } from '../services/api';
import { reviewsApi } from '../services/reviewsApi';
import LoadingSpinner from './LoadingSpinner';
import JobHeader from './jobs/JobHeader';
import JobDescription from './jobs/JobDescription';
import JobDetailsInfo from './jobs/JobDetails';
import JobOwner from './jobs/JobOwner';
import JobApplicationForm from './jobs/JobApplicationForm';
import PaymentButton from './PaymentButton';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadJobDetails();
      loadReviews();
    }
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobData = await jobApi.getJobById(id!);
      setJob(jobData);
      
      // Load owner details
      if (jobData.postedByUserId) {
        const ownerData = await userApi.getUserById(jobData.postedByUserId);
        setOwner(ownerData);
      }
      
      // Check if user has applied
      const applications = await jobApi.getUserApplications();
      setIsApplied(applications.some((app: any) => app.jobId === id));
      
      // Check if job is saved
      const savedJobs = await jobApi.getSavedJobs();
      setIsSaved(savedJobs.some((savedJob: any) => savedJob.id === id));
    } catch (error) {
      console.error('Failed to load job details:', error);
      setError('Kunde inte ladda jobbdetaljer');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const reviewsData = await reviewsApi.getJobReviews(id!);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await jobApi.unsaveJob(id!);
        setIsSaved(false);
      } else {
        await jobApi.saveJob(id!);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: job?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Länk kopierad till urklipp!');
    }
  };

  const handleContactOwner = () => {
    // Navigate to messages or open contact modal
    navigate(`/messages?user=${owner?.id}`);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    setIsApplied(true);
    // Reload job to update application count
    loadJobDetails();
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      await reviewsApi.createReview({
        ...reviewData,
        jobId: id!
      });
      setShowReviewForm(false);
      loadReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Laddar jobbdetaljer..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Jobb hittades inte</h1>
          <p className="text-gray-600 mb-6">{error || 'Detta jobb existerar inte eller har tagits bort.'}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tillbaka till jobb
          </button>
        </div>
      </div>
    );
  }

  const isOwner = owner?.id === job.postedByUserId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <JobHeader
              job={job}
              onApply={handleApply}
              onSave={handleSave}
              onShare={handleShare}
              isApplied={isApplied}
              isSaved={isSaved}
              isOwner={isOwner}
            />

            <JobDescription job={job} />

            <JobDetailsInfo job={job} />

            {owner && (
              <JobOwner
                owner={owner}
                onContact={handleContactOwner}
              />
            )}

            {showApplicationForm && (
              <JobApplicationForm
                jobId={id!}
                onSuccess={handleApplicationSuccess}
                onCancel={() => setShowApplicationForm(false)}
              />
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recensioner ({reviews.length})
                </h2>
                {!isOwner && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Skriv recension
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    bookingId=""
                    revieweeId={job.postedByUserId}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <ReviewList userId={job.postedByUserId} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Section */}
            {isOwner && job.status === 'active' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Betalning</h3>
                <PaymentButton bookingId={job.id} amount={job.budget} />
              </div>
            )}

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Liknande jobb</h3>
              <p className="text-gray-500 text-sm">Funktion kommer snart...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;