import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  bio?: string;
  profileImageUrl?: string;
  userType: 'customer' | 'youth';
  isVerified: boolean;
  joinedAt: string;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  totalEarnings?: number;
}

interface UserProfileCardProps {
  user: UserProfile;
  showActions?: boolean;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  showActions = true,
  isOwnProfile = false,
  onEdit
}) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow functionality
  };

  const handleMessage = () => {
    navigate(`/messages/${user.id}`);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="user-profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.displayName}
              className="profile-avatar-image"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {getInitials()}
            </div>
          )}
          {user.isVerified && (
            <div className="verification-badge">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="profile-info">
          <h3 className="profile-name">{user.displayName}</h3>
          <p className="profile-location">
            {user.city && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.city}
              </>
            )}
          </p>
          <p className="profile-joined">
            Medlem sedan {formatDate(user.joinedAt)}
          </p>
        </div>
      </div>

      {user.bio && (
        <div className="profile-bio">
          <p>{user.bio}</p>
        </div>
      )}

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{user.completedJobs || 0}</span>
          <span className="stat-label">Genomförda jobb</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{user.totalEarnings || 0} kr</span>
          <span className="stat-label">Total intäkt</span>
        </div>
        {user.rating && (
          <div className="stat-item">
            <div className="rating">
              {renderStars(user.rating)}
              <span className="rating-text">
                {user.rating.toFixed(1)} ({user.reviewCount || 0} recensioner)
              </span>
            </div>
          </div>
        )}
      </div>

      {showActions && (
        <div className="profile-actions">
          {isOwnProfile ? (
            <button
              onClick={onEdit}
              className="btn btn-primary"
            >
              Redigera profil
            </button>
          ) : (
            <>
              <button
                onClick={handleMessage}
                className="btn btn-primary"
              >
                Skicka meddelande
              </button>
              <button
                onClick={handleFollow}
                className={`btn ${isFollowing ? 'btn-secondary' : 'btn-outline'}`}
              >
                {isFollowing ? 'Följer' : 'Följ'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="profile-type-badge">
        <span className={`type-badge ${user.userType}`}>
          {user.userType === 'customer' ? 'Kund' : 'Ungdom'}
        </span>
      </div>
    </div>
  );
};

export default UserProfileCard;
