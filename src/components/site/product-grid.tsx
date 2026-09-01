"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-[#111] py-20 text-center">
        <p className="font-display text-lg font-semibold text-white">
          No products found
        </p>
        <p className="mt-1 text-sm text-white/50">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </motion.div>
  );
}
