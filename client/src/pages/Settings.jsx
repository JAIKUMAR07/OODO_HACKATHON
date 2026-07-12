import React, { useState } from "react";
import { RBAC_ROLES } from "../constants/settings.js";

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

function Settings() {
  const [depotName, setDepotName] = useState("Gandhinagar Depot GJ4");
  const [currency, setCurrency] = useState("INR (Rs)");
  const [distanceUnit, setDistanceUnit] = useState("Kilometers");

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Settings & RBAC</h1>
        <p className="text-slate-500 text-xs mt-0.5">Configure system preferences and manage access controls.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ── Left Column: General Form ──────────── */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-5">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">General</h2>
          
          <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col gap-5">
            <Field label="Depot Name">
              <input type="text" value={depotName} onChange={(e) => setDepotName(e.target.value)} className={inputCls} />
            </Field>

            <Field label="Currency">
              <div className="relative">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`${inputCls} appearance-none pr-7 cursor-pointer`}>
                  <option>INR (Rs)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

            <Field label="Distance Unit">
              <div className="relative">
                <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} className={`${inputCls} appearance-none pr-7 cursor-pointer`}>
                  <option>Kilometers</option>
                  <option>Miles</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

            <button className="w-full py-2.5 mt-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold transition-colors">
              Save changes
            </button>
          </div>
        </div>

        {/* ── Right Column: RBAC Table ───────────── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Role-Based Access (RBAC)</h2>
          
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200">
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Fleet</th>
                    <th className="px-5 py-3">Drivers</th>
                    <th className="px-5 py-3">Trips</th>
                    <th className="px-5 py-3">Fuel/Exp.</th>
                    <th className="px-5 py-3">Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RBAC_ROLES.map((row) => (
                    <tr key={row.role} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{row.role}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-500">{row.fleet}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-500">{row.drivers}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-500">{row.trips}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-500">{row.fuelExp}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-500">{row.analytics}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-auto px-5 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-[11px] text-slate-500 font-medium">
                Permissions are managed at the system level. Contact admin for custom role creation.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;
