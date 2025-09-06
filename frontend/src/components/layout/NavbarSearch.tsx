import React from 'react';
import SearchBar from '../SearchBar';

interface NavbarSearchProps {
  onSearch: (query: string) => void;
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({ onSearch }) => {
  return (
    <div className="navbar-search">
      <SearchBar
        placeholder="Sök extrajobb för ungdomar"
        onSearch={onSearch}
        className="navbar-search-bar"
        showSuggestions={true}
      />
    </div>
  );
};

export default NavbarSearch;
