// ── Filter Options ────────────────────────────────
export const FLEET_TYPE_OPTIONS   = ["All", "Van", "Truck", "Mini"];
export const FLEET_STATUS_OPTIONS = ["All", "Available", "On Trip", "In Shop", "Retired"];

// ── Fleet KPI Summary ─────────────────────────────
export const FLEET_STATS = [
  { label: "TOTAL FLEET",  value: "4"  },
  { label: "AVAILABLE",    value: "1"  },
  { label: "ON TRIP",      value: "1"  },
  { label: "IN SHOP",      value: "1"  },
  { label: "RETIRED",      value: "1"  },
];

// ── Vehicle Records ────────────────────────────────
export const FLEET_VEHICLES = [
  {
    id: "v1",
    regNo:    "GJ01AB452",
    name:     "VAN-05",
    type:     "Van",
    capacity: "500 kg",
    odometer: "74,000",
    acqCost:  "6,20,000",
    status:   "Available",
  },
  {
    id: "v2",
    regNo:    "GJ01AB998",
    name:     "TRUCK-11",
    type:     "Truck",
    capacity: "5 Ton",
    odometer: "1,82,000",
    acqCost:  "24,50,000",
    status:   "On Trip",
  },
  {
    id: "v3",
    regNo:    "GJ01AB120",
    name:     "MINI-03",
    type:     "Mini",
    capacity: "1 Ton",
    odometer: "66,000",
    acqCost:  "4,10,000",
    status:   "In Shop",
  },
  {
    id: "v4",
    regNo:    "GJ01AB008",
    name:     "VAN-09",
    type:     "Van",
    capacity: "750 kg",
    odometer: "2,41,900",
    acqCost:  "5,90,000",
    status:   "Retired",
  },
];

// ── Status Badge Styles ────────────────────────────
export const VEHICLE_STATUS_STYLE = {
  "Available": "bg-emerald-500 text-white",
  "On Trip":   "bg-blue-500 text-white",
  "In Shop":   "bg-amber-500 text-white",
  "Retired":   "bg-red-500 text-white",
};
