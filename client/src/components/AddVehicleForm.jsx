import React, { useState, useEffect } from "react";
import { X, Truck } from "lucide-react";

const EMPTY_FORM = {
  regNo:    "",
  name:     "",
  type:     "Van",
  capacity: "",
  odometer: "",
  acqCost:  "",
  status:   "Available",
};

const TYPE_OPTIONS   = ["Van", "Truck", "Mini"];
const STATUS_OPTIONS = ["Available", "On Trip", "In Shop", "Retired"];

// ── Reusable field wrapper ─────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
        {label}
        {required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors";

// ── AddVehicleForm ─────────────────────────────────
function AddVehicleForm({ isOpen, onClose, onSave }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Reset form whenever the drawer opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.regNo.trim())    errs.regNo    = "Registration No. is required.";
    if (!form.name.trim())     errs.name     = "Name / Model is required.";
    if (!form.capacity.trim()) errs.capacity = "Capacity is required.";
    if (!form.odometer.trim()) errs.odometer = "Odometer reading is required.";
    if (!form.acqCost.trim())  errs.acqCost  = "Acquisition cost is required.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({ ...form, id: `v${Date.now()}` });
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ──────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400 p-1.5">
              <Truck size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Add New Vehicle</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">All fields marked * are required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Form Body ───────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 py-5">

            {/* Registration No. */}
            <Field label="Registration No." required>
              <input
                type="text"
                value={form.regNo}
                onChange={(e) => handleChange("regNo", e.target.value.toUpperCase())}
                className={inputCls}
                placeholder="e.g. GJ01AB452"
                maxLength={12}
              />
              {errors.regNo && <p className="text-[11px] text-red-500 font-medium">{errors.regNo}</p>}
            </Field>

            {/* Name / Model */}
            <Field label="Name / Model" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputCls}
                placeholder="e.g. VAN-05"
              />
              {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
            </Field>

            {/* Type + Status (side-by-side) */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vehicle Type" required>
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className={`${inputCls} appearance-none pr-7 cursor-pointer`}
                  >
                    {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
                </div>
              </Field>

              <Field label="Status" required>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={`${inputCls} appearance-none pr-7 cursor-pointer`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
                </div>
              </Field>
            </div>

            {/* Capacity */}
            <Field label="Capacity" required>
              <input
                type="text"
                value={form.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className={inputCls}
                placeholder="e.g. 500 kg or 5 Ton"
              />
              {errors.capacity && <p className="text-[11px] text-red-500 font-medium">{errors.capacity}</p>}
            </Field>

            {/* Odometer + Acq. Cost (side-by-side) */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Odometer (km)" required>
                <input
                  type="number"
                  min={0}
                  value={form.odometer}
                  onChange={(e) => handleChange("odometer", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 74000"
                />
                {errors.odometer && <p className="text-[11px] text-red-500 font-medium">{errors.odometer}</p>}
              </Field>

              <Field label="Acq. Cost (₹)" required>
                <input
                  type="number"
                  min={0}
                  value={form.acqCost}
                  onChange={(e) => handleChange("acqCost", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 620000"
                />
                {errors.acqCost && <p className="text-[11px] text-red-500 font-medium">{errors.acqCost}</p>}
              </Field>
            </div>

            {/* Rule note */}
            <p className="text-[11px] text-amber-600 font-medium border border-amber-200 bg-amber-50 px-3 py-2">
              Registration No. must be unique across the fleet.
            </p>

          </div>

          {/* ── Footer Actions ───────────────────── */}
          <div className="mt-auto px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3 shrink-0">
            <button
              type="submit"
              className="flex-1 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold py-2.5 transition-colors"
            >
              Save Vehicle
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold py-2.5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

export default AddVehicleForm;
