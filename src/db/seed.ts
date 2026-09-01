// Standalone script — run with `npm run db:seed` (uses tsx, not the Next.js runtime),
// so env vars must be loaded here explicitly rather than relying on Next's auto-loading.
// Deliberately does NOT import the shared `db` singleton from "./index": that module reads
// process.env.DATABASE_URL at top-level (module-evaluation) time, and ESM hoists all
// `import` evaluation ahead of this file's own statements — so by the time our dotenv
// config() call below would run, "./index" would already have frozen db/pool as null.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as schema from "./schema";
import {
  categories as staticCategories,
  categoryProducts,
  products as staticProducts,
} from "../lib/data";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  try {
    console.log(`Seeding ${staticCategories.length} categories...`);
    // onConflictDoUpdate, scoped to just sortOrder: `categories`'s static array order
    // IS the intended display order (see the sort_order column addition), so re-running
    // the seed needs to backfill/refresh ordering on already-seeded rows. Every other
    // field stays onConflictDoNothing-equivalent (left out of `set`) so this can't
    // clobber a name/image/blurb edit made through the Admin Dashboard.
    await db
      .insert(schema.categories)
      .values(
        staticCategories.map((c, i) => ({
          slug: c.slug,
          name: c.name,
          count: c.count,
          image: c.image,
          blurb: c.blurb,
          sortOrder: i,
        }))
      )
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: { sortOrder: sql`excluded.sort_order` },
      });

    // The static `products` array (src/lib/data.ts) was originally generated FROM
    // categoryProducts using this exact slugify + collision-suffix logic, so slugs
    // line up 1:1 — this lookup carries over sport/badge/featured/rating/reviews/
    // price/oldPrice/colors/sizes, none of which categoryProducts itself stores.
    const productsBySlug = new Map(staticProducts.map((p) => [p.slug, p]));

    const usedSlugs = new Set<string>();
    const productRows: (typeof schema.products.$inferInsert)[] = [];
    for (const [categorySlug, items] of Object.entries(categoryProducts)) {
      for (const item of items) {
        let slug = slugify(item.name);
        if (usedSlugs.has(slug)) slug = `${slug}-${categorySlug}`;
        usedSlugs.add(slug);

        const match = productsBySlug.get(slug);

        productRows.push({
          slug,
          name: item.name,
          categorySlug,
          description: item.description,
          fabric: item.fabric ?? null,
          tags: item.tags ?? [],
          images: [item.image],
          position: item.position ?? null,
          sport: match?.sport ?? null,
          badge: match?.badge ?? null,
          featured: match?.featured ?? false,
          rating: match?.rating ?? null,
          reviews: match?.reviews ?? 0,
          price: match?.price ?? 0,
          oldPrice: match?.oldPrice ?? null,
          colors: match?.colors.map((c) => c.name) ?? null,
          sizes: match?.sizes ?? null,
        });
      }
    }

    console.log(`Seeding ${productRows.length} products...`);
    // onConflictDoUpdate (not DoNothing): re-running the seed after this schema change
    // needs to backfill the new columns onto already-seeded rows, not just skip them
    // because the slug already exists. Deliberately only touches the NEW columns on
    // conflict — name/description/fabric/tags/images/position are left alone so this
    // doesn't clobber any edits already made through the Admin Dashboard.
    await db
      .insert(schema.products)
      .values(productRows)
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          sport: sql`excluded.sport`,
          badge: sql`excluded.badge`,
          featured: sql`excluded.featured`,
          rating: sql`excluded.rating`,
          reviews: sql`excluded.reviews`,
          price: sql`excluded.price`,
          oldPrice: sql`excluded.old_price`,
          colors: sql`excluded.colors`,
          sizes: sql`excluded.sizes`,
        },
      });

    const adminEmail = "admin@blackshark.com";
    const adminPassword = "BlackShark@2024";
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    console.log(`Seeding admin user (${adminEmail})...`);
    await db
      .insert(schema.adminUsers)
      .values({ email: adminEmail, passwordHash })
      .onConflictDoNothing({ target: schema.adminUsers.email });

    console.log("Seed complete.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
