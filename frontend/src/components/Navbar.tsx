import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavbarLogo from './layout/NavbarLogo';
import NavbarSearch from './layout/NavbarSearch';
import NavbarDesktopNav from './layout/NavbarDesktopNav';
import NavbarMobileMenu from './layout/NavbarMobileMenu';
import NavbarCategories from './layout/NavbarCategories';
import NavbarCategoryDropdown from './layout/NavbarCategoryDropdown';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number } | null>(null);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const categoryItemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setHoveredCategory(null);
        setDropdownPosition(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const calculateDropdownPosition = useCallback((categoryName: string) => {
    const categoryElement = categoryItemsRef.current.get(categoryName);
    if (!categoryElement) return null;

    const rect = categoryElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownWidth = 288; // 18rem = 288px
    const dropdownHeight = 200; // Approximate height
    
    // Calculate horizontal position
    let left = rect.left + (rect.width / 2) - (dropdownWidth / 2);
    
    // Ensure dropdown stays within viewport horizontally
    if (left < 16) {
      left = 16; // 16px margin from left edge
    } else if (left + dropdownWidth > viewportWidth - 16) {
      left = viewportWidth - dropdownWidth - 16; // 16px margin from right edge
    }

    // Calculate vertical position (below the category bar)
    let top = rect.bottom + 8; // 8px gap below category
    
    // If dropdown would go off screen, position it above the category
    if (top + dropdownHeight > viewportHeight - 16) {
      top = rect.top - dropdownHeight - 8; // 8px gap above category
    }

    return { left, top };
  }, []);

  // Handle window resize to recalculate dropdown positions (debounced for performance)
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (hoveredCategory) {
          const position = calculateDropdownPosition(hoveredCategory);
          setDropdownPosition(position);
        }
      }, 100); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [hoveredCategory, calculateDropdownPosition]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to home even if logout fails
      navigate('/');
    }
  }, [logout, navigate]);

  // Memoize user display name to prevent unnecessary re-renders
  // const userDisplayName = useMemo(() => {
  //   if (!user) return null;
  //   return user.displayName || user.firstName || 'Välkommen';
  // }, [user]);

  // const userInitial = useMemo(() => {
  //   if (!user) return 'U';
  //   return user.displayName?.charAt(0) || user.firstName?.charAt(0) || 'U';
  // }, [user]);



  const handleCategoryHover = useCallback((categoryName: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    
    const position = calculateDropdownPosition(categoryName);
    setDropdownPosition(position);
    setHoveredCategory(categoryName);
  }, [dropdownTimeout, calculateDropdownPosition]);

  const handleCategoryLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setDropdownPosition(null);
    }, 150); // Small delay to allow moving mouse to dropdown
    setDropdownTimeout(timeout);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  // Categories for the navigation menu - focused on youth-friendly jobs
  const categories = [
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
    },
    { 
      name: 'Läxhjälp', 
      path: '/jobs?category=tutoring',
      subcategories: [
        { name: 'Matematik', path: '/jobs?category=tutoring&sub=math' },
        { name: 'Svenska', path: '/jobs?category=tutoring&sub=swedish' },
        { name: 'Engelska', path: '/jobs?category=tutoring&sub=english' },
        { name: 'Naturvetenskap', path: '/jobs?category=tutoring&sub=science' }
      ],
      icon: '📚'
    },
    { 
      name: 'Flytthjälp', 
      path: '/jobs?category=moving',
      subcategories: [
        { name: 'Packning av lådor', path: '/jobs?category=moving&sub=packing' },
        { name: 'Möbelbärning', path: '/jobs?category=moving&sub=furniture' },
        { name: 'Biltransport', path: '/jobs?category=moving&sub=transport' },
        { name: 'Uppackning', path: '/jobs?category=moving&sub=unpacking' }
      ],
      icon: '📦'
    },
    { 
      name: 'Sociala Medier', 
      path: '/jobs?category=social-media',
      subcategories: [
        { name: 'Instagram-hantering', path: '/jobs?category=social-media&sub=instagram' },
        { name: 'Facebook-hantering', path: '/jobs?category=social-media&sub=facebook' },
        { name: 'Innehållsskapande', path: '/jobs?category=social-media&sub=content' },
        { name: 'Hashtag-optimering', path: '/jobs?category=social-media&sub=hashtags' }
      ],
      icon: '📱'
    },
    { 
      name: 'Enklare Matlagning', 
      path: '/jobs?category=cooking',
      subcategories: [
        { name: 'Frukostlagning', path: '/jobs?category=cooking&sub=breakfast' },
        { name: 'Lunchlagning', path: '/jobs?category=cooking&sub=lunch' },
        { name: 'Middagslagning', path: '/jobs?category=cooking&sub=dinner' },
        { name: 'Bakning', path: '/jobs?category=cooking&sub=baking' }
      ],
      icon: '🍳'
    },
    { 
      name: 'Butikshjälp', 
      path: '/jobs?category=retail',
      subcategories: [
        { name: 'Kassatjänst', path: '/jobs?category=retail&sub=cashier' },
        { name: 'Lagerarbete', path: '/jobs?category=retail&sub=warehouse' },
        { name: 'Kundservice', path: '/jobs?category=retail&sub=customer-service' },
        { name: 'Produktplacering', path: '/jobs?category=retail&sub=product-placement' }
      ],
      icon: '🛒'
    },
    { 
      name: 'Cykelreparation', 
      path: '/jobs?category=bike-repair',
      subcategories: [
        { name: 'Däckbyte', path: '/jobs?category=bike-repair&sub=tire-change' },
        { name: 'Bromsjustering', path: '/jobs?category=bike-repair&sub=brake-adjustment' },
        { name: 'Kedjereparation', path: '/jobs?category=bike-repair&sub=chain-repair' },
        { name: 'Ljusinstallation', path: '/jobs?category=bike-repair&sub=light-installation' }
      ],
      icon: '🚲'
    }
  ];

  return (
    <>
      {/* Main navbar */}
      <nav 
        className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
        role="navigation"
        aria-label="Huvudnavigation"
      >
        <div className="navbar-container">
          <div className="navbar-content">
            <NavbarLogo />
            <NavbarSearch onSearch={(query) => navigate(`/jobs?q=${encodeURIComponent(query)}`)} />
            <NavbarDesktopNav
              hoveredCategory={hoveredCategory}
              onCategoryHover={handleCategoryHover}
              onCategoryLeave={handleCategoryLeave}
              isUserMenuOpen={isUserMenuOpen}
              onToggleUserMenu={toggleUserMenu}
              onLogout={handleLogout}
            />

            {/* Mobile menu button */}
            <div className="navbar-mobile-button">
              <button
                onClick={toggleMobileMenu}
                className="navbar-mobile-button"
                aria-label={isMobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <svg className="navbar-mobile-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <NavbarMobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </nav>
      
      <NavbarCategories
        hoveredCategory={hoveredCategory}
        onCategoryHover={handleCategoryHover}
        onCategoryLeave={handleCategoryLeave}
        categoryItemsRef={categoryItemsRef}
      />

      <NavbarCategoryDropdown
        hoveredCategory={hoveredCategory}
        dropdownPosition={dropdownPosition}
        categories={categories}
        onCategoryHover={handleCategoryHover}
        onCategoryLeave={handleCategoryLeave}
      />
    </>
  );
};

export default Navbar;
