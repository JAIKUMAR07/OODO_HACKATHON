import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff } from "lucide-react";
import BrandShowcase from "../components/BrandShowcase.jsx";
import { registerUser } from "../services/auth.service.js";

function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // User credentials
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("FLEET_MANAGER");

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Custom Modal Error State
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [subMessageText, setSubMessageText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowError(false);

        if (password !== confirmPassword) {
            setErrorText("Passwords do not match");
            setSubMessageText("Please ensure both password fields are identical.");
            setShowError(true);
            return;
        }

        setLoading(true);
        try {
            const response = await registerUser({ name, email, password, role });
            const { user, token } = response.data;
            login(user, token); // Automatically log in the user after signup
            navigate("/dashboard");
        } catch (err) {
            setErrorText(err.response?.data?.message || "Registration failed");
            setSubMessageText("Please try a different email or contact support.");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 transition-colors duration-300 font-['Outfit',sans-serif]">

            {/* LEFT SIDE PANEL (Reusable Branding showcase) */}
            <BrandShowcase />

            {/* RIGHT SIDE PANEL (Authentication Form) */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between min-h-[600px] md:min-h-screen relative bg-slate-50">

                {/* Centered Signup Box */}
                <div className="my-auto flex items-center justify-center w-full max-w-md self-center">

                    <div className="w-full flex flex-col justify-center transition-all duration-300">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                    Create your account
                                </h2>
                                <p className="text-slate-500 text-sm mt-1.5">
                                    Get started by filling out your registration details below.
                                </p>
                            </div>

                            {showError && (
                                <div className="border border-red-500/20 bg-red-500/5 text-red-500 px-4 py-3 rounded-xl text-xs font-semibold flex flex-col gap-1">
                                    <span>✕ {errorText}</span>
                                    <span className="opacity-80 font-normal">{subMessageText}</span>
                                </div>
                            )}

                            {/* Name Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                    PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-16 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#9a5b00] transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                    CONFIRM PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-16 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#9a5b00] transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                    ROLE REQUIRED
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#9a5b00] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="FLEET_MANAGER">Fleet Manager</option>
                                    <option value="DRIVER">Dispatcher</option>
                                    <option value="SAFETY_OFFICER">Safety Officer</option>
                                    <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                                </select>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] disabled:opacity-70 transition-colors rounded-xl py-3 text-white text-center font-bold tracking-wide shadow-md focus:outline-none mt-2"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                            {/* Switch to Sign In */}
                            <p className="text-center text-sm text-slate-500 mt-2">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-500 hover:underline font-semibold focus:outline-none"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Signup;
