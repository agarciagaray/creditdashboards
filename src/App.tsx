import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Users, 
  AlertTriangle, 
  Map, 
  Database,
  Home
} from 'lucide-react';
import TabView from './components/ui/TabView';
import FilterPanel from './components/FilterPanel';
import DashboardSummary from './components/DashboardSummary';
import DelinquencyAnalysis from './components/DelinquencyAnalysis';
import DemographicAnalysis from './components/DemographicAnalysis';
import GeographicAnalysis from './components/GeographicAnalysis';
import DataTable from './components/ui/DataTable';
import UploadPage from './components/UploadPage';
import ProcessingPage from './components/ProcessingPage';
import { portfolioData } from './data/mockData';
import { applyFilters, generateFilterOptions } from './utils/filters';
import { calculateKpiMetrics } from './utils/calculations';
import { SelectedFilters, FilterOptions, PortfolioItem } from './types';

type AppState = 'upload' | 'processing' | 'dashboard';

function App() {
  // App state
  const [appState, setAppState] = useState<AppState>('upload');
  
  // State for filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    ageRange: null,
    gender: null,
    amountRange: null,
    delinquencyRange: null,
    employer: null,
    city: null,
    riskLevel: null,
  });
  
  // State for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    ageRanges: [],
    gender: [],
    amountRanges: [],
    delinquencyRanges: [],
    employers: [],
    cities: [],
    riskLevels: [],
  });
  
  // State for filtered data
  const [filteredData, setFilteredData] = useState<PortfolioItem[]>(portfolioData);
  
  // State for metrics
  const [metrics, setMetrics] = useState(calculateKpiMetrics(portfolioData));
  
  // Generate filter options on component mount
  useEffect(() => {
    const options = generateFilterOptions(portfolioData);
    setFilterOptions(options);
  }, []);
  
  // Apply filters when selectedFilters change
  useEffect(() => {
    const filtered = applyFilters(portfolioData, selectedFilters);
    setFilteredData(filtered);
    setMetrics(calculateKpiMetrics(filtered));
  }, [selectedFilters]);
  
  // Handler for file upload
  const handleFileUpload = (file: File) => {
    setAppState('processing');
    // Simulate file processing
    setTimeout(() => {
      setAppState('dashboard');
    }, 2000);
  };
  
  // Handler for filter changes
  const handleFilterChange = (filterName: keyof SelectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value === 'Todos' ? null : value,
    }));
  };
  
  // Handler for clearing all filters
  const handleClearFilters = () => {
    setSelectedFilters({
      ageRange: null,
      gender: null,
      amountRange: null,
      delinquencyRange: null,
      employer: null,
      city: null,
      riskLevel: null,
    });
  };
  
  // Create tabs for the dashboard
  const tabs = [
    {
      label: 'Resumen General',
      icon: <Home size={18} />,
      content: <DashboardSummary data={filteredData} metrics={metrics} />,
    },
    {
      label: 'Análisis de Mora',
      icon: <AlertTriangle size={18} />,
      content: <DelinquencyAnalysis data={filteredData} />,
    },
    {
      label: 'Análisis Demográfico',
      icon: <Users size={18} />,
      content: <DemographicAnalysis data={filteredData} />,
    },
    {
      label: 'Análisis Geográfico',
      icon: <Map size={18} />,
      content: <GeographicAnalysis data={filteredData} />,
    },
    {
      label: 'Datos Detallados',
      icon: <Database size={18} />,
      content: <DataTable data={filteredData} title="Créditos Filtrados" />,
    },
  ];
  
  if (appState === 'upload') {
    return <UploadPage onFileUpload={handleFileUpload} />;
  }
  
  if (appState === 'processing') {
    return <ProcessingPage />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart2 className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard de Cartera de Créditos</h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredData.length} de {portfolioData.length} créditos mostrados
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterPanel
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        <TabView tabs={tabs} />
      </main>
      
      <footer className="bg-white shadow-inner mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Dashboard de Cartera de Créditos | Desarrollado para análisis financiero
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;