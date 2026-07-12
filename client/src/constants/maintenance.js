// ── Mock Data for Maintenance Log ──────────────────

export const SERVICE_LOGS = [
  {
    id: "m1",
    vehicle: "VAN-05",
    service: "Oil Change",
    cost: "2,500",
    status: "In Shop",
  },
  {
    id: "m2",
    vehicle: "TRUCK-11",
    service: "Engine Repair",
    cost: "18,000",
    status: "Completed",
  },
  {
    id: "m3",
    vehicle: "MINI-03",
    service: "Tyre Replace",
    cost: "6,200",
    status: "In Shop",
  },
];

export const MAINTENANCE_STATUS_STYLE = {
  "In Shop": "bg-amber-500 text-white",
  "Completed": "bg-emerald-500 text-white",
};
