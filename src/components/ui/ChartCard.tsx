import React from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  description, 
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg ${className} animate-fade-in`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="h-64 w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;