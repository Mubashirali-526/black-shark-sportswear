import type { Metadata } from "next";
import Image from "next/image";
import {
  Target,
  Eye,
  Heart,
  Award,
  Leaf,
  Users,
  Globe2,
  PackageCheck,
  Clock,
  Tags,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { CountUp } from "@/components/site/count-up";
import { ButtonLink } from "@/components/ui/button";
import { stats, BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Black Shark Sportswear is a premium B2B sportswear manufacturer based in Sialkot, Pakistan, producing custom football kits, basketball uniforms, cricket whites and training gear for teams worldwide.",
};

const values = [
  { icon: Award, title: "Uncompromising Quality", desc: "Every stitch is inspected. We build kits that survive full seasons, not a few washes." },
  { icon: Leaf, title: "Sustainable Craft", desc: "Recycled fabrics, low-impact inks and zero-waste cutting are the standard, not the exception." },
  { icon: Users, title: "Partnership First", desc: "One dedicated account manager guides you from first sketch to final delivery." },
  { icon: Heart, title: "Made with Passion", desc: "We're athletes too. We design gear we'd actually want to compete in." },
];

const products = [
  "Football Kits",
  "Basketball Uniforms",
  "Cricket Whites",
  "Training Gear",
  "Custom Team Uniforms",
];

const highlights = [
  { icon: Globe2, label: "Trusted by teams across 40+ countries" },
  { icon: PackageCheck, label: "Low MOQ from 20 pieces" },
  { icon: Clock, label: "Free design proof within 48 hours" },
  { icon: Tags, label: "Custom branding — logos, names, numbers" },
  { icon: ShieldCheck, label: "QC Assured — checked before dispatch" },
  { icon: Truck, label: "Global shipping available" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Engineered for Champions"
        subtitle={`Black Shark Sportswear is a B2B sportswear manufacturer based in Sialkot, Pakistan — the sports manufacturing capital of the world. Since ${BRAND.founded}, we've grown into a trusted production partner for teams, clubs and brands across 40+ countries.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              kicker="Our Story"
              title="From a single Sialkot workshop to a global name."
            />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/65 sm:text-base">
              <p>
                Black Shark Sportswear was founded in Sialkot, Pakistan — a city
                that has quietly outfitted the world's biggest sporting events for
                decades and earned its reputation as the sports manufacturing
                capital of the world. We build on that heritage every day.
              </p>
              <p>
                We manufacture football kits, basketball uniforms, cricket whites,
                training gear and fully custom team uniforms, cut and sublimated
                in-house across a complete size range from XS to 5XL. That
                vertically-integrated control — design, fabric, cutting, stitching
                and quality control all under one roof — is how we deliver
                consistent, on-spec production at scale, whether you need twenty
                pieces or twenty thousand.
              </p>
              <p>
                We remain obsessed with the details: the hand-feel of a fabric, the
                crispness of a crest, the on-time arrival of a tournament order. It&apos;s
                what earns us reorders from clubs, academies and brands worldwide.
              </p>
            </div>
            <div className="mt-8">
              <ButtonLink href="/manufacturing" size="lg">
                See How We Make It
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                style={{ backgroundColor: "#111111" }}
              >
                <Image
                  src="/about/factory-sewing.png"
                  alt="Factory worker sewing on the production floor"
                  fill
                  sizes="25vw"
                  className="object-cover object-center"
                />
              </div>
              <div
                className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl"
                style={{ backgroundColor: "#111111" }}
              >
                <Image
                  src="/about/quality-control.png"
                  alt="Quality control inspection at Black Shark"
                  fill
                  sizes="25vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What We Make */}
      <section className="border-t border-white/10 bg-[#0a0a0a] py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            align="center"
            kicker="What We Make"
            title="Custom sportswear, made to your spec."
            subtitle="From match-day kits to training gear, every product is produced in-house and available across a full size range — XS to 5XL, all sizes available."
            light
            className="mx-auto"
          />
          <Stagger className="mt-10 flex flex-wrap justify-center gap-3">
            {products.map((p) => (
              <StaggerItem key={p}>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white">
                  {p}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Highlights */}
      <section className="container-x py-16 md:py-24">
        <SectionHeading
          align="center"
          kicker="Why Teams Partner With Us"
          title="Built for reliable B2B production."
          className="mx-auto"
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <StaggerItem key={h.label}>
              <div className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-accent">
                  <h.icon size={20} />
                </span>
                <span className="text-sm font-semibold text-white">{h.label}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Stats */}
      <section className="border-y border-ink/10 bg-ink py-14 text-white">
        <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label} className="text-center">
              <CountUp value={s.value} className="font-display text-4xl font-bold sm:text-5xl" />
              <div className="mt-2 text-xs uppercase tracking-widest text-white/50">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our Mission", text: "To equip every team with premium, custom-fit sportswear that elevates performance and pride — accessible from just 20 pieces." },
            { icon: Eye, title: "Our Vision", text: "To be the world's most trusted custom sportswear partner, setting the benchmark for quality, sustainability and service." },
          ].map((m) => (
            <Reveal key={m.title}>
              <div className="h-full rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 md:p-10">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
                  <m.icon size={26} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/10 bg-[#0a0a0a] py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            align="center"
            kicker="What Drives Us"
            title="Our Core Values"
            light
            className="mx-auto"
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-ink-soft p-7 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-ink">
                    <v.icon size={24} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
