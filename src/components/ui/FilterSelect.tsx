import React from 'react';

interface FilterSelectProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        value={value || 'Todos'}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;