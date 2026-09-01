import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./reveal";

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-ink text-white">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="container-x relative py-16 md:py-24">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/45"
          >
            {breadcrumb.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-accent">{c.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <ChevronRight size={12} className="text-white/30" />
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
