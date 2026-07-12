import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const ROLES = [
  { value: "FLEET_MANAGER", label: "Fleet Manager" },
  { value: "DRIVER", label: "Driver" },
  { value: "SAFETY_OFFICER", label: "Safety Officer" },
  { value: "FINANCIAL_ANALYST", label: "Financial Analyst" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.role) {
      return setError("Please fill in all fields.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    try {
      const { data } = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#f87171", width: "33%" };
    if (p.length < 10) return { label: "Fair", color: "#fbbf24", width: "66%" };
    return { label: "Strong", color: "#4ade80", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">🚛</div>
          <span className="auth-brand-name">TransitOps</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the fleet management platform</p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <div className="form-input-wrap">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="reg-name"
                type="text"
                name="name"
                className="form-input has-icon-left"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                name="email"
                className="form-input has-icon-left"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="reg-role" className="form-label">Role</label>
            <div className="form-input-wrap">
              <select
                id="reg-role"
                name="role"
                className="form-input form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="" disabled>Select your role...</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div className="form-input-wrap">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPass ? "text" : "password"}
                name="password"
                className="form-input has-icon-left has-icon-right"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                <EyeIcon open={showPass} />
              </span>
            </div>
            {/* Strength bar */}
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 3, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: strength.width, height: "100%", background: strength.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
                </div>
                <span style={{ fontSize: 11, color: strength.color, marginTop: 4, display: "block" }}>{strength.label} password</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
            <div className="form-input-wrap">
              <span className="input-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                className="form-input has-icon-left has-icon-right"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)}>
                <EyeIcon open={showConfirm} />
              </span>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <button
              id="btn-register-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading && <span className="spinner" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
