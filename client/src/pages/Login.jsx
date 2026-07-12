import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import BrandShowcase from "../components/BrandShowcase.jsx";
import ErrorPopup from "../components/ErrorPopup.jsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("DRIVER"); // Map Dispatcher to DRIVER
    const [rememberMe, setRememberMe] = useState(true);

    // States for password visibility, submission, success and error popup
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false); // Initially false (no error on load)
    const [errorText, setErrorText] = useState("");
    const [lockoutText, setLockoutText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShowError(false);

        // Simulate authentication
        setTimeout(() => {
            setIsSubmitting(false);
            if (email === "Raven.k@transitops.in" && password === "password123") {
                setLoginSuccess(true);
            } else {
                setErrorText("Invalid credentials.");
                setLockoutText("Account locked after 5 failed attempts.");
                setShowError(true);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 transition-colors duration-300 font-['Outfit',sans-serif]">

            {/* LEFT SIDE PANEL (Reusable Branding showcase) */}
            <BrandShowcase />

            {/* RIGHT SIDE PANEL (Authentication Form) */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between min-h-[600px] md:min-h-screen relative bg-slate-50">

                {/* Empty container for layout alignment */}
                <div className="h-8 mb-8" />

                {/* Centered Login Box */}
                <div className="my-auto flex items-center justify-center w-full max-w-md self-center">

                    <div className="w-full flex flex-col justify-center transition-all duration-300">
                        {loginSuccess ? (
                            <div className="p-8 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-4 shadow-xl bg-white">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl shadow-inner">
                                    ✓
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Sign In Successful!</h2>
                                <p className="text-slate-500 text-sm px-2">
                                    Welcome back. Authenticated as <span className="text-[#9a5b00] font-bold">{role.replace("_", " ")}</span>.
                                </p>
                                <button
                                    onClick={() => {
                                        setLoginSuccess(false);
                                        setEmail("");
                                        setPassword("");
                                    }}
                                    className="mt-4 px-6 py-2.5 bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl text-white text-sm font-semibold shadow-md shadow-amber-900/10"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                        Sign in to your account
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1.5">
                                        Enter your credentials below to access your dashboard.
                                    </p>
                                </div>

                                {/* Email Input */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                                    />
                                </div>

                                {/* Password Input with Show/Hide toggle */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                        PASSWORD
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-16 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                                        />
                                        {/* Show/Hide password icon toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#9a5b00] transition-colors focus:outline-none"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Role selection dropdown */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                        ROLE (RBAC SCOPED)
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="FLEET_MANAGER">Fleet Manager</option>
                                            <option value="DRIVER">Dispatcher</option>
                                            <option value="SAFETY_OFFICER">Safety Officer</option>
                                            <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                                        </select>
                                        {/* Custom Dropdown Caret */}
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkbox and Forgot Password link */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer select-none text-slate-500">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded-md border mr-2 flex items-center justify-center transition-all bg-white ${rememberMe ? 'border-green-500 text-green-500' : 'border-slate-200 text-transparent'
                                                    }`}>
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#forgot" className="text-blue-500 hover:underline font-semibold">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl py-3 text-white text-center font-bold tracking-wide shadow-md focus:outline-none"
                                >
                                    {isSubmitting ? "Signing In..." : "Sign In"}
                                </button>

                                {/* Switch to Sign Up */}
                                <p className="text-center text-sm text-slate-500 mt-2">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/signup"
                                        className="text-blue-500 hover:underline font-semibold focus:outline-none"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>

                </div>

            </div>

            {/* RENDER DYNAMIC MODAL ERROR OVERLAY */}
            {showError && (
                <ErrorPopup
                    message={errorText}
                    subMessage={lockoutText}
                    onClose={() => setShowError(false)}
                />
            )}

        </div>
    );
}

export default Login;
