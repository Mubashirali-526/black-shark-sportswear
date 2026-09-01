"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { sports } from "@/lib/data";

type Category = { id: string; slug: string; name: string };

const BADGE_OPTIONS = ["None", "New", "Best Seller", "Sale"] as const;

const SUB_CATEGORIES: Record<string, string[]> = {
  "team-uniforms": ["Football / Soccer", "Cricket", "Basketball", "Rugby", "Boxing & MMA", "Baseball & Softball", "Volleyball", "Martial Arts", "Athletics / Running", "Gym & Fitness", "Kart Race", "Hockey", "Ice Hockey"],
  "activewear": ["Women's Activewear", "Men's Activewear", "Compression Wear", "Sports Bra & Tops", "Leggings & Tights", "Training Shorts", "Tank Tops & Stringers", "Tracksuits", "Yoga & Pilates Wear", "Swim Wear"],
  "sublimation-wear": ["Football Kit Sublimation", "Cricket Kit Sublimation", "Basketball Jersey Sublimation", "Hockey Kit Sublimation", "MMA & Boxing Sublimation"],
  "youth-sportswear": ["Youth Football", "Youth Cricket", "Youth Basketball", "Youth Rugby", "Youth Hockey", "Youth Tennis", "Youth Athletics"],
  "boxing-gloves": ["Boxing Gloves", "MMA Gloves", "Batting Gloves", "Goalkeeper Gloves", "Cycling Gloves", "Training Gloves"],
  "bags": ["Sports Duffel Bags", "Team Backpacks", "Gym Bags", "Boot Bags", "Cricket Kit Bags", "Shoe Bags"],
  "accessories-apparel": ["Caps & Headwear", "Sports Socks", "Hoodies", "Track Jackets", "T-Shirts & Tees", "Polo Shirts", "Compression Layers", "Training Shorts", "Tracksuits", "Fan Merchandise"],
};

export type ProductFormValues = {
  id?: string;
  name: string;
  categorySlug: string;
  subCategory: string;
  description: string;
  fabric: string;
  tags: string[];
  images: string[];
  position: string;
  sport: string;
  badge: string;
  featured: boolean;
  rating: string;
  reviews: string;
  price: string;
};

const EMPTY: ProductFormValues = {
  name: "",
  categorySlug: "",
  subCategory: "",
  description: "",
  fabric: "",
  tags: [],
  images: [],
  position: "",
  sport: "",
  badge: "None",
  featured: false,
  rating: "",
  reviews: "",
  price: "0",
};

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => d.ok && setCategories(d.items));
  }, []);

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !values.tags.includes(tag)) {
      setValues((v) => ({ ...v, tags: [...v.tags, tag] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValues((v) => ({ ...v, tags: v.tags.filter((t) => t !== tag) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!values.name.trim() || !values.categorySlug) {
      setError("Product name and category are required.");
      return;
    }

    setSaving(true);
    const isEdit = Boolean(values.id);
    const url = isEdit ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        categorySlug: values.categorySlug,
        subCategory: values.subCategory || null,
        description: values.description.trim() || null,
        fabric: values.fabric.trim() || null,
        tags: values.tags,
        images: values.images,
        position: values.position.trim() || null,
        sport: values.sport || null,
        badge: values.badge === "None" ? null : values.badge,
        featured: values.featured,
        rating: values.rating === "" ? null : Number(values.rating),
        reviews: values.reviews === "" ? 0 : Number(values.reviews),
        price: values.price === "" ? 0 : Number(values.price),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to save product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const uploadFolder = `categories/${values.categorySlug || "misc"}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <Field label="Product Name">
        <input
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </Field>

      <Field label="Category">
        <select
          value={values.categorySlug}
          onChange={(e) => setValues((v) => ({ ...v, categorySlug: e.target.value }))}
          className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      {values.categorySlug && SUB_CATEGORIES[values.categorySlug] && (
        <Field label="Sub Category">
          <select
            value={values.subCategory}
            onChange={(e) => setValues((v) => ({ ...v, subCategory: e.target.value }))}
            className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          >
            <option value="">Select sub-category</option>
            {SUB_CATEGORIES[values.categorySlug].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Description">
        <textarea
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </Field>

      <Field label="Fabric">
        <input
          value={values.fabric}
          onChange={(e) => setValues((v) => ({ ...v, fabric: e.target.value }))}
          className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </Field>

      <Field label="Tags">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type a tag and press Enter"
            className="h-11 flex-1 rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg border border-[#333333] px-4 text-sm font-medium text-white transition-colors hover:border-accent"
          >
            Add
          </button>
        </div>
        {values.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {values.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-[#333333] bg-[#1a1a1a] px-3 py-1 text-xs text-white"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                  <X size={12} className="text-white/50 hover:text-red-400" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <Field label="Images">
        <ImageUploader
          folder={uploadFolder}
          value={values.images}
          onChange={(images) => setValues((v) => ({ ...v, images }))}
        />
      </Field>

      <Field label="Position (optional CSS object-position override, e.g. object-[center_30%])">
        <input
          value={values.position}
          onChange={(e) => setValues((v) => ({ ...v, position: e.target.value }))}
          className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Sport">
          <select
            value={values.sport}
            onChange={(e) => setValues((v) => ({ ...v, sport: e.target.value }))}
            className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          >
            <option value="">Select a sport</option>
            {sports.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Badge">
          <select
            value={values.badge}
            onChange={(e) => setValues((v) => ({ ...v, badge: e.target.value }))}
            className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          >
            {BADGE_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Rating (0–5)">
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={values.rating}
            onChange={(e) => setValues((v) => ({ ...v, rating: e.target.value }))}
            className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          />
        </Field>

        <Field label="Reviews Count">
          <input
            type="number"
            min={0}
            step={1}
            value={values.reviews}
            onChange={(e) => setValues((v) => ({ ...v, reviews: e.target.value }))}
            className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          />
        </Field>

        <Field label="Price">
          <input
            type="number"
            min={0}
            step={1}
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            className="h-11 w-full rounded-lg border border-[#333333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent"
          />
        </Field>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 text-sm text-white">
            <button
              type="button"
              role="switch"
              aria-checked={values.featured}
              onClick={() => setValues((v) => ({ ...v, featured: !v.featured }))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                values.featured ? "bg-accent" : "bg-[#333333]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  values.featured ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            Featured Product
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-ink transition-colors hover:brightness-105 disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          Save Product
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="h-11 rounded-lg border border-[#333333] px-6 text-sm font-medium text-white transition-colors hover:border-white/40"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}
