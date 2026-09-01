"use client";

import Image from "next/image";
import { Stagger, StaggerItem } from "./reveal";

const collections = [
  {
    image: "/portfolio/urban-motion.png",
    name: "Urban Motion",
    description: "Full sublimation kit with moisture-wicking fabric",
  },
  {
    image: "/portfolio/performance-edge.png",
    name: "Performance Edge",
    description: "High-contrast training kit built for contact sports",
  },
  {
    image: "/portfolio/power-core-teal.png",
    name: "Power Core",
    description: "Lightweight cricket whites with teal accent panels",
  },
  {
    image: "/portfolio/power-core-orange.png",
    name: "Striker Pro",
    description: "Club-grade football kit with custom numbering",
  },
  {
    image: "/portfolio/neon-strike.png",
    name: "Neon Strike",
    description: "Bold activewear collection for youth academies",
  },
];

export function PortfolioCollections() {
  return (
    <div>
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <StaggerItem key={c.name}>
            <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-soft transition-colors duration-300 hover:border-accent/40">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-white">
                  {c.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                  {c.description}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
