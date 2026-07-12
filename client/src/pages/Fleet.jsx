import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, Plus, Truck, AlertCircle } from "lucide-react";
import {
  FLEET_TYPE_OPTIONS,
  FLEET_STATUS_OPTIONS,
  FLEET_STATS,
  VEHICLE_STATUS_STYLE,
} from "../constants/fleet.js";
import AddVehicleForm from "../components/AddVehicleForm.jsx";
import { getVehicles, createVehicle } from "../services/vehicleService.js";

// ── Filter Select (same as Dashboard) ─────────────
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

// ── Fleet Page ─────────────────────────────────────
function Fleet() {
  const [vehicles,     setVehicles]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [drawerOpen,   setDrawerOpen]   = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await getVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  async function handleAddVehicle(newVehicle) {
    try {
      // Map UI form fields to Prisma schema fields
      const payload = {
        registrationNumber: newVehicle.regNo,
        name: newVehicle.name,
        type: newVehicle.type,
        maxLoadCapacity: parseFloat(newVehicle.capacity) || 0,
        odometer: parseFloat(newVehicle.odometer) || 0,
        acquisitionCost: parseFloat(newVehicle.acqCost) || 0,
      };
      
      const createdVehicle = await createVehicle(payload);
      setVehicles((prev) => [createdVehicle, ...prev]);
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      alert("Error adding vehicle: " + (err.response?.data?.message || err.message));
    }
  }

  // Compute fleet stats dynamically
  const fleetStats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter(v => v.status === "AVAILABLE").length;
    const onTrip = vehicles.filter(v => v.status === "ON_TRIP").length;
    const inShop = vehicles.filter(v => v.status === "IN_SHOP").length;
    const retired = vehicles.filter(v => v.status === "RETIRED").length;
    return [
      { label: "Total Fleet", value: total },
      { label: "Available", value: available },
      { label: "On Trip", value: onTrip },
      { label: "In Shop", value: inShop },
      { label: "Retired", value: retired },
    ];
  }, [vehicles]);

  // Derived: filtered rows
  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      // Prisma uses UPPERCASE for enums usually, but let's compare case-insensitively
      const matchType   = typeFilter   === "All" || v.type?.toLowerCase() === typeFilter.toLowerCase();
      const matchStatus = statusFilter === "All" || v.status?.replace("_", " ")?.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch = v.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [vehicles, typeFilter, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-5 min-h-full">

      {/* ── Page Header ──────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Fleet</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage and monitor all registered vehicles.</p>
        </div>
      </div>

      {/* ── KPI Stats Row ─────────────────────────── */}
      <div className="grid grid-cols-5 gap-0 border border-slate-200 divide-x divide-slate-200 shadow-sm">
        {fleetStats.map(({ label, value }) => (
          <div key={label} className="bg-white p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <div className="bg-slate-100 p-2">
              <Truck size={14} className="text-slate-500" />
            </div>
            <div>
              <p className="text-[8.5px] font-bold tracking-widest uppercase text-slate-400 leading-tight">{label}</p>
              <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
            </div>
          </div>
        ))}
      </div>


      {/* ── Filter Bar + Add Button ───────────────── */}
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterSelect label="Type"   options={FLEET_TYPE_OPTIONS}   value={typeFilter}   onChange={setTypeFilter} />
          <FilterSelect label="Status" options={FLEET_STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />

          {/* Reg. No. Search */}
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reg. no. or name..."
              className="pl-7 pr-3 py-1.5 border border-slate-200 bg-white text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-all w-52"
            />
          </div>
        </div>

        {/* Add Vehicle CTA */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-xs font-bold px-4 py-2 transition-colors shadow-sm">
          <Plus size={13} />
          Add Vehicle
        </button>
      </div>

      {/* ── Add Vehicle Drawer ────────────────────── */}
      <AddVehicleForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleAddVehicle}
      />

      {/* ── Vehicle Table ─────────────────────────── */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200">
                <th className="px-5 py-3">Reg. No. (Unique)</th>
                <th className="px-5 py-3">Name / Model</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Odometer (km)</th>
                <th className="px-5 py-3">Acq. Cost (₹)</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    Loading vehicles...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-red-500">
                    <AlertCircle className="inline-block mr-2" size={16} />
                    {error}
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-600">{v.registrationNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{v.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 capitalize">{v.type?.toLowerCase()}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.maxLoadCapacity}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.odometer}</td>
                    <td className="px-5 py-3.5 text-slate-600">{v.acquisitionCost}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${
                        v.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                        v.status === "ON_TRIP" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                        v.status === "IN_SHOP" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                        "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        {v.status?.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    No vehicles match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer Rule Note ─────────────────────── */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-[11px] text-amber-600 font-medium">
            Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
          </p>
        </div>
      </div>

    </div>
  );
}

export default Fleet;
