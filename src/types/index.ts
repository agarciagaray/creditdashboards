// Credit portfolio data types

export interface Client {
  cedmil: string;
  nomcli: string;
  fechanacimiento: string;
  sexo: 'M' | 'F' | string;
  edad: number;
  ciucli: string; // City
  codemp: string; // Employer name (columna AH - nomemp)
}

export interface Credit {
  numlib: string; // Credit number
  valcuo: number; // Payment amount
  valtot: number; // Total value (columna J)
  fecini: string; // Start date
  fecfin: string; // End date
  saldocapital: number; // Current capital balance (columna L - salcapital)
  ncuotas: number; // Number of installments
  npagos: number; // Number of payments made
  diasmora: number; // Delinquency days (columna X - ndias)
  calidad: string; // Quality rating
  calif: 'A' | 'B' | 'C' | 'D' | 'E' | string; // Clasificación de riesgo (columna Z)
  vencido: number; // Amount in delinquency (columna Y)
}

export interface PortfolioItem extends Client, Credit { }

export interface FilterOptions {
  ageRanges: string[];
  gender: string[];
  amountRanges: string[];
  delinquencyRanges: string[];
  employers: string[];
  cities: string[];
  riskLevels: string[];
}

export interface SelectedFilters {
  ageRange: string | null;
  gender: string | null;
  amountRange: string | null;
  delinquencyRange: string | null;
  employer: string | null;
  city: string | null;
  riskLevel: string | null;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface MultiSeriesChartData {
  name: string;
  [key: string]: string | number;
}

export interface KpiMetrics {
  totalPortfolio: number;
  capitalBalance: number;
  delinquencyAmount: number;
  delinquencyRate: number;
  activeCredits: number;
  clientsInDelinquency: number;
  averageDelinquencyDays: number;
  highRiskPortfolio: number;
  highRiskRate: number;
}