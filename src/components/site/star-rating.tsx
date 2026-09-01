import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 14,
  className,
  showValue = false,
  dark = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  dark?: boolean;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                filled
                  ? "fill-accent text-accent"
                  : dark
                    ? "fill-transparent text-white/20"
                    : "fill-transparent text-ink/25"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("text-xs font-medium", dark ? "text-white/50" : "text-ink/60")}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
