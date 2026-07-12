import React, { useState, useEffect } from "react";
import { X, Receipt } from "lucide-react";

const EMPTY_FORM = {
  trip: "",
  vehicle: "",
  toll: "",
  other: "",
  maint: "0",
  status: "Completed",
};

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

function AddExpenseForm({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

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
    if (!form.trip.trim()) errs.trip = "Trip is required.";
    if (!form.vehicle.trim()) errs.vehicle = "Vehicle is required.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      id: `e${Date.now()}`,
      toll: form.toll || "0",
      other: form.other || "0",
      maint: form.maint || "0",
    });
    onClose();
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-400 p-1.5">
              <Receipt size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Add Expense</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">All fields marked * are required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Trip ID" required>
                <input
                  type="text"
                  value={form.trip}
                  onChange={(e) => handleChange("trip", e.target.value.toUpperCase())}
                  className={inputCls}
                  placeholder="e.g. TR005"
                />
                {errors.trip && <p className="text-[11px] text-red-500 font-medium">{errors.trip}</p>}
              </Field>

              <Field label="Vehicle" required>
                <input
                  type="text"
                  value={form.vehicle}
                  onChange={(e) => handleChange("vehicle", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. VAN-05"
                />
                {errors.vehicle && <p className="text-[11px] text-red-500 font-medium">{errors.vehicle}</p>}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Toll (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.toll}
                  onChange={(e) => handleChange("toll", e.target.value)}
                  className={inputCls}
                  placeholder="0"
                />
              </Field>

              <Field label="Other Misc (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.other}
                  onChange={(e) => handleChange("other", e.target.value)}
                  className={inputCls}
                  placeholder="0"
                />
              </Field>
            </div>

            <Field label="Maintenance Linked (₹)">
              <input
                type="number"
                min="0"
                value={form.maint}
                onChange={(e) => handleChange("maint", e.target.value)}
                className={inputCls}
                placeholder="0"
              />
            </Field>
            
            <Field label="Status" required>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className={`${inputCls} appearance-none pr-7 cursor-pointer`}
                >
                  <option>Available</option>
                  <option>Completed</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
              </div>
            </Field>

          </div>

          <div className="mt-auto px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3 shrink-0">
            <button
              type="submit"
              className="flex-1 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold py-2.5 transition-colors"
            >
              Save Expense
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

export default AddExpenseForm;
