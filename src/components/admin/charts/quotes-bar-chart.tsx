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

export function QuotesBarChart({ data }: { data: { month: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="#666666"
          tick={{ fill: "#888888", fontSize: 12 }}
          axisLine={{ stroke: "#222222" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          stroke="#666666"
          tick={{ fill: "#888888", fontSize: 12 }}
          axisLine={{ stroke: "#222222" }}
          tickLine={false}
        />
        <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ fill: "rgba(200,168,76,0.08)" }} />
        <Bar dataKey="count" name="Quote Requests" fill="#C9A84C" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
