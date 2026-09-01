import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  new: "bg-accent/15 text-accent border-accent/30",
  viewed: "bg-white/10 text-white/70 border-white/20",
  replied: "bg-green-500/15 text-green-400 border-green-500/30",
};

const LABELS: Record<string, string> = {
  new: "New",
  viewed: "Viewed",
  replied: "Replied",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        STYLES[status] ?? STYLES.viewed
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
