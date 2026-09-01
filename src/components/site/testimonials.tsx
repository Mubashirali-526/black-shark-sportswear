"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/data";
import { StarRating } from "./star-rating";

export function Testimonials() {
  const [i, setI] = useState(0);
  const count = testimonials.length;
  const t = testimonials[i];
  const go = useCallback(
    (dir: number) => setI((v) => (v + dir + count) % count),
    [count]
  );

  useEffect(() => {
    const timer = setInterval(() => go(1), 5500);
    return () => clearInterval(timer);
  }, [go]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-12">
        <Quote className="absolute -top-5 left-8 h-12 w-12 fill-accent text-accent" />
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <StarRating rating={t.rating} size={18} className="mb-5" />
            <p className="font-display text-xl font-medium leading-relaxed text-white sm:text-2xl">
              “{t.quote}”
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-lg font-bold text-ink">
                {t.name.charAt(0)}
              </span>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-white/50">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          suppressHydrationWarning
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Testimonial ${idx + 1}`}
              suppressHydrationWarning
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-8 bg-accent" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          suppressHydrationWarning
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
