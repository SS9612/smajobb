import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
  showAll?: boolean;
  limit?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
  showAll = false,
  limit = 5
}) => {
  const navigate = useNavigate();

  const getActivityIcon = (type: string) => {
    const icons = {
      job_created: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      job_completed: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      job_cancelled: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      application_received: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      application_accepted: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      application_rejected: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      payment_received: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      review_received: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      message_received: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    };
    return icons[type as keyof typeof icons] || icons.job_created;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      job_created: 'blue',
      job_completed: 'green',
      job_cancelled: 'red',
      application_received: 'blue',
      application_accepted: 'green',
      application_rejected: 'red',
      payment_received: 'green',
      review_received: 'yellow',
      message_received: 'blue'
    };
    return colors[type as keyof typeof colors] || 'blue';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Nu';
    } else if (diffInHours < 24) {
      return `${diffInHours} timmar sedan`;
    } else if (diffInHours < 48) {
      return 'Igår';
    } else {
      return date.toLocaleDateString('sv-SE', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.jobId) {
      navigate(`/jobs/${activity.jobId}`);
    } else if (activity.userId) {
      navigate(`/profile/${activity.userId}`);
    }
  };

  const displayActivities = showAll ? activities : activities.slice(0, limit);

  if (loading) {
    return (
      <div className="recent-activity">
        <div className="activity-header">
          <h3>Senaste aktivitet</h3>
        </div>
        <div className="activity-list">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="activity-item loading">
              <div className="activity-icon loading-icon"></div>
              <div className="activity-content">
                <div className="activity-title loading-text"></div>
                <div className="activity-description loading-text"></div>
                <div className="activity-timestamp loading-text"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="recent-activity">
        <div className="activity-header">
          <h3>Senaste aktivitet</h3>
        </div>
        <div className="activity-empty">
          <div className="empty-icon">📋</div>
          <p>Ingen aktivitet än</p>
          <span>Din aktivitet kommer att visas här</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Senaste aktivitet</h3>
        {!showAll && activities.length > limit && (
          <button
            onClick={() => navigate('/dashboard/activity')}
            className="view-all-link"
          >
            Visa alla
          </button>
        )}
      </div>
      <div className="activity-list">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-item activity-${getActivityColor(activity.type)}`}
            onClick={() => handleActivityClick(activity)}
          >
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-description">{activity.description}</div>
              <div className="activity-meta">
                <span className="activity-timestamp">
                  {formatTimestamp(activity.timestamp)}
                </span>
                {activity.amount && (
                  <span className="activity-amount">
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK'
                    }).format(activity.amount)}
                  </span>
                )}
                {activity.priority && (
                  <span className={`activity-priority priority-${activity.priority}`}>
                    {activity.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
