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
  { id: "Draft", label: "Draft", color: "bg-emerald-500" },
  { id: "Dispatched", label: "Dispatched", color: "bg-blue-500" },
  { id: "Completed", label: "Completed", color: "bg-slate-300" },
  { id: "Cancelled", label: "Cancelled", color: "bg-slate-300" },
];

export const TRIP_STATUS_STYLE = {
  "Draft": "bg-slate-400 text-white",
  "Dispatched": "bg-blue-500 text-white",
  "Completed": "bg-emerald-500 text-white",
  "Cancelled": "bg-red-500 text-white",
};
