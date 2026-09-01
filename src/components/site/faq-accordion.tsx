"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Faq } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  items,
  className,
}: {
  items: Faq[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-ink/10", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
              suppressHydrationWarning
            >
              <span className="font-display text-base font-semibold text-ink sm:text-lg">
                {item.q}
              </span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition-all",
                  isOpen && "rotate-45 bg-ink text-white"
                )}
              >
                <Plus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-12 text-sm leading-relaxed text-ink/60">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
