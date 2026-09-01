import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { CountUp } from "@/components/site/count-up";
import { PortfolioCollections } from "@/components/site/portfolio-collections";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Black Shark's custom sportswear collections — a portfolio of finished kits and apparel lines.",
};

const heroStats = [
  { value: "13+", label: "Years Manufacturing" },
  { value: "500+", label: "Orders Delivered" },
  { value: "40+", label: "Countries Shipped" },
  { value: "50+", label: "Team Clients" },
];

const projectStats = [
  { value: "850", label: "Kits Delivered" },
  { value: "3 Weeks", label: "Turnaround" },
  { value: "6", label: "Kit Variants" },
  { value: "100%", label: "On-Time Delivery" },
];

const projectPoints = [
  "Full sublimation across all kit variants",
  "Custom badge and sponsor placement",
  "Anti-slip silicone waistband on shorts",
  "72-hour rapid sample with courier delivery",
  "WRAP-certified ethical manufacturing",
];

const clients = [
  "Falcon Athletic Club",
  "Gulf Sports Academy",
  "Apex United FC",
  "Nordic Rugby Association",
  "Desert Storm Cricket Club",
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-ink text-white">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container-x relative py-20 md:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-6 bg-accent" />
              Portfolio
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl">
              Built For Performance. Worn Globally.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Custom sportswear collections manufactured to the highest standards
              in Sialkot, Pakistan.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-white/10">
          <div className="container-x grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
            {heroStats.map((s) => (
              <Reveal key={s.label} className="text-center">
                <CountUp
                  value={s.value}
                  className="font-display text-3xl font-bold sm:text-4xl"
                />
                <div className="mt-2 text-xs uppercase tracking-widest text-white/50">
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Collections grid */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            kicker="Portfolio"
            title="Selected Works"
            subtitle="A curated look at finished kits, from club football to youth academies."
            light
            className="mb-10"
          />
          <PortfolioCollections />
        </div>
      </section>

      {/* Featured project */}
      <section className="border-t border-white/10 bg-ink-soft py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            kicker="Case Study"
            title="Falcon Athletic Club — Tournament Kit Program"
            light
            className="mb-12 max-w-3xl"
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/portfolio/performance-edge.png"
                alt="Falcon Athletic Club tournament kit"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-white/65">
                Falcon Athletic Club commissioned Black Shark for their regional
                tournament program — an 850-unit run spanning home, away, and
                training variants with full sublimation and custom badge
                integration.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                {projectStats.map((s) => (
                  <div key={s.label}>
                    <CountUp
                      value={s.value}
                      className="font-display text-3xl font-bold text-accent sm:text-4xl"
                    />
                    <div className="mt-1 text-xs uppercase tracking-widest text-white/50">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-8 space-y-3">
                {projectPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
                    <span className="text-sm leading-relaxed text-white/70">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <ButtonLink href="/quote" variant="accent" size="lg" className="mt-10">
                Start a Similar Program
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Client logos */}
      <section className="border-t border-white/10 bg-ink py-16 md:py-20">
        <div className="container-x">
          <SectionHeading
            kicker="Clients"
            title="Trusted By Teams Worldwide"
            align="center"
            light
            className="mx-auto mb-10"
          />
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {clients.map((name) => (
              <StaggerItem key={name}>
                <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-center text-sm font-semibold text-white/70 transition-colors duration-300 hover:border-accent/40 hover:text-white">
                  {name}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
