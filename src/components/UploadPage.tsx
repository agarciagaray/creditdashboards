import {
  Download,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Upload,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";

interface UploadPageProps {
  onFileUpload: (file: File) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFormat, setShowFormat] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setIsLoading(true);

      // Validar el tipo de archivo
      const validTypes = [".xlsx", ".xls", ".csv"];
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        setError("Por favor, sube un archivo Excel (.xlsx, .xls) o CSV (.csv)");
        setIsLoading(false);
        return;
      }

      // Validar el tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(
          "El archivo es demasiado grande. El tamaño máximo permitido es 10MB"
        );
        setIsLoading(false);
        return;
      }

      try {
        onFileUpload(file);
      } catch (err) {
        setError(
          "Error al procesar el archivo. Por favor, intenta nuevamente."
        );
        setIsLoading(false);
      }
    },
    [onFileUpload]
  );

  const handleDownloadTemplate = useCallback(() => {
    // Crear datos de ejemplo
    const exampleData = [
      {
        cedmil: "1234567890",
        nomcli: "Juan Pérez",
        fechanacimiento: "1990-01-01",
        sexo: "M",
        edad: 33,
        ciucli: "Bogotá",
        nomemp: "Empresa A",
        numlib: "CRED001",
        valcuo: 1000000,
        valtot: 12000000,
        fecini: "2023-01-01",
        fecfin: "2024-01-01",
        salcapital: 10000000,
        ncuotas: 12,
        npagos: 3,
        ndias: 0,
        calidad: "Normal",
        calif: "A",
        vencido: 0,
      },
      {
        cedmil: "0987654321",
        nomcli: "María López",
        fechanacimiento: "1985-05-15",
        sexo: "F",
        edad: 38,
        ciucli: "Medellín",
        nomemp: "Empresa B",
        numlib: "CRED002",
        valcuo: 1500000,
        valtot: 18000000,
        fecini: "2023-02-01",
        fecfin: "2024-02-01",
        salcapital: 15000000,
        ncuotas: 12,
        npagos: 2,
        ndias: 15,
        calidad: "Atraso",
        calif: "B",
        vencido: 1500000,
      },
    ];

    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exampleData);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    // Generar el archivo Excel
    XLSX.writeFile(wb, "plantilla_ejemplo.xlsx");
  }, []);

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

        <div className="relative">
          {/* Botones de ayuda y formato */}
          <div className="absolute right-0 top-0 flex space-x-2">
            <button
              onClick={() => setShowFormat(!showFormat)}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Mostrar formato esperado"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Mostrar ayuda"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Panel de formato esperado */}
          {showFormat && (
            <div className="absolute right-0 top-10 w-96 bg-white p-4 rounded-lg shadow-lg z-10">
              <h3 className="font-semibold mb-2">
                Formato Esperado del Archivo
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Columnas requeridas:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>cedmil: Cédula del cliente</li>
                  <li>nomcli: Nombre del cliente</li>
                  <li>fechanacimiento: Fecha de nacimiento (YYYY-MM-DD)</li>
                  <li>sexo: Género (M/F)</li>
                  <li>edad: Edad en años</li>
                  <li>ciucli: Ciudad del cliente</li>
                  <li>nomemp: Nombre de la empresa</li>
                  <li>numlib: Número de crédito</li>
                  <li>valcuo: Valor de la cuota</li>
                  <li>valtot: Valor total del crédito</li>
                  <li>fecini: Fecha de inicio (YYYY-MM-DD)</li>
                  <li>fecfin: Fecha de finalización (YYYY-MM-DD)</li>
                  <li>salcapital: Saldo de capital</li>
                  <li>ncuotas: Número de cuotas</li>
                  <li>npagos: Número de pagos realizados</li>
                  <li>ndias: Días de mora</li>
                  <li>calidad: Calidad del crédito</li>
                  <li>calif: Calificación de riesgo (A-E)</li>
                  <li>vencido: Monto vencido</li>
                </ul>
              </div>
            </div>
          )}

          {/* Panel de ayuda existente */}
          {showHelp && (
            <div className="absolute right-0 top-10 w-64 bg-white p-4 rounded-lg shadow-lg z-10">
              <h3 className="font-semibold mb-2">¿Cómo funciona?</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sube un archivo Excel o CSV con tus datos de créditos</li>
                <li>• El archivo debe tener las columnas requeridas</li>
                <li>• Tamaño máximo: 10MB</li>
                <li>• Formatos soportados: .xlsx, .xls, .csv</li>
              </ul>
            </div>
          )}

          {/* Área de arrastrar y soltar existente */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            role="region"
            aria-label="Área para subir archivos"
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
              aria-label="Seleccionar archivo"
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <FileSpreadsheet
                  className="h-16 w-16 text-primary-500"
                  aria-hidden="true"
                />
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
                Formatos soportados:{" "}
                <span className="font-medium text-primary-600">.xlsx</span>,{" "}
                <span className="font-medium text-primary-600">.xls</span>,{" "}
                <span className="font-medium text-primary-600">.csv</span>
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() =>
                document.querySelector('input[type="file"]')?.click()
              }
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload
                className="h-4 w-4 mr-2"
                aria-hidden="true"
              />
              Seleccionar archivo
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download
                className="h-4 w-4 mr-2"
                aria-hidden="true"
              />
              Descargar plantilla
            </button>
          </div>

          {/* Mensajes de estado existentes */}
          {isLoading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">Procesando archivo...</p>
            </div>
          )}

          {error && (
            <div
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
