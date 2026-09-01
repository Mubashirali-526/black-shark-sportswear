import { and, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories as categoriesTable, products as productsTable } from "@/db/schema";
import {
  categories as staticCategories,
  categoryProducts as staticCategoryProducts,
  categorySubcategories as staticCategorySubcategories,
  demoProduct,
  products as staticProducts,
  type Category,
  type CategoryProduct,
  type Product,
} from "@/lib/data";

const commonColors = [
  { name: "Onyx Black", hex: "#0b0b0b" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Steel Grey", hex: "#8a8f98" },
  { name: "Shark Blue", hex: "#1e3a5f" },
];
const colorHexByName = new Map(commonColors.map((c) => [c.name, c.hex]));
const commonSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const VALID_BADGES = new Set(["New", "Best Seller", "Sale"]);
const baseSpecs = [
  { label: "Fabric", value: "180 GSM Recycled Poly-Interlock" },
  { label: "Fit", value: "Athletic / Regular" },
  { label: "Print", value: "Full Sublimation" },
  { label: "MOQ", value: "20 pieces" },
  { label: "Lead Time", value: "15 days" },
  { label: "Origin", value: "Made in Pakistan" },
];

const DEFAULT_SPORT: Record<string, string> = {
  "team-uniforms": "Soccer",
  activewear: "Running",
  "sublimation-wear": "Soccer",
  "youth-sportswear": "Soccer",
  "boxing-gloves": "Boxing",
  bags: "Soccer",
};

function sportFor(categorySlug: string, tags: string[] | null) {
  if (categorySlug === "team-uniforms") {
    if (tags?.includes("Basketball")) return "Basketball";
    if (tags?.includes("Rugby")) return "Rugby";
    return "Soccer";
  }
  return DEFAULT_SPORT[categorySlug] ?? "Soccer";
}

// Fallback only, for rows where rating/reviews are still null (e.g. a product added
// through the Admin Dashboard before that field was filled in) — derives a value
// that's stable across requests for the same product id, rather than either faking
// fresh randomness on every load or rendering empty stars.
function hashSeed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h >>> 0;
}
function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function derivedRatingAndReviews(id: string) {
  const rand = mulberry32(hashSeed(id));
  return {
    rating: Math.round((4.5 + rand() * 0.4) * 10) / 10,
    reviews: Math.floor(50 + rand() * 251),
  };
}

/** All 12 categories. Falls back to the static list only if the DB is unreachable. */
export async function getSiteCategories(): Promise<Category[]> {
  if (!db) return staticCategories;
  try {
    const rows = await db.select().from(categoriesTable).orderBy(categoriesTable.sortOrder);
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      count: r.count ?? 0,
      image: r.image ?? "",
      blurb: r.blurb ?? "",
    }));
  } catch {
    return staticCategories;
  }
}

/** Real (joined) product count per category slug — used to decide whether a category card links to its detail page. */
export async function getCategoryProductCounts(): Promise<Record<string, number>> {
  if (!db) {
    return Object.fromEntries(
      Object.entries(staticCategoryProducts).map(([slug, items]) => [slug, items.length])
    );
  }
  try {
    const rows = await db
      .select({
        slug: categoriesTable.slug,
        count: sql<number>`count(${productsTable.id})::int`,
      })
      .from(categoriesTable)
      .leftJoin(productsTable, eq(productsTable.categorySlug, categoriesTable.slug))
      .groupBy(categoriesTable.id, categoriesTable.slug);
    return Object.fromEntries(rows.map((r) => [r.slug, r.count]));
  } catch {
    return Object.fromEntries(
      Object.entries(staticCategoryProducts).map(([slug, items]) => [slug, items.length])
    );
  }
}

/** Products for a single category's detail page, in the CategoryProduct shape. */
export async function getSiteCategoryProducts(categorySlug: string): Promise<CategoryProduct[]> {
  if (!db) return staticCategoryProducts[categorySlug] ?? [];
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.categorySlug, categorySlug))
      .orderBy(desc(productsTable.createdAt));
    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      image: r.images?.[0] ?? "",
      fabric: r.fabric ?? undefined,
      description: r.description ?? "",
      tags: r.tags ?? undefined,
      position: r.position ?? undefined,
    }));
  } catch {
    return staticCategoryProducts[categorySlug] ?? [];
  }
}

function mapDbProduct(
  row: typeof productsTable.$inferSelect,
  categoryNameBySlug: Map<string, string>
): Product {
  // rating is nullable (an admin-added product may not have set one yet); reviews
  // always has a real value (notNull + default 0), so only rating needs a fallback.
  const ratingFallback = row.rating == null ? derivedRatingAndReviews(row.id).rating : null;
  const badge = VALID_BADGES.has(row.badge ?? "") ? (row.badge as Product["badge"]) : undefined;

  return {
    slug: row.slug,
    productId: row.productId ?? undefined,
    name: row.name,
    category: categoryNameBySlug.get(row.categorySlug) ?? row.categorySlug,
    categorySlug: row.categorySlug,
    sport: row.sport ?? sportFor(row.categorySlug, row.tags),
    price: row.price ?? 0,
    oldPrice: row.oldPrice ?? undefined,
    rating: row.rating ?? ratingFallback!,
    reviews: row.reviews,
    description: row.description ?? "",
    images: row.images && row.images.length > 0 ? row.images : ["/categories/placeholder.png"],
    colors:
      row.colors && row.colors.length > 0
        ? row.colors.map((name) => ({ name, hex: colorHexByName.get(name) ?? "#0b0b0b" }))
        : commonColors,
    tags: row.tags ?? undefined,
    sizes: row.sizes && row.sizes.length > 0 ? row.sizes : commonSizes,
    position: row.position ?? undefined,
    badge,
    featured: row.featured,
    specs: baseSpecs,
  };
}

/** Full product catalog in the rich Product shape used by /products and /products/[slug]. */
export async function getSiteProducts(): Promise<Product[]> {
  if (!db) return staticProducts;
  try {
    const [productRows, categoryRows] = await Promise.all([
      db.select().from(productsTable).orderBy(desc(productsTable.createdAt)),
      db.select({ slug: categoriesTable.slug, name: categoriesTable.name }).from(categoriesTable),
    ]);
    if (productRows.length === 0) return staticProducts;
    const nameBySlug = new Map(categoryRows.map((c) => [c.slug, c.name]));
    return productRows.map((r) => mapDbProduct(r, nameBySlug));
  } catch {
    return staticProducts;
  }
}

/** Distinct subcategory names for a category, merging live DB values (products.subCategory)
 * with the curated static list in data.ts, so an admin rename/addition shows up on the public
 * site without needing a matching entry in that category's local subcategories.ts. */
export async function getSiteSubcategories(categorySlug: string): Promise<string[]> {
  const staticSubs = staticCategorySubcategories[categorySlug] ?? [];
  if (!db) return staticSubs;
  try {
    const rows = await db
      .selectDistinct({ subCategory: productsTable.subCategory })
      .from(productsTable)
      .where(
        and(
          eq(productsTable.categorySlug, categorySlug),
          isNotNull(productsTable.subCategory),
          ne(productsTable.subCategory, "")
        )
      );
    const dbSubs = rows.map((r) => r.subCategory).filter((v): v is string => Boolean(v));
    return [...new Set([...dbSubs, ...staticSubs])].sort();
  } catch {
    return staticSubs;
  }
}

/** Products for a subcategory landing page (e.g. /categories/team-uniforms/basketball), in the full Product shape used by ProductCard. No static fallback — a subcategory with no DB products just renders its empty state. */
export async function getSiteSubcategoryProducts(
  categorySlug: string,
  subCategory: string
): Promise<Product[]> {
  if (!db) return [];
  try {
    const [productRows, categoryRows] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(
          and(
            eq(productsTable.categorySlug, categorySlug),
            eq(productsTable.subCategory, subCategory)
          )
        )
        .orderBy(desc(productsTable.createdAt)),
      db.select({ slug: categoriesTable.slug, name: categoriesTable.name }).from(categoriesTable),
    ]);
    const nameBySlug = new Map(categoryRows.map((c) => [c.slug, c.name]));
    return productRows.map((r) => mapDbProduct(r, nameBySlug));
  } catch {
    return [];
  }
}

/** Single product lookup for /products/[slug] — tries the DB directly before falling back. */
export async function getSiteProductBySlug(slug: string): Promise<Product | null> {
  if (slug === demoProduct.slug) return demoProduct;
  if (!db) return staticProducts.find((p) => p.slug === slug) ?? null;
  try {
    const [row] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);
    if (!row) {
      return staticProducts.find((p) => p.slug === slug) ?? null;
    }
    const categoryRows = await db
      .select({ slug: categoriesTable.slug, name: categoriesTable.name })
      .from(categoriesTable);
    return mapDbProduct(row, new Map(categoryRows.map((c) => [c.slug, c.name])));
  } catch {
    return staticProducts.find((p) => p.slug === slug) ?? null;
  }
}
