import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getChartTheme } from "../../utils/chartTheme.js";

function VehicleDistanceChart({ data = [], isDark = false }) {
  const theme = getChartTheme(isDark);
  const chartData = data
    .map((v) => ({
      name: v.name?.length > 10 ? `${v.name.slice(0, 10)}…` : v.name,
      distance: v.metrics?.totalDistance ?? 0,
    }))
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 10); // Top 10 by distance

  if (!chartData.length || chartData.every((d) => d.distance === 0)) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
        No distance data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={{ stroke: theme.grid }}
          tickLine={false}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}k km`}
        />
        <Tooltip
          cursor={{ fill: theme.cursor }}
          contentStyle={{
            backgroundColor: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontSize: 12,
            color: theme.tooltipText,
          }}
          formatter={(value) => [`${Number(value).toLocaleString()} km`, "Distance"]}
        />
        <Bar
          dataKey="distance"
          fill={isDark ? "#818cf8" : "#6366f1"}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default VehicleDistanceChart;
