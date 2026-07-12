import React, { useState, useEffect } from "react";
import { Search, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center px-6 gap-4">

      {/* ── Search Input ─────────────────────────── */}
      <div className="relative flex-1 max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-8 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
        />
      </div>

      {/* ── Spacer ───────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right: Theme, Bell + User ──────────────── */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition-colors focus:outline-none"
          title="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <button className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none">
          <Bell size={17} />
          {/* Unread dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Guest"}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{user?.role?.replace("_", " ") || "No Role"}</p>
          </div>
          {/* Avatar bubble */}
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-sm">
            <span className="text-[11px] font-extrabold text-white tracking-tight">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "G"}
            </span>
          </div>

          <button 
            onClick={logout}
            className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors focus:outline-none"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </header>
  );
}

export default Navbar;
