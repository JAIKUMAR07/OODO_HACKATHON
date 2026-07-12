import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtpRequest } from "../../services/auth.service";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef([]);

  // Auto-focus first box
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  // If no email passed, redirect back
  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const handleChange = (idx, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  const otpValue = otp.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpValue.length < 6) return setError("Please enter the complete 6-digit OTP.");
    setLoading(true);
    try {
      await verifyOtpRequest(email, otpValue);
      navigate("/reset-password", { state: { email, otp: otpValue } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
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
          <div className="step-dot active" />
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
          📩
        </div>

        <h1 className="auth-title">Check your inbox</h1>
        <p className="auth-subtitle">
          We sent a 6-digit OTP to{" "}
          <strong style={{ color: "#a78bfa" }}>{email}</strong>
        </p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* OTP inputs */}
          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (refs.current[idx] = el)}
                id={`otp-digit-${idx + 1}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`otp-input${digit ? " filled" : ""}`}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>

          <button
            id="btn-verify-otp"
            type="submit"
            className="btn-primary"
            disabled={loading || otpValue.length < 6}
          >
            {loading && <span className="spinner" />}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 18 }}>
          <span>Didn't receive it? </span>
          <Link to="/forgot-password" className="auth-link">Resend OTP</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 10 }}>
          <Link to="/login" className="auth-link">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
