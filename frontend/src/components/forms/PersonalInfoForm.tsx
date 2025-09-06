import React from 'react';
import { UserProfile } from '../../services/userApi';

interface PersonalInfoFormProps {
  user: UserProfile;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    birthDate: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personlig information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Förnamn *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={onInputChange}
            name="firstName"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ditt förnamn"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Efternamn *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={onInputChange}
            name="lastName"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ditt efternamn"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-postadress *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={onInputChange}
            name="email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="din@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={onInputChange}
            name="phone"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="070-123 45 67"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biografi
        </label>
        <textarea
          value={formData.bio}
          onChange={onInputChange}
          name="bio"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Berätta lite om dig själv..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plats
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={onInputChange}
            name="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Din stad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Födelsedatum
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={onInputChange}
            name="birthDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
