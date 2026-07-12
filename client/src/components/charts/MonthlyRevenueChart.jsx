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

function MonthlyRevenueChart({ data, isDark = false }) {
  const theme = getChartTheme(isDark);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={{ stroke: theme.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
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
          formatter={(value) => [`₹ ${Number(value).toLocaleString()}`, "Revenue"]}
        />
        <Bar
          dataKey="amount"
          fill={isDark ? "#60a5fa" : "#3b82f6"}
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyRevenueChart;
