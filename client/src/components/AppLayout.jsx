import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-['Outfit',sans-serif]">
      {/* ── Left Sidebar ─────────────────────────── */}
      <Sidebar />

      {/* ── Right: Navbar + Page Content ─────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
