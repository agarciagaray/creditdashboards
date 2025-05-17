import { PortfolioItem, KpiMetrics, ChartData, MultiSeriesChartData } from '../types';
import { filterByAge, filterByGender, filterByAmount, filterByDelinquency } from './filters';

// Calculate key metrics from filtered portfolio data
export const calculateKpiMetrics = (data: PortfolioItem[]): KpiMetrics => {
  // Total portfolio value
  const totalPortfolio = data.reduce((sum, item) => sum + item.valtot, 0);
  
  // Capital balance
  const capitalBalance = data.reduce((sum, item) => sum + item.saldocapital, 0);
  
  // Delinquency
  const delinquentItems = data.filter(item => item.diasmora > 0);
  const delinquencyAmount = delinquentItems.reduce((sum, item) => sum + item.saldocapital, 0);
  const delinquencyRate = totalPortfolio > 0 ? (delinquencyAmount / capitalBalance) * 100 : 0;
  
  // Clients
  const activeCredits = data.length;
  const clientsInDelinquency = delinquentItems.length;
  
  // Average delinquency days
  const totalDelinquencyDays = data.reduce((sum, item) => sum + item.diasmora, 0);
  const averageDelinquencyDays = activeCredits > 0 ? totalDelinquencyDays / activeCredits : 0;
  
  // High risk portfolio (D and E categories)
  const highRiskItems = data.filter(item => ['D', 'E'].includes(item.riesgo));
  const highRiskPortfolio = highRiskItems.reduce((sum, item) => sum + item.saldocapital, 0);
  const highRiskRate = capitalBalance > 0 ? (highRiskPortfolio / capitalBalance) * 100 : 0;
  
  return {
    totalPortfolio,
    capitalBalance,
    delinquencyAmount,
    delinquencyRate,
    activeCredits,
    clientsInDelinquency,
    averageDelinquencyDays,
    highRiskPortfolio,
    highRiskRate,
  };
};

// Generate distribution data by risk category
export const getRiskDistribution = (data: PortfolioItem[]): ChartData[] => {
  const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  
  data.forEach(item => {
    if (distribution[item.riesgo] !== undefined) {
      distribution[item.riesgo] += item.saldocapital;
    }
  });
  
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));
};

// Generate distribution data by delinquency category
export const getDelinquencyDistribution = (data: PortfolioItem[]): ChartData[] => {
  const categories = [
    { name: 'Sin mora', filter: (item: PortfolioItem) => filterByDelinquency(item, 'Sin mora') },
    { name: '1-30 días', filter: (item: PortfolioItem) => filterByDelinquency(item, '1-30 días') },
    { name: '31-60 días', filter: (item: PortfolioItem) => filterByDelinquency(item, '31-60 días') },
    { name: '61-90 días', filter: (item: PortfolioItem) => filterByDelinquency(item, '61-90 días') },
    { name: 'Mayor a 90 días', filter: (item: PortfolioItem) => filterByDelinquency(item, 'Mayor a 90 días') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const value = filteredData.reduce((sum, item) => sum + item.saldocapital, 0);
    return {
      name: category.name,
      value: Math.round(value),
    };
  });
};

// Generate age distribution data
export const getAgeDistribution = (data: PortfolioItem[]): ChartData[] => {
  const categories = [
    { name: 'Menor de 30', filter: (item: PortfolioItem) => filterByAge(item, 'Menor de 30') },
    { name: '30-40', filter: (item: PortfolioItem) => filterByAge(item, '30-40') },
    { name: '41-50', filter: (item: PortfolioItem) => filterByAge(item, '41-50') },
    { name: '51-60', filter: (item: PortfolioItem) => filterByAge(item, '51-60') },
    { name: 'Mayor de 60', filter: (item: PortfolioItem) => filterByAge(item, 'Mayor de 60') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const value = filteredData.reduce((sum, item) => sum + item.saldocapital, 0);
    return {
      name: category.name,
      value: Math.round(value),
    };
  });
};

// Generate gender distribution data
export const getGenderDistribution = (data: PortfolioItem[]): ChartData[] => {
  const categories = [
    { name: 'Masculino', filter: (item: PortfolioItem) => filterByGender(item, 'M') },
    { name: 'Femenino', filter: (item: PortfolioItem) => filterByGender(item, 'F') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const value = filteredData.reduce((sum, item) => sum + item.saldocapital, 0);
    return {
      name: category.name,
      value: Math.round(value),
    };
  });
};

// Generate amount distribution data
export const getAmountDistribution = (data: PortfolioItem[]): ChartData[] => {
  const categories = [
    { name: 'Menor de 5M', filter: (item: PortfolioItem) => filterByAmount(item, 'Menor de 5M') },
    { name: '5M-10M', filter: (item: PortfolioItem) => filterByAmount(item, '5M-10M') },
    { name: '10M-20M', filter: (item: PortfolioItem) => filterByAmount(item, '10M-20M') },
    { name: '20M-50M', filter: (item: PortfolioItem) => filterByAmount(item, '20M-50M') },
    { name: 'Mayor de 50M', filter: (item: PortfolioItem) => filterByAmount(item, 'Mayor de 50M') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const value = filteredData.reduce((sum, item) => sum + item.saldocapital, 0);
    return {
      name: category.name,
      value: Math.round(value),
    };
  });
};

// Generate distribution data by city
export const getCityDistribution = (data: PortfolioItem[]): ChartData[] => {
  const distribution: Record<string, number> = {};
  
  data.forEach(item => {
    if (!distribution[item.ciucli]) {
      distribution[item.ciucli] = 0;
    }
    distribution[item.ciucli] += item.saldocapital;
  });
  
  return Object.entries(distribution)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 cities
};

// Generate distribution data by employer
export const getEmployerDistribution = (data: PortfolioItem[]): ChartData[] => {
  const distribution: Record<string, number> = {};
  
  data.forEach(item => {
    if (!distribution[item.codemp]) {
      distribution[item.codemp] = 0;
    }
    distribution[item.codemp] += item.saldocapital;
  });
  
  return Object.entries(distribution)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 employers
};

// Generate average delinquency days by age category
export const getDelinquencyByAge = (data: PortfolioItem[]): MultiSeriesChartData[] => {
  const categories = [
    { name: 'Menor de 30', filter: (item: PortfolioItem) => filterByAge(item, 'Menor de 30') },
    { name: '30-40', filter: (item: PortfolioItem) => filterByAge(item, '30-40') },
    { name: '41-50', filter: (item: PortfolioItem) => filterByAge(item, '41-50') },
    { name: '51-60', filter: (item: PortfolioItem) => filterByAge(item, '51-60') },
    { name: 'Mayor de 60', filter: (item: PortfolioItem) => filterByAge(item, 'Mayor de 60') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const totalDelinquencyDays = filteredData.reduce((sum, item) => sum + item.diasmora, 0);
    const averageDelinquencyDays = filteredData.length > 0 ? totalDelinquencyDays / filteredData.length : 0;
    
    return {
      name: category.name,
      'Días promedio': Math.round(averageDelinquencyDays),
    };
  });
};

// Generate average delinquency days by gender
export const getDelinquencyByGender = (data: PortfolioItem[]): MultiSeriesChartData[] => {
  const categories = [
    { name: 'Masculino', filter: (item: PortfolioItem) => filterByGender(item, 'M') },
    { name: 'Femenino', filter: (item: PortfolioItem) => filterByGender(item, 'F') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const totalDelinquencyDays = filteredData.reduce((sum, item) => sum + item.diasmora, 0);
    const averageDelinquencyDays = filteredData.length > 0 ? totalDelinquencyDays / filteredData.length : 0;
    
    return {
      name: category.name,
      'Días promedio': Math.round(averageDelinquencyDays),
    };
  });
};

// Generate average delinquency days by amount category
export const getDelinquencyByAmount = (data: PortfolioItem[]): MultiSeriesChartData[] => {
  const categories = [
    { name: 'Menor de 5M', filter: (item: PortfolioItem) => filterByAmount(item, 'Menor de 5M') },
    { name: '5M-10M', filter: (item: PortfolioItem) => filterByAmount(item, '5M-10M') },
    { name: '10M-20M', filter: (item: PortfolioItem) => filterByAmount(item, '10M-20M') },
    { name: '20M-50M', filter: (item: PortfolioItem) => filterByAmount(item, '20M-50M') },
    { name: 'Mayor de 50M', filter: (item: PortfolioItem) => filterByAmount(item, 'Mayor de 50M') },
  ];
  
  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const totalDelinquencyDays = filteredData.reduce((sum, item) => sum + item.diasmora, 0);
    const averageDelinquencyDays = filteredData.length > 0 ? totalDelinquencyDays / filteredData.length : 0;
    
    return {
      name: category.name,
      'Días promedio': Math.round(averageDelinquencyDays),
    };
  });
};

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentages
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};