import { Search, Star, StarOff, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { FilterOptions, SelectedFilters } from "../types";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [savedFilters, setSavedFilters] = useState<SelectedFilters[]>([]);
  const [showSavedFilters, setShowSavedFilters] = useState(false);

  // Filtros rápidos predefinidos
  const quickFilters = [
    {
      name: "Cartera Normal",
      filters: {
        riskLevel: "A",
        delinquencyRange: "0-0",
      },
    },
    {
      name: "Cartera en Riesgo",
      filters: {
        riskLevel: "C",
        delinquencyRange: "31-90",
      },
    },
    {
      name: "Cartera Crítica",
      filters: {
        riskLevel: "E",
        delinquencyRange: "90+",
      },
    },
  ];

  const handleQuickFilter = useCallback(
    (filter: (typeof quickFilters)[0]) => {
      // Primero limpiamos los filtros existentes
      onClearFilters();
      // Luego aplicamos los nuevos filtros
      Object.entries(filter.filters).forEach(([key, value]) => {
        onFilterChange(key as keyof SelectedFilters, value as string);
      });
    },
    [onFilterChange, onClearFilters]
  );

  const handleSaveFilter = useCallback(() => {
    setSavedFilters((prev) => [...prev, selectedFilters]);
  }, [selectedFilters]);

  const handleRemoveSavedFilter = useCallback((index: number) => {
    setSavedFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleApplySavedFilter = useCallback(
    (filter: SelectedFilters) => {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          onFilterChange(key as keyof SelectedFilters, value);
        }
      });
    },
    [onFilterChange]
  );

  // Función para filtrar opciones basadas en la búsqueda
  const filterOptionsBySearch = useCallback(
    (options: string[]) => {
      if (!searchTerm) return options;
      return options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en filtros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveFilter}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Star className="h-4 w-4 mr-2" />
            Guardar Filtros
          </button>
          <button
            onClick={() => setShowSavedFilters(!showSavedFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <StarOff className="h-4 w-4 mr-2" />
            Filtros Guardados
          </button>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Filtros Rápidos
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleQuickFilter(filter)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros guardados */}
      {showSavedFilters && savedFilters.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Filtros Guardados
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <button
                  onClick={() => handleApplySavedFilter(filter)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Filtro {index + 1}
                </button>
                <button
                  onClick={() => handleRemoveSavedFilter(index)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Filtro de Rango de Edad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Edad
          </label>
          <select
            value={selectedFilters.ageRange || ""}
            onChange={(e) => onFilterChange("ageRange", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            {filterOptionsBySearch(filterOptions.ageRanges).map((range) => (
              <option
                key={range}
                value={range}
              >
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Género */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            value={selectedFilters.gender || ""}
            onChange={(e) => onFilterChange("gender", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            {filterOptionsBySearch(filterOptions.gender).map((gender) => (
              <option
                key={gender}
                value={gender}
              >
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Rango de Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Monto
          </label>
          <select
            value={selectedFilters.amountRange || ""}
            onChange={(e) => onFilterChange("amountRange", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            {filterOptionsBySearch(filterOptions.amountRanges).map((range) => (
              <option
                key={range}
                value={range}
              >
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Rango de Mora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rango de Mora
          </label>
          <select
            value={selectedFilters.delinquencyRange || ""}
            onChange={(e) => onFilterChange("delinquencyRange", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            {filterOptionsBySearch(filterOptions.delinquencyRanges).map(
              (range) => (
                <option
                  key={range}
                  value={range}
                >
                  {range}
                </option>
              )
            )}
          </select>
        </div>

        {/* Filtro de Empresa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empresa
          </label>
          <select
            value={selectedFilters.employer || ""}
            onChange={(e) => onFilterChange("employer", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas</option>
            {filterOptionsBySearch(filterOptions.employers).map((employer) => (
              <option
                key={employer}
                value={employer}
              >
                {employer}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <select
            value={selectedFilters.city || ""}
            onChange={(e) => onFilterChange("city", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas</option>
            {filterOptionsBySearch(filterOptions.cities).map((city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Nivel de Riesgo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel de Riesgo
          </label>
          <select
            value={selectedFilters.riskLevel || ""}
            onChange={(e) => onFilterChange("riskLevel", e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            {filterOptionsBySearch(filterOptions.riskLevels).map((level) => (
              <option
                key={level}
                value={level}
              >
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
