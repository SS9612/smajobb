import React, { useState } from 'react';
import { User } from '../services/api';
import { userApi } from '../services/userApi';
import LoadingSpinner from './LoadingSpinner';
import PersonalInfoForm from './forms/PersonalInfoForm';
import SkillsForm from './forms/SkillsForm';
import ProfileImageForm from './forms/ProfileImageForm';

interface ProfileEditFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    location: user.location || '',
    birthDate: user.birthDate || '',
    skills: [] as string[], // Skills not available in UserProfile type
    profileImage: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((s: string) => s !== skill)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Förnamn är obligatoriskt';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Efternamn är obligatoriskt';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-postadress är obligatorisk';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-postadress är inte giltig';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer är obligatoriskt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Only update fields that are supported by the UserProfile type
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        birthDate: formData.birthDate
      };
      await userApi.updateUser(user.id, updateData);
      onSuccess();
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ general: 'Kunde inte uppdatera profilen. Försök igen.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Redigera profil</h1>
          <p className="text-gray-600 mt-1">Uppdatera din personliga information</p>
        </div>

        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <PersonalInfoForm
            user={user}
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <SkillsForm
            skills={formData.skills}
            onSkillAdd={handleSkillAdd}
            onSkillRemove={handleSkillRemove}
          />

          <ProfileImageForm
            profileImage={formData.profileImage}
            onImageChange={handleImageChange}
            currentImageUrl={user.avatar}
          />

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Sparar...</span>
                </div>
              ) : (
                'Spara ändringar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;