// ── Mock Data for Fuel & Expenses ──────────────────

export const FUEL_LOGS = [
  { id: "f1", vehicle: "VAN-05",   date: "05 Jul 2026", liters: "42 L",  cost: "3,150" },
  { id: "f2", vehicle: "TRUCK-11", date: "06 Jul 2026", liters: "110 L", cost: "8,400" },
  { id: "f3", vehicle: "MINI-08",  date: "06 Jul 2026", liters: "28 L",  cost: "2,050" },
];

export const OTHER_EXPENSES = [
  { 
    id: "e1", 
    trip: "TR001", 
    vehicle: "VAN-05", 
    toll: "120", 
    other: "0", 
    maint: "0", 
    status: "Available" // Using literal text from sketch
  },
  { 
    id: "e2", 
    trip: "TR002", 
    vehicle: "TRK-12", 
    toll: "340", 
    other: "150", 
    maint: "18,000", 
    status: "Completed" // Using literal text from sketch
  },
];

export const EXPENSE_STATUS_STYLE = {
  "Available": "bg-emerald-500 text-white",
  "Completed": "bg-emerald-600 text-white", // Darker green as per sketch difference if any, but emerald is fine
};
