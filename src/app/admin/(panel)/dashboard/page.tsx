import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { Package, Grid, MessageSquare, Plus } from "lucide-react";
import { db } from "@/db";
import { products, categories, quoteRequests } from "@/db/schema";
import { StatusBadge } from "@/components/admin/status-badge";
import { StatCardsGrid, type StatCardData } from "@/components/admin/stat-cards-grid";
import { QuotesBarChart } from "@/components/admin/charts/quotes-bar-chart";
import { CategoryPieChart } from "@/components/admin/charts/category-pie-chart";
import { CategoryBarChart } from "@/components/admin/charts/category-bar-chart";

function pctChange(current: number, previous: number) {
  if (previous > 0) return Math.round(((current - previous) / previous) * 100);
  return current > 0 ? 100 : 0;
}

async function getStats() {
  if (!db) {
    return {
      products: { total: 0, deltaPct: 0 },
      categories: { total: 0, deltaPct: 0 },
      newQuotes: 0,
      quotesDeltaPct: 0,
    };
  }

  // Cumulative catalog size now vs. 30 days ago, both real counts from created_at.
  const [
    [productsNow],
    [productsPrev],
    [categoriesNow],
    [categoriesPrev],
    [newQuotesRow],
    [last30],
    [prev30],
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(products),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(sql`${products.createdAt} <= now() - interval '30 days'`),
    db.select({ count: sql<number>`count(*)::int` }).from(categories),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(categories)
      .where(sql`${categories.createdAt} <= now() - interval '30 days'`),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(quoteRequests)
      .where(eq(quoteRequests.status, "new")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(quoteRequests)
      .where(sql`${quoteRequests.createdAt} >= now() - interval '30 days'`),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(quoteRequests)
      .where(
        sql`${quoteRequests.createdAt} >= now() - interval '60 days' and ${quoteRequests.createdAt} < now() - interval '30 days'`
      ),
  ]);

  return {
    products: {
      total: productsNow?.count ?? 0,
      deltaPct: pctChange(productsNow?.count ?? 0, productsPrev?.count ?? 0),
    },
    categories: {
      total: categoriesNow?.count ?? 0,
      deltaPct: pctChange(categoriesNow?.count ?? 0, categoriesPrev?.count ?? 0),
    },
    newQuotes: newQuotesRow?.count ?? 0,
    quotesDeltaPct: pctChange(last30?.count ?? 0, prev30?.count ?? 0),
  };
}

async function getRecentQuotes() {
  if (!db) return [];
  return db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt)).limit(5);
}

/** Last 6 calendar months of quote requests, real counts with zero-filled gaps. */
async function getMonthlyQuotes() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      month: d.toLocaleString("en-US", { month: "short" }),
    };
  });

  if (!db) return months.map((m) => ({ month: m.month, count: 0 }));

  const rows = await db
    .select({
      key: sql<string>`to_char(date_trunc('month', ${quoteRequests.createdAt}), 'YYYY-MM')`,
      count: sql<number>`count(*)::int`,
    })
    .from(quoteRequests)
    .where(sql`${quoteRequests.createdAt} >= now() - interval '6 months'`)
    .groupBy(sql`date_trunc('month', ${quoteRequests.createdAt})`);

  const map = new Map(rows.map((r) => [r.key, r.count]));
  return months.map((m) => ({ month: m.month, count: map.get(m.key) ?? 0 }));
}

/** All categories with their real product counts (left join so zero-product categories still show). */
async function getCategoryBreakdown() {
  if (!db) return [];
  const rows = await db
    .select({
      name: categories.name,
      count: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categorySlug, categories.slug))
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`count(${products.id})`));
  return rows;
}

export default async function AdminDashboardPage() {
  const [stats, recentQuotes, monthlyQuotes, categoryBreakdown] = await Promise.all([
    getStats(),
    getRecentQuotes(),
    getMonthlyQuotes(),
    getCategoryBreakdown(),
  ]);

  const statCards: StatCardData[] = [
    {
      label: "Total Products",
      value: stats.products.total,
      icon: <Package size={28} />,
      deltaPct: stats.products.deltaPct,
      deltaLabel: "vs 30 days ago",
    },
    {
      label: "Total Categories",
      value: stats.categories.total,
      icon: <Grid size={28} />,
      deltaPct: stats.categories.deltaPct,
      deltaLabel: "vs 30 days ago",
    },
    {
      label: "New Quote Requests",
      value: stats.newQuotes,
      icon: <MessageSquare size={28} />,
      deltaPct: stats.quotesDeltaPct,
      deltaLabel: "volume vs last 30 days",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-accent">
          Welcome back, Admin 👋
        </h2>
        <p className="mt-1 text-sm text-[#888888]">
          Here&apos;s what&apos;s happening with Black Shark today.
        </p>
      </div>

      <StatCardsGrid stats={statCards} />

      {/* Row 2 — quotes trend (60%) + category donut (40%) */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 lg:col-span-3">
          <h3 className="mb-4 font-display text-base font-bold text-white">
            Quote Requests — Last 6 Months
          </h3>
          <QuotesBarChart data={monthlyQuotes} />
        </div>
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-base font-bold text-white">
            Products by Category
          </h3>
          <CategoryPieChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Row 3 — full-width category distribution */}
      <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
        <h3 className="mb-4 font-display text-base font-bold text-white">
          Category Distribution
        </h3>
        <CategoryBarChart data={categoryBreakdown} />
      </div>

      {/* Row 4 — quick actions + recent quotes */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-base font-bold text-white">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:brightness-105"
            >
              <Plus size={16} />
              Add Product
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 rounded-lg border border-[#222222] bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent/60"
            >
              <Plus size={16} />
              Add Category
            </Link>
            <Link
              href="/admin/quotes"
              className="inline-flex items-center gap-2 rounded-lg border border-[#222222] bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-accent/60"
            >
              View Quotes
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-[#222222] bg-[#111111] lg:col-span-3">
          <div className="border-b border-[#222222] px-5 py-4">
            <h3 className="font-display text-base font-bold text-white">
              Recent Quote Requests
            </h3>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="p-6 text-sm text-[#888888]">No quote requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#222222] text-xs uppercase tracking-wide text-[#888888]">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Sport</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((q, i) => (
                    <tr
                      key={q.id}
                      className={`border-b border-[#1a1a1a] transition-colors hover:bg-white/[0.03] ${
                        i % 2 === 1 ? "bg-white/[0.015]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-white">{q.name}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">{q.sport ?? "—"}</td>
                      <td className="px-5 py-3 text-[#aaaaaa]">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={q.status ?? "new"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
