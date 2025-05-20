import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileText } from "lucide-react";
import React from "react";
import * as XLSX from "xlsx";

interface ExportButtonsProps {
  data: any[];
  currentPage: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, currentPage }) => {
  const exportToExcel = () => {
    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();

    // Convertir los datos a formato de hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(data);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, currentPage);

    // Guardar el archivo
    XLSX.writeFile(
      wb,
      `CreditDashboard_${currentPage}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };

  const exportToPDF = async () => {
    // Obtener el elemento que queremos convertir a PDF
    const element = document.getElementById("dashboard-content");
    if (!element) return;

    try {
      // Crear un canvas del elemento
      const canvas = await html2canvas(element, {
        scale: 2, // Mejor calidad
        useCORS: true, // Permitir imágenes externas
        logging: false, // Desactivar logs
      });

      // Crear el PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Calcular dimensiones para ajustar al PDF
      const imgWidth = 297; // Ancho A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Agregar la imagen al PDF
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Guardar el PDF
      pdf.save(
        `CreditDashboard_${currentPage}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <Download size={16} />
        Exportar a Excel
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <FileText size={16} />
        Exportar a PDF
      </button>
    </div>
  );
};

export default ExportButtons;
