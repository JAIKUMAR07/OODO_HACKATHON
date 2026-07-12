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

function FuelEfficiencyChart({ data = [], isDark = false }) {
  const theme = getChartTheme(isDark);
  const chartData = data
    .filter((v) => v.metrics?.fuelEfficiency > 0)
    .map((v) => ({
      name: v.name?.length > 10 ? `${v.name.slice(0, 10)}…` : v.name,
      efficiency: v.metrics?.fuelEfficiency ?? 0,
    }))
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 10); // Top 10 by efficiency

  if (!chartData.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
        No fuel efficiency data available
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
          tickFormatter={(v) => `${v} km/L`}
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
          formatter={(value) => [`${Number(value).toFixed(2)} km/L`, "Fuel Efficiency"]}
        />
        <Bar
          dataKey="efficiency"
          fill={isDark ? "#06b6d4" : "#0891b2"}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default FuelEfficiencyChart;
