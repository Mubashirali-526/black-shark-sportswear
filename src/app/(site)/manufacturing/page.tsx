import type { Metadata } from "next";
import Image from "next/image";
import { Globe2, Ship, Plane, FileCheck2, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { processSteps, manufacturingImages, whatsappLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Manufacturing & Export",
  description:
    "Inside Black Shark's vertically-integrated sportswear manufacturing — design, sublimation, cutting, stitching, QC and global export.",
};

const stageImages: Record<string, string> = {
  "Consultation & Design": "/manufacturing/consultation.png",
  "Fabric & Sampling": "/manufacturing/fabric-sampling.png",
  "Precision Production": "/manufacturing/precision-production.png",
  "QC & Global Delivery": "/manufacturing/qc-delivery.png",
};

const exportFeatures = [
  { icon: Globe2, title: "40+ Countries", desc: "Established export network across six continents." },
  { icon: Ship, title: "Sea Freight", desc: "Cost-efficient bulk freight for large-volume orders." },
  { icon: Plane, title: "Air Express", desc: "Rush air courier for tournament-critical deadlines." },
  { icon: FileCheck2, title: "Full Documentation", desc: "Complete export paperwork and customs support." },
];

export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        title="Where Performance Is Made"
        subtitle="A vertically-integrated facility that controls every stage — so quality is never left to chance."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Manufacturing" }]}
      />

      {/* Wide image */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl">
            <Image
              src={manufacturingImages.wide}
              alt="Black Shark production floor"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute bottom-0 p-8 md:p-12">
              <h2 className="max-w-xl font-display text-2xl font-bold text-white sm:text-3xl">
                In-house control from yarn to finished kit.
              </h2>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Process steps detailed */}
      <section className="container-x pb-16 md:pb-24">
        <SectionHeading
          kicker="The Process"
          title="Four Precision Stages"
          subtitle="Each order flows through a controlled pipeline with checkpoints at every step."
        />
        <div className="mt-14 space-y-6">
          {processSteps.map((step, i) => (
            <Reveal key={step.step}>
              <div
                className={`grid gap-8 overflow-hidden rounded-3xl border border-ink/10 bg-white lg:grid-cols-2 lg:items-center ${
                  i % 2 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative h-[320px]">
                  <Image
                    src={stageImages[step.title] ?? step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <span className="font-display text-5xl font-bold text-accent">
                    {step.step}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65 sm:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Export services */}
      <section className="border-y border-ink/10 bg-ink py-16 text-white md:py-24">
        <div className="container-x">
          <SectionHeading
            align="center"
            light
            kicker="Export Services"
            title="Reliable Global Delivery"
            subtitle="Door-to-door logistics that get your order there — on time, every time."
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exportFeatures.map((f) => (
              <Reveal key={f.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-ink">
                    <f.icon size={24} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/quote" variant="accent" size="lg">
              Request Export Quote <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink
              href={whatsappLink("Hi Black Shark, I'd like to discuss export and bulk manufacturing.")}
              external
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-ink"
            >
              Chat with Sales
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
