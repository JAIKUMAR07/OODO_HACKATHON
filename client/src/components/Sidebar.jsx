import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../constants/navigation.js";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        background: "linear-gradient(to bottom right, #0c1328, #090d1a, #04060d)",
      }}
      className={`
        relative flex flex-col shrink-0 h-screen border-r border-white/5
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[230px]"}
      `}
    >
      {/* Subtle glow blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[40%] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[30%] rounded-full bg-emerald-600/5 blur-[80px] pointer-events-none" />

      {/* ── Logo row (click logo to toggle collapse) ── */}
      <div className="flex items-center gap-2.5 px-4 py-5 mb-1 z-10">
        {/* Clickable logo mark */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:opacity-80 active:scale-95 transition-all focus:outline-none cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </button>

        {/* Wordmark — hidden when collapsed */}
        {!collapsed && (
          <span className="font-bold text-white text-[15px] tracking-tight whitespace-nowrap">
            TransitOps
          </span>
        )}
      </div>

      {/* ── Nav Items ────────────────────────────── */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto overflow-x-hidden z-10">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
               ${isActive
                ? "bg-amber-400 text-white shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                    }`}
                />
                {!collapsed && (
                  <span className="whitespace-nowrap leading-none">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;