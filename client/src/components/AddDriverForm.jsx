import React, { useState, useEffect } from "react";
import { X, Users } from "lucide-react";
import { DRIVER_STATUS_OPTIONS, DRIVER_CATEGORY_OPTIONS } from "../constants/drivers.js";

const EMPTY_FORM = {
  name:      "",
  licenseNo: "",
  category:  "LMV",
  expiry:    "",
  contact:   "",
  status:    "Available",
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

function AddDriverForm({ isOpen, onClose, onSave }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
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
    if (!form.name.trim())      errs.name      = "Name is required.";
    if (!form.licenseNo.trim()) errs.licenseNo = "License No is required.";
    if (!form.expiry.trim())    errs.expiry    = "Expiry date is required.";
    if (!form.contact.trim())   errs.contact   = "Contact is required.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // New drivers start with some default stats
    onSave({ 
      ...form, 
      id: `d${Date.now()}`,
      tripCompl: "0%",
      safetyStatus: form.status === "Suspended" ? "Suspended" : "Available",
      expired: false,
    });
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
              <Users size={15} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Add New Driver</h2>
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

            {/* Name */}
            <Field label="Driver Name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputCls}
                placeholder="e.g. Alex"
              />
              {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
            </Field>

            {/* License No */}
            <Field label="License No." required>
              <input
                type="text"
                value={form.licenseNo}
                onChange={(e) => handleChange("licenseNo", e.target.value.toUpperCase())}
                className={inputCls}
                placeholder="e.g. DL-88213"
              />
              {errors.licenseNo && <p className="text-[11px] text-red-500 font-medium">{errors.licenseNo}</p>}
            </Field>

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={`${inputCls} appearance-none pr-7 cursor-pointer`}
                  >
                    {DRIVER_CATEGORY_OPTIONS.filter(o => o !== "All").map((t) => <option key={t}>{t}</option>)}
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
                    {DRIVER_STATUS_OPTIONS.filter(o => o !== "All").map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▾</span>
                </div>
              </Field>
            </div>

            {/* Expiry + Contact */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry (MM/YYYY)" required>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={(e) => handleChange("expiry", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 12/2028"
                />
                {errors.expiry && <p className="text-[11px] text-red-500 font-medium">{errors.expiry}</p>}
              </Field>

              <Field label="Contact No." required>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. 9876500000"
                />
                {errors.contact && <p className="text-[11px] text-red-500 font-medium">{errors.contact}</p>}
              </Field>
            </div>

            {/* Rule note */}
            <p className="text-[11px] text-amber-600 font-medium border border-amber-200 bg-amber-50 px-3 py-2">
              Rule: Expired license or Suspended status {"->"} blocked from trip assignment
            </p>

          </div>

          {/* ── Footer Actions ───────────────────── */}
          <div className="mt-auto px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3 shrink-0">
            <button
              type="submit"
              className="flex-1 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white text-sm font-bold py-2.5 transition-colors"
            >
              Save Driver
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

export default AddDriverForm;
