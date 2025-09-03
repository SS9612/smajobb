import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, AuthResponse, UserProfile } from '../services/authApi';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userProfile = await authApi.getProfile();
          setUser(userProfile);
        } catch (err) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Get full user profile
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Inloggning misslyckades';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.register(userData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Get full user profile
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registrering misslyckades';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore errors on logout
      console.log('Logout completed');
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const refreshUser = async () => {
    if (user) {
      try {
        const userProfile = await authApi.getProfile();
        setUser(userProfile);
      } catch (err) {
        // If refresh fails, user might be logged out
        logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
