"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2, Tag, ChevronRight, Check } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { slugify } from "@/lib/utils";

type Category = {
  id: string;
  slug: string;
  name: string;
  count: number | null;
  image: string | null;
  blurb: string | null;
};

const EMPTY_FORM = { id: "", name: "", slug: "", blurb: "", count: 0, image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [subModalCategory, setSubModalCategory] = useState<Category | null>(null);
  const [subItems, setSubItems] = useState<string[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [subActionError, setSubActionError] = useState<string | null>(null);
  const [subDeleteTarget, setSubDeleteTarget] = useState<string | null>(null);
  const [subDeleteError, setSubDeleteError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (data.ok) setCategories(data.items);
    setLoading(false);
  }

  useEffect(() => {
    // Standard fetch-on-mount; no data-fetching library in this project to defer to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(c: Category) {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      blurb: c.blurb ?? "",
      count: c.count ?? 0,
      image: c.image ?? "",
    });
    setSlugTouched(true);
    setError(null);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const isEdit = Boolean(form.id);
    const url = isEdit ? `/api/admin/categories/${form.id}` : "/api/admin/categories";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        blurb: form.blurb.trim() || null,
        count: Number(form.count) || 0,
        image: form.image || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to save category.");
      return;
    }
    setFormOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setDeleteError(data.message ?? "Failed to delete category.");
      return;
    }
    setDeleteTarget(null);
    load();
  }

  async function loadSubcategories(categorySlug: string) {
    setSubLoading(true);
    const res = await fetch(`/api/admin/subcategories?categorySlug=${encodeURIComponent(categorySlug)}`);
    const data = await res.json();
    if (data.ok) setSubItems(data.items);
    setSubLoading(false);
  }

  function openSubModal(c: Category) {
    setSubModalCategory(c);
    setSubItems([]);
    setNewSubName("");
    setEditingSub(null);
    setSubActionError(null);
    loadSubcategories(c.slug);
  }

  function closeSubModal() {
    setSubModalCategory(null);
  }

  function handleAddSub() {
    const trimmed = newSubName.trim();
    if (!trimmed || subItems.includes(trimmed)) return;
    setSubItems((items) => [...items, trimmed].sort((a, b) => a.localeCompare(b)));
    setNewSubName("");
  }

  function startEditSub(name: string) {
    setEditingSub(name);
    setEditValue(name);
    setSubActionError(null);
  }

  function cancelEditSub() {
    setEditingSub(null);
    setEditValue("");
  }

  async function saveEditSub() {
    if (!subModalCategory || !editingSub) return;
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === editingSub) {
      cancelEditSub();
      return;
    }
    setSubActionError(null);
    const res = await fetch("/api/admin/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categorySlug: subModalCategory.slug,
        oldName: editingSub,
        newName: trimmed,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setSubActionError(data.message ?? "Failed to rename subcategory.");
      return;
    }
    setSubItems((items) =>
      items.map((s) => (s === editingSub ? trimmed : s)).sort((a, b) => a.localeCompare(b))
    );
    cancelEditSub();
  }

  async function handleDeleteSub() {
    if (!subModalCategory || !subDeleteTarget) return;
    setSubDeleteError(null);
    const res = await fetch("/api/admin/subcategories/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categorySlug: subModalCategory.slug, name: subDeleteTarget }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setSubDeleteError(data.message ?? "Failed to delete subcategory.");
      return;
    }
    setSubItems((items) => items.filter((s) => s !== subDeleteTarget));
    setSubDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:brightness-105"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[#888888]">Loading…</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="overflow-hidden rounded-xl border border-[#222222] bg-[#111111]"
            >
              <div className="relative aspect-[4/3] bg-[#1a1a1a]">
                {c.image && (
                  <Image src={c.image} alt={c.name} fill sizes="300px" className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-bold text-white">{c.name}</h3>
                <p className="mt-1 text-xs text-[#888888]">{c.count ?? 0} products</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#222222] py-1.5 text-xs font-medium text-white transition-colors hover:border-accent hover:text-accent"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openSubModal(c)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#222222] py-1.5 text-xs font-medium text-white transition-colors hover:border-accent hover:text-accent"
                  >
                    <Tag size={13} />
                    Sub
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setDeleteTarget(c);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#222222] py-1.5 text-xs font-medium text-white transition-colors hover:border-red-500 hover:text-red-400"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-xl border border-[#222222] bg-[#111111] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white">
                {form.id ? "Edit Category" : "Add Category"}
              </h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close">
                <X size={18} className="text-white/50 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: slugTouched ? f.slug : slugify(name),
                    }));
                  }}
                  className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                  Slug
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                  Blurb
                </label>
                <textarea
                  value={form.blurb}
                  onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                  Product Count
                </label>
                <input
                  type="number"
                  value={form.count}
                  onChange={(e) => setForm((f) => ({ ...f, count: Number(e.target.value) }))}
                  className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
                  Image
                </label>
                <ImageUploader
                  folder="categories"
                  multiple={false}
                  value={form.image ? [form.image] : []}
                  onChange={(urls) => setForm((f) => ({ ...f, image: urls[0] ?? "" }))}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-ink transition-colors hover:brightness-105 disabled:opacity-60"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="h-11 rounded-lg border border-[#333333] px-6 text-sm font-medium text-white transition-colors hover:border-white/40"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category?"
        message={
          deleteError ?? `This will permanently remove "${deleteTarget?.name}" from the database.`
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {subModalCategory && (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-xl border border-[#222222] bg-[#111111] p-6">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                <span>Categories</span>
                <ChevronRight size={13} />
                <span className="text-white">{subModalCategory.name}</span>
              </div>
              <button type="button" onClick={closeSubModal} aria-label="Close">
                <X size={18} className="text-white/50 hover:text-white" />
              </button>
            </div>
            <h3 className="mb-4 font-display text-base font-bold text-white">Subcategories</h3>

            <p className="mb-4 rounded-lg border border-[#222222] bg-[#1a1a1a] px-3 py-2 text-xs text-[#888888]">
              Renaming updates all products in this category that use it.
            </p>

            {subActionError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {subActionError}
              </div>
            )}

            <div className="mb-4 flex gap-2">
              <input
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSub();
                  }
                }}
                placeholder="New subcategory name"
                className="h-10 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleAddSub}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-bold text-ink transition-colors hover:brightness-105"
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            {subLoading ? (
              <p className="py-4 text-center text-sm text-[#888888]">Loading…</p>
            ) : subItems.length === 0 ? (
              <p className="py-4 text-center text-sm text-[#888888]">No subcategories yet.</p>
            ) : (
              <ul className="space-y-2">
                {subItems.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 rounded-lg border border-[#222222] bg-[#1a1a1a] px-3 py-2"
                  >
                    {editingSub === name ? (
                      <>
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEditSub();
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEditSub();
                            }
                          }}
                          className="h-8 w-full rounded-md border border-accent bg-[#111111] px-2 text-sm text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={saveEditSub}
                          aria-label="Save"
                          className="shrink-0 text-accent hover:brightness-110"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditSub}
                          aria-label="Cancel"
                          className="shrink-0 text-white/50 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 truncate text-sm text-white">{name}</span>
                        <button
                          type="button"
                          onClick={() => startEditSub(name)}
                          aria-label={`Edit ${name}`}
                          className="shrink-0 text-white/50 hover:text-accent"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubDeleteError(null);
                            setSubDeleteTarget(name);
                          }}
                          aria-label={`Delete ${name}`}
                          className="shrink-0 text-white/50 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!subDeleteTarget}
        title="Delete subcategory?"
        message={
          subDeleteError ??
          `This will clear "${subDeleteTarget}" from every product in ${subModalCategory?.name ?? "this category"} that uses it. Products themselves are not deleted.`
        }
        onConfirm={handleDeleteSub}
        onCancel={() => setSubDeleteTarget(null)}
      />
    </div>
  );
}
