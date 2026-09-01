"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { Sport } from "@/lib/data";

export function SportCard({ sport }: { sport: Sport }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [value, setValue] = useState(50); // 0-100, position along the track
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const offset = (value - 50) / 50; // -1..1
  const iconTransform = `translateX(${offset * 10}px) rotate(${offset * 12}deg) scale(${1 + Math.abs(offset) * 0.1})`;

  return (
    <div className="group flex flex-col items-center gap-3 rounded-3xl border border-transparent bg-white p-7 text-center shadow-[0_2px_10px_rgba(11,11,11,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-accent/[0.04] hover:shadow-[0_16px_32px_rgba(200,162,74,0.18)]">
      <Link
        href={`/products?sport=${sport.slug}`}
        className="flex flex-col items-center gap-3"
      >
        <span
          className="text-4xl transition-transform duration-150 ease-out"
          style={{ transform: iconTransform }}
        >
          {sport.icon}
        </span>
        <span className="text-base font-bold text-ink transition-colors duration-300 group-hover:text-accent">
          {sport.name}
        </span>
      </Link>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mt-1 h-4 w-16 cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-neutral-200" />
        <span
          className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full shadow-sm transition-[background-color,transform] duration-150 ${
            dragging ? "scale-125 bg-accent" : "bg-ink group-hover:bg-accent"
          }`}
          style={{ left: `calc(${value}% - 6px)` }}
        />
      </div>
    </div>
  );
}
