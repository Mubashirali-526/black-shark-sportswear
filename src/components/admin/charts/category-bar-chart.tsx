"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "./chart-tooltip";

export function CategoryBarChart({ data }: { data: { name: string; count: number }[] }) {
  const height = Math.max(280, data.length * 32);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        barCategoryGap={10}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6f28" />
            <stop offset="100%" stopColor="#f0dda8" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#222222" horizontal={false} />
        <XAxis
          type="number"
          allowDecimals={false}
          stroke="#666666"
          tick={{ fill: "#888888", fontSize: 12 }}
          axisLine={{ stroke: "#222222" }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          stroke="#666666"
          tick={{ fill: "#aaaaaa", fontSize: 12 }}
          axisLine={{ stroke: "#222222" }}
          tickLine={false}
        />
        <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ fill: "rgba(200,168,76,0.08)" }} />
        <Bar dataKey="count" name="Products" fill="url(#goldGradient)" radius={[0, 6, 6, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
