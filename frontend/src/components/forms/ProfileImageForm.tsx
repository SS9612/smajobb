import React from 'react';

interface ProfileImageFormProps {
  profileImage: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentImageUrl?: string;
}

const ProfileImageForm: React.FC<ProfileImageFormProps> = ({
  profileImage,
  onImageChange,
  currentImageUrl
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Profilbild</h3>
      
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profilbild"
                className="w-full h-full object-cover"
              />
            ) : currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt="Profilbild"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium text-2xl">U</span>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Välj ny profilbild
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            JPG, PNG eller GIF. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageForm;
