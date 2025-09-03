import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer', // 'customer' or 'youth'
    birthDate: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Lösenorden matchar inte');
      setIsLoading(false);
      return;
    }

    try {
      // await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Registreringen misslyckades. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="auth-title">Gå med i Småjobb Idag</h1>
          <p className="auth-subtitle">Skapa ditt konto och börja din resa med oss</p>
          <p className="auth-description">
            Har du redan ett konto?{' '}
            <Link to="/login" className="auth-link">
              Logga in här
            </Link>
          </p>
        </div>

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="auth-message error">
                <p>{error}</p>
              </div>
            )}

            {/* User Type Selection */}
            <div className="form-group">
              <label className="form-label">
                Jag vill:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex cursor-pointer rounded-xl border border-gray-300 bg-white p-4 focus:outline-none hover:bg-gray-50">
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={formData.userType === 'customer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Anlita Ungdomar</p>
                        <p className="text-gray-500">Lägg upp jobb och hitta arbetare</p>
                      </div>
                    </div>
                    <div className={`shrink-0 ${formData.userType === 'customer' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-gray-300 bg-white p-4 focus:outline-none hover:bg-gray-50">
                  <input
                    type="radio"
                    name="userType"
                    value="youth"
                    checked={formData.userType === 'youth'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Arbeta som Ungdom</p>
                        <p className="text-gray-500">Hitta jobb och tjäna pengar</p>
                      </div>
                    </div>
                    <div className={`shrink-0 ${formData.userType === 'youth' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Förnamn
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Förnamn"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Efternamn
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Efternamn"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-postadress
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Ange din e-post"
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Telefonnummer
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Ange ditt telefonnummer"
              />
            </div>

            {/* Birth Date for Youth */}
            {formData.userType === 'youth' && (
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Födelsedatum
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200"
                />
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Lösenord
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Skapa lösenord"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Bekräfta lösenord
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Bekräfta lösenord"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Jag godkänner{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Användarvillkoren
                </a>{' '}
                och{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Integritetspolicyn
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-button"
            >
              {isLoading ? (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  Skapar konto...
                </div>
              ) : (
                'Skapa konto'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">Eller fortsätt med</span>
            <div className="auth-divider-line"></div>
          </div>

          <div className="social-login">
            <button className="social-button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Registrera dig med Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
