import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Fleet from "./pages/Fleet.jsx";
import Drivers from "./pages/Drivers.jsx";
import Trips from "./pages/Trips.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import FuelExpenses from "./pages/FuelExpenses.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import AppLayout from "./components/AppLayout.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50"><div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* ── Auth routes (no sidebar) ──────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── App routes (with sidebar via AppLayout) ── */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/fleet"         element={<Fleet />} />
          <Route path="/drivers"       element={<Drivers />} />
          <Route path="/trips"         element={<Trips />} />
          <Route path="/maintenance"   element={<Maintenance />} />
          <Route path="/fuel-expenses" element={<FuelExpenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* ── Fallback ─────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
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
