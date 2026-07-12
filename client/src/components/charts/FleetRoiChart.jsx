import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getChartTheme } from "../../utils/chartTheme.js";

function FleetRoiChart({ vehicles = [], isDark = false }) {
  const theme = getChartTheme(isDark);
  const chartData = vehicles
    .slice(0, 8)
    .map((v) => ({
      name: v.name?.length > 10 ? `${v.name.slice(0, 10)}…` : v.name,
      roi: v.roi ?? 0,
      revenue: v.revenue ?? 0,
    }));

  if (!chartData.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
        No ROI data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity={0.4} />
            <stop offset="95%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={{ stroke: theme.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontSize: 12,
            color: theme.tooltipText,
          }}
          formatter={(value, name) => [
            name === "roi" ? `${Number(value).toFixed(1)}%` : `₹ ${Number(value).toLocaleString()}`,
            name === "roi" ? "ROI" : "Revenue",
          ]}
        />
        <Area
          type="monotone"
          dataKey="roi"
          stroke={isDark ? "#34d399" : "#10b981"}
          fill="url(#roiGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default FleetRoiChart;
