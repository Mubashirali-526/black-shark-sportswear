import { cn } from "@/lib/utils";

// Fictional club names — not real-world clubs. A "Trusted By" section naming actual
// clubs (Real Madrid, Manchester United, etc.) would imply a real sponsorship/supplier
// relationship with trademark-protected organizations that doesn't exist; swapped in
// placeholder names with the same "real football club" naming convention instead.
const clubs = [
  { name: "Ironclad FC", style: "font-display font-black uppercase tracking-tight" },
  { name: "Northgate United", style: "font-sans font-semibold uppercase tracking-[0.15em]" },
  { name: "Crimson City FC", style: "font-display font-bold italic" },
  { name: "Sterling Rovers", style: "font-sans font-medium uppercase tracking-widest" },
  { name: "Apex Athletic", style: "font-display font-extrabold tracking-tight" },
  { name: "Blackstone United", style: "font-sans font-semibold" },
  { name: "Vantage FC", style: "font-display font-black uppercase tracking-[0.1em]" },
  { name: "Meridian Athletic", style: "font-sans font-bold italic tracking-tight" },
  { name: "Falcon Sporting Club", style: "font-display font-bold uppercase" },
  { name: "Highline United", style: "font-sans font-semibold uppercase tracking-wide" },
  { name: "Redwood FC", style: "font-display font-black tracking-tight" },
  { name: "Coastal City FC", style: "font-sans font-bold uppercase tracking-[0.12em]" },
  { name: "Summit Rovers", style: "font-display font-bold italic uppercase" },
  { name: "Westbrook Athletic", style: "font-sans font-semibold tracking-tight" },
  { name: "Union Forge FC", style: "font-display font-extrabold uppercase tracking-widest" },
];

export function TrustedBy() {
  const track = [...clubs, ...clubs];

  return (
    <section className="border-y border-white/5 bg-[#0a0a0a] py-14 md:py-16">
      <div className="mb-8 text-center text-xs font-bold uppercase tracking-[0.35em] text-accent">
        Trusted by Teams Worldwide
      </div>

      <div className="overflow-hidden">
        <div
          className="animate-marquee flex w-max shrink-0 items-center gap-4"
          style={{ animationDuration: "35s" }}
        >
          {track.map((club, i) => (
            <span
              key={`${club.name}-${i}`}
              className={cn(
                "shrink-0 whitespace-nowrap rounded border border-[#222222] bg-[#111111] px-7 py-3 text-white transition-all duration-300 hover:border-accent hover:text-accent",
                club.style
              )}
            >
              {club.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
