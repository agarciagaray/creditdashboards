import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  positive = true,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg ${className} animate-fade-in`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="text-primary-600">{icon}</div>
      </div>
      <div className="font-bold text-2xl text-gray-800 mb-1">{value}</div>
      {change && (
        <div className={`text-sm flex items-center ${positive ? 'text-success-500' : 'text-danger-500'}`}>
          <span className="mr-1">
            {positive ? '↑' : '↓'}
          </span>
          {change}
        </div>
      )}
    </div>
  );
};

export default KpiCard;