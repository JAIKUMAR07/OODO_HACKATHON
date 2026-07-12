import React, { useState } from "react";
import { 
  AVAILABLE_VEHICLES, 
  AVAILABLE_DRIVERS, 
  LIVE_TRIPS, 
  TRIP_LIFECYCLE_STEPS, 
  TRIP_STATUS_STYLE 
} from "../constants/trips.js";
import { X, Check } from "lucide-react";

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

function Trips() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [distance, setDistance] = useState("");

  const selectedVehicle = AVAILABLE_VEHICLES.find(v => v.id === vehicleId);
  const weight = parseFloat(cargoWeight) || 0;
  
  let capacityError = null;
  if (selectedVehicle && weight > selectedVehicle.capacityKg) {
    capacityError = {
      capacity: selectedVehicle.capacityKg,
      weight: weight,
      exceededBy: weight - selectedVehicle.capacityKg
    };
  }

  const isFormValid = source && destination && vehicleId && driverId && cargoWeight && distance && !capacityError;

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* ── Page Header ──────────────────────────── */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Trip Dispatcher</h1>
        <p className="text-slate-500 text-xs mt-0.5">Create new trips and monitor active assignments.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ── Left Column: Create Trip Form ──────── */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-5">
          <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Create Trip</h2>
          
          <div className="bg-white border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
            <Field label="Source">
              <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className={inputCls} placeholder="e.g. Gandhinagar Depot" />
            </Field>

            <Field label="Destination">
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className={inputCls} placeholder="e.g. Ahmedabad Hub" />
            </Field>

            <Field label="Vehicle (Available Only)">
              <div className="relative">
                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={`${inputCls} appearance-none pr-7`}>
                  <option value="">Select a vehicle...</option>
                  {AVAILABLE_VEHICLES.map(v => (
                    <option key={v.id} value={v.id}>{v.name} - {v.capacityKg} kg capacity</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

            <Field label="Driver (Available Only)">
              <div className="relative">
                <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className={`${inputCls} appearance-none pr-7`}>
                  <option value="">Select a driver...</option>
                  {AVAILABLE_DRIVERS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

            <Field label="Cargo Weight (KG)">
              <input type="number" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} className={inputCls} placeholder="e.g. 700" />
            </Field>

            <Field label="Planned Distance (KM)">
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className={inputCls} placeholder="e.g. 38" />
            </Field>

            {/* Error Block */}
            {capacityError && (
              <div className="border border-red-300 bg-red-50 p-3 mt-1">
                <p className="text-[11px] text-red-600 font-medium">Vehicle Capacity: {capacityError.capacity} kg</p>
                <p className="text-[11px] text-red-600 font-medium">Cargo Weight: {capacityError.weight} kg</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-red-700 font-bold">
                  <X size={12} strokeWidth={3} />
                  <p>Capacity exceeded by {capacityError.exceededBy} kg — dispatch blocked</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-2">
              <button 
                disabled={!isFormValid}
                className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
                  isFormValid 
                    ? "bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                Dispatch {isFormValid ? "" : "(disabled)"}
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Lifecycle & Live Board ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          
          {/* Lifecycle Bar */}
          <div>
            <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-4">Trip Lifecycle</h2>
            <div className="bg-white border border-slate-200 p-6 shadow-sm flex items-center justify-between relative">
              {/* Connecting Line */}
              <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
              
              {TRIP_LIFECYCLE_STEPS.map((step, idx) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${step.color} shadow-sm border-2 border-white`} />
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${idx < 2 ? step.color.replace('bg-', 'text-') : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Board */}
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-3">Live Board</h2>
            
            <div className="flex flex-col gap-3">
              {LIVE_TRIPS.map((trip) => (
                <div key={trip.id} className="bg-white border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{trip.id}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs font-medium text-slate-600">{trip.vehicle} / {trip.driver.toUpperCase()}</span>
                    </div>
                    <div className="text-sm text-slate-800 font-medium">
                      {trip.source} <span className="text-slate-400 mx-1">→</span> {trip.destination}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 md:gap-1.5 shrink-0">
                    <span className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${TRIP_STATUS_STYLE[trip.status]}`}>
                      {trip.status}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {trip.eta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">
                On Complete: odometer → fuel log → expenses → Vehicle & Driver Available
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Trips;
