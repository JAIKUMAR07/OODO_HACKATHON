import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import BrandShowcase from "../components/BrandShowcase.jsx";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Multi-step: 1 = Enter Email, 2 = Enter OTP, 3 = Reset Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const otpRefs = useRef([]);

  // Auto-focus first digit on step 2
  useEffect(() => {
    if (step === 2) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setErrorText("Please enter your email address.");
    setLoading(true);
    setErrorText("");
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP.");

      setSuccessText("OTP sent to your email!");
      setTimeout(() => {
        setSuccessText("");
        setStep(2);
      }, 1500);
    } catch (err) {
      setErrorText(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) return setErrorText("Please enter the complete 6-digit OTP.");
    setLoading(true);
    setErrorText("");
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid or expired OTP.");

      setSuccessText("OTP verified successfully!");
      setTimeout(() => {
        setSuccessText("");
        setStep(3);
      }, 1500);
    } catch (err) {
      setErrorText(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return setErrorText("Please fill in all fields.");
    if (newPassword.length < 6) return setErrorText("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setErrorText("Passwords do not match.");
    setLoading(true);
    setErrorText("");
    try {
      const otpValue = otp.join("");
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Password reset failed.");

      setSuccessText("Password reset successfully! Redirecting to login…");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorText(err.message);
    } finally {
      setLoading(false);
    }
  };


  // OTP Inputs Helpers
  const handleOtpChange = (idx, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);
    setErrorText("");
    if (value && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 transition-colors duration-300 font-['Outfit',sans-serif]">
      {/* Reusable Branding Showcase */}
      <BrandShowcase />

      {/* Auth Form Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between min-h-[600px] md:min-h-screen relative bg-slate-50">
        <div className="h-8 mb-8" />

        <div className="my-auto flex items-center justify-center w-full max-w-md self-center">
          <div className="w-full flex flex-col justify-center transition-all duration-300">

            {/* Header */}
            <div className="mb-6">
              <div className="flex gap-1.5 mb-4">
                <span className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-[#9a5b00]" : "bg-slate-200"}`} />
                <span className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-[#9a5b00]" : "bg-slate-200"}`} />
                <span className={`h-1.5 flex-1 rounded-full ${step >= 3 ? "bg-[#9a5b00]" : "bg-slate-200"}`} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {step === 1 && "Forgot password?"}
                {step === 2 && "Enter OTP"}
                {step === 3 && "Reset your password"}
              </h2>
              <p className="text-slate-500 text-sm mt-1.5">
                {step === 1 && "Enter your email to receive a 6-digit verification code."}
                {step === 2 && `We sent a verification code to ${email}`}
                {step === 3 && "Set your new dashboard sign-in password."}
              </p>
            </div>

            {errorText && (
              <div className="border border-red-500/20 bg-red-500/5 text-red-500 px-4 py-2.5 rounded-xl text-xs font-semibold mb-4">
                ✕ {errorText}
              </div>
            )}
            {successText && (
              <div className="border border-green-500/20 bg-green-500/5 text-green-500 px-4 py-2.5 rounded-xl text-xs font-semibold mb-4">
                ✓ {successText}
              </div>
            )}

            {/* STEP 1: ENTER EMAIL */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorText(""); }}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl py-3 text-white text-center font-bold tracking-wide shadow-md focus:outline-none"
                >
                  {loading ? "Sending..." : "Send Verification OTP"}
                </button>
              </form>
            )}

            {/* STEP 2: ENTER OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 text-center">
                    ENTER 6-DIGIT CODE
                  </label>
                  <div className="flex gap-2.5 justify-center my-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-14 bg-white border border-slate-200 rounded-xl text-center text-lg font-bold text-slate-900 focus:outline-none focus:border-[#9a5b00] focus:ring-1 focus:ring-[#9a5b00] transition-all"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl py-3 text-white text-center font-bold tracking-wide shadow-md focus:outline-none"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            {/* STEP 3: RESET PASSWORD */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400">
                    NEW PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Min. 6 characters"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-16 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#9a5b00]"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400">
                    CONFIRM NEW PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat your password"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-16 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#9a5b00]"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl py-3 text-white text-center font-bold tracking-wide shadow-md focus:outline-none"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/login" className="text-blue-500 hover:underline font-semibold">
                ← Back to Sign In
              </Link>
            </p>

          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
