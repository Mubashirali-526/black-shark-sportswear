"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/categories": "Categories",
  "/admin/quotes": "Quote Requests",
};

function resolveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (/^\/admin\/products\/[^/]+\/edit$/.test(pathname)) return "Edit Product";
  return "Admin";
}

export function AdminTopbar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-[#222222] bg-[#111111] px-6 py-4 md:px-8">
      <div>
        <h1 className="font-display text-lg font-bold text-white">
          {resolveTitle(pathname)}
        </h1>
        <p className="mt-0.5 text-xs text-[#888888]">{today}</p>
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-display text-xs font-bold text-ink">
            BS
          </span>
          <span className="text-sm text-white/70">{email}</span>
          <ChevronDown
            size={14}
            className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-lg border border-[#222222] bg-[#1a1a1a] py-1 shadow-xl">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
