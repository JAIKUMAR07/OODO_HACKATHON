import { Truck, Wrench, Route, Clock, Users, BarChart3 } from "lucide-react";

// ── Filter Options ────────────────────────────────
export const VEHICLE_TYPES = ["All", "Van", "Truck", "Mini-Bus"];
export const TRIP_STATUSES  = ["All", "Available", "On Trip", "In Shop", "Retired"];
export const REGIONS        = ["All", "Mumbai", "Pune", "Nashik", "Nagpur"];

// ── KPI Stat Cards ────────────────────────────────
export const DASHBOARD_STATS = [
  {
    label: "ACTIVE VEHICLES", value: "53",
    icon: Truck, iconColor: "text-slate-500", iconBg: "bg-slate-100",
    accent: false,
  },
  {
    label: "AVAILABLE VEHICLES", value: "42",
    icon: Truck, iconColor: "text-emerald-600", iconBg: "bg-emerald-50",
    accent: false,
  },
  {
    label: "IN MAINTENANCE", value: "5",
    icon: Wrench, iconColor: "text-amber-600", iconBg: "bg-amber-50",
    accent: false,
  },
  {
    label: "ACTIVE TRIPS", value: "18",
    icon: Route, iconColor: "text-blue-600", iconBg: "bg-blue-50",
    accent: false,
  },
  {
    label: "PENDING TRIPS", value: "9",
    icon: Clock, iconColor: "text-violet-600", iconBg: "bg-violet-50",
    accent: false,
  },
  {
    label: "DRIVERS ON DUTY", value: "26",
    icon: Users, iconColor: "text-indigo-600", iconBg: "bg-indigo-50",
    accent: false,
  },
  {
    label: "FLEET UTILIZATION", value: "81%",
    icon: BarChart3, iconColor: "text-teal-600", iconBg: "bg-teal-50",
    accent: false,
  },
];

// ── Recent Trips ───────────────────────────────────
export const RECENT_TRIPS = [
  { id: "TR001", vehicle: "VAN-05",  driver: "Alex",  source: "Mumbai", dest: "Pune",   status: "On Trip",    progress: 60,  eta: "45 min" },
  { id: "TR002", vehicle: "TRK-12",  driver: "John",  source: "Pune",   dest: "Nashik", status: "Completed",  progress: 100, eta: "Done" },
  { id: "TR003", vehicle: "MINI-08", driver: "Priya", source: "Nashik", dest: "Nagpur", status: "Dispatched", progress: 15,  eta: "In 10m" },
  { id: "TR004", vehicle: null,      driver: null,    source: "Nagpur", dest: "Mumbai", status: "Draft",      progress: 0,   eta: null },
];

// ── Trip Status Styles ─────────────────────────────
export const TRIP_STATUS_STYLE = {
  "On Trip":    "bg-blue-500 text-white",
  "Completed":  "bg-emerald-500 text-white",
  "Dispatched": "bg-sky-500 text-white",
  "Draft":      "bg-slate-300 text-slate-700",
};

export const TRIP_PROGRESS_COLOR = {
  "On Trip":    "bg-blue-400",
  "Completed":  "bg-emerald-400",
  "Dispatched": "bg-sky-400",
  "Draft":      "bg-slate-200",
};

// ── Vehicle Status (Donut Chart) ───────────────────
export const VEHICLE_STATUS_DATA = [
  { label: "Available", count: 38, color: "#10b981" },
  { label: "On Trip",   count: 10, color: "#3b82f6" },
  { label: "In Shop",   count: 5,  color: "#f59e0b" },
  { label: "Retired",   count: 5,  color: "#ef4444" },
];
