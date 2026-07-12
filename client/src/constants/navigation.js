import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard",       icon: LayoutDashboard, to: "/dashboard" },
  { label: "Fleet",           icon: Truck,            to: "/fleet" },
  { label: "Drivers",         icon: Users,            to: "/drivers" },
  { label: "Trips",           icon: Route,            to: "/trips" },
  { label: "Maintenance",     icon: Wrench,           to: "/maintenance" },
  { label: "Fuel & Expenses", icon: Fuel,             to: "/fuel-expenses" },
  { label: "Analytics",       icon: BarChart3,        to: "/analytics" },
  { label: "Settings",        icon: Settings,         to: "/settings" },
];
