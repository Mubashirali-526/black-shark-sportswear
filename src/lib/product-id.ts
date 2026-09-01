export const CATEGORY_CODES: Record<string, string> = {
  "team-uniforms": "TU",
  activewear: "ACT",
  "sublimation-wear": "SUB",
  "youth-sportswear": "YS",
  "boxing-gloves": "BG",
  bags: "BAG",
  "accessories-apparel": "ACC",
};

export function categoryCodeFor(categorySlug: string): string {
  return CATEGORY_CODES[categorySlug] ?? categorySlug.slice(0, 3).toUpperCase();
}

/** Builds the next sequential product ID for a category given the existing IDs already used within it. */
export function nextProductId(categorySlug: string, existingIdsInCategory: string[]): string {
  const code = categoryCodeFor(categorySlug);
  const prefix = `BS-${code}-`;
  let max = 0;
  for (const id of existingIdsInCategory) {
    if (!id.startsWith(prefix)) continue;
    const n = Number(id.slice(prefix.length));
    if (Number.isFinite(n) && n > max) max = n;
  }
  const next = max + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}
