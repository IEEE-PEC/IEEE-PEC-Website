"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-border bg-muted/30 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to Clean Minimalist (Light)" : "Switch to Midnight Cyber (Dark)"}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
        isDark
          ? "bg-[#0B132B]/80 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:scale-105"
          : "bg-white/80 border-slate-200 text-amber-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:scale-105"
      } ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 text-amber-500" />
      )}
    </button>
  );
}
