import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    setError("");
    try {
      await forgotPasswordRequest(email);
      setSent(true);
      // Navigate to verify OTP, passing email via state
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="step-dot" />
          <div className="step-dot" />
        </div>

        {/* Icon */}
        <div style={{
          width: 56, height: 56,
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          fontSize: 26,
        }}>
          🔑
        </div>

        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-subtitle">
          Enter your email and we'll send you a 6-digit OTP to reset your password.
        </p>

        {error && <div className="alert alert-error">⚠ {error}</div>}
        {sent && (
          <div className="alert alert-success">
            ✓ OTP sent! Check your inbox. Redirecting…
          </div>
        )}

        {!sent && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="forgot-email" className="form-label">Email Address</label>
              <div className="form-input-wrap">
                <span className="input-icon-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  className="form-input has-icon-left"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoFocus
                />
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                id="btn-send-otp"
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading && <span className="spinner" />}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
