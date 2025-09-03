import React from 'react';

interface DashboardStats {
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

interface DashboardStatsProps {
  stats: DashboardStats;
  userType: 'customer' | 'youth';
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  userType,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="dashboard-stats">
        <div className="stats-grid">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="stat-card loading">
              <div className="stat-card-content">
                <div className="stat-icon loading-icon"></div>
                <div className="stat-info">
                  <div className="stat-label loading-text"></div>
                  <div className="stat-value loading-text"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatIcon = (index: number) => {
    const icons = [
      // Total Jobs
      <svg key="jobs" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.605-9-1.65M21 13.255A23.931 23.931 0 0012 15c-3.183 0-6.22-.605-9-1.65" />
      </svg>,
      // Completed Jobs
      <svg key="completed" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      // Earnings
      <svg key="earnings" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>,
      // Rating
      <svg key="rating" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ];
    return icons[index] || icons[0];
  };

  const getStatColor = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'yellow'];
    return colors[index] || 'blue';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatData = () => {
    if (userType === 'customer') {
      return [
        {
          label: 'Totalt antal jobb',
          value: stats.totalJobs,
          icon: 0,
          color: 'blue'
        },
        {
          label: 'Genomförda jobb',
          value: stats.completedJobs,
          icon: 1,
          color: 'green'
        },
        {
          label: 'Total kostnad',
          value: formatCurrency(stats.totalEarnings),
          icon: 2,
          color: 'purple'
        },
        {
          label: 'Genomsnittlig betyg',
          value: stats.averageRating.toFixed(1),
          icon: 3,
          color: 'yellow'
        }
      ];
    } else {
      return [
        {
          label: 'Totalt antal jobb',
          value: stats.totalJobs,
          icon: 0,
          color: 'blue'
        },
        {
          label: 'Genomförda jobb',
          value: stats.completedJobs,
          icon: 1,
          color: 'green'
        },
        {
          label: 'Total intäkt',
          value: formatCurrency(stats.totalEarnings),
          icon: 2,
          color: 'purple'
        },
        {
          label: 'Genomsnittlig betyg',
          value: stats.averageRating.toFixed(1),
          icon: 3,
          color: 'yellow'
        }
      ];
    }
  };

  const statData = getStatData();

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {statData.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-card-content">
              <div className="stat-icon">
                {getStatIcon(stat.icon)}
              </div>
              <div className="stat-info">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="stats-additional">
        <div className="additional-stat">
          <div className="additional-stat-label">Aktiva jobb</div>
          <div className="additional-stat-value">{stats.activeJobs}</div>
        </div>
        <div className="additional-stat">
          <div className="additional-stat-label">Väntande jobb</div>
          <div className="additional-stat-value">{stats.pendingJobs}</div>
        </div>
        <div className="additional-stat">
          <div className="additional-stat-label">Denna månad</div>
          <div className="additional-stat-value">{formatCurrency(stats.thisMonthEarnings)}</div>
        </div>
        <div className="additional-stat">
          <div className="additional-stat-label">Genomförandegrad</div>
          <div className="additional-stat-value">{stats.completionRate}%</div>
        </div>
        <div className="additional-stat">
          <div className="additional-stat-label">Svarstid</div>
          <div className="additional-stat-value">{stats.responseRate}%</div>
        </div>
        <div className="additional-stat">
          <div className="additional-stat-label">Recensioner</div>
          <div className="additional-stat-value">{stats.totalReviews}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
