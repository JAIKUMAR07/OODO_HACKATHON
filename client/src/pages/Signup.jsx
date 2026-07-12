import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import BrandShowcase from "../components/BrandShowcase.jsx";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("FLEET_MANAGER");

    // States for password visibility, submission, success and error
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [errorText, setErrorText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorText("");

        if (password !== confirmPassword) {
            setErrorText("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            setSignupSuccess(true);
        } catch (err) {
            setErrorText(err.message);
        } finally {
            setIsSubmitting(false);
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
                        {signupSuccess ? (
                            <div className="p-8 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-4 shadow-xl bg-white">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl shadow-inner">
                                    ✓
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Account Created!</h2>
                                <p className="text-slate-500 text-sm px-2">
                                    Your account has been registered successfully as a <span className="text-[#9a5b00] font-bold">{role.replace("_", " ")}</span>.
                                </p>
                                <Link
                                    to="/login"
                                    className="mt-4 px-6 py-2.5 bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl text-white text-sm font-semibold shadow-md inline-block text-center"
                                >
                                    Proceed to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                        Create your account
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1.5">
                                        Get started by filling out your registration details below.
                                    </p>
                                </div>

                                {errorText && (
                                    <div className="border border-red-500/20 bg-red-500/5 text-red-500 px-4 py-2.5 rounded-xl text-xs font-semibold">
                                        ✕ {errorText}
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

                                {/* Password Input with Show/Hide toggle */}
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

                                {/* Confirm Password Input with Show/Hide toggle */}
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
                                        {/* Show/Hide confirm password icon toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#9a5b00] transition-colors focus:outline-none"
                                            title={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Role selection dropdown */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-400">
                                        ROLE REQUIRED
                                    </label>
                                    <div className="relative">
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
                                        {/* Custom Dropdown Caret */}
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#9a5b00] hover:bg-[#b46a00] active:bg-[#804b00] transition-colors rounded-xl py-3 text-white text-center font-bold tracking-wide shadow-md focus:outline-none mt-2"
                                >
                                    {isSubmitting ? "Creating Account..." : "Sign Up"}
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
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Signup;
