import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProductsExplorer } from "@/components/site/products-explorer";
import { getSiteProducts, getSiteCategories } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products — Custom Sportswear & Uniforms",
  description:
    "Browse Black Shark's full range of custom sports uniforms, training wear, jackets, activewear and accessories.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const [{ sport }, products, categories] = await Promise.all([
    searchParams,
    getSiteProducts(),
    getSiteCategories(),
  ]);

  return (
    <>
      <PageHero
        title="The Full Collection"
        subtitle="Premium performance apparel — customisable, sublimated and built to last. Filter your way to the perfect kit."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <ProductsExplorer products={products} categories={categories} initialSport={sport} />
    </>
  );
}
