import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  userType: 'customer' | 'youth';
  showTitle?: boolean;
  columns?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userType,
  showTitle = true,
  columns = 2
}) => {
  const navigate = useNavigate();

  const getActions = (): QuickAction[] => {
    if (userType === 'customer') {
      return [
        {
          id: 'create-job',
          title: 'Skapa nytt jobb',
          description: 'Lägg upp ett nytt jobb för ungdomar',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          path: '/jobs/create',
          color: 'blue'
        },
        {
          id: 'manage-jobs',
          title: 'Hantera jobb',
          description: 'Se och hantera dina jobb',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          path: '/jobs/manage',
          color: 'green'
        },
        {
          id: 'find-youth',
          title: 'Hitta ungdomar',
          description: 'Bläddra bland tillgängliga ungdomar',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          path: '/youth',
          color: 'purple'
        },
        {
          id: 'messages',
          title: 'Meddelanden',
          description: 'Hantera dina konversationer',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
          path: '/messages',
          color: 'blue',
          badge: '3'
        },
        {
          id: 'payments',
          title: 'Betalningar',
          description: 'Hantera dina betalningar',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          ),
          path: '/payments',
          color: 'green'
        },
        {
          id: 'reports',
          title: 'Rapporter',
          description: 'Se dina statistik och rapporter',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          path: '/reports',
          color: 'yellow'
        }
      ];
    } else {
      return [
        {
          id: 'find-jobs',
          title: 'Hitta jobb',
          description: 'Bläddra bland tillgängliga jobb',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          path: '/jobs',
          color: 'blue'
        },
        {
          id: 'my-applications',
          title: 'Mina ansökningar',
          description: 'Se status på dina jobbansökningar',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          path: '/applications',
          color: 'green'
        },
        {
          id: 'my-jobs',
          title: 'Mina jobb',
          description: 'Hantera dina pågående jobb',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          path: '/my-jobs',
          color: 'purple'
        },
        {
          id: 'messages',
          title: 'Meddelanden',
          description: 'Hantera dina konversationer',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
          path: '/messages',
          color: 'blue',
          badge: '5'
        },
        {
          id: 'earnings',
          title: 'Intäkter',
          description: 'Se dina intäkter och betalningar',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          ),
          path: '/earnings',
          color: 'green'
        },
        {
          id: 'profile',
          title: 'Uppdatera profil',
          description: 'Förbättra din profil för fler jobb',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          path: '/profile',
          color: 'yellow'
        }
      ];
    }
  };

  const actions = getActions();

  const handleActionClick = (action: QuickAction) => {
    if (!action.disabled) {
      navigate(action.path);
    }
  };

  return (
    <div className="quick-actions">
      {showTitle && (
        <div className="actions-header">
          <h3>Snabbåtgärder</h3>
        </div>
      )}
      <div className={`actions-grid actions-grid-${columns}`}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
            className={`action-card action-${action.color} ${action.disabled ? 'disabled' : ''}`}
          >
            <div className="action-icon">
              {action.icon}
            </div>
            <div className="action-content">
              <h4 className="action-title">{action.title}</h4>
              <p className="action-description">{action.description}</p>
            </div>
            {action.badge && (
              <div className="action-badge">
                {action.badge}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
