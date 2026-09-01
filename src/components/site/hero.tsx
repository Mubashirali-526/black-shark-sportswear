"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { heroSlides } from "@/lib/data";

const AUTO_ADVANCE_MS = 5500;

const contentVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = heroSlides.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [next, paused]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev]);

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  }

  const slide = heroSlides[index];

  return (
    <section
      className="relative isolate flex h-[calc(100vh-100px)] w-full items-center overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image — crossfades between slides */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 5.5, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.headline}
              fill
              priority
              sizes="100vw"
              style={{ objectPosition: "center top" }}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay — strong left, fading right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </div>

      {/* Slide content — slides in from the right, out to the left */}
      <div className="relative z-10 h-full w-full touch-pan-y">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            drag="x"
            dragElastic={0.15}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex h-full w-full items-center px-5 lg:pl-20"
          >
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="show"
              className="flex max-w-[600px] flex-col gap-4"
            >
              <motion.span
                variants={itemVariants}
                className="inline-flex w-fit items-center rounded-full bg-accent px-3.5 py-1 text-[12px] font-bold uppercase tracking-widest text-ink"
              >
                {slide.preTitle}
              </motion.span>

              <h1
                className="flex flex-col font-display font-black uppercase tracking-tight"
                style={{ lineHeight: 1.05 }}
              >
                <motion.span variants={itemVariants} className="text-[32px] text-white lg:text-[52px]">
                  {slide.headline}
                </motion.span>
                <motion.span variants={itemVariants} className="text-[32px] text-accent lg:text-[52px]">
                  {slide.headlineSub}
                </motion.span>
                <motion.span
                  variants={itemVariants}
                  className="text-[32px] text-transparent lg:text-[52px]"
                  style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.85)" }}
                >
                  {slide.headlineEnd}
                </motion.span>
              </h1>

              <motion.p
                variants={itemVariants}
                className="max-w-[400px] text-sm leading-[1.6] text-[#aaaaaa] lg:text-[15px]"
              >
                {slide.desc}
              </motion.p>

              <motion.div variants={itemVariants} className="pt-2">
                <Link
                  href="/quote"
                  suppressHydrationWarning
                  className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-[14px] text-xs font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:brightness-105"
                >
                  Customize Your Order
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right side — vertical dot navigation (desktop) */}
      <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 lg:right-10 lg:flex">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            suppressHydrationWarning
            className="grid h-6 w-6 place-items-center"
          >
            <span
              className={`block rounded-full border-2 transition-all duration-300 ${
                index === i
                  ? "h-3 w-3 border-accent bg-accent"
                  : "h-2.5 w-2.5 border-white/40 bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Bottom left — slide counter + arrow controls */}
      <div className="absolute bottom-8 left-5 z-30 flex items-center gap-5 lg:left-20">
        <span className="font-display text-sm font-bold text-accent">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            suppressHydrationWarning
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1a1a1a] text-accent transition-colors hover:bg-[#222222]"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            suppressHydrationWarning
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1a1a1a] text-accent transition-colors hover:bg-[#222222]"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile — dots centered at bottom */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 sm:hidden">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            suppressHydrationWarning
            className={`h-2 rounded-full transition-all duration-300 ${
              index === i ? "w-6 bg-accent" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
