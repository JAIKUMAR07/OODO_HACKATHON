import React, { useState, useEffect } from "react";
import { Download, RefreshCw, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAnalyticsSummary, exportAnalyticsCSV } from "../services/analyticsService.js";
import MonthlyRevenueChart from "../components/charts/MonthlyRevenueChart.jsx";
import VehicleCostBarChart from "../components/charts/VehicleCostBarChart.jsx";
import FleetRoiChart from "../components/charts/FleetRoiChart.jsx";
import CostBreakdownChart from "../components/charts/CostBreakdownChart.jsx";
import VehicleDistanceChart from "../components/charts/VehicleDistanceChart.jsx";
import FuelEfficiencyChart from "../components/charts/FuelEfficiencyChart.jsx";
function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const summary = await getAnalyticsSummary();
      setData(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportAnalyticsCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fleet_analytics_report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = () => {
    setExportingPDF(true);
    try {
      const doc = new jsPDF();
      doc.text("Fleet Analytics Report", 14, 15);
      
      const tableColumn = ["Registration", "Name", "Type", "Status", "Dist (km)", "Fuel (km/L)", "Cost", "Revenue", "ROI (%)"];
      const tableRows = [];

      data?.vehicles?.forEach(vehicle => {
        const vehicleData = [
          vehicle.registrationNumber,
          vehicle.name,
          vehicle.type,
          vehicle.status,
          vehicle.metrics?.totalDistance ?? 0,
          vehicle.metrics?.fuelEfficiency ?? 0,
          vehicle.costs?.total ?? 0,
          vehicle.revenue ?? 0,
          vehicle.roi ?? 0
        ];
        tableRows.push(vehicleData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }, // blue-500
      });

      doc.save("fleet_analytics_report.pdf");
    } catch (err) {
      console.error("Export PDF failed", err);
      alert("Failed to export PDF");
    } finally {
      setExportingPDF(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Failed to load analytics data.</div>;
  }

  const { summary, monthlyRevenue, topCostliestVehicles, vehicles = [] } = data;
  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.amount), 1); // fallback to 1 to avoid /0

  const totalFuel = vehicles.reduce((sum, v) => sum + (v.costs?.fuel || 0), 0);
  const totalMaintenance = vehicles.reduce((sum, v) => sum + (v.costs?.maintenance || 0), 0);
  const totalOther = vehicles.reduce((sum, v) => sum + (v.costs?.otherExpenses || 0), 0);

  const ANALYTICS_KPIS = [
    { label: "Total Revenue", value: `₹ ${summary.totalRevenue.toLocaleString()}`, borderClass: "border-emerald-400" },
    { label: "Operational Cost", value: `₹ ${summary.totalOperationalCost.toLocaleString()}`, borderClass: "border-red-400" },
    { label: "Fleet ROI", value: `${summary.overallRoi}%`, borderClass: "border-blue-400" },
    { label: "Fleet Utilization", value: `${summary.fleetUtilization}%`, borderClass: "border-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 text-xs mt-0.5">Key performance indicators and financial insights.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-bold px-4 py-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {exportingPDF ? <RefreshCw size={14} className="animate-spin" /> : <FileText size={14} />}
            Export PDF
          </button>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold px-4 py-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 shadow-sm">
        {ANALYTICS_KPIS.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-5 flex flex-col justify-center relative"
          >
            {/* The colored accent border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.borderClass.replace('border-', 'bg-')}`} />
            
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase ml-2">
              {kpi.label}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight ml-2">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Formula Note ─────────────────────────── */}
      <div className="mt-2 text-[10px] font-medium text-slate-400">
        ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-2">

        {/* ── Left Column: Monthly Revenue Chart ─── */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Monthly Revenue</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[300px]">
            <MonthlyRevenueChart data={monthlyRevenue} />
          </div>
        </div>

        {/* ── Right Column: Top Costliest Vehicles ─ */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Top Costliest Vehicles</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[300px]">
            <VehicleCostBarChart data={topCostliestVehicles} />
          </div>
        </div>
      </div>

      {/* ── Second Row of Charts ─── */}
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        {/* ── Fleet ROI Chart ─── */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Fleet ROI vs Revenue</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[300px]">
            <FleetRoiChart vehicles={vehicles} />
          </div>
        </div>

        {/* ── Cost Breakdown Chart ─── */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Operational Cost Breakdown</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[300px]">
            <CostBreakdownChart fuel={totalFuel} maintenance={totalMaintenance} other={totalOther} />
          </div>
        </div>
      </div>

      {/* ── Third Row of Charts ─── */}
      <div className="flex flex-col lg:flex-row gap-6 mt-2 mb-6">
        {/* ── Distance by Vehicle ─── */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Top 10 Vehicles by Distance</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[300px]">
            <VehicleDistanceChart data={vehicles} />
          </div>
        </div>

        {/* ── Fuel Efficiency ─── */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Top 10 Fuel Efficient Vehicles</h2>
          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[300px]">
            <FuelEfficiencyChart data={vehicles} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
