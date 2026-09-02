import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getSiteCategories, getSiteCategoryProducts } from "@/lib/site-data";

export const dynamic = "force-dynamic";

// Some category product photos are tall portrait flat-lays that get cropped
// top-and-bottom when forced into these square cards; object-top keeps the
// most identifying part (collar/hood) in frame instead of splitting the crop.
const categoryImagePosition: Record<string, string> = {};

// Most category photos are tall portrait garment flat-lays (~4:5), but some
// (e.g. boxing gloves) are near-square product shots with the subject filling
// the frame edge-to-edge — forcing those into a 4:5 box makes object-cover
// zoom in aggressively. Override the box shape per category where needed.
const categoryAspect: Record<string, string> = {
  "boxing-gloves": "aspect-square",
};

// Bags mixes landscape and portrait product shots within the same category —
// no single crop position works for both, so this uses object-contain
// instead of cropping, showing each product at its full size.
const categoryFit: Record<string, string> = {
  bags: "object-contain",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getSiteCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.blurb,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getSiteCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = await getSiteCategoryProducts(category.slug);
  const imagePosition = categoryImagePosition[category.slug] ?? "object-center";
  const imageAspect = categoryAspect[category.slug] ?? "aspect-[4/5]";
  const imageFit = categoryFit[category.slug] ?? "object-cover";

  return (
    <>
      <PageHero
        title={category.name}
        subtitle={category.blurb}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <section className="bg-[#0a0a0a] pb-16 pt-8 text-white md:pb-24 md:pt-10">
        <div className="container-x">
          {products.length > 0 ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const href = p.slug ? `/products/${p.slug}` : null;
                const image = (
                  <div className={`relative ${imageAspect} overflow-hidden`}>
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`${imageFit} ${p.position ?? imagePosition} transition-transform duration-700 group-hover:scale-105`}
                    />
                  </div>
                );
                const title = (
                  <h3 className="mt-2 font-display text-lg font-bold text-white transition-colors group-hover:text-accent">
                    {p.name}
                  </h3>
                );
                return (
                <StaggerItem key={p.id ?? p.name}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                    {href ? <Link href={href}>{image}</Link> : image}
                    <div className="flex flex-1 flex-col p-6">
                      {p.id && (
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">
                          {p.id}
                        </span>
                      )}
                      {href ? <Link href={href}>{title}</Link> : title}
                      {p.fabric && (
                        <p className="mt-1 text-xs uppercase tracking-wide text-white/40">
                          {p.fabric}
                        </p>
                      )}
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                        {p.description}
                      </p>
                      {p.tags && p.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <ButtonLink
                        href="/quote"
                        variant="accent"
                        size="sm"
                        className="mt-6 w-full"
                      >
                        Request Quote
                      </ButtonLink>
                    </div>
                  </div>
                </StaggerItem>
                );
              })}
            </Stagger>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-ink-soft p-12 text-center">
              <h2 className="font-display text-xl font-bold text-white">
                Products coming soon
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                We&apos;re adding detailed listings for {category.name}. Request a
                quote and our team will send you the full spec sheet.
              </p>
              <ButtonLink href="/quote" variant="accent" size="lg" className="mt-6">
                Request Quote
              </ButtonLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
