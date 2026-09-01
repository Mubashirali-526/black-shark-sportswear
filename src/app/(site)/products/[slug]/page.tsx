import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getSiteProductBySlug, getSiteProducts } from "@/lib/site-data";
import { ProductDetail } from "@/components/site/product-detail";
import { ProductGrid } from "@/components/site/product-grid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSiteProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getSiteProductBySlug(slug),
    getSiteProducts(),
  ]);
  if (!product) notFound();

  const related = allProducts
    .filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug)
    .slice(0, 4);
  const fallback = allProducts.filter((p) => p.slug !== product.slug).slice(0, 4);
  const relatedList = related.length >= 4 ? related : fallback;

  return (
    <div className="bg-[#0a0a0a] text-white">
      <div className="border-b border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/45">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-accent">Products</Link>
            <ChevronRight size={12} />
            <span className="text-accent">{product.name}</span>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60 transition-colors hover:text-accent"
          >
            <ArrowLeft size={14} />
            Back to Products
          </Link>
        </div>
      </div>

      <ProductDetail product={product} />

      <section className="border-t border-white/10 py-20">
        <div className="container-x">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            — Related —
          </div>
          <h2 className="relative inline-block pb-3 font-display text-3xl font-bold text-white sm:text-4xl">
            You May Also Like
            <span className="absolute bottom-0 left-0 h-[3px] w-[60px] rounded-full bg-accent" />
          </h2>
          <div className="mt-12">
            <ProductGrid products={relatedList} />
          </div>
        </div>
      </section>
    </div>
  );
}
