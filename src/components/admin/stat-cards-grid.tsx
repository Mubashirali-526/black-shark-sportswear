"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardData = {
  label: string;
  value: number;
  icon: ReactNode;
  deltaPct: number;
  deltaLabel: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function StatCardsGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={item}
          className="group rounded-xl border border-[#222222] border-b-2 border-b-accent/60 bg-[#111111] p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(200,168,76,0.15)]"
        >
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
            {s.icon}
          </span>
          <div className="mt-5 font-display text-3xl font-bold text-white">{s.value}</div>
          <div className="mt-1 text-sm text-[#888888]">{s.label}</div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            {s.deltaPct > 0 ? (
              <TrendingUp size={13} className="text-green-400" />
            ) : s.deltaPct < 0 ? (
              <TrendingDown size={13} className="text-red-400" />
            ) : (
              <Minus size={13} className="text-white/30" />
            )}
            <span
              className={cn(
                "font-semibold",
                s.deltaPct > 0 ? "text-green-400" : s.deltaPct < 0 ? "text-red-400" : "text-white/40"
              )}
            >
              {s.deltaPct > 0 ? "+" : ""}
              {s.deltaPct}%
            </span>
            <span className="text-white/35">{s.deltaLabel}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
