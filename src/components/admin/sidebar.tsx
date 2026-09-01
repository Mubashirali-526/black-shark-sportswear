"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Grid },
  { href: "/admin/quotes", label: "Quote Requests", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-[#222222] bg-[#0a0a0a]">
      <div className="flex items-center gap-3 border-b border-[#222222] px-6 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-ink">
          BS
        </span>
        <div>
          <div className="font-display text-sm font-bold leading-none text-white">
            BLACK SHARK
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
            Admin Panel
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-accent bg-white/5 text-accent"
                  : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#222222] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
