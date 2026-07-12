import React, { useState } from "react";
import {
  SERVICE_LOGS,
  MAINTENANCE_STATUS_STYLE
} from "../constants/maintenance.js";
import { ArrowRight } from "lucide-react";

// ── Reusable Field Wrapper ──────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors";

function Maintenance() {
  const [vehicle, setVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Active");

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Maintenance</h1>
        <p className="text-slate-500 text-xs mt-0.5">Track fleet repairs and service history.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left Column: Form ──────────────────── */}
        <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-5">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Log Service Record</h2>

          <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
            <Field label="Vehicle">
              <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputCls} placeholder="e.g. VAN-05" />
            </Field>

            <Field label="Service Type">
              <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputCls} placeholder="e.g. Oil Change" />
            </Field>

            <Field label="Cost">
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={inputCls} placeholder="e.g. 2500" />
            </Field>

            <Field label="Date">
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} placeholder="DD/MM/YYYY" />
            </Field>

            <Field label="Status">
              <div className="relative">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls} appearance-none pr-7`}>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

            <button className="w-full py-2.5 mt-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold transition-colors">
              Save
            </button>

          </div>
        </div>

        {/* ── Right Column: Service Log Table ────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Service Log</h2>

          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200">
                    <th className="px-5 py-3">Vehicle</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3 text-right">Cost</th>
                    <th className="px-5 py-3 pl-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SERVICE_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{log.vehicle}</td>
                      <td className="px-5 py-3.5 text-slate-600">{log.service}</td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-right">{log.cost}</td>
                      <td className="px-5 py-3.5 pl-8">
                        <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${MAINTENANCE_STATUS_STYLE[log.status]}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Maintenance;
