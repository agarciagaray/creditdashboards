import React, { useState } from 'react';
import { PortfolioItem } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface DataTableProps {
  data: PortfolioItem[];
  title: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crédito</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Mora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riesgo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.cedmil + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.nomcli}</div>
                  <div className="text-xs text-gray-500">{item.cedmil}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.numlib}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(item.valtot)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(item.saldocapital)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    item.diasmora === 0 ? 'text-success-600' :
                    item.diasmora <= 30 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {item.diasmora}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.riesgo === 'A' ? 'bg-success-100 text-success-800' :
                    item.riesgo === 'B' ? 'bg-success-200 text-success-800' :
                    item.riesgo === 'C' ? 'bg-warning-100 text-warning-800' :
                    item.riesgo === 'D' ? 'bg-warning-200 text-warning-800' :
                    'bg-danger-100 text-danger-800'
                  }`}>
                    {item.riesgo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.ciucli}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <select
            className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>{size} filas</option>
            ))}
          </select>
          <span className="ml-2 text-sm text-gray-500">
            Mostrando {start + 1}-{Math.min(end, data.length)} de {data.length}
          </span>
        </div>
        
        <div className="flex">
          <button
            className="px-3 py-1 text-sm border rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 0}
            onClick={() => handleChangePage(page - 1)}
          >
            Anterior
          </button>
          <button
            className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page >= totalPages - 1}
            onClick={() => handleChangePage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;