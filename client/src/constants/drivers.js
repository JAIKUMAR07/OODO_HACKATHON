// ── Filter Options ────────────────────────────────
export const DRIVER_STATUS_OPTIONS   = ["All", "Available", "On Trip", "Off Duty", "Suspended"];
export const DRIVER_CATEGORY_OPTIONS = ["All", "LMV", "HMV"];

// ── Driver KPI Summary ─────────────────────────────
export const DRIVER_STATS = [
  { label: "TOTAL DRIVERS",  value: "4"  },
  { label: "AVAILABLE",      value: "2"  },
  { label: "ON TRIP",        value: "1"  },
  { label: "OFF DUTY",       value: "1"  },
  { label: "SUSPENDED",      value: "1"  },
];

// ── Driver Records ─────────────────────────────────
export const DRIVERS = [
  {
    id: "d1",
    name:        "Alex",
    licenseNo:   "DL-88213",
    category:    "LMV",
    expiry:      "12/2028",
    expired:     false,
    contact:     "98765xxxxx",
    tripCompl:   "96%",
    safetyStatus: "Available",
    status:      "Available",
  },
  {
    id: "d2",
    name:        "John",
    licenseNo:   "DL-44120",
    category:    "HMV",
    expiry:      "03/2025",
    expired:     true,
    contact:     "98220xxxxx",
    tripCompl:   "81%",
    safetyStatus: "Suspended",
    status:      "Suspended",
  },
  {
    id: "d3",
    name:        "Priya",
    licenseNo:   "DL-77031",
    category:    "LMV",
    expiry:      "08/2027",
    expired:     false,
    contact:     "99110xxxxx",
    tripCompl:   "99%",
    safetyStatus: "Available",
    status:      "On Trip",
  },
  {
    id: "d4",
    name:        "Suresh",
    licenseNo:   "DL-90045",
    category:    "HMV",
    expiry:      "01/2027",
    expired:     false,
    contact:     "97440xxxxx",
    tripCompl:   "88%",
    safetyStatus: "Available",
    status:      "Off Duty",
  },
];

// ── Status Badge Styles ────────────────────────────
export const DRIVER_STATUS_STYLE = {
  "Available":  "bg-emerald-500 text-white",
  "On Trip":    "bg-blue-500   text-white",
  "Off Duty":   "bg-slate-400  text-white",
  "Suspended":  "bg-orange-500 text-white",
};

// ── Safety Status Badge Styles ─────────────────────
export const SAFETY_STATUS_STYLE = {
  "Available": "bg-emerald-500 text-white",
  "Suspended": "bg-orange-500 text-white",
};
