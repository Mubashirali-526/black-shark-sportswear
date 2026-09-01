import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();

  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) notFound();

  return (
    <ProductForm
      initial={{
        id: product.id,
        name: product.name,
        categorySlug: product.categorySlug,
        subCategory: product.subCategory ?? "",
        description: product.description ?? "",
        fabric: product.fabric ?? "",
        tags: product.tags ?? [],
        images: product.images ?? [],
        position: product.position ?? "",
        sport: product.sport ?? "",
        badge: product.badge ?? "None",
        featured: product.featured,
        rating: product.rating == null ? "" : String(product.rating),
        reviews: String(product.reviews),
        price: String(product.price),
      }}
    />
  );
}
