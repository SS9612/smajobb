import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardStats from '../components/DashboardStats';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';
import UserProfileCard from '../components/UserProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Define a proper type for the user
interface User {
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

interface DashboardStatsData {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  completionRate: number;
}

interface ActivityItem {
  id: string;
  type: 'job_created' | 'job_completed' | 'job_cancelled' | 'application_received' | 'application_accepted' | 'application_rejected' | 'payment_received' | 'review_received' | 'message_received';
  title: string;
  description: string;
  timestamp: string;
  jobId?: string;
  userId?: string;
  amount?: number;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Derive user from auth
  const user: User | null = authUser
    ? {
        id: authUser.id,
        displayName: authUser.displayName,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        phone: authUser.phone,
        city: authUser.location,
        bio: authUser.bio,
        userType: authUser.userType,
        isVerified: authUser.isVerified,
        joinedAt: authUser.createdAt,
      }
    : null;

  // Mock stats data
  const [stats] = useState<DashboardStatsData>({
    totalJobs: 24,
    completedJobs: 18,
    activeJobs: 3,
    pendingJobs: 2,
    totalEarnings: 2840,
    thisMonthEarnings: 420,
    averageRating: 4.8,
    totalReviews: 24,
    responseRate: 95,
    completionRate: 88
  });

  // Mock activity data
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'payment_received',
      title: 'Betalning mottagen',
      description: 'Betalning mottagen för Trädgårdsskötsel-jobb',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      jobId: '1',
      amount: 150,
      priority: 'high'
    },
    {
      id: '2',
      type: 'application_received',
      title: 'Ny ansökan',
      description: 'Ny ansökan för Husstädning-position från Emma S.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      jobId: '2',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'job_completed',
      title: 'Jobb genomfört',
      description: 'Trädgårdsskötsel-jobb har genomförts av Lucas M.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      jobId: '1',
      amount: 150
    },
    {
      id: '4',
      type: 'review_received',
      title: 'Ny recension',
      description: 'Du har fått en 5-stjärnig recension från Sofia K.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      jobId: '3'
    },
    {
      id: '5',
      type: 'message_received',
      title: 'Nytt meddelande',
      description: 'Meddelande från Erik J. om Hundrastning-jobb',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      userId: '2'
    }
  ]);

  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading]);

  const handleEditProfile = () => {
    navigate('/profile');
  };

  const tabs = [
    { id: 'overview', name: 'Översikt', icon: '📊' },
    { id: 'jobs', name: 'Jobb', icon: '💼' },
    { id: 'activity', name: 'Aktivitet', icon: '📈' },
    { id: 'settings', name: 'Inställningar', icon: '⚙️' }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="container-wide">
            <div className="dashboard-header-content">
              <div>
                <h1 className="dashboard-title">Instrumentpanel</h1>
                <p className="dashboard-subtitle">Laddar...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-wide">
          <div className="dashboard-loading">
            <LoadingSpinner size="lg" text="Laddar instrumentpanel..." />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="container-wide">
          <div className="dashboard-content">
            <p>Du måste vara inloggad för att se instrumentpanelen.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container-wide">
          <div className="dashboard-header-content">
            <div>
              <h1 className="dashboard-title">Instrumentpanel</h1>
              <p className="dashboard-subtitle">Välkommen tillbaka, {user.displayName}!</p>
            </div>
            <button
              onClick={() => navigate('/jobs/create')}
              className="dashboard-cta-button"
            >
              Skapa nytt jobb
            </button>
          </div>
        </div>
      </div>

      <div className="container-wide">
        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            {/* Stats */}
            <DashboardStats
              stats={stats}
              userType={user.userType}
              loading={false}
            />

            {/* Main Grid */}
            <div className="dashboard-grid">
              {/* Left Column */}
              <div className="dashboard-main">
                {/* Recent Activity */}
                <RecentActivity
                  activities={activities}
                  loading={false}
                  showAll={false}
                  limit={5}
                />
              </div>

              {/* Right Column */}
              <div className="dashboard-sidebar">
                {/* User Profile Card */}
                <UserProfileCard
                  user={user}
                  showActions={true}
                  isOwnProfile={true}
                  onEdit={handleEditProfile}
                />

                {/* Quick Actions */}
                <QuickActions
                  userType={user.userType}
                  showTitle={true}
                  columns={1}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2>Mina jobb</h2>
              <p>Hantera dina jobb och ansökningar</p>
              <div className="dashboard-placeholder">
                <div className="placeholder-icon">💼</div>
                <h3>Jobbhantering</h3>
                <p>Här kommer du att kunna hantera alla dina jobb</p>
                <button
                  onClick={() => navigate('/jobs/manage')}
                  className="btn btn-primary"
                >
                  Hantera jobb
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2>All aktivitet</h2>
              <p>Se all din aktivitet på plattformen</p>
              <RecentActivity
                activities={activities}
                loading={false}
                showAll={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2>Inställningar</h2>
              <p>Hantera dina kontoinställningar</p>
              <div className="dashboard-placeholder">
                <div className="placeholder-icon">⚙️</div>
                <h3>Kontoinställningar</h3>
                <p>Här kommer du att kunna hantera dina inställningar</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="btn btn-primary"
                >
                  Gå till profil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
