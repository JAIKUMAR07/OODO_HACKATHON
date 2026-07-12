import React from "react";

function BrandShowcase() {
  return (
    <div className="w-full md:w-1/2 bg-linear-to-br from-[#0c1328] via-[#090d1a] to-[#04060d] text-white p-8 md:p-16 flex flex-col justify-between min-h-[450px] md:min-h-screen relative overflow-hidden">
      {/* Background Decorative Glow Effect */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />

      {/* Header / Brand */}
      <div className="flex items-center gap-3.5 z-10">
        {/* Minimalist Geometric Logo */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
          <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            TransitOps
          </h1>
        </div>
      </div>

      {/* Center Branding / Subtext & UI Showcase */}
      <div className="my-auto py-12 flex flex-col gap-10 z-10">
        {/* Subtext */}
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Smart Transport Operations Platform
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Digitizing fleet management, dispatch, and analytics in one centralized hub. Scoped access control for every tier.
          </p>
        </div>

      </div>

      {/* Footer info */}
      <div className="text-[11px] text-slate-600 tracking-wider font-semibold mt-auto z-10 uppercase">
        TRANSITOPS © 2026 — OPERATIONAL CONTROL PLATFORM
      </div>
    </div>
  );
}

export default BrandShowcase;
