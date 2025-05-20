import {
  AlertTriangle,
  BarChart2,
  Database,
  Download,
  Home,
  Map,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DashboardSummary from "./components/DashboardSummary";
import DelinquencyAnalysis from "./components/DelinquencyAnalysis";
import DemographicAnalysis from "./components/DemographicAnalysis";
import FilterPanel from "./components/FilterPanel";
import GeographicAnalysis from "./components/GeographicAnalysis";
import ProcessingPage from "./components/ProcessingPage";
import Breadcrumb from "./components/ui/Breadcrumb";
import DataTable from "./components/ui/DataTable";
import ScrollToTop from "./components/ui/ScrollToTop";
import TabView from "./components/ui/TabView";
import UploadPage from "./components/UploadPage";
import { FilterOptions, PortfolioItem, SelectedFilters } from "./types";
import { calculateKpiMetrics } from "./utils/calculations";
import { applyFilters, generateFilterOptions } from "./utils/filters";

type AppState = "upload" | "processing" | "dashboard";

function App() {
  // App state
  const [appState, setAppState] = useState<AppState>("upload");

  // State for filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    ageRange: null,
    gender: null,
    amountRange: null,
    delinquencyRange: null,
    employer: null,
    city: null,
    riskLevel: null,
  });

  // State for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    ageRanges: [],
    gender: [],
    amountRanges: [],
    delinquencyRanges: [],
    employers: [],
    cities: [],
    riskLevels: [],
  });

  // State for filtered data
  const [filteredData, setFilteredData] = useState<PortfolioItem[]>([]);
  const [displayData, setDisplayData] = useState<PortfolioItem[]>([]);

  // State for metrics
  const [metrics, setMetrics] = useState(calculateKpiMetrics([]));

  // Generate filter options when data changes
  useEffect(() => {
    if (filteredData.length > 0) {
      const options = generateFilterOptions(filteredData);
      setFilterOptions(options);
    }
  }, [filteredData]);

  // Apply filters when selectedFilters change
  useEffect(() => {
    if (filteredData.length > 0) {
      const filtered = applyFilters(filteredData, selectedFilters);
      setDisplayData(filtered);
      setMetrics(calculateKpiMetrics(filtered));
    }
  }, [selectedFilters, filteredData]);

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    setAppState("processing");

    try {
      console.log("Iniciando procesamiento del archivo:", file.name);
      const data = await readExcelFile(file);
      console.log("Datos procesados:", data.length, "registros");

      if (data.length === 0) {
        throw new Error("El archivo no contiene datos válidos");
      }

      setFilteredData(data);
      setDisplayData(data);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 4500));

      setAppState("dashboard");
    } catch (error) {
      console.error("Error detallado:", error);
      alert(
        `Error al procesar el archivo: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      setAppState("upload");
    }
  };

  // Function to read Excel file
  const readExcelFile = (file: File): Promise<PortfolioItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          console.log("Archivo leído, procesando...");
          const data = e.target?.result;
          if (!data) {
            throw new Error("No se pudo leer el archivo");
          }

          const workbook = XLSX.read(data, { type: "binary" });
          console.log("Hojas disponibles:", workbook.SheetNames);

          if (workbook.SheetNames.length === 0) {
            throw new Error("El archivo no contiene hojas");
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          console.log(
            "Datos convertidos a JSON:",
            jsonData.length,
            "registros"
          );
          console.log("Primera fila de ejemplo:", jsonData[0]);
          if (jsonData.length > 0) {
            console.log(
              "Nombres de columnas disponibles:",
              Object.keys(jsonData[0] as object)
            );
          }

          if (jsonData.length === 0) {
            throw new Error("La hoja no contiene datos");
          }

          // Transform the data to match PortfolioItem type
          const transformedData = jsonData.map((item: any) => {
            console.log("Procesando fila:", item);
            return {
              // Client properties
              cedmil: String(item.cedmil || ""),
              nomcli: String(item.nomcli || ""),
              fechanacimiento: String(item.fechanacimiento || ""),
              sexo: String(item.sexo || ""),
              edad: Number(item.edad || 0),
              ciucli: String(item.ciucli || ""),
              codemp: String(item.nomemp || ""),

              // Credit properties
              numlib: String(item.numlib || ""),
              valcuo: Number(item.valcuo || 0),
              valtot: Number(item.valtot || 0),
              fecini: String(item.fecini || ""),
              fecfin: String(item.fecfin || ""),
              saldocapital: Number(item.salcapital || 0),
              ncuotas: Number(item.ncuotas || 0),
              npagos: Number(item.npagos || 0),
              diasmora: Number(item.ndias || 0),
              calidad: String(item.calidad || ""),
              calif: String(item.calif || "A")
                .trim()
                .toUpperCase(),
              vencido: Number(item.vencido || 0),
            };
          });

          console.log(
            "Datos transformados:",
            transformedData.length,
            "registros"
          );
          console.log("Primera fila transformada:", transformedData[0]);
          console.log(
            "Suma de valtot:",
            transformedData.reduce((sum, item) => sum + item.valtot, 0)
          );
          console.log(
            "Suma de saldocapital:",
            transformedData.reduce((sum, item) => sum + item.saldocapital, 0)
          );
          console.log(
            "Suma de vencido:",
            transformedData.reduce((sum, item) => sum + item.vencido, 0)
          );

          // Log para verificar valores de riesgo transformados
          console.log(
            "Distribución de riesgo transformada (primeros 10):",
            transformedData.slice(0, 10).map((item) => item.calif)
          );

          resolve(transformedData);
        } catch (error) {
          console.error("Error en el procesamiento:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error("Error al leer el archivo:", error);
        reject(new Error("Error al leer el archivo"));
      };

      console.log("Iniciando lectura del archivo...");
      reader.readAsBinaryString(file);
    });
  };

  // Handler for filter changes
  const handleFilterChange = (
    filterName: keyof SelectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: value === "Todos" ? null : value,
    }));
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setSelectedFilters({
      ageRange: null,
      gender: null,
      amountRange: null,
      delinquencyRange: null,
      employer: null,
      city: null,
      riskLevel: null,
    });
  };

  // Función para exportar datos
  const handleExportData = useCallback(() => {
    const dataToExport = displayData.map((item) => ({
      Cédula: item.cedmil,
      Nombre: item.nomcli,
      "Fecha Nacimiento": item.fechanacimiento,
      Género: item.sexo,
      Edad: item.edad,
      Ciudad: item.ciucli,
      Empresa: item.codemp,
      "Número Crédito": item.numlib,
      "Valor Cuota": item.valcuo,
      "Valor Total": item.valtot,
      "Fecha Inicio": item.fecini,
      "Fecha Fin": item.fecfin,
      "Saldo Capital": item.saldocapital,
      "Número Cuotas": item.ncuotas,
      "Pagos Realizados": item.npagos,
      "Días Mora": item.diasmora,
      Calidad: item.calidad,
      Calificación: item.calif,
      Vencido: item.vencido,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "cartera_creditos.xlsx");
  }, [displayData]);

  // Create tabs for the dashboard
  const tabs = [
    {
      label: "Resumen General",
      icon: <Home size={18} />,
      content: (
        <DashboardSummary
          data={displayData}
          metrics={metrics}
        />
      ),
    },
    {
      label: "Análisis de Mora",
      icon: <AlertTriangle size={18} />,
      content: <DelinquencyAnalysis data={displayData} />,
    },
    {
      label: "Análisis Demográfico",
      icon: <Users size={18} />,
      content: <DemographicAnalysis data={displayData} />,
    },
    {
      label: "Análisis Geográfico",
      icon: <Map size={18} />,
      content: <GeographicAnalysis data={displayData} />,
    },
    {
      label: "Datos Detallados",
      icon: <Database size={18} />,
      content: (
        <DataTable
          data={displayData}
          title="Créditos Filtrados"
        />
      ),
    },
  ];

  if (appState === "upload") {
    return <UploadPage onFileUpload={handleFileUpload} />;
  }

  if (appState === "processing") {
    return <ProcessingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header
        className="bg-white shadow-md"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart2
                className="h-8 w-8 text-primary-600 mr-3"
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard de Cartera de Créditos
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className="text-sm text-gray-500"
                role="status"
                aria-live="polite"
              >
                {displayData.length} créditos cargados
              </div>
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                aria-label="Exportar datos"
              >
                <Download
                  className="h-4 w-4 mr-2"
                  aria-hidden="true"
                />
                Exportar
              </button>
              <button
                onClick={() => setAppState("upload")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                aria-label="Cargar nuevo archivo"
              >
                <Upload
                  className="h-4 w-4 mr-2"
                  aria-hidden="true"
                />
                Cargar otro archivo
              </button>
            </div>
          </div>
        </div>
      </header>

      <main
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        role="main"
      >
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "#" },
              { label: "Resumen General" },
            ]}
          />
        </div>

        <div className="mb-6">
          <FilterPanel
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <TabView tabs={tabs} />
        </div>
      </main>

      <footer
        className="bg-white shadow-inner mt-8 py-4"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Dashboard de Cartera de Créditos |
            Desarrollado para análisis financiero
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}

export default App;
