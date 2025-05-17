import React from 'react';
import { PortfolioItem } from '../types';
import ChartCard from './ui/ChartCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, Line, LineChart
} from 'recharts';
import { 
  formatCurrency,
  getAgeDistribution,
  getGenderDistribution,
  getDelinquencyByAge,
  getDelinquencyByGender,
  getAmountDistribution,
  getDelinquencyByAmount
} from '../utils/calculations';

interface DemographicAnalysisProps {
  data: PortfolioItem[];
}

const AGE_COLORS = ['#84cc16', '#22d3ee', '#0073e6', '#fb923c', '#ff0000'];
const GENDER_COLORS = ['#0073e6', '#ff69b4'];
const AMOUNT_COLORS = ['#84cc16', '#22d3ee', '#0073e6', '#fb923c', '#ff0000'];

const DemographicAnalysis: React.FC<DemographicAnalysisProps> = ({ data }) => {
  const ageDistribution = getAgeDistribution(data);
  const genderDistribution = getGenderDistribution(data);
  const delinquencyByAge = getDelinquencyByAge(data);
  const delinquencyByGender = getDelinquencyByGender(data);
  const amountDistribution = getAmountDistribution(data);
  const delinquencyByAmount = getDelinquencyByAmount(data);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Age Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribución por Edad" description="Saldo de capital por rango de edad">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#0073e6">
                {ageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Mora por Edad" description="Días promedio de mora por rango de edad">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delinquencyByAge} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Días promedio" fill="#fb923c">
                {delinquencyByAge.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Gender Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribución por Género" description="Saldo de capital por género">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Mora por Género" description="Días promedio de mora por género">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delinquencyByGender} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Días promedio" fill="#fb923c">
                {delinquencyByGender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Amount Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribución por Monto" description="Saldo de capital por rango de monto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={amountDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" fill="#0073e6">
                {amountDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AMOUNT_COLORS[index % AMOUNT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Mora por Monto" description="Días promedio de mora por rango de monto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delinquencyByAmount} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Días promedio" fill="#fb923c">
                {delinquencyByAmount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AMOUNT_COLORS[index % AMOUNT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default DemographicAnalysis;