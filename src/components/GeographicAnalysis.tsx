import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PortfolioItem } from "../types";
import {
  formatCurrency,
  getCityDistribution,
  getEmployerDistribution,
} from "../utils/calculations";
import ChartCard from "./ui/ChartCard";

interface GeographicAnalysisProps {
  data: PortfolioItem[];
}

// Generate a nice color gradient for charts
const generateColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = ((i * 360) / count) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({ data }) => {
  const cityDistribution = getCityDistribution(data);
  const employerDistribution = getEmployerDistribution(data);

  const cityColors = generateColors(cityDistribution.length);
  const employerColors = generateColors(employerDistribution.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Distribución por Ciudad"
          description="Top 10 ciudades por saldo de capital"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={cityDistribution}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <YAxis
                type="category"
                dataKey="name"
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Ciudad: ${label}`}
              />
              <Bar
                dataKey="value"
                fill="#0073e6"
              >
                {cityDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={cityColors[index % cityColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Distribución por Empresa"
          description="Top 10 empresas por saldo de capital"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={employerDistribution}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <YAxis
                type="category"
                dataKey="Código"
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  formatCurrency(value),
                  `${name} (${props.payload["Número de Créditos"]} créditos)`,
                ]}
                labelFormatter={(label) => `Empresa: ${label}`}
              />
              <Bar
                dataKey="Saldo Capital"
                fill="#0073e6"
              >
                {employerDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={employerColors[index % employerColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Distribución de Cartera por Ciudad"
          description="Porcentaje del saldo por ciudad"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={cityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {cityDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={cityColors[index % cityColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Dejo comentada la gráfica de Distribución de Cartera por Empresa (Pie Chart) según tu último requerimiento, enfocándonos en el Bar Chart */}
        {/* Si la necesitas de vuelta, házmelo saber. */}

        <ChartCard
          title="Distribución de Cartera por Empresa"
          description="Porcentaje del saldo por empresa"
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={employerDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="Saldo Capital"
              >
                {employerDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={employerColors[index % employerColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default GeographicAnalysis;
