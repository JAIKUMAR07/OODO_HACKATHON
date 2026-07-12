import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getChartTheme, formatStatusLabel } from "../../utils/chartTheme.js";

function VehicleStatusPieChart({ data, isDark = false }) {
  const theme = getChartTheme(isDark);
  const chartData = data.map((d) => ({
    name: formatStatusLabel(d.label),
    value: d.count,
    color: d.color,
  }));

  if (!chartData.length || chartData.every((d) => d.value === 0)) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
        No vehicle data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
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
          formatter={(value) => [value, "Vehicles"]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: theme.axis }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default VehicleStatusPieChart;
