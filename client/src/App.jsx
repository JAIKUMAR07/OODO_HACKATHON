import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Placeholder Dashboard
function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg)",
      gap: 16,
    }}>
      <div style={{
        background: "rgba(15,23,42,0.85)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 20,
        padding: "40px 48px",
        textAlign: "center",
        backdropFilter: "blur(24px)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚛</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
          Welcome, {user?.name}!
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 6 }}>Role: <strong style={{ color: "#a78bfa" }}>{user?.role}</strong></p>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>{user?.email}</p>
        <button
          onClick={logout}
          style={{
            padding: "10px 28px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
