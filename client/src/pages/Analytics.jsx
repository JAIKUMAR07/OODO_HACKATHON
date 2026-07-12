import React, { useState, useEffect } from "react";
import { Download, RefreshCw } from "lucide-react";
import { getAnalyticsSummary, exportAnalyticsCSV } from "../services/analyticsService.js";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Failed to load analytics data.</div>;
  }

  const { summary, monthlyRevenue, topCostliestVehicles } = data;
  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.amount), 1); // fallback to 1 to avoid /0

  const ANALYTICS_KPIS = [
    { label: "Total Revenue", value: `₹ ${summary.totalRevenue.toLocaleString()}`, borderClass: "border-emerald-400" },
    { label: "Operational Cost", value: `₹ ${summary.totalOperationalCost.toLocaleString()}`, borderClass: "border-red-400" },
    { label: "Fleet ROI", value: `${summary.overallRoi}%`, borderClass: "border-blue-400" },
    { label: "Fleet Utilization", value: `${summary.fleetUtilization}%`, borderClass: "border-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 text-xs mt-0.5">Key performance indicators and financial insights.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold px-4 py-2 transition-colors shadow-sm disabled:opacity-50"
        >
          {exporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
          Export CSV
        </button>
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

          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[250px] flex items-end gap-2">
            {monthlyRevenue.map((d, idx) => {
              const heightPct = (d.amount / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 pointer-events-none whitespace-nowrap z-10 font-medium rounded">
                    ₹ {d.amount.toLocaleString()}
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-400 transition-colors"
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Label */}
                  <span className="text-[9px] text-slate-400 font-medium rotate-45 md:rotate-0 mt-1">{d.month}</span> 
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Column: Top Costliest Vehicles ─ */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Top Costliest Vehicles</h2>

          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[250px] flex flex-col gap-4 overflow-y-auto">
            {topCostliestVehicles.length === 0 ? (
              <div className="text-center text-slate-400 text-sm mt-10">No cost data available.</div>
            ) : topCostliestVehicles.map((item, idx) => {
              const maxCost = topCostliestVehicles[0].cost || 1;
              const widthPct = (item.cost / maxCost) * 100;
              
              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-800">
                      ₹ {item.cost.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-red-400"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
