import React, { useState, useEffect } from 'react';

interface UserProfile {
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
  birthDate?: string;
  address?: string;
  postalCode?: string;
  skills?: string[];
  availability?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
    publicProfile: boolean;
  };
}

interface ProfileEditFormProps {
  user: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSave,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('availability.')) {
        const day = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          availability: {
            ...prev.availability,
            [day]: checked
          }
        }));
      } else if (name.startsWith('preferences.')) {
        const pref = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [pref]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !formData.skills?.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const validateForm = (): boolean => {
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
      newErrors.email = 'Ogiltig e-postadress';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Ogiltigt telefonnummer';
    }

    if (formData.userType === 'youth' && formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13 || age > 25) {
        newErrors.birthDate = 'Du måste vara mellan 13 och 25 år';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personlig information', icon: '👤' },
    { id: 'contact', name: 'Kontaktuppgifter', icon: '📞' },
    { id: 'skills', name: 'Färdigheter', icon: '🎯' },
    { id: 'availability', name: 'Tillgänglighet', icon: '📅' },
    { id: 'preferences', name: 'Inställningar', icon: '⚙️' }
  ];

  return (
    <div className="profile-edit-form">
      <div className="form-header">
        <h1>Redigera profil</h1>
        <p>Uppdatera din profilinformation</p>
      </div>

      <div className="form-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`form-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {activeTab === 'personal' && (
          <div className="form-section">
            <h2>Personlig information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Förnamn *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Ange ditt förnamn"
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Efternamn *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Ange ditt efternamn"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Om mig</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                placeholder="Berätta lite om dig själv..."
              />
            </div>

            {formData.userType === 'youth' && (
              <div className="form-group">
                <label htmlFor="birthDate">Födelsedatum</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate || ''}
                  onChange={handleInputChange}
                  className={errors.birthDate ? 'error' : ''}
                />
                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="form-section">
            <h2>Kontaktuppgifter</h2>
            <div className="form-group">
              <label htmlFor="email">E-postadress *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="din@email.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefonnummer</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                placeholder="+46 70 123 45 67"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Stad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  placeholder="Stockholm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postnummer</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode || ''}
                  onChange={handleInputChange}
                  placeholder="123 45"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Adress</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Gatunamn 123"
              />
            </div>
          </div>
        )}

        {activeTab === 'skills' && formData.userType === 'youth' && (
          <div className="form-section">
            <h2>Färdigheter</h2>
            <div className="form-group">
              <label>Lägg till färdigheter</label>
              <div className="skill-input-group">
                <input
                  type="text"
                  placeholder="T.ex. Städning, Trädgårdsarbete, IT-hjälp..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSkillAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                    handleSkillAdd(input.value);
                    input.value = '';
                  }}
                  className="btn btn-secondary"
                >
                  Lägg till
                </button>
              </div>
            </div>

            {formData.skills && formData.skills.length > 0 && (
              <div className="skills-list">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="skill-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && formData.userType === 'youth' && (
          <div className="form-section">
            <h2>Tillgänglighet</h2>
            <p className="section-description">
              Välj vilka dagar du vanligtvis är tillgänglig för jobb
            </p>
            <div className="availability-grid">
              {Object.entries(formData.availability || {}).map(([day, available]) => (
                <label key={day} className="availability-day">
                  <input
                    type="checkbox"
                    name={`availability.${day}`}
                    checked={available}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <span className="day-name">
                    {day === 'monday' && 'Måndag'}
                    {day === 'tuesday' && 'Tisdag'}
                    {day === 'wednesday' && 'Onsdag'}
                    {day === 'thursday' && 'Torsdag'}
                    {day === 'friday' && 'Fredag'}
                    {day === 'saturday' && 'Lördag'}
                    {day === 'sunday' && 'Söndag'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="form-section">
            <h2>Inställningar</h2>
            <div className="preferences-list">
              <label className="preference-item">
                <input
                  type="checkbox"
                  name="preferences.notifications"
                  checked={formData.preferences?.notifications || false}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <div className="preference-content">
                  <span className="preference-title">Push-notifikationer</span>
                  <span className="preference-description">Få notifikationer direkt på din enhet</span>
                </div>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  name="preferences.emailUpdates"
                  checked={formData.preferences?.emailUpdates || false}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <div className="preference-content">
                  <span className="preference-title">E-postuppdateringar</span>
                  <span className="preference-description">Få viktiga uppdateringar via e-post</span>
                </div>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  name="preferences.smsUpdates"
                  checked={formData.preferences?.smsUpdates || false}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <div className="preference-content">
                  <span className="preference-title">SMS-uppdateringar</span>
                  <span className="preference-description">Få viktiga meddelanden via SMS</span>
                </div>
              </label>

              <label className="preference-item">
                <input
                  type="checkbox"
                  name="preferences.publicProfile"
                  checked={formData.preferences?.publicProfile || false}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <div className="preference-content">
                  <span className="preference-title">Offentlig profil</span>
                  <span className="preference-description">Låt andra användare se din profil</span>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sparar...' : 'Spara ändringar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
