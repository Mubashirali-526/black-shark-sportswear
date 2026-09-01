const VALID_BADGES = new Set(["New", "Best Seller", "Sale"]);

/** Shared body-parsing for the admin product create/update routes. */
export function parseProductFields(body: Record<string, unknown>) {
  const badge = typeof body.badge === "string" && VALID_BADGES.has(body.badge) ? body.badge : null;
  return {
    description: (body.description as string | null) ?? null,
    fabric: (body.fabric as string | null) ?? null,
    tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
    images: Array.isArray(body.images) ? (body.images as string[]) : [],
    position: (body.position as string | null) ?? null,
    sport: (body.sport as string | null) ?? null,
    badge,
    subCategory: (body.subCategory as string | null) ?? null,
    featured: Boolean(body.featured),
    rating: body.rating === null || body.rating === undefined ? null : Number(body.rating),
    reviews: body.reviews === null || body.reviews === undefined ? 0 : Number(body.reviews),
    price: body.price === null || body.price === undefined ? 0 : Number(body.price),
  };
}
