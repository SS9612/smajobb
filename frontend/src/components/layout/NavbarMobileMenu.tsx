import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from '../SearchBar';

interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isOpen,
  onClose,
  onLogout
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userDisplayName = user?.displayName || user?.firstName || 'Välkommen';
  const userInitial = user?.displayName?.charAt(0) || user?.firstName?.charAt(0) || 'U';

  const categories = [
    { name: 'Trädgårdsarbete', path: '/jobs?category=garden', icon: '🌱' },
    { name: 'Hundpassning', path: '/jobs?category=dog-sitting', icon: '🐕' },
    { name: 'Barnpassning', path: '/jobs?category=babysitting', icon: '👶' },
    { name: 'Städning', path: '/jobs?category=cleaning', icon: '🧹' },
    { name: 'Datorhjälp', path: '/jobs?category=computer-help', icon: '💻' },
    { name: 'Läxhjälp', path: '/jobs?category=tutoring', icon: '📚' },
    { name: 'Flytthjälp', path: '/jobs?category=moving', icon: '📦' },
    { name: 'Sociala Medier', path: '/jobs?category=social-media', icon: '📱' },
    { name: 'Enklare Matlagning', path: '/jobs?category=cooking', icon: '🍳' },
    { name: 'Butikshjälp', path: '/jobs?category=retail', icon: '🛒' },
    { name: 'Cykelreparation', path: '/jobs?category=bike-repair', icon: '🚲' }
  ];

  if (!isOpen) return null;

  return (
    <div 
      id="mobile-menu"
      className="navbar-mobile-nav open"
      role="menu"
      aria-label="Mobil navigation"
    >
      {/* Mobile search */}
      <div className="navbar-mobile-search">
        <SearchBar
          placeholder="Sök extrajobb för ungdomar"
          onSearch={(query) => {
            navigate(`/jobs?q=${encodeURIComponent(query)}`);
            onClose();
          }}
          className="navbar-mobile-search-bar"
          showSuggestions={true}
        />
      </div>
      
      <div className="navbar-mobile-links">
        <Link 
          to="/jobs" 
          className="navbar-mobile-link"
          onClick={onClose}
          role="menuitem"
        >
          Extrajobb
        </Link>
        
        <Link 
          to="/dashboard" 
          className="navbar-mobile-link"
          onClick={onClose}
          role="menuitem"
        >
          Sysselsättning
        </Link>
        
        {/* Category links */}
        <div className="navbar-mobile-categories">
          <p className="navbar-mobile-categories-title">Kategorier</p>
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.path}
              className="navbar-mobile-category-link"
              onClick={onClose}
              role="menuitem"
            >
              <span className="navbar-mobile-category-icon">{category.icon}</span>
              {category.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile Auth */}
        {user ? (
          <div className="navbar-mobile-auth">
            <div className="navbar-mobile-user">
              <div className="navbar-mobile-user-avatar">
                <span className="navbar-mobile-user-initial">
                  {userInitial}
                </span>
              </div>
              <span className="navbar-mobile-user-text">
                {userDisplayName}
              </span>
            </div>
            <div className="navbar-mobile-user-links">
              <Link
                to="/profile"
                className="navbar-mobile-user-link"
                onClick={onClose}
                role="menuitem"
              >
                Min profil
              </Link>
              <Link
                to="/dashboard"
                className="navbar-mobile-user-link"
                onClick={onClose}
                role="menuitem"
              >
                Instrumentpanel
              </Link>
              <Link
                to="/jobs/manage"
                className="navbar-mobile-user-link"
                onClick={onClose}
                role="menuitem"
              >
                Mina jobb
              </Link>
              <Link
                to="/jobs/create"
                className="navbar-mobile-user-link"
                onClick={onClose}
                role="menuitem"
              >
                Skapa jobb
              </Link>
              <Link
                to="/payments"
                className="navbar-mobile-user-link"
                onClick={onClose}
                role="menuitem"
              >
                Betalningar
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="navbar-mobile-user-button"
                role="menuitem"
              >
                Logga ut
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-mobile-auth-buttons">
            <Link
              to="/login"
              className="navbar-mobile-login-link"
              onClick={onClose}
              role="menuitem"
            >
              Logga in
            </Link>
            <Link
              to="/register"
              className="navbar-mobile-register-link"
              onClick={onClose}
              role="menuitem"
            >
              Kom igång
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
