import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPasswordRequest } from "../../services/auth.service";

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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !otp) navigate("/forgot-password");
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.newPassword || !form.confirmPassword) return setError("Please fill in all fields.");
    if (form.newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (form.newPassword !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await resetPasswordRequest(email, otp, form.newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.newPassword;
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

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-dot active" />
          <div className="step-dot active" />
          <div className="step-dot active" />
        </div>

        {/* Icon */}
        <div style={{
          width: 56, height: 56,
          background: success ? "rgba(74,222,128,0.12)" : "rgba(99,102,241,0.12)",
          border: success ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(99,102,241,0.3)",
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          fontSize: 26,
          transition: "all 0.3s",
        }}>
          {success ? "✅" : "🔒"}
        </div>

        {success ? (
          <>
            <h1 className="auth-title">Password reset!</h1>
            <p className="auth-subtitle">Your password has been changed successfully. Redirecting to login…</p>
            <div className="alert alert-success">✓ You can now sign in with your new password.</div>
          </>
        ) : (
          <>
            <h1 className="auth-title">Set new password</h1>
            <p className="auth-subtitle">Choose a strong password for your account.</p>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <div className="form-group">
                <label htmlFor="reset-new-pass" className="form-label">New Password</label>
                <div className="form-input-wrap">
                  <span className="input-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="reset-new-pass"
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    className="form-input has-icon-left has-icon-right"
                    placeholder="Min. 6 characters"
                    value={form.newPassword}
                    onChange={handleChange}
                    autoFocus
                    autoComplete="new-password"
                  />
                  <span className="input-icon-right" onClick={() => setShowNew(!showNew)}>
                    <EyeIcon open={showNew} />
                  </span>
                </div>
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
                <label htmlFor="reset-confirm-pass" className="form-label">Confirm New Password</label>
                <div className="form-input-wrap">
                  <span className="input-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <input
                    id="reset-confirm-pass"
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
                  id="btn-reset-password"
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading && <span className="spinner" />}
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="auth-link">← Back to sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
