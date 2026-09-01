import type { TooltipContentProps } from "recharts";

export function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-accent/40 bg-[#111111] px-3 py-2 text-xs shadow-xl">
      {label && <div className="mb-1 font-semibold text-white">{label}</div>}
      {payload.map((entry, i) => (
        <div key={i} className="text-white/80">
          {entry.name}: <span className="font-semibold text-accent">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
