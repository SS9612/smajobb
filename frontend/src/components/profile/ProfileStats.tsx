import React from 'react';

interface ProfileStatsProps {
  stats: {
    jobsPosted: number;
    jobsCompleted: number;
    totalEarnings: number;
    averageRating: number;
    reviewCount: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistik</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {stats.jobsPosted}
          </div>
          <div className="text-sm text-gray-500">Jobb publicerade</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.jobsCompleted}
          </div>
          <div className="text-sm text-gray-500">Jobb slutförda</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {stats.totalEarnings.toLocaleString()} kr
          </div>
          <div className="text-sm text-gray-500">Total inkomst</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">
            Betyg ({stats.reviewCount} recensioner)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
