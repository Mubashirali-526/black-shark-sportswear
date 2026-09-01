"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  LayoutGrid,
  FileText,
  PenTool,
  Truck,
  BadgeCheck,
  Package,
  Clock,
  Globe2,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Whatsapp } from "@/components/site/social-icons";
import type { Category } from "@/lib/data";

const CATEGORIES_WITH_CUSTOM_PAGES = new Set([
  "team-uniforms",
  "activewear",
  "sublimation-wear",
  "youth-sportswear",
  "boxing-gloves",
  "bags",
  "accessories-apparel",
]);

// team-uniforms/activewear use hero-banner source photos with bold
// marketing taglines baked in ("Built As One" / "Move In Style") — the
// standard bg-black/55 card overlay doesn't fully hide that text, so these
// two need a stronger overlay wherever their card image is reused.
const STRONG_OVERLAY_CATEGORIES = new Set(["team-uniforms", "activewear"]);

const processSteps = [
  {
    icon: LayoutGrid,
    title: "Choose Your Category",
    desc: "Browse our 12 product categories and find what suits your team or brand.",
  },
  {
    icon: FileText,
    title: "Request a Free Quote",
    desc: "Fill out our quick quote form with your requirements — no commitment needed.",
  },
  {
    icon: PenTool,
    title: "Get Design Proof",
    desc: "Our design team sends you a free digital proof within 48 hours.",
  },
  {
    icon: Truck,
    title: "We Manufacture & Ship",
    desc: "We produce your order with premium quality and ship worldwide.",
  },
];

const whyUs = [
  {
    icon: BadgeCheck,
    title: "Custom Branding",
    desc: "Your logo, colors and design on every piece — fully customized.",
  },
  {
    icon: Package,
    title: "Low MOQ from 20 Pieces",
    desc: "Start small or go big — we accommodate orders of all sizes.",
  },
  {
    icon: Clock,
    title: "Free Design Proof in 48hrs",
    desc: "See exactly what you're getting before production begins.",
  },
  {
    icon: Globe2,
    title: "Worldwide Shipping",
    desc: "Trusted by teams in 40+ countries with reliable international delivery.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Per-card crop overrides for source photos that don't read well at object-center
// in this grid's 4:3 boxes (portrait photos cropped into a landscape frame).
const cardImagePosition: Record<string, string> = {
  "team-uniforms": "object-top",
  "youth-sportswear": "object-top",
  activewear: "object-top",
  "sublimation-wear": "object-top",
};

export function CategoriesContent({
  categories,
  categoriesWithProducts,
}: {
  categories: Category[];
  categoriesWithProducts: Record<string, number>;
}) {
  return (
    <>
      {/* ── Categories Grid ── */}
      <section className="container-x py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={itemVariants}>
              <Link
                id={cat.slug}
                href={
                  CATEGORIES_WITH_CUSTOM_PAGES.has(cat.slug) ||
                  (categoriesWithProducts[cat.slug] ?? 0) > 0
                    ? `/categories/${cat.slug}`
                    : "/products"
                }
                className="group relative block aspect-[4/3] scroll-mt-28 overflow-hidden rounded-2xl bg-ink"
              >
                {cat.placeholder ? (
                  <div className="absolute inset-0 bg-[#0a0a0a]" />
                ) : (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover opacity-80 transition-all duration-700 group-hover:scale-108 group-hover:opacity-55 ${
                      cardImagePosition[cat.slug] ?? "object-center"
                    }`}
                  />
                )}
                {/* Dark overlay — hides any text/watermark baked into the source image */}
                <div
                  className={`absolute inset-0 ${
                    STRONG_OVERLAY_CATEGORIES.has(cat.slug) ? "bg-black/70" : "bg-black/55"
                  }`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-all duration-500" />
                {/* Gold Accent Glow on hover */}
                <div className="absolute inset-0 bg-accent/0 transition-all duration-500 group-hover:bg-accent/8" />
                {/* Top right corner accent */}
                <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/0 bg-white/0 text-white/0 transition-all duration-300 group-hover:border-accent/50 group-hover:bg-accent/15 group-hover:text-accent">
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h2 className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                    {cat.name}
                  </h2>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    {cat.blurb}
                  </p>
                  <span className="mt-4 inline-flex translate-y-2 items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100">
                    Shop Collection
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <div className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-accent">
              — Our Process —
            </div>
            <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/50">
              From idea to delivery — simple, fast, professional.
            </p>
          </Reveal>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent lg:block" />
            {processSteps.map((step, i) => (
              <motion.div key={step.title} variants={itemVariants} className="relative text-center">
                <div className="relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-ink font-display text-sm font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mx-auto mt-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                  <step.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-white">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed text-white/55">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Black Shark ── */}
      <section className="border-t border-white/5 bg-ink py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <div className="mb-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-accent">
              — Why Us —
            </div>
            <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl">
              Why Teams Choose Black Shark
            </h2>
          </Reveal>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2"
          >
            {whyUs.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(200,162,74,0.12)]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-ink text-accent transition-colors duration-300 group-hover:border-accent/50">
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden border-t border-white/5 bg-ink py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(200,162,74,0.18), transparent 60%)",
          }}
        />
        <div className="container-x relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-white sm:text-5xl">
              Ready to Outfit Your Team?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Get a free custom design proof within 48 hours — no commitment required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/quote" size="lg" variant="accent">
                Request a Quote <ArrowRight size={17} />
              </ButtonLink>
              <a
                href="https://wa.me/923370488235"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-sm font-medium uppercase tracking-wide text-white transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <Whatsapp size={17} />
                Chat on WhatsApp <ArrowRight size={15} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
