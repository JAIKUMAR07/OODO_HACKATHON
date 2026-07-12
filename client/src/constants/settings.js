// ── Mock Data for Settings & RBAC ──────────────────

export const RBAC_ROLES = [
  {
    role: "Fleet Manager",
    fleet: "✓",
    drivers: "✓",
    trips: "—",
    fuelExp: "—",
    analytics: "✓",
  },
  {
    role: "Dispatcher",
    fleet: "View",
    drivers: "—",
    trips: "✓",
    fuelExp: "—",
    analytics: "—",
  },
  {
    role: "Safety Officer",
    fleet: "—",
    drivers: "✓",
    trips: "View",
    fuelExp: "—",
    analytics: "—",
  },
  {
    role: "Financial Analyst",
    fleet: "View",
    drivers: "—",
    trips: "—",
    fuelExp: "✓",
    analytics: "✓",
  },
];
