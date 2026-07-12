import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getChartTheme, PIE_COLORS } from "../../utils/chartTheme.js";

function CostBreakdownChart({ fuel = 0, maintenance = 0, other = 0, isDark = false }) {
  const theme = getChartTheme(isDark);
  const data = [
    { name: "Fuel", value: fuel },
    { name: "Maintenance", value: maintenance },
    { name: "Other", value: other },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">
        No cost data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={75}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontSize: 12,
            color: theme.tooltipText,
          }}
          formatter={(value) => [`₹ ${Number(value).toLocaleString()}`, "Cost"]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: theme.axis }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CostBreakdownChart;
