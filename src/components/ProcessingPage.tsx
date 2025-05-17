import React from 'react';
import { BarChart2 } from 'lucide-react';

const ProcessingPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="animate-pulse">
        <BarChart2 className="h-16 w-16 text-primary-600 mb-6" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Analizando tu cartera
      </h2>
      <p className="text-gray-600 mb-8">
        Estamos procesando tu archivo para generar el análisis completo...
      </p>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary-600 animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default ProcessingPage;