import React, { useState } from "react";
import { Search, Bell, Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../hooks/useTheme.js";

function Navbar({ onMenuClick, mobileMenuOpen }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  return (
    <header className="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-3 sm:gap-4">

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="relative flex-1 max-w-xs hidden sm:block">
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

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition-colors focus:outline-none"
          title="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none hidden sm:block">
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" />
        </button>

        <div className="w-px h-5 bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Guest"}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{user?.role?.replace(/_/g, " ") || "No Role"}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-sm">
            <span className="text-[11px] font-extrabold text-white tracking-tight">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "G"}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors focus:outline-none"
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
