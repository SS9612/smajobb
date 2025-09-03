import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../services/userApi';

// Define a proper type for the user
interface User {
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const Profile: React.FC = () => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const user = {} as User;
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    birthDate: '',
    userType: 'customer',
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsUpdates: false
    }
  });

  const [formData, setFormData] = useState(profileData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!authUser) return;
    // Update basic fields via user controller
    await userApi.updateUser(authUser.id, {
      email: formData.email,
      phone: formData.phone,
      displayName: `${formData.firstName} ${formData.lastName}`.trim()
    });
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', name: 'Personlig Information', icon: '👤' },
    { id: 'security', name: 'Säkerhet', icon: '🔒' },
    { id: 'preferences', name: 'Inställningar', icon: '⚙️' },
    { id: 'activity', name: 'Aktivitet', icon: '📊' }
  ];

  useEffect(() => {
    if (authLoading) return;
    if (authUser) {
      setProfileData({
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
        phone: authUser.phone,
        location: authUser.location || '',
        bio: authUser.bio || '',
        birthDate: authUser.birthDate || '',
        userType: authUser.userType,
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false
        }
      });
      setFormData(prev => ({ ...prev, ...profileData }));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          Laddar profil...
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          Du måste vara inloggad för att visa profilen.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Min Profil</h1>
              <p className="text-gray-600">Hantera din profil och inställningar</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md"
              >
                Redigera Profil
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {profileData.userType === 'customer' ? 'Kund' : 'Ungdom'}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'personal' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Personlig Information</h2>
                      {isEditing && (
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            Spara
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            Avbryt
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Förnamn
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Efternamn
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-postadress
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefonnummer
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plats
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      {profileData.userType === 'youth' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Födelsedatum
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Om mig
                      </label>
                      <textarea
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        placeholder="Berätta lite om dig själv..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Säkerhet</h2>
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">BankID-verifiering</h3>
                        <p className="text-sm text-blue-700">
                          Din identitet är verifierad via BankID. Detta säkerställer att du är den du utger dig för att vara.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Ändra lösenord</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nuvarande lösenord
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Ange ditt nuvarande lösenord"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nytt lösenord
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Ange ditt nya lösenord"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bekräfta nytt lösenord
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Bekräfta ditt nya lösenord"
                            />
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Uppdatera Lösenord
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Inställningar</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-4">Notifikationer</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Push-notifikationer</p>
                              <p className="text-sm text-gray-500">Få notifikationer direkt på din enhet</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="notifications"
                                checked={formData.preferences.notifications}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">E-postuppdateringar</p>
                              <p className="text-sm text-gray-500">Få viktiga uppdateringar via e-post</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="emailUpdates"
                                checked={formData.preferences.emailUpdates}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">SMS-uppdateringar</p>
                              <p className="text-sm text-gray-500">Få viktiga meddelanden via SMS</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="smsUpdates"
                                checked={formData.preferences.smsUpdates}
                                onChange={handleInputChange}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Aktivitet</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Senaste inloggning</p>
                            <p className="text-sm text-gray-500">Idag kl 14:30</p>
                          </div>
                          <div className="text-sm text-gray-500">Stockholm, SE</div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Konto skapat</p>
                            <p className="text-sm text-gray-500">15 januari 2024</p>
                          </div>
                          <div className="text-sm text-gray-500">Via e-post</div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Profil uppdaterad</p>
                            <p className="text-sm text-gray-500">12 januari 2024</p>
                          </div>
                          <div className="text-sm text-gray-500">Personlig information</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
