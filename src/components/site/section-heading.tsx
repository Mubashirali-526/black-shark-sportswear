import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  light = false,
  className,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]",
            light ? "text-accent" : "text-accent"
          )}
        >
          <span className="h-px w-6 bg-accent" />
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl text-balance",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            light ? "text-white/70" : "text-ink/60"
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
