"use client";

import { CountUp } from "./count-up";

export function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <CountUp value={value} className="font-display text-2xl font-bold" />
      <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
        {label}
      </div>
    </div>
  );
}
