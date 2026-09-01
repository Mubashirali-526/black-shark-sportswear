import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { subcategories } from "../subcategories";
import { getSiteSubcategoryProducts } from "@/lib/site-data";
import { ProductCard } from "@/components/site/product-card";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return subcategories.map((s) => ({ subSlug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subSlug: string }>;
}): Promise<Metadata> {
  const { subSlug } = await params;
  const sub = subcategories.find((s) => s.slug === subSlug);
  if (!sub) return { title: "Accessories & Apparel" };
  return {
    title: `${sub.name} — Accessories & Apparel`,
    description: sub.description,
  };
}

export default async function AccessoriesApparelSubcategoryPage({
  params,
}: {
  params: Promise<{ subSlug: string }>;
}) {
  const { subSlug } = await params;
  const sub = subcategories.find((s) => s.slug === subSlug);
  if (!sub) notFound();

  const items = await getSiteSubcategoryProducts("accessories-apparel", sub.name);

  return (
    <>
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
          <Link href="/categories/accessories-apparel" className="hover:text-accent">
            Accessories &amp; Apparel
          </Link>
          <ChevronRight size={12} />
          <span className="text-white">{sub.name}</span>
        </div>
      </div>

      <section className="relative flex min-h-[360px] items-end overflow-hidden bg-ink text-white">
        <Image
          src={sub.image}
          alt={sub.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="container-x relative pb-10 pt-24">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Accessories &amp; Apparel
          </span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">
            {sub.name}
          </h1>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-16 text-white md:py-24">
        <div className="container-x">
          <p className="max-w-2xl text-base leading-relaxed text-white/70">{sub.description}</p>

          {items.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-ink-soft p-8 text-center max-w-2xl">
              <h2 className="font-display text-xl font-bold text-white">
                Full {sub.name} range coming soon
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                We&apos;re building out detailed {sub.name.toLowerCase()} listings. Request a
                quote in the meantime and our team will send you the full spec sheet.
              </p>
              <ButtonLink href="/quote" variant="accent" size="lg" className="mt-6">
                Request a Quote
              </ButtonLink>
            </div>
          )}

          <Link
            href="/categories/accessories-apparel"
            className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60 transition-colors hover:text-accent"
          >
            <ArrowLeft size={14} />
            Back to Accessories &amp; Apparel
          </Link>
        </div>
      </section>
    </>
  );
}
