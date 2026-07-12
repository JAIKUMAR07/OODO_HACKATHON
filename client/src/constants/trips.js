// ── Mock Data for Trip Dispatcher ──────────────────

export const AVAILABLE_VEHICLES = [
  { id: "v1", name: "VAN-05", capacityKg: 500 },
  { id: "v2", name: "TRUCK-11", capacityKg: 5000 },
];

export const AVAILABLE_DRIVERS = [
  { id: "d1", name: "Alex" },
  { id: "d2", name: "Priya" },
];

export const LIVE_TRIPS = [
  {
    id: "TR001",
    source: "Gandhinagar Depot",
    destination: "Ahmedabad Hub",
    vehicle: "VAN-05",
    driver: "Alex",
    status: "Dispatched",
    eta: "45 min",
  },
  {
    id: "TR004",
    source: "Vatva Industrial Area",
    destination: "Sanand Warehouse",
    vehicle: "TRUCK-04",
    driver: "Suresh",
    status: "Draft",
    eta: "Awaiting dispatch",
  },
  {
    id: "TR006",
    source: "Mansa",
    destination: "Kalol Depot",
    vehicle: "Unassigned",
    driver: "Unassigned",
    status: "Cancelled",
    eta: "Vehicle went to shop",
  },
];

export const TRIP_LIFECYCLE_STEPS = [
  { id: "DRAFT", label: "Draft", color: "bg-emerald-500" },
  { id: "ASSIGNED", label: "Assigned", color: "bg-violet-500" },
  { id: "DISPATCHED", label: "Dispatched", color: "bg-blue-500" },
  { id: "COMPLETED", label: "Completed", color: "bg-slate-400" },
  { id: "CANCELLED", label: "Cancelled", color: "bg-red-400" },
];

export const TRIP_STATUS_STYLE = {
  DRAFT: "bg-slate-400 text-white",
  ASSIGNED: "bg-violet-500 text-white",
  DISPATCHED: "bg-blue-500 text-white",
  COMPLETED: "bg-emerald-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

export const TRIP_PROGRESS_COLOR = {
  DISPATCHED: "bg-blue-400",
  COMPLETED: "bg-emerald-400",
  ASSIGNED: "bg-violet-400",
  DRAFT: "bg-slate-300",
};
