import {
  BarChart2,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const ProcessingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(stepInterval);
  }, []);

  const steps = [
    {
      icon: <FileSpreadsheet className="h-8 w-8" />,
      title: "Leyendo archivo",
      description: "Procesando los datos del archivo Excel...",
    },
    {
      icon: <Loader2 className="h-8 w-8 animate-spin" />,
      title: "Analizando datos",
      description: "Calculando métricas y estadísticas...",
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Preparando dashboard",
      description: "Generando visualizaciones y gráficos...",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Procesando tu información
          </h1>
          <p className="text-gray-600">
            Estamos analizando los datos de tu cartera
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${
                currentStep > index + 1
                  ? "bg-green-50"
                  : currentStep === index + 1
                  ? "bg-primary-50"
                  : "bg-gray-50"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  currentStep > index + 1
                    ? "text-green-500"
                    : currentStep === index + 1
                    ? "text-primary-500"
                    : "text-gray-400"
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${
                    currentStep > index + 1
                      ? "text-green-700"
                      : currentStep === index + 1
                      ? "text-primary-700"
                      : "text-gray-700"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    currentStep > index + 1
                      ? "text-green-600"
                      : currentStep === index + 1
                      ? "text-primary-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Progreso: {Math.round((currentStep / totalSteps) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
