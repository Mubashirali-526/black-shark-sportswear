"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Product = {
  id: string;
  slug: string;
  productId: string | null;
  name: string;
  categorySlug: string;
  subCategory: string | null;
  tags: string[] | null;
  images: string[] | null;
  createdAt: string;
};

type Category = { id: string; slug: string; name: string };

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.slug, c.name]));
    return (slug: string) => map.get(slug) ?? slug;
  }, [categories]);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    if (data.ok) {
      setProducts(data.items);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, search, category]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => d.ok && setCategories(d.items));
  }, []);

  useEffect(() => {
    // Standard fetch-on-mount/on-filter-change; no data-fetching library in this project to defer to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search, category]);

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteTarget(null);
      load();
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="h-10 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-[#666666] focus:border-accent"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-[#333333] bg-[#1a1a1a] px-3 text-sm text-white outline-none transition-colors focus:border-accent"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:brightness-105"
        >
          <Plus size={16} />
          Add New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#222222] bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#222222] text-xs uppercase tracking-wide text-[#888888]">
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3 font-medium">Product ID</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Sub Category</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[#888888]">
                    Loading…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[#888888]">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-[#1a1a1a] transition-colors hover:bg-white/[0.03] ${
                      i % 2 === 1 ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#1a1a1a]">
                        {p.images?.[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-accent">{p.productId || "—"}</td>
                    <td className="px-5 py-3 font-medium text-white">{p.name}</td>
                    <td className="px-5 py-3 text-[#aaaaaa]">{categoryName(p.categorySlug)}</td>
                    <td className="px-5 py-3 text-[#aaaaaa] text-sm">
                      {p.subCategory || "—"}
                    </td>
                    <td className="px-5 py-3 text-[#aaaaaa]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          aria-label="Edit"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-[#222222] text-white/70 transition-colors hover:border-accent hover:text-accent"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          aria-label="Delete"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-[#222222] text-white/70 transition-colors hover:border-red-500 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#888888]">
          <span>
            Page {page} of {totalPages} — {total} products
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-[#222222] px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#222222] px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={`This will permanently remove "${deleteTarget?.name}" from the database.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
