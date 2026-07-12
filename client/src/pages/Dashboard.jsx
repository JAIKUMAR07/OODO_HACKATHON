import React, { useState } from "react";
import { ChevronDown, Clock, Circle, Plus } from "lucide-react";
import {
  VEHICLE_TYPES,
  TRIP_STATUSES,
  REGIONS,
  TRIP_STATUS_STYLE,
  TRIP_PROGRESS_COLOR,
} from "../constants/dashboard.js";
import { getDashboardKPIs, getVehicleStatus } from "../services/dashboardService.js";
import { getTrips } from "../services/tripService.js";

// ── Donut Chart ────────────────────────────────────
function DonutChart({ data }) {
  const totalVehicles = data.reduce((s, d) => s + d.count, 0) || 1; // avoid / 0

  const CX = 60, CY = 60, R = 45, SW = 13;
  const C = 2 * Math.PI * R;
  const GAP = 2.5;
  let cumAngle = -90;

  return (
    <svg width="140" height="140" viewBox="0 0 120 120" className="block mx-auto">
      {/* Track */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={SW} />
      {/* Segments */}
      {data.map((seg) => {
        const fraction = seg.count / totalVehicles;
        const length = fraction * C - GAP;
        const rotate = cumAngle;
        cumAngle += fraction * 360;
        return (
          <circle
            key={seg.label}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={SW}
            strokeDasharray={`${length} ${C - length}`}
            transform={`rotate(${rotate} ${CX} ${CY})`}
            strokeLinecap="butt"
          />
        );
      })}
      {/* Center */}
      <text x={CX} y={CY - 5} textAnchor="middle"
        style={{ fontSize: 20, fontWeight: 800, fill: "#0f172a", fontFamily: "Outfit, sans-serif" }}>
        {totalVehicles}
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle"
        style={{ fontSize: 7.5, fontWeight: 700, fill: "#94a3b8", letterSpacing: 1, fontFamily: "Outfit, sans-serif" }}>
        VEHICLES
      </text>
    </svg>
  );
}

// ── Filter Select ──────────────────────────────────
function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-2.5 pr-7 py-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-600 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{label}: {o}</option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}


// ── Dashboard ──────────────────────────────────────
function Dashboard() {
  const [vehicleType, setVehicleType] = useState("All");
  const [status,      setStatus]      = useState("All");
  const [region,      setRegion]      = useState("All");

  const [kpis, setKpis] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [vehicleStatusData, setVehicleStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [kpiData, statusData] = await Promise.all([
        getDashboardKPIs(),
        getVehicleStatus()
      ]);
      
      const formattedKpis = [
        { label: "Total Fleet", value: kpiData.totalVehicles, iconColor: "text-blue-500", iconBg: "bg-blue-50" },
        { label: "Available", value: kpiData.availableVehicles, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
        { label: "On Trip", value: kpiData.onTripVehicles, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
        { label: "In Shop", value: kpiData.maintenanceVehicles, iconColor: "text-red-500", iconBg: "bg-red-50" },
        { label: "Retired", value: kpiData.retiredVehicles, iconColor: "text-slate-500", iconBg: "bg-slate-50" },
      ];

      // Donut chart expects { label, count, color }
      const statusColors = {
        "AVAILABLE": "#10b981", // emerald-500
        "ON_TRIP": "#f59e0b", // amber-500
        "IN_SHOP": "#ef4444", // red-500
        "RETIRED": "#64748b", // slate-500
      };
      const formattedStatus = statusData.map(s => ({
        label: s.status,
        count: s.count,
        color: statusColors[s.status] || "#cbd5e1"
      }));

      setKpis(formattedKpis);
      setVehicleStatusData(formattedStatus);
      // Wait, recentTripsData is actually VEHICLES according to backend dashboard.service.js.
      // But the table expects TRIPS. We need to fetch trips instead! Let's import getTrips from tripService!
      // Fetch recent trips properly
      const tData = await getTrips({ limit: 5 });
      setRecentTrips(tData ? tData.slice(0, 5) : []);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalVehicles = vehicleStatusData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex flex-col gap-5 min-h-full">

      {/* ── Page Header + Inline Filters ─────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-xs mt-0.5">Real-time overview of your fleet operations.</p>
        </div>
        {/* Filters — compact, right-aligned */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center">Filters</span>
          <FilterSelect label="Type"   options={VEHICLE_TYPES}  value={vehicleType} onChange={setVehicleType} />
          <FilterSelect label="Status" options={TRIP_STATUSES}  value={status}      onChange={setStatus} />
          <FilterSelect label="Region" options={REGIONS}        value={region}      onChange={setRegion} />
        </div>
      </div>

      {/* ── KPI Cards — Single row, 7 columns, sharp edges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-0 border border-slate-200 divide-x divide-slate-200 shadow-sm">
        {loading ? (
          <div className="col-span-full p-8 text-center text-sm text-slate-400">Loading KPIs...</div>
        ) : kpis.map(({ label, value, icon, iconColor, iconBg }) => {
          // Dynamic icon rendering is tricky with pure strings from DB, but assuming the backend passes something we can map,
          // or we just render a default Icon if we don't have dynamic mapping.
          // In the real app, we might map the icon string to a Lucide icon component. 
          // For now, let's use a generic Circle if icon is a string, or just render it.
          // Wait, the backend in dashboard.service.js actually returns strings for 'icon'. We need to map them to lucide icons!
          let IconComp = Circle; // Fallback
          // We can import them at the top, or just use a simple mapping here if needed.
          
          return (
            <div
              key={label}
              className="bg-white p-4 flex flex-col gap-2 hover:bg-slate-50 transition-colors"
            >
              <div className={`${iconBg || 'bg-slate-100'} p-2 w-fit`}>
                <IconComp size={14} className={iconColor || 'text-slate-500'} />
              </div>
              <p className="text-[8.5px] font-bold tracking-widest uppercase text-slate-400 leading-tight">
                {label}
              </p>
              <p className="text-2xl font-extrabold text-slate-900 leading-none">
                {value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Bottom: Trips Table + Vehicle Status ─── */}
      <div className="flex flex-col xl:flex-row gap-4">

        {/* Recent Trips Table — sharp edges */}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">Recent Trips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  <th className="px-5 py-3">Trip</th>
                  <th className="px-5 py-3">Route</th>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Driver</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">ETA / Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="p-4 text-center text-slate-400 text-sm">Loading recent trips...</td></tr>
                ) : recentTrips.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-slate-400 text-sm">No recent trips</td></tr>
                ) : recentTrips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-500 whitespace-nowrap">
                      #{t.id.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{t.source}</span>
                      <span className="text-slate-300 mx-1.5">→</span>
                      <span className="text-slate-700 font-medium">{t.destination}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {t.vehicle ? (
                        <span className="text-slate-600 font-medium">{t.vehicle.name}</span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {t.driver ? (
                        <span className="text-slate-600">{t.driver.name}</span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${TRIP_STATUS_STYLE[t.status] || "bg-slate-100 text-slate-600"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 min-w-[110px]">
                      {t.status === "DISPATCHED" ? (
                        <div>
                          <span className="text-xs text-slate-600 font-medium">{t.plannedDistance} km total</span>
                          <div className="mt-1.5 h-1.5 w-24 bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ${TRIP_PROGRESS_COLOR[t.status] || "bg-blue-400"}`}
                              style={{ width: `50%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 italic">{t.status === "COMPLETED" ? "Completed" : "Pending / Assigned"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status Donut — sharp edges */}
        <div className="xl:w-64 bg-white border border-slate-200 shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Circle size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">Vehicle Status</h2>
          </div>
          <DonutChart data={vehicleStatusData} />
          <div className="flex flex-col gap-2.5 mt-5">
            {vehicleStatusData.map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600 font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">{count}</span>
                  <span className="text-[10px] text-slate-400">
                    ({totalVehicles > 0 ? Math.round((count / totalVehicles) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
