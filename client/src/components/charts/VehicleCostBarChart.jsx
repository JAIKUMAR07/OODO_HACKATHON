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

function VehicleCostBarChart({ data, isDark = false }) {
  const theme = getChartTheme(isDark);
  const chartData = data.map((d) => ({
    name: d.name?.length > 12 ? `${d.name.slice(0, 12)}…` : d.name,
    cost: d.cost,
  }));

  if (!chartData.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
        No cost data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={80}
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
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
          formatter={(value) => [`₹ ${Number(value).toLocaleString()}`, "Cost"]}
        />
        <Bar
          dataKey="cost"
          fill={isDark ? "#f87171" : "#ef4444"}
          radius={[0, 4, 4, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default VehicleCostBarChart;
