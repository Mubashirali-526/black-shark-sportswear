const items = [
  "Custom Team Kits",
  "Full Sublimation",
  "Low MOQ",
  "Global Export",
  "Recycled Fabrics",
  "Free Design Proof",
  "Fast Turnaround",
  "Ethical Manufacturing",
];

export function Marquee() {
  return (
    <div className="border-y border-ink/10 bg-ink py-4 text-white">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                {item}
              </span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
