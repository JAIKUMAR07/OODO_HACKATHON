import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Fleet from "./pages/Fleet.jsx";
import Drivers from "./pages/Drivers.jsx";
import Trips from "./pages/Trips.jsx";
import AppLayout from "./components/AppLayout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth routes (no sidebar) ──────────────── */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── App routes (with sidebar via AppLayout) ── */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/fleet"         element={<Fleet />} />
          <Route path="/drivers"       element={<Drivers />} />
          <Route path="/trips"         element={<Trips />} />
          <Route path="/maintenance"   element={<PlaceholderPage title="Maintenance" />} />
          <Route path="/fuel-expenses" element={<PlaceholderPage title="Fuel & Expenses" />} />
          <Route path="/analytics"     element={<PlaceholderPage title="Analytics" />} />
          <Route path="/settings"      element={<PlaceholderPage title="Settings" />} />
        </Route>

        {/* ── Fallback ─────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Lightweight stub for pages not yet implemented
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="text-center">
        <p className="text-4xl font-extrabold text-slate-200 mb-2">{title}</p>
        <p className="text-slate-400 text-sm">This page is coming soon.</p>
      </div>
    </div>
  );
}

export default App;
