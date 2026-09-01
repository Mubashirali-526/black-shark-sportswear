"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ChevronRight, ChevronDown } from "lucide-react";
import { Logo } from "./logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/data";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

type MegaMenuItem = { name: string; parentSlug: string; slug: string };
type MegaMenuColumn = { heading: string; items: MegaMenuItem[] };

const megaMenuColumns: MegaMenuColumn[] = [
  {
    heading: "Team Uniforms",
    items: [
      { name: "Football / Soccer", parentSlug: "team-uniforms", slug: "football" },
      { name: "Cricket", parentSlug: "team-uniforms", slug: "cricket" },
      { name: "Basketball", parentSlug: "team-uniforms", slug: "basketball" },
      { name: "Rugby", parentSlug: "team-uniforms", slug: "rugby" },
      { name: "Boxing & MMA", parentSlug: "team-uniforms", slug: "boxing-mma" },
      { name: "Baseball & Softball", parentSlug: "team-uniforms", slug: "baseball-softball" },
      { name: "Volleyball", parentSlug: "team-uniforms", slug: "volleyball" },
      { name: "Martial Arts", parentSlug: "team-uniforms", slug: "martial-arts" },
      { name: "Athletics / Running", parentSlug: "team-uniforms", slug: "athletics-running" },
      { name: "Gym & Fitness", parentSlug: "team-uniforms", slug: "gym-fitness" },
    ],
  },
  {
    heading: "Activewear & Sublimation",
    items: [
      { name: "Women's Activewear", parentSlug: "activewear", slug: "womens-activewear" },
      { name: "Men's Activewear", parentSlug: "activewear", slug: "mens-activewear" },
      { name: "Compression Wear", parentSlug: "activewear", slug: "compression-wear" },
      { name: "Full Body Sublimation", parentSlug: "sublimation-wear", slug: "full-body-sublimation" },
      { name: "Galaxy & Space Print", parentSlug: "sublimation-wear", slug: "galaxy-space-print" },
      { name: "Flame & Lava Print", parentSlug: "sublimation-wear", slug: "flame-lava-print" },
      { name: "Geometric Print", parentSlug: "sublimation-wear", slug: "geometric-abstract" },
      { name: "Watercolor Print", parentSlug: "sublimation-wear", slug: "watercolor-brush-stroke" },
      { name: "Gradient Print", parentSlug: "sublimation-wear", slug: "gradient-ombre" },
      { name: "Custom Design", parentSlug: "sublimation-wear", slug: "custom-design" },
    ],
  },
  {
    heading: "Gloves & Bags",
    items: [
      { name: "Boxing Gloves", parentSlug: "boxing-gloves", slug: "boxing-gloves" },
      { name: "MMA Gloves", parentSlug: "boxing-gloves", slug: "mma-gloves" },
      { name: "Batting Gloves", parentSlug: "boxing-gloves", slug: "batting-gloves" },
      { name: "Goalkeeper Gloves", parentSlug: "boxing-gloves", slug: "goalkeeper-gloves" },
      { name: "Sports Duffel Bags", parentSlug: "bags", slug: "sports-duffel" },
      { name: "Team Backpacks", parentSlug: "bags", slug: "team-backpacks" },
      { name: "Gym Bags", parentSlug: "bags", slug: "gym-bags" },
      { name: "Boot Bags", parentSlug: "bags", slug: "boot-bags" },
      { name: "Cricket Kit Bags", parentSlug: "bags", slug: "cricket-kit-bags" },
      { name: "Shoe Bags", parentSlug: "bags", slug: "shoe-sneaker-bags" },
    ],
  },
  {
    heading: "Accessories & Apparel",
    items: [
      { name: "Caps & Headwear", parentSlug: "accessories-apparel", slug: "caps-headwear" },
      { name: "Sports Socks", parentSlug: "accessories-apparel", slug: "sports-socks" },
      { name: "Hoodies", parentSlug: "accessories-apparel", slug: "hoodies-sweatshirts" },
      { name: "Track Jackets", parentSlug: "accessories-apparel", slug: "track-jackets-windbreakers" },
      { name: "T-Shirts & Tees", parentSlug: "accessories-apparel", slug: "t-shirts-tees" },
      { name: "Polo Shirts", parentSlug: "accessories-apparel", slug: "polo-shirts" },
      { name: "Compression Layers", parentSlug: "accessories-apparel", slug: "compression-base-layers" },
      { name: "Training Shorts", parentSlug: "accessories-apparel", slug: "training-shorts" },
      { name: "Tracksuits", parentSlug: "accessories-apparel", slug: "tracksuits-jogger-sets" },
      { name: "Fan Merchandise", parentSlug: "accessories-apparel", slug: "custom-fan-merchandise" },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [navBottom, setNavBottom] = useState(76);
  const categoriesRef = useRef<HTMLLIElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeMegaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  function openMegaMenu() {
    if (closeMegaTimer.current) {
      clearTimeout(closeMegaTimer.current);
      closeMegaTimer.current = null;
    }
    setCategoriesOpen(true);
  }

  function scheduleCloseMegaMenu() {
    closeMegaTimer.current = setTimeout(() => setCategoriesOpen(false), 200);
  }

  useEffect(() => {
    return () => {
      if (closeMegaTimer.current) clearTimeout(closeMegaTimer.current);
    };
  }, []);

  useEffect(() => {
    function updateMetrics() {
      setScrolled(window.scrollY > 12);
      if (headerRef.current) {
        setNavBottom(headerRef.current.getBoundingClientRect().bottom);
      }
    }
    updateMetrics();
    window.addEventListener("scroll", updateMetrics, { passive: true });
    window.addEventListener("resize", updateMetrics);
    return () => {
      window.removeEventListener("scroll", updateMetrics);
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!categoriesOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoriesOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-white">
        <div className="container-x flex h-9 items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]">
          <span className="hidden sm:inline">Free design proof</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span>Trusted in 40+ countries</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline">Low MOQ from 20 pieces</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline">Custom Branding Available</span>
        </div>
      </div>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-ink/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            : "bg-white"
        )}
      >
        <nav className="container-x flex h-16 items-center gap-4">
          <Logo />

          <div className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              if (link.href === "/categories") {
                return (
                  <li
                    key={link.href}
                    ref={categoriesRef}
                    onMouseEnter={openMegaMenu}
                    onMouseLeave={scheduleCloseMegaMenu}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-accent",
                        active ? "text-ink" : "text-ink/55"
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          categoriesOpen && "rotate-180"
                        )}
                      />
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
                        />
                      )}
                    </Link>

                    {/* Mega menu panel — position: fixed so it can never affect page
                        layout or inherit a narrow containing block from this <li>. */}
                    <div
                      style={{ top: navBottom }}
                      className={cn(
                        "fixed left-0 right-0 z-[9999] grid grid-cols-[200px_1fr_1fr_1fr_1fr] gap-10 border-t-2 border-[#C9A84C] bg-[#111111] px-20 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-200 ease-out",
                        categoriesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-2 opacity-0"
                      )}
                    >
                      <div className="border-r border-white/10 pr-8">
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                          Our Collections
                        </span>
                        <h3 className="mt-3 text-[20px] font-bold text-white">
                          Sports &amp; Teamwear
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#888888]">
                          Premium custom sportswear from Sialkot.
                        </p>
                        <Link
                          href="/categories"
                          onClick={() => setCategoriesOpen(false)}
                          className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/10"
                        >
                          View All <ChevronRight size={14} />
                        </Link>
                      </div>

                      {megaMenuColumns.map((column) => (
                        <div key={column.heading}>
                          <h4 className="relative inline-block pb-2.5 text-[11px] font-bold uppercase tracking-[2px] text-accent">
                            {column.heading}
                            <span className="absolute bottom-0 left-0 h-[2px] w-[30px] bg-accent" />
                          </h4>
                          <ul className="mt-4 list-none">
                            {column.items.map((item) => (
                              <li key={item.slug}>
                                <Link
                                  href={`/categories/${item.parentSlug}/${item.slug}`}
                                  onClick={() => setCategoriesOpen(false)}
                                  className="block py-1 text-[13px] text-[#888888] transition-colors duration-200 hover:text-accent"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-accent",
                      active ? "text-ink" : "text-ink/55"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/products"
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Search size={19} />
            </Link>
            <ButtonLink
              href="/quote"
              size="sm"
              className="ml-6 hidden xl:inline-flex rounded-full"
            >
              Request a Quote
            </ButtonLink>

          

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[86%] max-w-sm flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col">
                  {links.map((link, i) => {
                    const active =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                            active
                              ? "bg-ink text-white"
                              : "text-ink/80 hover:bg-ink/5"
                          )}
                        >
                          {link.label}
                          <ChevronRight size={18} className="opacity-40" />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              <div className="space-y-3 border-t border-ink/10 p-5">
                <ButtonLink href="/quote" className="w-full">
                  Request a Quote
                </ButtonLink>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
