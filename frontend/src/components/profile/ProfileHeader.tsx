import React from 'react';
import { User } from '../../services/api';

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
  isOwner: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit, isOwner }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-2xl">
              {user.firstName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            {user.bio && (
              <p className="text-gray-700 mt-2">{user.bio}</p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Medlem sedan {new Date(user.createdAt).toLocaleDateString('sv-SE')}</span>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Redigera profil
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
