import { pgTable, serial, text, integer, uuid, timestamp, boolean, real } from "drizzle-orm/pg-core";

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  count: integer("count").default(0),
  image: text("image"),
  blurb: text("blurb"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  productId: text("product_id").unique(), // human-readable, e.g. "BS-ACT-001" — see src/lib/product-id.ts
  name: text("name").notNull(),
  categorySlug: text("category_slug")
    .notNull()
    .references(() => categories.slug),
  description: text("description"),
  fabric: text("fabric"),
  tags: text("tags").array(),
  images: text("images").array(),
  position: text("position"),
  sport: text("sport"),
  badge: text("badge"), // 'New' | 'Best Seller' | 'Sale' | null
  subCategory: text("sub_category"),
  featured: boolean("featured").notNull().default(false),
  rating: real("rating"),
  reviews: integer("reviews").notNull().default(0),
  price: integer("price").notNull().default(0),
  oldPrice: integer("old_price"),
  colors: text("colors").array(),
  sizes: text("sizes").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Contact
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  businessType: text("business_type"),
  // Location
  country: text("country"),
  city: text("city"),
  // Order
  category: text("category"),
  sport: text("sport"),
  quantity: text("quantity"),
  budget: text("budget"),
  deliveryDate: text("delivery_date"),
  // Design
  customLogo: text("custom_logo"),
  customColors: text("custom_colors"),
  hasExistingDesign: text("has_existing_design"),
  decorationMethod: text("decoration_method"),
  // Project
  description: text("description"),
  hearAboutUs: text("hear_about_us"),
  // Meta
  status: text("status").default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
