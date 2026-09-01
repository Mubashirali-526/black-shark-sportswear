"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { products } from "@/lib/data";
import { StarRating } from "@/components/site/star-rating";

export default function WishlistPage() {
  const [items, setItems] = useState(products.slice(0, 4));
  const remove = (slug: string) =>
    setItems((prev) => prev.filter((p) => p.slug !== slug));

  return (
    <div className="min-h-[70vh] border-t border-ink/10 bg-neutral-50">
      <div className="container-x py-12 md:py-16">
        <div className="flex items-center gap-3">
          <Heart className="fill-red-500 text-red-500" size={26} />
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            My Wishlist
          </h1>
        </div>
        <p className="mt-2 text-sm text-ink/50">
          {items.length} saved {items.length === 1 ? "item" : "items"}
        </p>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/20 bg-white py-20 text-center">
            <Heart size={40} className="text-ink/30" />
            <h2 className="mt-4 font-display text-xl font-bold text-ink">
              Your wishlist is empty
            </h2>
            <p className="mt-1 text-sm text-ink/50">
              Tap the heart on any product to save it here.
            </p>
            <ButtonLink href="/products" className="mt-6">
              Discover Products
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <div
                key={p.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white"
              >
                <button
                  onClick={() => remove(p.slug)}
                  aria-label="Remove from wishlist"
                  className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-transform hover:scale-110"
                >
                  <X size={16} />
                </button>
                <Link
                  href={`/products/${p.slug}`}
                  className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] uppercase tracking-wider text-ink/40">
                    {p.category}
                  </span>
                  <h3 className="mt-1 font-display text-base font-semibold text-ink">
                    <Link href={`/products/${p.slug}`} className="hover:text-accent">
                      {p.name}
                    </Link>
                  </h3>
                  <StarRating rating={p.rating} size={12} className="mt-1.5" showValue />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
