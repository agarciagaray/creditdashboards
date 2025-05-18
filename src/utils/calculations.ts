import { ChartData, KpiMetrics, MultiSeriesChartData, PortfolioItem } from '../types';
import { filterByAge, filterByAmount, filterByGender } from './filters';

// Calculate key metrics from filtered portfolio data
export const calculateKpiMetrics = (data: PortfolioItem[]): KpiMetrics => {
  // Total portfolio value (suma de columna J - valtot)
  const totalPortfolio = data.reduce((sum, item) => sum + item.valtot, 0);

  // Capital balance (suma de columna L - salcapital)
  const capitalBalance = data.reduce((sum, item) => sum + item.saldocapital, 0);

  // Delinquency (usando columna Y - vencido)
  const delinquentItems = data.filter(item => item.vencido > 0);
  const delinquencyAmount = delinquentItems.reduce((sum, item) => sum + item.vencido, 0);
  const delinquencyRate = capitalBalance > 0 ? (delinquencyAmount / capitalBalance) * 100 : 0;

  // Clients
  const activeCredits = data.length;
  const clientsInDelinquency = delinquentItems.length;

  // Average delinquency days (usando columna X - ndias)
  const totalDelinquencyDays = delinquentItems.reduce((sum, item) => sum + item.diasmora, 0);
  const averageDelinquencyDays = clientsInDelinquency > 0 ? totalDelinquencyDays / clientsInDelinquency : 0;

  // High risk portfolio (categorias diferentes de A, usando columna Z - calif y sumando salcapital)
  const highRiskItems = data.filter(item => item.calif !== 'A');
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

// Generate distribution data by risk category (usando columna Z - calif y sumando salcapital)
export const getRiskDistribution = (data: PortfolioItem[]): ChartData[] => {
  // Las categorías de riesgo ahora se basan en los valores únicos de 'calif' en los datos.
  // No pre-definimos { A: 0, B: 0, ... } ya que podrían haber otras categorías.
  const distribution: Record<string, number> = {};

  data.forEach(item => {
    const riskCategory = item.calif.trim().toUpperCase();
    if (!distribution[riskCategory]) {
      distribution[riskCategory] = 0;
    }
    distribution[riskCategory] += item.saldocapital;
  });

  // Ordenar por nombre de categoría (A, B, C, D, E) si existen, o alfabéticamente si hay otras.
  return Object.entries(distribution)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Generate distribution data by delinquency category
export const getDelinquencyDistribution = (data: PortfolioItem[]): ChartData[] => {
  const categories = [
    { name: 'Sin mora', filter: (item: PortfolioItem) => item.vencido === 0 },
    { name: '1-30 días', filter: (item: PortfolioItem) => item.diasmora >= 1 && item.diasmora <= 30 },
    { name: '31-60 días', filter: (item: PortfolioItem) => item.diasmora >= 31 && item.diasmora <= 60 },
    { name: '61-90 días', filter: (item: PortfolioItem) => item.diasmora >= 61 && item.diasmora <= 90 },
    { name: 'Mayor a 90 días', filter: (item: PortfolioItem) => item.diasmora > 90 },
  ];

  return categories.map(category => {
    const filteredData = data.filter(category.filter);
    const value = filteredData.reduce((sum, item) => sum + item.vencido, 0);
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

// Generate distribution data by employer (usando columna AH - nomemp como codemp)
export const getEmployerDistribution = (data: PortfolioItem[]): MultiSeriesChartData[] => {
  const distribution: Record<string, { value: number, count: number }> = {};

  data.forEach(item => {
    const employerCode = item.codemp.trim(); // Usar el código de empleador (que viene de nomemp)
    if (!distribution[employerCode]) {
      distribution[employerCode] = { value: 0, count: 0 };
    }
    distribution[employerCode].value += item.saldocapital;
    distribution[employerCode].count += 1;
  });

  // Convertir a formato de gráfico, incluyendo nombre, código, valor y conteo
  return Object.entries(distribution)
    .map(([code, data]) => ({
      name: code, // Usar el código como nombre principal para el eje
      'Código': code,
      'Saldo Capital': Math.round(data.value),
      'Número de Créditos': data.count,
    }))
    .sort((a, b) => b['Saldo Capital'] - a['Saldo Capital'])
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