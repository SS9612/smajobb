import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userApi, jobApi, User, Job } from '../services/api';
import { reviewsApi } from '../services/reviewsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileJobs from '../components/profile/ProfileJobs';
import ProfileReviews from '../components/profile/ProfileReviews';
import ProfileEditForm from '../components/ProfileEditForm';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    jobsPosted: 0,
    jobsCompleted: 0,
    totalEarnings: 0,
    averageRating: 0,
    reviewCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const isOwner = !userId || userId === currentUser?.id;

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        setError('Användare hittades inte');
        return;
      }

      // Load user data
      const userData = await userApi.getUserById(targetUserId);
      setUser(userData);

      // Load user's jobs
      const jobsData = await jobApi.getUserJobs();
      setJobs(jobsData);

      // Load user's reviews
      const reviewsData = await reviewsApi.getReviewsByUser(targetUserId);
      setReviews(reviewsData);

      // Calculate stats
      const completedJobs = jobsData.filter(job => job.status === 'completed');
      const totalEarnings = completedJobs.reduce((sum, job) => sum + job.budget, 0);
      const averageRating = reviewsData.length > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
        : 0;

      setStats({
        jobsPosted: jobsData.length,
        jobsCompleted: completedJobs.length,
        totalEarnings,
        averageRating,
        reviewCount: reviewsData.length
      });
    } catch (error) {
      console.error('Failed to load profile data:', error);
      setError('Kunde inte ladda profildata');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    loadProfileData();
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Laddar profil..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profil hittades inte</h1>
          <p className="text-gray-600 mb-6">{error || 'Denna profil existerar inte.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tillbaka till startsidan
          </button>
        </div>
      </div>
    );
  }

  if (showEditForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileEditForm
            user={user}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          user={user}
          onEdit={handleEdit}
          isOwner={isOwner}
        />

        <ProfileStats stats={stats} />

        <ProfileJobs
          jobs={jobs}
          onJobClick={handleJobClick}
          isOwner={isOwner}
        />

        <ProfileReviews reviews={reviews} />
      </div>
    </div>
  );
};

export default Profile;
