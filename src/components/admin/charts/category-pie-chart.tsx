"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./chart-tooltip";

const GOLD_SHADES = [
  "#C9A84C",
  "#E8D28F",
  "#B08D2E",
  "#DCC06A",
  "#9C7A22",
  "#F0DDA8",
  "#A88A3A",
  "#84651A",
  "#D4B65E",
  "#755712",
  "#C0A050",
  "#EFE0B8",
];

export function CategoryPieChart({ data }: { data: { name: string; count: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="w-full max-w-[170px] shrink-0">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={2}
              stroke="#111111"
              strokeWidth={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={GOLD_SHADES[i % GOLD_SHADES.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <ChartTooltip {...props} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid w-full flex-1 grid-cols-1 gap-x-4 gap-y-2 sm:max-h-[220px] sm:grid-cols-2 sm:overflow-y-auto">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-start gap-2">
            <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: GOLD_SHADES[i % GOLD_SHADES.length] }}
            />
            <div className="min-w-0">
              <div className="text-[11px] leading-tight text-white/80">{d.name}</div>
              <div className="text-[11px] leading-tight text-white/40">
                {d.count} · {total > 0 ? Math.round((d.count / total) * 100) : 0}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
