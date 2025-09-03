import React from 'react';

interface SortOption {
  value: string;
  label: string;
  order: 'asc' | 'desc';
}

interface SortDropdownProps {
  value: string;
  order: 'asc' | 'desc';
  onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  order,
  onChange,
  className = ''
}) => {
  const sortOptions: SortOption[] = [
    { value: 'createdAt', label: 'Senast publicerade', order: 'desc' },
    { value: 'createdAt', label: 'Äldst publicerade', order: 'asc' },
    { value: 'price', label: 'Lägsta pris', order: 'asc' },
    { value: 'price', label: 'Högsta pris', order: 'desc' },
    { value: 'urgency', label: 'Högsta prioritet', order: 'desc' },
    { value: 'urgency', label: 'Lägsta prioritet', order: 'asc' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = sortOptions[parseInt(e.target.value)];
    onChange(selectedOption.value, selectedOption.order);
  };

  const getCurrentValue = () => {
    return sortOptions.findIndex(option => 
      option.value === value && option.order === order
    );
  };

  return (
    <div className={`sort-dropdown ${className}`}>
      <label htmlFor="sort-select" className="sort-label">
        Sortera efter:
      </label>
      <select
        id="sort-select"
        value={getCurrentValue()}
        onChange={handleChange}
        className="sort-select"
      >
        {sortOptions.map((option, index) => (
          <option key={index} value={index}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
