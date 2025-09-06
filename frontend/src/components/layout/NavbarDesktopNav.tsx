import React, { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../NotificationBell';

interface NavbarDesktopNavProps {
  hoveredCategory: string | null;
  onCategoryHover: (categoryName: string) => void;
  onCategoryLeave: () => void;
  isUserMenuOpen: boolean;
  onToggleUserMenu: () => void;
  onLogout: () => void;
}

const NavbarDesktopNav: React.FC<NavbarDesktopNavProps> = ({
  hoveredCategory,
  onCategoryHover,
  onCategoryLeave,
  isUserMenuOpen,
  onToggleUserMenu,
  onLogout
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Memoize user display name to prevent unnecessary re-renders
  const userDisplayName = useMemo(() => {
    if (!user) return null;
    return user.displayName || user.firstName || 'Välkommen';
  }, [user]);

  const userInitial = useMemo(() => {
    if (!user) return 'U';
    return user.displayName?.charAt(0) || user.firstName?.charAt(0) || 'U';
  }, [user]);

  // Categories for the navigation menu - focused on youth-friendly jobs
  const categories = useMemo(() => [
    { 
      name: 'Alla Jobb', 
      path: '/jobs',
      subcategories: [],
      icon: '💼'
    },
    { 
      name: 'Trädgårdsarbete', 
      path: '/jobs?category=garden',
      subcategories: [
        { name: 'Gräsklippning', path: '/jobs?category=garden&sub=grass-cutting' },
        { name: 'Lövplockning', path: '/jobs?category=garden&sub=leaf-raking' },
        { name: 'Växtvattning', path: '/jobs?category=garden&sub=watering' },
        { name: 'Trädplantering', path: '/jobs?category=garden&sub=planting' }
      ],
      icon: '🌱'
    },
    { 
      name: 'Hundpassning', 
      path: '/jobs?category=dog-sitting',
      subcategories: [
        { name: 'Hundpromenering', path: '/jobs?category=dog-sitting&sub=walking' },
        { name: 'Hundpassning hemma', path: '/jobs?category=dog-sitting&sub=home-sitting' },
        { name: 'Hundträning', path: '/jobs?category=dog-sitting&sub=training' },
        { name: 'Hundmatning', path: '/jobs?category=dog-sitting&sub=feeding' }
      ],
      icon: '🐕'
    },
    { 
      name: 'Barnpassning', 
      path: '/jobs?category=babysitting',
      subcategories: [
        { name: 'Barnpassning hemma', path: '/jobs?category=babysitting&sub=home' },
        { name: 'Barnpassning utomhus', path: '/jobs?category=babysitting&sub=outdoor' },
        { name: 'Läxhjälp för barn', path: '/jobs?category=babysitting&sub=homework' },
        { name: 'Lekaktiviteter', path: '/jobs?category=babysitting&sub=play' }
      ],
      icon: '👶'
    },
    { 
      name: 'Städning', 
      path: '/jobs?category=cleaning',
      subcategories: [
        { name: 'Hemstädning', path: '/jobs?category=cleaning&sub=home' },
        { name: 'Kontorsstädning', path: '/jobs?category=cleaning&sub=office' },
        { name: 'Fönsterputsning', path: '/jobs?category=cleaning&sub=windows' },
        { name: 'Golvstädning', path: '/jobs?category=cleaning&sub=floors' }
      ],
      icon: '🧹'
    },
    { 
      name: 'Datorhjälp', 
      path: '/jobs?category=computer-help',
      subcategories: [
        { name: 'Virusrensning', path: '/jobs?category=computer-help&sub=virus-removal' },
        { name: 'Programinstallation', path: '/jobs?category=computer-help&sub=software' },
        { name: 'Internetproblem', path: '/jobs?category=computer-help&sub=internet' },
        { name: 'Backup av filer', path: '/jobs?category=computer-help&sub=backup' }
      ],
      icon: '💻'
    }
  ], []);

  return (
    <div className="navbar-desktop-nav">
      <div 
        className="navbar-nav-item"
        onMouseEnter={() => onCategoryHover('Extrajobb')}
        onMouseLeave={onCategoryLeave}
      >
        <Link 
          to="/jobs" 
          className="navbar-nav-link"
          aria-haspopup="true"
          aria-expanded={hoveredCategory === 'Extrajobb'}
        >
          Extrajobb
        </Link>
        
        {/* Extrajobb hover dropdown */}
        {hoveredCategory === 'Extrajobb' && (
          <div 
            className="navbar-dropdown"
            role="menu"
            aria-label="Populära extrajobb"
          >
            <div className="navbar-dropdown-header">
              <h3 className="navbar-dropdown-title">Populära extrajobb</h3>
              <div className="navbar-dropdown-grid">
                {categories.slice(1, 7).map((category, index) => (
                  <Link
                    key={index}
                    to={category.path}
                    className="navbar-dropdown-item"
                    role="menuitem"
                  >
                    <span className="navbar-dropdown-icon">{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="navbar-dropdown-badge">Ny</span>
                  </Link>
                ))}
              </div>
              <div className="navbar-dropdown-footer">
                <Link
                  to="/jobs"
                  className="navbar-dropdown-link"
                  role="menuitem"
                >
                  Visa alla jobb →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Link 
        to="/dashboard" 
        className="navbar-nav-link"
        aria-label="Gå till instrumentpanel"
      >
        Sysselsättning
      </Link>
      
      {authLoading ? (
        <div className="navbar-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : user ? (
        <div className="navbar-user-menu">
          <NotificationBell className="navbar-notification-bell" />
          <div className="navbar-user-menu">
            <button 
              className="navbar-user-button"
              onClick={onToggleUserMenu}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen}
              aria-label={`Användarmeny för ${user.displayName || 'användare'}`}
            >
              <div className="navbar-user-avatar">
                <span className="navbar-user-initial">
                  {userInitial}
                </span>
              </div>
              <span className="navbar-user-text">
                {userDisplayName}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div 
                className="navbar-user-dropdown"
                role="menu"
                aria-label="Användarmeny"
              >
                <Link 
                  to="/profile" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Min profil
                </Link>
                <Link 
                  to="/dashboard" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Instrumentpanel
                </Link>
                <Link 
                  to="/jobs/manage" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Mina jobb
                </Link>
                <Link 
                  to="/jobs/create" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Skapa jobb
                </Link>
                <Link 
                  to="/payments" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Betalningar
                </Link>
                <Link 
                  to="/reviews" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Recensioner
                </Link>
                <Link 
                  to="/media" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Media
                </Link>
                <Link 
                  to="/notifications" 
                  className="navbar-user-dropdown-item"
                  role="menuitem"
                  onClick={() => onToggleUserMenu()}
                >
                  Notifikationer
                </Link>
                {user?.role === 'Admin' && (
                  <Link 
                    to="/monitoring" 
                    className="navbar-user-dropdown-item"
                    role="menuitem"
                    onClick={() => onToggleUserMenu()}
                  >
                    Monitoring
                  </Link>
                )}
                <button 
                  onClick={onLogout} 
                  className="navbar-user-dropdown-button"
                  role="menuitem"
                >
                  Logga ut
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="navbar-auth-buttons">
          <Link
            to="/login"
            className="navbar-login-link"
            aria-label="Logga in på ditt konto"
          >
            Logga in
          </Link>
          <Link
            to="/register"
            className="navbar-register-link"
            aria-label="Skapa ett nytt konto"
          >
            Kom igång
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavbarDesktopNav;
