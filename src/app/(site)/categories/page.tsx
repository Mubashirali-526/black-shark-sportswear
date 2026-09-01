import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CategoriesContent } from "@/components/site/categories-content";
import { getSiteCategories, getCategoryProductCounts } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse Black Shark's 12 product categories — from team uniforms to custom printing and accessories.",
};

export default async function CategoriesPage() {
  const [categories, categoriesWithProducts] = await Promise.all([
    getSiteCategories(),
    getCategoryProductCounts(),
  ]);

  return (
    <>
      <PageHero
        title="Product Categories"
        subtitle="Ranges engineered for every athlete, every discipline and every level of play."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />
      <CategoriesContent categories={categories} categoriesWithProducts={categoriesWithProducts} />
    </>
  );
}
