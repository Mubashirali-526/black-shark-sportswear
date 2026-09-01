import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  footer = false,
  className,
}: {
  light?: boolean;
  footer?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex shrink-0 items-center gap-2.5", className)}
      aria-label="Black Shark home"
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg transition-transform duration-300 group-hover:rotate-6",
          footer ? "bg-accent text-ink" : light ? "bg-white text-ink" : "bg-ink text-white"
        )}
      >
        <Image
          src="/favicon.png"
          alt=""
          width={40}
          height={40}
          className={cn("h-8 w-8 object-contain", light && "invert")}
          aria-hidden
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "whitespace-nowrap font-display text-lg font-extrabold uppercase tracking-tight",
            footer ? "text-white" : light ? "text-white" : "text-ink"
          )}
        >
          Black Shark
        </span>
        <span
          className={cn(
            "text-[9px] font-medium uppercase tracking-[0.3em]",
            footer ? "text-white/50" : light ? "text-white/50" : "text-ink/45"
          )}
        >
          Sportswear
        </span>
      </span>
    </Link>
  );
}
