# Black Shark Frontend

A Next.js marketing website for a custom sportswear manufacturer, with a full Admin Dashboard on top of a Supabase database. The project includes a product catalog, category browsing, manufacturing information, gallery, portfolio, FAQs, a quote request flow, a WhatsApp contact CTA, and an authenticated `/admin` panel for managing products/categories/gallery/quote requests. There is no blog and no cart — both were removed; see `CLAUDE.md` for the full history.

## Tech Stack

- Next.js 16 (App Router) — frontend framework for building the website
- React 19 — UI library used for building interactive components
- TypeScript — programming language that adds type safety
- Tailwind CSS v4 — styling framework for fast UI design (CSS-first config, no `tailwind.config.js`)
- Framer Motion — animation library for smooth effects
- Recharts — charts on the Admin Dashboard
- Drizzle ORM — tool for database access and queries
- Supabase Postgres — database used for data storage
- jose — JWT signing/verification for admin sessions (edge-runtime compatible)
- bcryptjs — password hashing for the admin login
- ESLint — tool for keeping code clean and consistent

## Features

- Responsive landing page and multi-page marketing site
- Product catalog (no cart/checkout wiring, no prices shown publicly — quote-driven instead) and detail pages, now DB-backed with a static fallback (see Database section)
- Categories, portfolio, gallery, and contact pages
- Quote request page and WhatsApp lead funnel
- Wishlist and checkout page templates (demo state, not persisted)
- Health API route for uptime monitoring, and a working newsletter signup that writes to Postgres
- **Admin Dashboard** (`/admin`) — email/password login (JWT in an httpOnly cookie), a stats + charts dashboard, and full CRUD for products, categories, gallery images, and quote requests, all backed by real Supabase queries with no mock data

`/products`, `/products/[slug]`, `/categories`, and `/categories/[slug]` read live from Supabase (falling back to the static arrays in `src/lib/data.ts` if the DB is unreachable) — changes made through the Admin Dashboard show up on these pages immediately. Most other pages (home, about, manufacturing, portfolio, gallery) are still static content from `src/lib/data.ts`. See `CLAUDE.md` for the full picture, including why the homepage's "Featured Categories" section was deliberately left static.

## Project Structure

```text
.
├── public/                  # Static assets like images, icons, and files
├── src/                     # Main source code of the project
│   ├── app/                 # Next.js App Router pages, layouts, and API routes
│   │   ├── (site)/          # Public site route group — its own root layout (Navbar/Footer)
│   │   │   ├── about/, categories/, checkout/, contact/, faq/, gallery/,
│   │   │   │   manufacturing/, portfolio/, privacy/, products/, quote/,
│   │   │   │   terms/, wishlist/, page.tsx (home), not-found.tsx
│   │   ├── admin/            # Admin Dashboard — its own separate root layout (no site chrome)
│   │   │   ├── login/         # /admin/login
│   │   │   └── (panel)/       # sidebar+topbar shell: dashboard/, products/, categories/,
│   │   │                        gallery/, quotes/
│   │   └── api/              # API routes (health, newsletter, admin/*)
│   ├── components/          # Reusable UI and section components
│   │   ├── site/            # Marketing website components like hero, navbar, footer
│   │   ├── admin/            # Admin Dashboard components (sidebar, topbar, charts, forms)
│   │   └── ui/              # Shared UI primitives like buttons
│   ├── db/                  # Database connection, schema, and seed script
│   └── lib/                 # Shared data (data.ts), site-data.ts (DB adapter), admin-auth.ts, utilities
├── drizzle.config.ts        # Drizzle ORM configuration (loads DATABASE_URL from .env.local)
├── next.config.ts           # Next.js configuration
├── package.json             # Project scripts and dependencies
├── tsconfig.json            # TypeScript configuration
└── eslint.config.mjs       # ESLint rules and configuration
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 20+
- npm
- A Postgres connection string (Supabase or otherwise) if you want the database-backed features — health route, newsletter signup, and `db:seed` — to work

## Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/your_database
SESSION_SECRET=<a random 32-byte hex string, used to sign admin login sessions>
```

Notes:

- The project can still build and run even when `DATABASE_URL` is not set — DB-backed routes just return a `503`/no-op instead of erroring.
- The `/api/health` route will return a `503` status if the database is not configured in the current environment.
- `drizzle.config.ts` loads `DATABASE_URL` from `.env.local` via `dotenv`. Don't replace it with a `drizzle.config.json` — JSON can't interpolate `process.env.*`, and a static/hardcoded JSON config has caused real connection mismatches in this repo's history.
- `SESSION_SECRET` is required for `/admin` login to work (it signs the JWT stored in the session cookie). Rotating it invalidates existing admin sessions but nothing else.

## Installation

```bash
npm install
```

## Database Setup

```bash
npx drizzle-kit push   # create/update tables in the DB pointed to by DATABASE_URL
npm run db:seed         # seed categories, products, and an admin user (idempotent, safe to re-run)
```

## Run the App

### Development mode

```bash
npm run dev
```

Then open:

- http://localhost:3000

### Production build

```bash
npm run build
npm run start
```

## Verification Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Common Scripts

- `npm run dev` — start local development server
- `npm run build` — create production build
- `npm run start` — run the production server
- `npm run lint` — lint the codebase
- `npm run typecheck` — run TypeScript type checking
- `npm run db:seed` — seed categories/products/admin user into the database

There is no test script/framework configured in this repo, and no `db:push`/`db:generate` npm script — run Drizzle migrations directly via `npx drizzle-kit push`.

## Notes

Products and categories are live from Supabase (`/products`, `/products/[slug]`, `/categories`, `/categories/[slug]`), with `src/lib/data.ts` acting as the seed source and as a fallback if the database is unreachable. Everything else — testimonials, gallery, manufacturing/portfolio content, the homepage's curated sections — is still static in `src/lib/data.ts`. Manage live product/category/gallery/quote-request data day-to-day through the `/admin` dashboard (see Environment Variables above for the login prerequisites) rather than by hand-editing `data.ts`, which only affects the seed/fallback content. See `CLAUDE.md` for full architectural detail and known gotchas.
