import { PortfolioItem, FilterOptions, SelectedFilters } from '../types';

// Define age range bounds
export const getAgeRanges = () => [
  'Todos',
  'Menor de 30',
  '30-40',
  '41-50',
  '51-60',
  'Mayor de 60'
];

// Define amount range bounds
export const getAmountRanges = () => [
  'Todos',
  'Menor de 5M',
  '5M-10M',
  '10M-20M',
  '20M-50M',
  'Mayor de 50M'
];

// Define delinquency range bounds
export const getDelinquencyRanges = () => [
  'Todos',
  'Sin mora',
  '1-30 días',
  '31-60 días',
  '61-90 días',
  'Mayor a 90 días'
];

// Filter functions
export const filterByAge = (item: PortfolioItem, ageRange: string | null): boolean => {
  if (!ageRange || ageRange === 'Todos') return true;
  
  if (ageRange === 'Menor de 30') return item.edad < 30;
  if (ageRange === '30-40') return item.edad >= 30 && item.edad <= 40;
  if (ageRange === '41-50') return item.edad >= 41 && item.edad <= 50;
  if (ageRange === '51-60') return item.edad >= 51 && item.edad <= 60;
  if (ageRange === 'Mayor de 60') return item.edad > 60;
  
  return true;
};

export const filterByGender = (item: PortfolioItem, gender: string | null): boolean => {
  if (!gender || gender === 'Todos') return true;
  return item.sexo === gender;
};

export const filterByAmount = (item: PortfolioItem, amountRange: string | null): boolean => {
  if (!amountRange || amountRange === 'Todos') return true;
  
  const million = 1000000;
  
  if (amountRange === 'Menor de 5M') return item.valtot < 5 * million;
  if (amountRange === '5M-10M') return item.valtot >= 5 * million && item.valtot <= 10 * million;
  if (amountRange === '10M-20M') return item.valtot > 10 * million && item.valtot <= 20 * million;
  if (amountRange === '20M-50M') return item.valtot > 20 * million && item.valtot <= 50 * million;
  if (amountRange === 'Mayor de 50M') return item.valtot > 50 * million;
  
  return true;
};

export const filterByDelinquency = (item: PortfolioItem, delinquencyRange: string | null): boolean => {
  if (!delinquencyRange || delinquencyRange === 'Todos') return true;
  
  if (delinquencyRange === 'Sin mora') return item.diasmora === 0;
  if (delinquencyRange === '1-30 días') return item.diasmora >= 1 && item.diasmora <= 30;
  if (delinquencyRange === '31-60 días') return item.diasmora >= 31 && item.diasmora <= 60;
  if (delinquencyRange === '61-90 días') return item.diasmora >= 61 && item.diasmora <= 90;
  if (delinquencyRange === 'Mayor a 90 días') return item.diasmora > 90;
  
  return true;
};

export const filterByEmployer = (item: PortfolioItem, employer: string | null): boolean => {
  if (!employer || employer === 'Todos') return true;
  return item.codemp === employer;
};

export const filterByCity = (item: PortfolioItem, city: string | null): boolean => {
  if (!city || city === 'Todos') return true;
  return item.ciucli === city;
};

export const filterByRiskLevel = (item: PortfolioItem, riskLevel: string | null): boolean => {
  if (!riskLevel || riskLevel === 'Todos') return true;
  return item.riesgo === riskLevel;
};

// Apply all filters function
export const applyFilters = (data: PortfolioItem[], filters: SelectedFilters): PortfolioItem[] => {
  return data.filter(item => 
    filterByAge(item, filters.ageRange) &&
    filterByGender(item, filters.gender) &&
    filterByAmount(item, filters.amountRange) &&
    filterByDelinquency(item, filters.delinquencyRange) &&
    filterByEmployer(item, filters.employer) &&
    filterByCity(item, filters.city) &&
    filterByRiskLevel(item, filters.riskLevel)
  );
};

// Generate filter options from data
export const generateFilterOptions = (data: PortfolioItem[]): FilterOptions => {
  const genders = ['Todos', 'M', 'F'];
  
  // Get unique employers
  const uniqueEmployers = new Set<string>();
  data.forEach(item => uniqueEmployers.add(item.codemp));
  const employers = ['Todos', ...Array.from(uniqueEmployers)];
  
  // Get unique cities
  const uniqueCities = new Set<string>();
  data.forEach(item => uniqueCities.add(item.ciucli));
  const cities = ['Todos', ...Array.from(uniqueCities)];
  
  // Get unique risk levels
  const uniqueRiskLevels = new Set<string>();
  data.forEach(item => uniqueRiskLevels.add(item.riesgo));
  const riskLevels = ['Todos', ...Array.from(uniqueRiskLevels)];
  
  return {
    ageRanges: getAgeRanges(),
    gender: genders,
    amountRanges: getAmountRanges(),
    delinquencyRanges: getDelinquencyRanges(),
    employers,
    cities,
    riskLevels,
  };
};