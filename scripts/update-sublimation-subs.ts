// One-time script — run with `npx tsx scripts/update-sublimation-subs.ts`.
// Deliberately does NOT import the shared `db` singleton from "../src/db/index": that module
// reads process.env.DATABASE_URL at top-level (module-evaluation) time, and ESM hoists all
// `import` evaluation ahead of this file's own statements — so by the time our dotenv config()
// call below would run, "../src/db/index" would already have frozen db/pool as null.
// (Same pattern as src/db/seed.ts.)
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { products } from "../src/db/schema";

const NEW_SUBCATEGORIES = [
  "Football Kit Sublimation",
  "Cricket Kit Sublimation",
  "Basketball Jersey Sublimation",
  "Hockey Kit Sublimation",
  "MMA & Boxing Sublimation",
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set (expected in .env.local).");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool, { schema });

  const rows = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(eq(products.categorySlug, "sublimation-wear"));

  if (rows.length === 0) {
    console.log(
      "No products found with categorySlug = 'sublimation-wear' — nothing to update. " +
        "(Existing subCategory values, if any, would be cleared, but there are no rows to touch.)"
    );
    await pool.end();
    return;
  }

  console.log(`Found ${rows.length} sublimation-wear product(s). Assigning subcategories...`);

  for (let i = 0; i < rows.length; i++) {
    const newSubCategory = NEW_SUBCATEGORIES[i % NEW_SUBCATEGORIES.length];
    await db
      .update(products)
      .set({ subCategory: newSubCategory })
      .where(and(eq(products.id, rows[i].id), eq(products.categorySlug, "sublimation-wear")));
    console.log(`  ${rows[i].name} -> ${newSubCategory}`);
  }

  console.log(`Done. Updated ${rows.length} row(s).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
