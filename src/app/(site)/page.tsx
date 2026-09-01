import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Ruler,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { Hero } from "@/components/site/hero";
import { TrustedBy } from "@/components/site/trusted-by";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Testimonials } from "@/components/site/testimonials";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { FeatureIcon } from "@/components/site/feature-icon";
import { AnimatedStat } from "@/components/site/animated-stat";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  whyChoose,
  processSteps,
  faqs,
  whatsappLink,
} from "@/lib/data";

// Deliberately NOT wired to the DB categories table (see src/lib/site-data.ts) even
// though a task later asked to make "homepage featured categories" DB-driven: this is
// a hand-picked subset (6 of 12) with its own curated images/crops, distinct from the
// full /categories grid on purpose (see CLAUDE.md's Data layer section) — swapping it
// for a raw DB query would silently replace the curated art direction with generic
// category photos. Left untouched; flagged instead of guessed.
const featuredCategories = [
  { slug: "team-uniforms", image: "/categories/team-uniforms/teamwear-hero.png", name: "Team Uniforms", count: 45, objectPosition: "center top" },
  { slug: "activewear", image: "/categories/activewear/active-hero.png", name: "Activewear", count: 38, objectPosition: "center top" },
  { slug: "sublimation-wear", image: "/categories/sublimation-wear/sublimation-hero.png", name: "Sublimation Wear", count: 42, objectPosition: "center top" },
];

const expertise = [
  {
    image: "/expertise/tracksuits.png",
    label: "Tracksuits",
    description:
      "Premium tracksuits engineered for performance, training, and team identity. Custom manufactured to your brand specifications.",
  },
  {
    image: "/expertise/jackets.jpg",
    label: "Jackets",
    description:
      "Durable sports jackets from lightweight windbreakers to insulated bombers — built to your brand's clients details.",
  },
  {
    image: "/expertise/hoodies.png",
    label: "Hoodies & Sweatshirts",
    description:
      "Premium structured hoodies and sweatshirts. From pattern creation to bulk delivery.",
  },
  {
    image: "/expertise/team-uniforms.jpg",
    label: "Team Uniforms",
    description:
      "Complete team uniform solutions from concept to final delivery. Full sublimation, embroidery and screen print available.",
  },
];

const featuredBuilds = [
  { image: "/featured/build-1.png", name: "Core Zip Hoodie", status: "Available" },
  { image: "/featured/build-2.png", name: "Varsity Classic", status: "Available" },
  { image: "/featured/build-3.png", name: "Black Bomber", status: "Available" },
  { image: "/featured/build-4.png", name: "White Bomber", status: "Available" },
  { image: "/featured/build-5.png", name: "Windbreaker Pro", status: "Available" },
  { image: "/featured/build-6.jpg", name: "Urban Tracksuit", status: "Available" },
  { image: "/featured/build-7.png", name: "Venum Coach Jacket", status: "Available" },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <TrustedBy />

      {/* Featured Categories */}
      <section className="container-x py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            kicker="Collections"
            title="Featured Categories"
            subtitle="Precision-engineered performance wear across six ranges — built to outlast the game, not just survive it."
          />
          <ButtonLink href="/categories" variant="outline" size="sm">
            View all <ArrowRight size={15} />
          </ButtonLink>
        </div>

        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {featuredCategories.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                href={`/categories#${cat.slug}`}
                className="group relative block h-[300px] overflow-hidden rounded-2xl bg-ink"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: cat.objectPosition }}
                  className="w-full h-full opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-60"
                />
                <div
                  className={`absolute inset-0 ${
                    cat.slug === "team-uniforms" || cat.slug === "activewear"
                      ? "bg-black/70"
                      : "bg-black/55"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="mt-1 font-display text-sm font-bold leading-tight text-white">
                    {cat.name}
                  </h3>
                </div>
                <span className="absolute right-3 top-3 grid h-8 w-8 -translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Our Expertise */}
      <section className="bg-ink py-12 text-white md:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Our Manufacturing Expertise
              </span>
              <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl md:text-7xl">
                Our Expertise.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="max-w-sm">
              <p className="text-sm leading-relaxed text-white/60 md:text-base">
                From technical performance wear to lifestyle outerwear. We
                manufacture exactly what your team, brand or clients need.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:text-white"
              >
                View Full Collection <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {expertise.map((item, i) => (
              <Reveal
                key={item.label}
                delay={i * 0.08}
                className={cn(i % 2 === 1 && "md:mt-6")}
              >
                <Link
                  href="/products"
                  className="group relative block h-[400px] max-h-[400px] w-full overflow-hidden rounded-2xl bg-ink-soft"
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

                  <span className="absolute left-6 top-6 text-xs font-bold uppercase tracking-[0.25em] text-accent">
                    {item.label}
                  </span>

                  <div className="absolute inset-x-6 bottom-6">
                    <h3 className="font-display text-2xl font-extrabold uppercase leading-tight text-white sm:text-3xl">
                      {item.label}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom uniform CTA */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Design Your Own
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Custom apparel, built exactly how you imagine it.
            </h2>
            <p className="mt-5 max-w-lg text-white/65">
              Share a logo, a colourway, or just a rough idea. Our in-house design
              studio returns a free digital proof within 48 hours — no commitment
              required.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Palette, label: "Free Design" },
                { icon: Ruler, label: "Any Size Run" },
                { icon: Globe, label: "Global Ship" },
                { icon: ShieldCheck, label: "QC Assured" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/10 hover:shadow-[0_12px_28px_rgba(200,162,74,0.2)]"
                >
                  <f.icon
                    size={22}
                    className="text-accent transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-white/70 transition-colors duration-300 group-hover:text-white">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quote" variant="accent" size="lg">
                Start a Custom Order
              </ButtonLink>
              <ButtonLink
                href={whatsappLink("Hi Black Shark, I want to design a custom uniform.")}
                external
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-ink"
              >
                Talk to a Designer
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/custom1.png", alt: "Athlete stretching in custom Black Shark activewear", position: "center center" },
                { src: "/custom2.png", alt: "Athlete in a custom Black Shark performance tee and shorts", position: "center top" },
                { src: "/athlete-girl.jpg", alt: "Athlete in custom Black Shark training gear", position: "38% center" },
                { src: "/custom3.png", alt: "Athlete mid-stride in a custom Black Shark training tee", position: "center center" },
              ].map((img, i) => (
                <div
                  key={img.src}
                  className={`relative h-[320px] overflow-hidden rounded-2xl ${
                    i % 2 ? "translate-y-6" : ""
                  }`}
                  style={{ backgroundColor: "#111111" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="25vw"
                    style={{ objectPosition: img.position }}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Build */}
      <section className="bg-ink py-16 text-white md:py-20">
        <div className="container-x">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Featured Build
            </span>
            <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
              Manufactured Without Compromise.
            </h2>
          </Reveal>

          <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {featuredBuilds.map((item, i) => (
              <Reveal
                key={item.name}
                delay={i * 0.06}
                className="w-[220px] shrink-0 snap-start sm:w-[260px] md:w-auto md:shrink"
              >
                <Link href="/quote" className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-soft">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 260px, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-white">
                    {item.name}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent group-hover:text-white">
                    Request <ArrowUpRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            kicker="The Black Shark Edge"
            title="Why Teams Choose Black Shark"
            subtitle="Over a decade of engineering performance apparel for clubs, brands and champions worldwide."
            className="mx-auto"
          />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((f) => (
              <StaggerItem key={f.title}>
                <div className="group h-full rounded-3xl bg-white p-8 text-center shadow-[0_2px_10px_rgba(11,11,11,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(11,11,11,0.1)]">
                  <span className="relative mx-auto grid h-14 w-14 place-items-center">
                    <span
                      className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl bg-ink/10"
                      aria-hidden
                    />
                    <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
                      <FeatureIcon name={f.icon} />
                    </span>
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold text-ink">
                    {f.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/60">
                    {f.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Manufacturing process */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            kicker="How It's Made"
            title="Our Manufacturing Process"
            subtitle="Four precision stages from first sketch to your locker room."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="group h-full overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-sm font-bold text-accent">
                      {step.step}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/manufacturing" size="lg">
              Explore Manufacturing <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Bulk order CTA */}
      <section className="container-x py-20 md:py-28">
        <Reveal className="relative overflow-hidden rounded-3xl border border-ink/10 bg-ink px-8 py-14 text-white md:px-16 md:py-20">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Wholesale & Export
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Bulk orders with wholesale pricing & global delivery.
              </h2>
              <p className="mt-4 max-w-lg text-white/65">
                Kitting an entire league or launching your own label? Unlock tiered
                pricing, dedicated account management and reliable export logistics.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <div className="grid w-full grid-cols-3 gap-4">
                {[
                  { v: "500+", l: "Min Order" },
                  { v: "40+", l: "Countries" },
                  { v: "15d", l: "Lead Time" },
                ].map((s) => (
                  <AnimatedStat key={s.l} value={s.v} label={s.l} />
                ))}
              </div>
              <ButtonLink
                href="/quote"
                variant="accent"
                size="lg"
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(200,162,74,0.5)] sm:w-auto"
              >
                Request Bulk Quote <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="bg-ink py-20 text-white md:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            light
            kicker="Client Stories"
            title="Trusted by Teams Worldwide"
            className="mx-auto"
          />
          <div className="mt-14">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              kicker="Answers"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know before placing your first order."
            />
            <div className="mt-8">
              <ButtonLink href="/faq" variant="outline" size="md">
                View all FAQs <ArrowRight size={15} />
              </ButtonLink>
            </div>
          </div>
          <FaqAccordion items={faqs.slice(0, 5)} />
        </div>
      </section>
    </>
  );
}
