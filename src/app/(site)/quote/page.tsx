import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { QuoteForm } from "@/components/site/quote-form";
import { Reveal } from "@/components/site/reveal";
import { WorldMap } from "@/components/site/world-map";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a free custom quote from Black Shark for team uniforms, bulk apparel and export orders.",
};

const stats = [
  { value: "48hrs", label: "Design Proof Delivered" },
  { value: "20 pcs", label: "Minimum Order Quantity" },
  { value: "40+", label: "Countries Served" },
  { value: "Free", label: "No Commitment Quote" },
];

const mapMarkers = [
  { name: "UK", cx: 470, cy: 140 },
  { name: "USA", cx: 200, cy: 180 },
  { name: "Canada", cx: 190, cy: 130 },
  { name: "UAE", cx: 590, cy: 210 },
  { name: "Saudi Arabia", cx: 575, cy: 220 },
  { name: "Germany", cx: 500, cy: 140 },
  { name: "Australia", cx: 800, cy: 360 },
  { name: "South Africa", cx: 530, cy: 350 },
  { name: "Pakistan", cx: 630, cy: 200 },
  { name: "India", cx: 650, cy: 220 },
  { name: "Nigeria", cx: 500, cy: 270 },
  { name: "France", cx: 490, cy: 150 },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        title="Request a Free Quote"
        subtitle="Tell us what you need and we'll build a tailored quote within 24 hours — no obligation."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Request Quote" }]}
      />

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-[#111111] py-6">
        <div className="container-x grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-black text-accent">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-16 text-white md:py-24">
        <div className="container-x mx-auto max-w-3xl">
          <Reveal>
            <QuoteForm />
          </Reveal>
        </div>
      </section>

      {/* World map section */}
      <section className="border-t border-white/5 bg-[#080808] py-20">
        <div className="container-x">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[4px] text-accent">Global Reach</p>
            <h2 className="font-display text-3xl font-black text-white">
              Countries We Serve
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
              Trusted by teams, brands and organizations across 40+ countries worldwide.
            </p>
          </div>

          <WorldMap />

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {mapMarkers.map((m) => (
              <span
                key={m.name}
                className="rounded-full border border-white/10 bg-[#111] px-3 py-1 text-xs text-white/50"
              >
                {m.name}
              </span>
            ))}
          </div>

          <p className="mt-10 text-center text-xs uppercase tracking-widest text-white/20">
            Worldwide export with full documentation &amp; customs support
          </p>
        </div>
      </section>
    </>
  );
}
