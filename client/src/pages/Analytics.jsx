import React from "react";
import {
  ANALYTICS_KPIS,
  MONTHLY_REVENUE_DATA,
  COSTLIEST_VEHICLES
} from "../constants/analytics.js";

function Analytics() {
  const maxRevenue = Math.max(...MONTHLY_REVENUE_DATA.map(d => d.value));

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500 text-xs mt-0.5">Key performance indicators and financial insights.</p>
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
            {MONTHLY_REVENUE_DATA.map((data, idx) => {
              const heightPct = (data.value / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 pointer-events-none whitespace-nowrap z-10 font-medium">
                    {data.value}k
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-400 transition-colors"
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Label (Optional: uncomment if needed)
                  <span className="text-[10px] text-slate-400 font-medium">{data.month}</span> 
                  */}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Column: Top Costliest Vehicles ─ */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Top Costliest Vehicles</h2>

          <div className="bg-white border border-slate-200 shadow-sm p-6 h-[250px] flex flex-col gap-6 justify-center">
            {COSTLIEST_VEHICLES.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-20 text-[10px] font-bold tracking-wider text-slate-600 uppercase shrink-0">
                  {item.vehicle}
                </span>

                <div className="flex-1 h-3 bg-slate-100 relative overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 bottom-0 ${item.colorClass}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
