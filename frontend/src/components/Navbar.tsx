import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
// import { useAuth } from '../hooks/useAuth';

// Define a proper type for the user
interface User {
  displayName?: string;
  email?: string;
}

const Navbar: React.FC = () => {
  // const { user, logout } = useAuth();
  const user = {} as User; // Use type assertion to avoid 'never' type errors
  const logout = () => {}; // Temporary mock logout
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryHover = (categoryName: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setHoveredCategory(categoryName);
  };

  const handleCategoryLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // Small delay to allow moving mouse to dropdown
    setDropdownTimeout(timeout);
  };

  // Categories for the navigation menu - focused on youth-friendly jobs
  const categories = [
    { 
      name: 'Alla Jobb', 
      path: '/jobs',
      subcategories: []
    },
    { 
      name: 'Trädgårdsarbete', 
      path: '/jobs?category=garden',
      subcategories: [
        { name: 'Gräsklippning', path: '/jobs?category=garden&sub=grass-cutting' },
        { name: 'Lövplockning', path: '/jobs?category=garden&sub=leaf-raking' },
        { name: 'Växtvattning', path: '/jobs?category=garden&sub=watering' },
        { name: 'Trädplantering', path: '/jobs?category=garden&sub=planting' },
        { name: 'Häckskärning', path: '/jobs?category=garden&sub=hedge-trimming' }
      ]
    },
    { 
      name: 'Hundpassning', 
      path: '/jobs?category=dog-sitting',
      subcategories: [
        { name: 'Hundpromenering', path: '/jobs?category=dog-sitting&sub=walking' },
        { name: 'Hundpassning hemma', path: '/jobs?category=dog-sitting&sub=home-sitting' },
        { name: 'Hundträning', path: '/jobs?category=dog-sitting&sub=training' },
        { name: 'Hundmatning', path: '/jobs?category=dog-sitting&sub=feeding' }
      ]
    },
    { 
      name: 'Barnpassning', 
      path: '/jobs?category=babysitting',
      subcategories: [
        { name: 'Barnpassning hemma', path: '/jobs?category=babysitting&sub=home' },
        { name: 'Barnpassning utomhus', path: '/jobs?category=babysitting&sub=outdoor' },
        { name: 'Läxhjälp för barn', path: '/jobs?category=babysitting&sub=homework' },
        { name: 'Lekaktiviteter', path: '/jobs?category=babysitting&sub=play' }
      ]
    },
    { 
      name: 'Städning', 
      path: '/jobs?category=cleaning',
      subcategories: [
        { name: 'Hemstädning', path: '/jobs?category=cleaning&sub=home' },
        { name: 'Kontorsstädning', path: '/jobs?category=cleaning&sub=office' },
        { name: 'Fönsterputsning', path: '/jobs?category=cleaning&sub=windows' },
        { name: 'Golvstädning', path: '/jobs?category=cleaning&sub=floors' }
      ]
    },
    { 
      name: 'Datorhjälp', 
      path: '/jobs?category=computer-help',
      subcategories: [
        { name: 'Virusrensning', path: '/jobs?category=computer-help&sub=virus-removal' },
        { name: 'Programinstallation', path: '/jobs?category=computer-help&sub=software' },
        { name: 'Internetproblem', path: '/jobs?category=computer-help&sub=internet' },
        { name: 'Backup av filer', path: '/jobs?category=computer-help&sub=backup' }
      ]
    },
    { 
      name: 'Läxhjälp', 
      path: '/jobs?category=tutoring',
      subcategories: [
        { name: 'Matematik', path: '/jobs?category=tutoring&sub=math' },
        { name: 'Svenska', path: '/jobs?category=tutoring&sub=swedish' },
        { name: 'Engelska', path: '/jobs?category=tutoring&sub=english' },
        { name: 'Naturvetenskap', path: '/jobs?category=tutoring&sub=science' }
      ]
    },
    { 
      name: 'Flytthjälp', 
      path: '/jobs?category=moving',
      subcategories: [
        { name: 'Packning av lådor', path: '/jobs?category=moving&sub=packing' },
        { name: 'Möbelbärning', path: '/jobs?category=moving&sub=furniture' },
        { name: 'Biltransport', path: '/jobs?category=moving&sub=transport' },
        { name: 'Uppackning', path: '/jobs?category=moving&sub=unpacking' }
      ]
    },
    { 
      name: 'Sociala Medier', 
      path: '/jobs?category=social-media',
      subcategories: [
        { name: 'Instagram-hantering', path: '/jobs?category=social-media&sub=instagram' },
        { name: 'Facebook-hantering', path: '/jobs?category=social-media&sub=facebook' },
        { name: 'Innehållsskapande', path: '/jobs?category=social-media&sub=content' },
        { name: 'Hashtag-optimering', path: '/jobs?category=social-media&sub=hashtags' }
      ]
    },
    { 
      name: 'Enklare Matlagning', 
      path: '/jobs?category=cooking',
      subcategories: [
        { name: 'Frukostlagning', path: '/jobs?category=cooking&sub=breakfast' },
        { name: 'Lunchlagning', path: '/jobs?category=cooking&sub=lunch' },
        { name: 'Middagslagning', path: '/jobs?category=cooking&sub=dinner' },
        { name: 'Bakning', path: '/jobs?category=cooking&sub=baking' }
      ]
    },
    { 
      name: 'Butikshjälp', 
      path: '/jobs?category=retail',
      subcategories: [
        { name: 'Kassatjänst', path: '/jobs?category=retail&sub=cashier' },
        { name: 'Lagerarbete', path: '/jobs?category=retail&sub=warehouse' },
        { name: 'Kundservice', path: '/jobs?category=retail&sub=customer-service' },
        { name: 'Produktplacering', path: '/jobs?category=retail&sub=product-placement' }
      ]
    },
    { 
      name: 'Cykelreparation', 
      path: '/jobs?category=bike-repair',
      subcategories: [
        { name: 'Däckbyte', path: '/jobs?category=bike-repair&sub=tire-change' },
        { name: 'Bromsjustering', path: '/jobs?category=bike-repair&sub=brake-adjustment' },
        { name: 'Kedjereparation', path: '/jobs?category=bike-repair&sub=chain-repair' },
        { name: 'Ljusinstallation', path: '/jobs?category=bike-repair&sub=light-installation' }
      ]
    },
  ];

  return (
    <>
             {/* Main navbar */}
       <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-icon">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="navbar-logo-text">Smajobb</span>
            </Link>
            
            {/* Search bar - visible on desktop */}
            <div className="navbar-search">
              <SearchBar
                placeholder="Sök extrajobb för ungdomar"
                onSearch={(query) => navigate(`/jobs?q=${encodeURIComponent(query)}`)}
                className="navbar-search-bar"
                showSuggestions={true}
              />
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="navbar-desktop-nav">
              <div 
                className="navbar-nav-item"
                onMouseEnter={() => setHoveredCategory('Extrajobb')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link to="/jobs" className="navbar-nav-link">
                  Extrajobb
                </Link>
                
                                 {/* Extrajobb hover dropdown */}
                 {hoveredCategory === 'Extrajobb' && (
                   <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <h3 className="navbar-dropdown-title">Populära extrajobb</h3>
                      <div className="navbar-dropdown-grid">
                        {categories.slice(1, 7).map((category, index) => (
                          <Link
                            key={index}
                            to={category.path}
                            className="navbar-dropdown-item"
                          >
                            <span>{category.name}</span>
                            <span className="navbar-dropdown-badge">Ny</span>
                          </Link>
                        ))}
                      </div>
                      <div className="navbar-dropdown-footer">
                        <Link
                          to="/jobs"
                          className="navbar-dropdown-link"
                        >
                          Visa alla jobb →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/dashboard" className="navbar-nav-link">
                Sysselsättning
              </Link>
              
              {user ? (
                <div className="navbar-user-menu">
                  <NotificationBell className="navbar-notification-bell" />
                  <div className="navbar-user-menu">
                    <button className="navbar-user-button">
                      <div className="navbar-user-avatar">
                        <span className="navbar-user-initial">
                          {user?.displayName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="navbar-user-text">Välkommen</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="navbar-user-dropdown">
                      <Link to="/profile" className="navbar-user-dropdown-item">Min profil</Link>
                      <Link to="/dashboard" className="navbar-user-dropdown-item">Instrumentpanel</Link>
                      <Link to="/jobs/manage" className="navbar-user-dropdown-item">Mina jobb</Link>
                      <Link to="/jobs/create" className="navbar-user-dropdown-item">Skapa jobb</Link>
                      <Link to="/payments" className="navbar-user-dropdown-item">Betalningar</Link>
                      <Link to="/reviews" className="navbar-user-dropdown-item">Recensioner</Link>
                      <Link to="/media" className="navbar-user-dropdown-item">Media</Link>
                      <Link to="/notifications" className="navbar-user-dropdown-item">Notifikationer</Link>
                      <button onClick={handleLogout} className="navbar-user-dropdown-button">
                        Logga ut
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="navbar-auth-buttons">
                  <Link
                    to="/login"
                    className="navbar-login-link"
                  >
                    Logga in
                  </Link>
                  <Link
                    to="/register"
                    className="navbar-register-link"
                  >
                    Kom igång
                  </Link>
                </div>
              )}
            </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-button">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-mobile-button"
            >
              <svg className="navbar-mobile-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile-nav open">
            {/* Mobile search */}
            <div className="navbar-mobile-search">
              <form onSubmit={handleSearch} className="navbar-mobile-search-form">
                <div className="navbar-mobile-search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sök extrajobb för ungdomar"
                    className="navbar-mobile-search-input"
                  />
                  <div className="navbar-mobile-search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="navbar-mobile-links">
              <Link 
                to="/jobs" 
                className="navbar-mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Extrajobb
              </Link>
              
              <Link 
                to="/dashboard" 
                className="navbar-mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sysselsättning
              </Link>
              
              {/* Category links */}
              <div className="navbar-mobile-categories">
                <p className="navbar-mobile-categories-title">Kategorier</p>
                {categories.slice(1).map((category, index) => (
                  <Link
                    key={index}
                    to={category.path}
                    className="navbar-mobile-category-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
                        {user?.displayName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="navbar-mobile-user-text">Välkommen</span>
                  </div>
                  <div className="navbar-mobile-user-links">
                    <Link
                      to="/profile"
                      className="navbar-mobile-user-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Min profil
                    </Link>
                    <Link
                      to="/dashboard"
                      className="navbar-mobile-user-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Instrumentpanel
                    </Link>
                    <Link
                      to="/jobs/manage"
                      className="navbar-mobile-user-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mina jobb
                    </Link>
                    <Link
                      to="/jobs/create"
                      className="navbar-mobile-user-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Skapa jobb
                    </Link>
                    <Link
                      to="/payments"
                      className="navbar-mobile-user-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Betalningar
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="navbar-mobile-user-button"
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Logga in
                  </Link>
                  <Link
                    to="/register"
                    className="navbar-mobile-register-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kom igång
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    
         {/* Categories navigation bar with hover dropdowns */}
     <div className="navbar-categories">
      <div className="navbar-categories-container">
        <div className="navbar-categories-content">
          {categories.map((category, index) => (
                         <div
               key={index}
               className="navbar-category-item"
               onMouseEnter={() => handleCategoryHover(category.name)}
               onMouseLeave={handleCategoryLeave}
             >
              <Link
                to={category.path}
                className="navbar-category-link"
              >
                {category.name}
              </Link>
              
                                              {/* Hover dropdown */}
                 {hoveredCategory === category.name && category.subcategories && category.subcategories.length > 0 && (
                   <div 
                     className="navbar-category-dropdown"
                     onMouseEnter={() => handleCategoryHover(category.name)}
                     onMouseLeave={handleCategoryLeave}
                   >
                  <div className="navbar-category-dropdown-header">
                    <h3 className="navbar-category-dropdown-title">{category.name}</h3>
                    <div className="navbar-category-dropdown-grid">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subcategory.path}
                          className="navbar-category-dropdown-item"
                        >
                          <span>{subcategory.name}</span>
                          <span className="navbar-category-dropdown-badge">Ny</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Navbar;
