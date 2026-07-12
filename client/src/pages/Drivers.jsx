import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Plus, Users } from "lucide-react";
import {
  DRIVER_CATEGORY_OPTIONS,
  DRIVER_STATUS_OPTIONS,
  DRIVER_STATS,
  DRIVERS,
  DRIVER_STATUS_STYLE,
  SAFETY_STATUS_STYLE,
} from "../constants/drivers.js";
import AddDriverForm from "../components/AddDriverForm.jsx";

// ── Filter Select (same as Dashboard/Fleet) ─────────────
function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-2.5 pr-7 py-1.5 border border-slate-200 bg-white text-xs font-medium text-slate-600 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{label}: {o}</option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── Drivers Page ─────────────────────────────────────
function Drivers() {
  const [drivers,        setDrivers]        = useState(DRIVERS);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter,   setStatusFilter]   = useState("All");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [drawerOpen,     setDrawerOpen]     = useState(false);

  function handleAddDriver(newDriver) {
    setDrivers((prev) => [...prev, newDriver]);
  }

  // Derived: filtered rows
  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const matchCategory = categoryFilter === "All" || d.category === categoryFilter;
      const matchStatus   = statusFilter   === "All" || d.status   === statusFilter;
      const matchSearch   = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.licenseNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });
  }, [drivers, categoryFilter, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-5 min-h-full">

      {/* ── Page Header ──────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Drivers</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage driver profiles and compliance.</p>
        </div>
      </div>

      {/* ── KPI Stats Row ─────────────────────────── */}
      <div className="grid grid-cols-5 gap-0 border border-slate-200 divide-x divide-slate-200 shadow-sm">
        {DRIVER_STATS.map(({ label, value }) => (
          <div key={label} className="bg-white p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <div className="bg-slate-100 p-2">
              <Users size={14} className="text-slate-500" />
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
          <FilterSelect label="Category" options={DRIVER_CATEGORY_OPTIONS} value={categoryFilter} onChange={setCategoryFilter} />
          <FilterSelect label="Status"   options={DRIVER_STATUS_OPTIONS}   value={statusFilter}   onChange={setStatusFilter} />

          {/* Search */}
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or license..."
              className="pl-7 pr-3 py-1.5 border border-slate-200 bg-white text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-all w-52"
            />
          </div>
        </div>

        {/* Add Driver CTA */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-xs font-bold px-4 py-2 transition-colors shadow-sm">
          <Plus size={13} />
          Add Driver
        </button>
      </div>

      {/* ── Add Driver Drawer ────────────────────── */}
      <AddDriverForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleAddDriver}
      />

      {/* ── Drivers Table ─────────────────────────── */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-200">
                <th className="px-5 py-3">Driver</th>
                <th className="px-5 py-3">License No</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Expiry</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Trip Compl.</th>
                <th className="px-5 py-3">Safety</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{d.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-600">{d.licenseNo}</td>
                    <td className="px-5 py-3.5 text-slate-600">{d.category}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {d.expiry} 
                      {d.expired && <span className="ml-1 text-[10px] text-red-500 font-bold uppercase">Expired</span>}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{d.contact}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{d.tripCompl}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${SAFETY_STATUS_STYLE[d.safetyStatus] || "bg-slate-400 text-white"}`}>
                        {d.safetyStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold whitespace-nowrap ${DRIVER_STATUS_STYLE[d.status] || "bg-slate-400 text-white"}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-400">
                    No drivers match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer Rule Note ─────────────────────── */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-[11px] text-amber-600 font-medium">
            Rule: Expired license or Suspended status {"->"} blocked from trip assignment
          </p>
        </div>
      </div>

    </div>
  );
}

export default Drivers;
