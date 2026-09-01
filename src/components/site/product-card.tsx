"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { StarRating } from "./star-rating";

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[#222] bg-[#111] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_0_0_1px_rgba(200,168,76,0.4),0_20px_40px_rgba(200,168,76,0.18)]"
    >
      <div
        className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-110",
              "scale-100 opacity-100",
              product.position
            )}
          />
          <Image
            src={product.images[1] ?? product.images[0]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="hidden"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
            {product.badge}
          </span>
        )}

        {/* Hover actions */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href="/quote"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:brightness-105"
          >
            <MessageSquareText size={15} />
            Request Quote
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
            {product.category}
          </span>
          <StarRating rating={product.rating} size={12} showValue dark />
        </div>
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-white">
          <Link href={`/products/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-4 w-4 rounded-full border border-white/15"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[11px] text-white/40">{product.reviews} reviews</span>
        </div>
      </div>
    </motion.div>
  );
}
