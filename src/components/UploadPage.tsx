import React, { useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface UploadPageProps {
  onFileUpload: (file: File) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateExcelFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    return validTypes.includes(file.type);
  };

  const handleFile = (file: File) => {
    setError(null);
    if (!validateExcelFile(file)) {
      setError('Por favor, sube un archivo Excel válido (.xlsx, .xls o .csv)');
      return;
    }
    onFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Cartera de Créditos
          </h1>
          <p className="text-gray-600">
            Sube tu archivo Excel para comenzar el análisis
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileSpreadsheet className="h-16 w-16 text-primary-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Arrastra y suelta tu archivo aquí
              </p>
              <p className="text-sm text-gray-500 mt-1">
                o haz clic para seleccionar un archivo
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Formatos soportados: .xlsx, .xls, .csv
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;