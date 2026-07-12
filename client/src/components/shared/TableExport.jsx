import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../utils/exportUtils.js";

function TableExport({ title, headers, rows, filename = "export" }) {
  const [exporting, setExporting] = useState(null);

  const handleCSV = () => {
    setExporting("csv");
    try {
      exportToCSV({ headers, rows, filename: `${filename}.csv` });
    } finally {
      setExporting(null);
    }
  };

  const handlePDF = () => {
    setExporting("pdf");
    try {
      exportToPDF({ title, headers, rows, filename: `${filename}.pdf` });
    } finally {
      setExporting(null);
    }
  };

  if (!rows?.length) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleCSV}
        disabled={!!exporting}
        title="Export as CSV"
        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
      >
        <Download size={12} />
        CSV
      </button>
      <button
        type="button"
        onClick={handlePDF}
        disabled={!!exporting}
        title="Save as PDF"
        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
      >
        <FileText size={12} />
        PDF
      </button>
    </div>
  );
}

export default TableExport;
