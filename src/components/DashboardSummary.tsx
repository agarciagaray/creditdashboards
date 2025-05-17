import React from 'react';
import { PortfolioItem, KpiMetrics } from '../types';
import KpiCard from './ui/KpiCard';
import ChartCard from './ui/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, Line, LineChart
} from 'recharts';
import { DollarSign, Users, AlertCircle, TrendingUp, Percent } from 'lucide-react';
import { 
  formatCurrency, 
  formatPercentage,
  getRiskDistribution,
  getDelinquencyDistribution
} from '../utils/calculations';

interface DashboardSummaryProps {
  data: PortfolioItem[];
  metrics: KpiMetrics;
}

const RISK_COLORS = {
  'A': '#00cc00',
  'B': '#84cc16',
  'C': '#ffbb00',
  'D': '#fb923c',
  'E': '#ff0000',
};

const DELINQUENCY_COLORS = ['#00cc00', '#84cc16', '#ffbb00', '#fb923c', '#ff0000'];

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ data, metrics }) => {
  const riskDistribution = getRiskDistribution(data);
  const delinquencyDistribution = getDelinquencyDistribution(data);
  
  // Create summary data for bar chart
  const summaryData = [
    { name: 'Cartera Total', value: metrics.totalPortfolio },
    { name: 'Saldo Capital', value: metrics.capitalBalance },
    { name: 'Cartera en Mora', value: metrics.delinquencyAmount },
    { name: 'Cartera en Alto Riesgo', value: metrics.highRiskPortfolio },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Cartera Total"
          value={formatCurrency(metrics.totalPortfolio)}
          icon={<DollarSign size={20} />}
        />
        <KpiCard
          title="Saldo de Capital"
          value={formatCurrency(metrics.capitalBalance)}
          icon={<TrendingUp size={20} />}
        />
        <KpiCard
          title="Créditos Activos"
          value={metrics.activeCredits.toString()}
          icon={<Users size={20} />}
        />
        <KpiCard
          title="Cartera en Mora"
          value={formatCurrency(metrics.delinquencyAmount)}
          icon={<AlertCircle size={20} />}
          change={formatPercentage(metrics.delinquencyRate)}
          positive={false}
        />
      </div>
      
      {/* Second KPI cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Índice de Mora"
          value={formatPercentage(metrics.delinquencyRate)}
          icon={<Percent size={20} />}
          positive={false}
        />
        <KpiCard
          title="Clientes en Mora"
          value={metrics.clientsInDelinquency.toString()}
          icon={<Users size={20} />}
          change={`${Math.round((metrics.clientsInDelinquency / metrics.activeCredits) * 100)}%`}
          positive={false}
        />
        <KpiCard
          title="Días Promedio en Mora"
          value={metrics.averageDelinquencyDays.toFixed(1)}
          icon={<AlertCircle size={20} />}
        />
        <KpiCard
          title="Cartera en Alto Riesgo"
          value={formatCurrency(metrics.highRiskPortfolio)}
          icon={<AlertCircle size={20} />}
          change={formatPercentage(metrics.highRiskRate)}
          positive={false}
        />
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Resumen de Cartera" description="Distribución de los valores principales">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#0073e6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Distribución por Riesgo" description="Calificación de riesgo por saldo de capital">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribución por Mora" description="Saldo de capital por días de mora">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={delinquencyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {delinquencyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DELINQUENCY_COLORS[index % DELINQUENCY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Tendencia de Mora" description="Cartera en mora por categoría de días">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delinquencyDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#fb923c">
                {delinquencyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DELINQUENCY_COLORS[index % DELINQUENCY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardSummary;