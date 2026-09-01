import {
  PenTool,
  Layers,
  PackageCheck,
  Truck,
  ShieldCheck,
  Headphones,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  PenTool,
  Layers,
  PackageCheck,
  Truck,
  ShieldCheck,
  Headphones,
};

export function FeatureIcon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = map[name] ?? Layers;
  return <Icon size={size} className={className} />;
}
