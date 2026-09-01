"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { type Category, type Product } from "@/lib/data";
import { ProductGrid } from "./product-grid";
import { cn, sanitizeInput } from "@/lib/utils";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const colorOptions = [
  { name: "Black", hex: "#0b0b0b" },
  { name: "White", hex: "#ffffff" },
  { name: "Grey", hex: "#8a8f98" },
  { name: "Blue", hex: "#1e3a5f" },
];

export function ProductsExplorer({
  products,
  categories,
  initialSport,
}: {
  products: Product[];
  categories: Category[];
  initialSport?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sport, setSport] = useState<string | null>(initialSport ?? null);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.categorySlug] = (counts[p.categorySlug] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const q = sanitizeInput(query).toLowerCase();
    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.category} ${p.sport}`.toLowerCase().includes(q))
        return false;
      if (category && p.categorySlug !== category) return false;
      if (sport && p.sport.toLowerCase() !== sport.toLowerCase()) return false;
      if (size && !p.sizes.includes(size)) return false;
      if (color && !p.colors.some((c) => c.name.toLowerCase().includes(color.toLowerCase())))
        return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
    return list;
  }, [products, query, category, sport, size, color, sort]);

  const reset = () => {
    setCategory(null);
    setSport(null);
    setSize(null);
    setColor(null);
    setQuery("");
  };

  const activeCount =
    (category ? 1 : 0) +
    (sport ? 1 : 0) +
    (size ? 1 : 0) +
    (color ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-8">
      <FilterBlock title="Category">
        <div className="space-y-1">
          {categories.map((c) => (
            <FilterRow
              key={c.slug}
              label={c.name}
              count={categoryCounts[c.slug] ?? 0}
              active={category === c.slug}
              onClick={() => {
                setCategory(category === c.slug ? null : c.slug);
              }}
            />
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Size">
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(size === s ? null : s)}
              className={cn(
                "grid h-9 w-11 place-items-center rounded-lg border text-xs font-semibold transition-colors",
                size === s
                  ? "border-accent bg-accent text-ink"
                  : "border-white/15 text-white/70 hover:border-accent/60"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Color">
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(color === c.name ? null : c.name)}
              aria-label={c.name}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border-2 transition-all",
                color === c.name ? "border-accent" : "border-white/20"
              )}
              style={{ backgroundColor: c.hex }}
            >
              {color === c.name && (
                <Check
                  size={14}
                  className={c.name === "White" ? "text-ink" : "text-white"}
                />
              )}
            </button>
          ))}
        </div>
      </FilterBlock>

      <button
        type="button"
        onClick={reset}
        className="w-full rounded-full border border-white/15 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/60 transition-colors hover:border-accent hover:text-accent"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] py-12 text-white md:py-16">
      <div className="container-x">
        {/* Search + sort bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, sports, categories…"
              maxLength={80}
              className="h-12 w-full rounded-full border border-white/15 bg-[#111111] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-medium text-white lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeCount > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] text-ink">
                  {activeCount}
                </span>
              )}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort by"
                className="h-12 appearance-none rounded-full border border-white/15 bg-[#111111] pl-5 pr-10 text-sm font-medium text-white outline-none transition-colors focus:border-accent"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{FilterPanel}</div>
          </aside>

          <div>
            <p className="mb-6 text-sm text-white/50">
              Showing <span className="font-semibold text-white">{filtered.length}</span>{" "}
              of {products.length} products
            </p>
            <ProductGrid products={filtered} />
          </div>
        </div>

        {/* Mobile filter drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0a0a0a] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white"
                >
                  <X size={20} />
                </button>
              </div>
              {FilterPanel}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mt-6 w-full rounded-full bg-accent py-3.5 text-sm font-semibold uppercase tracking-wide text-ink"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between border-l-2 px-3 py-2 text-sm transition-colors",
        active
          ? "border-accent bg-white/5 font-semibold text-accent"
          : "border-transparent text-white/60 hover:text-accent"
      )}
    >
      <span>{label}</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/50">
        {count}
      </span>
    </button>
  );
}

function SportPill({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ minWidth: 80 }}
      className={cn(
        "flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition-colors",
        active
          ? "border-accent bg-accent"
          : "border-white/10 bg-[#111111] hover:border-accent/60"
      )}
    >
      <span
        className="grid h-11 w-11 place-items-center rounded-full font-bold"
        style={{
          background: active ? "#0a0a0a" : "#C9A84C",
          color: active ? "#C9A84C" : "#000000",
        }}
      >
        {icon}
      </span>
      <span className={cn("text-[11px] font-medium", active ? "text-ink" : "text-white/70")}>
        {label}
      </span>
    </button>
  );
}
