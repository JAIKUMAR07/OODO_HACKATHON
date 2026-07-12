import React, { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, Circle } from "lucide-react";

// ── Filter Options ────────────────────────────────────
const vehicleTypes = ["All", "Van", "Truck", "Mini-Bus"];
const statuses     = ["All", "Available", "On Trip", "In Shop", "Retired"];
const regions      = ["All", "Mumbai", "Pune", "Nashik", "Nagpur"];

// ── Stat Cards ────────────────────────────────────────
const stats = [
  { label: "ACTIVE VEHICLES",       value: "53", accent: false },
  { label: "AVAILABLE VEHICLES",    value: "42", accent: false },
  { label: "VEHICLES IN MAINTENANCE", value: "05", accent: true  },
  { label: "ACTIVE TRIPS",          value: "18", accent: false },
  { label: "PENDING TRIPS",         value: "09", accent: false },
  { label: "DRIVERS ON DUTY",       value: "26", accent: false },
  { label: "FLEET UTILIZATION",     value: "81%", accent: false },
];

// ── Recent Trips ──────────────────────────────────────
const trips = [
  { id: "TR001", vehicle: "VAN-05", driver: "Alex",  status: "On Trip",   eta: "45 min" },
  { id: "TR002", vehicle: "TRK-12", driver: "John",  status: "Completed", eta: "—" },
  { id: "TR003", vehicle: "MINI-08", driver: "Priya", status: "Dispatched", eta: "In 10m" },
  { id: "TR004", vehicle: "—",      driver: "—",     status: "Draft",     eta: "Awaiting vehicle" },
];

const statusStyle = {
  "On Trip":    "bg-blue-500 text-white",
  "Completed":  "bg-emerald-500 text-white",
  "Dispatched": "bg-sky-500 text-white",
  "Draft":      "bg-slate-400 text-white",
};

// ── Vehicle Status Bars ───────────────────────────────
const vehicleStatus = [
  { label: "Available", pct: 72, color: "bg-emerald-500" },
  { label: "On Trip",   pct: 34, color: "bg-blue-500" },
  { label: "In Shop",   pct: 10, color: "bg-amber-500" },
  { label: "Retired",   pct: 5,  color: "bg-red-500" },
];

// ── Shared Filter Select ──────────────────────────────
function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-all cursor-pointer shadow-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>{label}: {o}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────
function Dashboard() {
  const [vehicleType, setVehicleType] = useState("All");
  const [status,      setStatus]      = useState("All");
  const [region,      setRegion]      = useState("All");

  return (
    <div className="flex flex-col gap-5 min-h-full">

      {/* ── Filters Row ──────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5">
        <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Filters</p>
        <div className="flex flex-wrap gap-2">
          <FilterSelect label="Vehicle Type" options={vehicleTypes} value={vehicleType} onChange={setVehicleType} />
          <FilterSelect label="Status"       options={statuses}     value={status}      onChange={setStatus} />
          <FilterSelect label="Region"       options={regions}      value={region}      onChange={setRegion} />
        </div>
      </div>

      {/* ── Stat Cards Row ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
        {stats.map(({ label, value, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-4 shadow-sm flex flex-col gap-1 ${
              accent
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-slate-100"
            }`}
          >
            <p className={`text-[9px] font-bold tracking-widest uppercase leading-tight ${accent ? "text-amber-600" : "text-slate-400"}`}>
              {label}
            </p>
            <p className={`text-3xl font-extrabold leading-none mt-1 ${accent ? "text-amber-600" : "text-slate-900"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom Row: Trips + Vehicle Status ───── */}
      <div className="flex gap-5 flex-col xl:flex-row">

        {/* Recent Trips Table */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Recent Trips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  <th className="px-5 py-3">Trip</th>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Driver</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-500">{t.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{t.vehicle}</td>
                    <td className="px-5 py-3.5 text-slate-600">{t.driver}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold ${statusStyle[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{t.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status Panel */}
        <div className="xl:w-72 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <Circle size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Vehicle Status</h2>
          </div>
          <div className="flex flex-col gap-4">
            {vehicleStatus.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                  <span className="text-xs font-bold text-slate-400">{pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
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

export default Dashboard;
