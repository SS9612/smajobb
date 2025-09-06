import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <Link 
      to="/" 
      className="navbar-logo"
      aria-label="Småjobb - Gå till startsida"
    >
      <div className="navbar-logo-icon">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      <span className="navbar-logo-text">Småjobb</span>
    </Link>
  );
};

export default NavbarLogo;
