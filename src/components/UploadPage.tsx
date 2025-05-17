import React from 'react';
import { FileUp as FileUpload, Upload } from 'lucide-react';

interface UploadPageProps {
  onFileUpload: (file: File) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Análisis de Cartera de Créditos
      </h1>
      
      <div className="bg-white rounded-lg shadow-xl p-8 w-full mb-8">
        <div className="flex items-center justify-center mb-6">
          <FileUpload className="h-16 w-16 text-primary-600" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Sube tu archivo de cartera
        </h2>
        
        <p className="text-gray-600 mb-6">
          Analiza tu cartera de créditos de forma rápida y eficiente. Obtén insights valiosos sobre mora, 
          riesgo crediticio, distribución demográfica y más.
        </p>
        
        <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">Excel o CSV (Máx. 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
          />
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <FeatureCard
          title="Análisis Completo"
          description="Obtén una visión detallada de tu cartera con métricas clave, gráficos y tendencias."
          icon={<BarChart2 className="h-8 w-8 text-primary-600" />}
        />
        <FeatureCard
          title="Segmentación Detallada"
          description="Analiza por edad, género, ubicación y más para tomar decisiones informadas."
          icon={<Users className="h-8 w-8 text-primary-600" />}
        />
        <FeatureCard
          title="Gestión de Riesgo"
          description="Identifica y monitorea los niveles de riesgo y mora en tu cartera."
          icon={<AlertTriangle className="h-8 w-8 text-primary-600" />}
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default UploadPage;