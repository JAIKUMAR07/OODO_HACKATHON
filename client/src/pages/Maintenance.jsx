import React, { useState, useEffect } from "react";
import { MAINTENANCE_STATUS_STYLE } from "../constants/maintenance.js";
import { ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { getVehicles } from "../services/vehicleService.js";
import { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog } from "../services/maintenanceService.js";

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
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [vehicleId, setVehicleId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, lData] = await Promise.all([
        getVehicles(),
        getMaintenanceLogs()
      ]);
      setVehicles(vData);
      setLogs(lData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!vehicleId || !serviceType) return;
    setSaving(true);
    try {
      await createMaintenanceLog({
        vehicleId,
        description: serviceType,
        cost: cost ? parseFloat(cost) : 0
      });
      // Reset form
      setVehicleId("");
      setServiceType("");
      setCost("");
      // Refresh
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save log: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleCloseLog = async (id, currentCost) => {
    try {
      await closeMaintenanceLog(id, { cost: currentCost });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to close log: " + (err.response?.data?.message || err.message));
    }
  };

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
              <div className="relative">
                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={`${inputCls} appearance-none pr-7`}>
                  <option value="">Select a vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

            <Field label="Service Type">
              <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputCls} placeholder="e.g. Oil Change" />
            </Field>

            <Field label="Cost">
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={inputCls} placeholder="e.g. 2500" />
            </Field>

            <button 
              onClick={handleSave}
              disabled={saving || !vehicleId || !serviceType}
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
            >
              {saving && <RefreshCw size={14} className="animate-spin" />}
              {saving ? "Saving..." : "Save Log"}
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
                  {loading ? (
                    <tr><td colSpan={4} className="p-4 text-center text-slate-400 text-sm">Loading logs...</td></tr>
                  ) : logs.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-slate-400 text-sm">No maintenance logs found</td></tr>
                  ) : logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{log.vehicle?.name || "Unknown"}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {log.description}
                        <div className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-right">₹{log.cost}</td>
                      <td className="px-5 py-3.5 pl-8">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${MAINTENANCE_STATUS_STYLE[log.status] || "bg-slate-100 text-slate-600"}`}>
                            {log.status}
                          </span>
                          {log.status === "ACTIVE" && (
                            <button 
                              onClick={() => handleCloseLog(log.id, log.cost)}
                              title="Mark as Closed"
                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
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
