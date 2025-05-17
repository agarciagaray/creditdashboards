import React from 'react';
import { PortfolioItem } from '../types';
import ChartCard from './ui/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, Line, LineChart,
  Area, AreaChart, ComposedChart
} from 'recharts';
import { 
  formatCurrency,
  getDelinquencyDistribution,
  getDelinquencyByAmount,
  getRiskDistribution
} from '../utils/calculations';

interface DelinquencyAnalysisProps {
  data: PortfolioItem[];
}

const DELINQUENCY_COLORS = ['#00cc00', '#84cc16', '#ffbb00', '#fb923c', '#ff0000'];

const RISK_COLORS = {
  'A': '#00cc00',
  'B': '#84cc16',
  'C': '#ffbb00',
  'D': '#fb923c',
  'E': '#ff0000',
};

const DelinquencyAnalysis: React.FC<DelinquencyAnalysisProps> = ({ data }) => {
  const delinquencyDistribution = getDelinquencyDistribution(data);
  const delinquencyByAmount = getDelinquencyByAmount(data);
  const riskDistribution = getRiskDistribution(data);
  
  // Calculate additional metrics for delinquency
  const totalDelinquent = data.filter(item => item.diasmora > 0);
  const totalPortfolio = data.reduce((sum, item) => sum + item.saldocapital, 0);
  const delinquentPortfolio = totalDelinquent.reduce((sum, item) => sum + item.saldocapital, 0);
  const delinquencyRate = (delinquentPortfolio / totalPortfolio) * 100;
  
  // Prepare data for risk vs. delinquency table
  const riskVsDelinquency = [
    { risk: 'A', description: 'Normal', maxDays: 0, rate: '0%' },
    { risk: 'B', description: 'Aceptable', maxDays: 30, rate: '1%' },
    { risk: 'C', description: 'Apreciable', maxDays: 60, rate: '20%' },
    { risk: 'D', description: 'Significativo', maxDays: 90, rate: '50%' },
    { risk: 'E', description: 'Incobrabilidad', maxDays: '> 90', rate: '100%' },
  ];
  
  // Prepare histogram data for delinquency distribution
  const delinquencyByDays = Array(13).fill(0).map((_, i) => {
    const min = i * 15;
    const max = i === 12 ? '180+' : (i + 1) * 15;
    const label = i === 12 ? '180+' : `${min}-${max}`;
    
    const filteredData = i === 12 
      ? data.filter(item => item.diasmora > 180)
      : data.filter(item => item.diasmora >= min && item.diasmora < (i + 1) * 15);
      
    const value = filteredData.reduce((sum, item) => sum + item.saldocapital, 0);
    const count = filteredData.length;
    
    return {
      name: label,
      value,
      count
    };
  });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribución de Mora" description="Distribución de cartera por días de mora">
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
        
        <ChartCard title="Histograma de Mora" description="Distribución detallada por rangos de días">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={delinquencyByDays} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'value') return formatCurrency(value);
                  return value;
                }}
                labelFormatter={(label) => `Días: ${label}`}
              />
              <Legend payload={[
                { value: 'Saldo', type: 'rect', color: '#fb923c' },
                { value: 'Créditos', type: 'line', color: '#0073e6' }
              ]}/>
              <Bar yAxisId="left" dataKey="value" fill="#fb923c" name="Saldo" />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#0073e6" name="Créditos" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Calificación de Riesgo" description="Distribución por categoría de riesgo">
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
        
        <ChartCard title="Mora por Monto" description="Relación entre monto de crédito y días de mora">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delinquencyByAmount} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Días promedio" fill="#fb923c" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Matriz de Calificación de Riesgo</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Mora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provisión</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riskVsDelinquency.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.risk === 'A' ? 'bg-success-100 text-success-800' :
                      item.risk === 'B' ? 'bg-success-200 text-success-800' :
                      item.risk === 'C' ? 'bg-warning-100 text-warning-800' :
                      item.risk === 'D' ? 'bg-warning-200 text-warning-800' :
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.maxDays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DelinquencyAnalysis;