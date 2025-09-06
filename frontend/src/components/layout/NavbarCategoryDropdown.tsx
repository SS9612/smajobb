import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  name: string;
  path: string;
  subcategories: Array<{
    name: string;
    path: string;
  }>;
  icon: string;
}

interface NavbarCategoryDropdownProps {
  hoveredCategory: string | null;
  dropdownPosition: { left: number; top: number } | null;
  categories: Category[];
  onCategoryHover: (categoryName: string) => void;
  onCategoryLeave: () => void;
}

const NavbarCategoryDropdown: React.FC<NavbarCategoryDropdownProps> = ({
  hoveredCategory,
  dropdownPosition,
  categories,
  onCategoryHover,
  onCategoryLeave
}) => {
  if (!hoveredCategory || !dropdownPosition) return null;

  const category = categories.find(cat => cat.name === hoveredCategory);
  if (!category || !category.subcategories || category.subcategories.length === 0) {
    return null;
  }

  return (
    <div 
      className="navbar-category-dropdown"
      style={{
        position: 'fixed',
        left: `${dropdownPosition.left}px`,
        top: `${dropdownPosition.top}px`,
        zIndex: 999999
      }}
      onMouseEnter={() => onCategoryHover(category.name)}
      onMouseLeave={onCategoryLeave}
      role="menu"
      aria-label={`Undermeny för ${category.name}`}
    >
      <div className="navbar-category-dropdown-header">
        <h3 className="navbar-category-dropdown-title">
          <span className="navbar-category-dropdown-icon">{category.icon}</span>
          {category.name}
        </h3>
        <div className="navbar-category-dropdown-grid">
          {category.subcategories.map((subcategory, subIndex) => (
            <Link
              key={subIndex}
              to={subcategory.path}
              className="navbar-category-dropdown-item"
              role="menuitem"
              onClick={() => {
                onCategoryLeave();
              }}
            >
              <span className="navbar-category-dropdown-item-text">{subcategory.name}</span>
              <span className="navbar-category-dropdown-badge">Ny</span>
            </Link>
          ))}
        </div>
        <div className="navbar-category-dropdown-footer">
          <Link
            to={category.path}
            className="navbar-category-dropdown-view-all"
            onClick={() => {
              onCategoryLeave();
            }}
          >
            Visa alla {category.name.toLowerCase()} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarCategoryDropdown;
