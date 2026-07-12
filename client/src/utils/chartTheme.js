export const CHART_COLORS = {
  emerald: "#10b981",
  blue: "#3b82f6",
  amber: "#f59e0b",
  red: "#ef4444",
  violet: "#8b5cf6",
  slate: "#64748b",
  indigo: "#6366f1",
  cyan: "#06b6d4",
};

export const PIE_COLORS = [
  CHART_COLORS.emerald,
  CHART_COLORS.blue,
  CHART_COLORS.amber,
  CHART_COLORS.red,
  CHART_COLORS.violet,
  CHART_COLORS.indigo,
  CHART_COLORS.cyan,
];

export function getChartTheme(isDark) {
  return {
    grid: isDark ? "#334155" : "#e2e8f0",
    axis: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipBorder: isDark ? "#475569" : "#e2e8f0",
    tooltipText: isDark ? "#f1f5f9" : "#0f172a",
    cursor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.3)",
  };
}

export function formatStatusLabel(status) {
  return status?.replace(/_/g, " ") ?? "";
}
