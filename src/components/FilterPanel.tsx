import React from 'react';
import FilterSelect from './ui/FilterSelect';
import { FilterOptions, SelectedFilters } from '../types';

interface FilterPanelProps {
  filterOptions: FilterOptions;
  selectedFilters: SelectedFilters;
  onFilterChange: (filterName: keyof SelectedFilters, value: string) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterOptions,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        <button
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          onClick={onClearFilters}
        >
          Limpiar Filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <FilterSelect
          label="Rango de Edad"
          options={filterOptions.ageRanges}
          value={selectedFilters.ageRange}
          onChange={(value) => onFilterChange('ageRange', value)}
        />
        
        <FilterSelect
          label="Género"
          options={filterOptions.gender}
          value={selectedFilters.gender}
          onChange={(value) => onFilterChange('gender', value)}
        />
        
        <FilterSelect
          label="Rango de Monto"
          options={filterOptions.amountRanges}
          value={selectedFilters.amountRange}
          onChange={(value) => onFilterChange('amountRange', value)}
        />
        
        <FilterSelect
          label="Estado de Mora"
          options={filterOptions.delinquencyRanges}
          value={selectedFilters.delinquencyRange}
          onChange={(value) => onFilterChange('delinquencyRange', value)}
        />
        
        <FilterSelect
          label="Empresa"
          options={filterOptions.employers}
          value={selectedFilters.employer}
          onChange={(value) => onFilterChange('employer', value)}
        />
        
        <FilterSelect
          label="Ciudad"
          options={filterOptions.cities}
          value={selectedFilters.city}
          onChange={(value) => onFilterChange('city', value)}
        />
        
        <FilterSelect
          label="Nivel de Riesgo"
          options={filterOptions.riskLevels}
          value={selectedFilters.riskLevel}
          onChange={(value) => onFilterChange('riskLevel', value)}
        />
      </div>
    </div>
  );
};

export default FilterPanel;