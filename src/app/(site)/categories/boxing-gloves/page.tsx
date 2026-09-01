import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { getSiteCategories, getSiteSubcategories } from "@/lib/site-data";
import { subcategories } from "./subcategories";

type SubcategoryItem = { name: string; slug?: string; description?: string; image?: string; position?: string };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gloves",
  description:
    "Professional-grade boxing and MMA gloves engineered for grip, protection and performance — built for fighters who demand precision.",
};

export default async function GlovesPage() {
  const categories = await getSiteCategories();
  const otherCategories = categories.filter((c) => c.slug !== "boxing-gloves");
  const subNames = await getSiteSubcategories("boxing-gloves");
  const subcategoryItems: SubcategoryItem[] = subNames.map(
    (name) => subcategories.find((s) => s.name === name) ?? { name }
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="container-x flex items-center gap-1.5 py-4 text-xs uppercase tracking-widest text-white/45">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/categories" className="hover:text-accent">
            Categories
          </Link>
          <ChevronRight size={12} />
          <span className="text-white">Gloves</span>
        </div>
      </div>

      {/* SECTION 1 — Hero */}
      <section className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 25%, rgba(200,162,74,0.16), transparent 45%), radial-gradient(circle at 82% 75%, rgba(200,162,74,0.12), transparent 50%)",
          }}
        />
        <div
          className="animate-mesh-drift pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(rgba(200,162,74,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/25" />

        <div className="container-x relative">
          <Reveal>
            <span className="inline-block text-sm font-bold uppercase tracking-[0.4em] text-accent">
              Accessories &amp; Protection
            </span>
            <h1 className="mt-4 font-display text-[48px] font-extrabold uppercase leading-[0.95] text-white sm:text-[64px] lg:text-[80px]">
              Gloves
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              Professional-grade boxing and MMA gloves engineered for grip,
              protection and performance — built for fighters who demand precision.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink
                href="/quote"
                size="lg"
                variant="accent"
                className="h-16 px-10 text-base"
              >
                Request a Quote <ArrowRight size={18} />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2 — Subcategories */}
      <section className="bg-[#f8f8f8] py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <span className="block text-sm font-bold uppercase tracking-[0.3em] text-accent">
              Explore Product Lines
            </span>
            <h2 className="relative mt-3 inline-block pb-3 font-display text-4xl font-extrabold text-[#111111] sm:text-5xl">
              Subcategories &amp; Capabilities
              <span className="absolute bottom-0 left-0 h-[3px] w-[60px] rounded-full bg-accent" />
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
            {subcategoryItems.map((s, i) =>
              s.slug ? (
                <StaggerItem key={s.slug}>
                  <Link
                    href={`/categories/boxing-gloves/${s.slug}`}
                    className="group flex h-full rounded-xl border-l-4 border-l-transparent bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-l-accent hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)]"
                  >
                    <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden rounded-lg">
                      <Image src={s.image!} alt={s.name} fill sizes="180px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col pl-5">
                      <span className="text-xs font-bold tracking-widest text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-[22px] font-bold text-[#111111]">{s.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#666666]">
                        {s.description}
                      </p>
                      <span className="mt-auto flex items-center gap-1.5 pt-3 text-[12px] font-semibold uppercase tracking-wide text-accent">
                        Explore Products
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ) : (
                <StaggerItem key={s.name}>
                  <Link
                    href="/quote"
                    className="group flex h-full items-center rounded-xl border-l-4 border-l-transparent bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-l-accent hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)]"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-bold tracking-widest text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-[22px] font-bold text-[#111111]">{s.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#666666]">
                        Ask us for full specs and pricing on this product line.
                      </p>
                      <span className="mt-auto flex items-center gap-1.5 pt-3 text-[12px] font-semibold uppercase tracking-wide text-accent">
                        Request a Quote
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              )
            )}
          </Stagger>
        </div>
      </section>

      {/* SECTION 3 — Explore more categories */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="relative inline-block pb-3 font-display text-4xl font-extrabold text-white sm:text-5xl">
              Explore More Categories
              <span className="absolute bottom-0 left-0 h-[3px] w-[60px] rounded-full bg-accent" />
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {otherCategories.map((c) => (
              <StaggerItem key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink"
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-80 transition-all duration-700 group-hover:scale-108 group-hover:opacity-55"
                  />
                  <div
                    className={`absolute inset-0 ${
                      c.slug === "team-uniforms" || c.slug === "activewear" ? "bg-black/70" : "bg-black/55"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                  <div className="absolute inset-0 bg-accent/0 transition-all duration-500 group-hover:bg-accent/8" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-accent/70" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-accent">
                      {c.name}
                    </h3>
                    <span className="mt-3 inline-flex translate-y-2 items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100">
                      Shop Collection <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
