"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Factory, Package, Zap, Plane, X, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/data";
import { whatsappLink } from "@/lib/data";
import { cn } from "@/lib/utils";
import { StarRating } from "./star-rating";
import { ButtonLink } from "@/components/ui/button";
import { Whatsapp } from "./social-icons";

const trustBadges = [
  { icon: Factory, label: "Made in Pakistan" },
  { icon: Package, label: "MOQ: 20 Pieces" },
  { icon: Zap, label: "15 Days Lead Time" },
  { icon: Plane, label: "Ships Worldwide" },
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "fabric", label: "Fabric & Materials" },
  { id: "customization", label: "Customization" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProductDetail({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(true);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [quantity, setQuantity] = useState(20);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  function selectImage(i: number) {
    if (i === activeImg) return;
    setImgLoaded(false);
    setActiveImg(i);
  }

  function handleZoomMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = galleryRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  return (
    <div className="container-x py-10 md:py-16">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
        {/* Gallery — 60% */}
        <div className="lg:col-span-3">
          <div
            ref={galleryRef}
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleZoomMove}
            onClick={() => setLightboxOpen(true)}
            className="relative h-[400px] cursor-zoom-in overflow-hidden rounded-2xl bg-[#111111] sm:h-[500px] lg:h-[600px]"
          >
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              onLoad={() => setImgLoaded(true)}
              style={{
                transform: zoomActive ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              }}
              className={cn(
                "object-cover transition-all duration-300 ease-out",
                imgLoaded ? "opacity-100" : "opacity-0",
                product.position
              )}
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full border border-accent/40 bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                {product.badge}
              </span>
            )}
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
              <ZoomIn size={13} />
              Click to zoom
            </span>
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => selectImage(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl border-2 bg-[#111111] transition-all duration-300",
                    activeImg === i
                      ? "border-accent"
                      : "border-[#222222] opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill sizes="150px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info — 40% */}
        <div className="lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            {product.category}
          </span>
          <h1 className="mt-2 font-display text-[32px] font-bold leading-tight text-white">
            {product.name}
          </h1>

          {product.productId && (
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
              Product ID: <span className="text-white/70">{product.productId}</span>
            </p>
          )}

          {product.rating > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} size={17} dark />
              <span className="text-sm text-white/50">({product.reviews} reviews)</span>
            </div>
          )}

          <div className="mt-6 border-t border-accent/20" />

          <p className="mt-6 text-sm leading-relaxed text-white/70">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/60">Available Colors</span>
                <span className="text-sm text-white/50">{color}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-[#0a0a0a] transition-all",
                      color === c.name ? "ring-accent" : "ring-transparent"
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.name && (
                      <Check size={16} className={c.hex === "#ffffff" ? "text-ink" : "text-white"} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/60">Available Sizes</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs font-semibold text-accent underline underline-offset-2 hover:text-white transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s === size ? null : s)}
                    className={cn(
                      "grid h-11 min-w-[3rem] place-items-center rounded-xl px-3 text-sm font-semibold transition-colors",
                      size === s
                        ? "bg-accent text-ink"
                        : "bg-[#1a1a1a] text-white hover:bg-[#222222]"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-7">
            <span className="mb-3 block text-sm font-semibold text-white/60">Quantity (Min. 20 pieces)</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(20, q - 10))}
                className="grid h-11 w-11 place-items-center rounded-xl bg-[#1a1a1a] text-white text-xl font-bold hover:bg-[#222222] transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={20}
                step={10}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(20, Number(e.target.value)))}
                className="h-11 w-24 rounded-xl border border-[#333333] bg-[#1a1a1a] text-center text-sm font-bold text-white outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 10)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-[#1a1a1a] text-white text-xl font-bold hover:bg-[#222222] transition-colors"
              >
                +
              </button>
              <span className="text-xs text-white/40">pieces</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-7 rounded-xl border border-[#222222] bg-[#111111] p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-white">$0</span>
              <span className="text-sm text-white/50">Contact us for pricing</span>
            </div>
            <p className="mt-1 text-xs text-white/40">
              Final price confirmed via WhatsApp
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink
              href={`/quote?product=${product.slug}`}
              size="lg"
              variant="accent"
              className="w-full"
            >
              Request a Quote <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              href={whatsappLink(
                `Hi, I'm interested in ${product.name}${color ? ` (${color})` : ""}${size ? `, size ${size}` : ""}, quantity: ${quantity} pieces.`
              )}
              external
              size="lg"
              className="w-full bg-[#1a1a1a] text-white hover:bg-[#222222]"
            >
              <Whatsapp className="h-[18px] w-[18px] text-accent" />
              Chat on WhatsApp <ArrowRight size={18} />
            </ButtonLink>
          </div>

          {/* Trust badges */}
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#222222] pt-6 sm:grid-cols-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <b.icon size={16} className="shrink-0 text-white/40" />
                <span className="text-xs text-white/50">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs table */}
      <div className="mt-16 rounded-2xl border border-[#222222] bg-[#111111] p-6 md:p-8">
        <h2 className="font-display text-xl font-bold text-accent">Product Specifications</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-[#222222]">
          {product.specs.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "grid grid-cols-2 gap-4 border-l-2 border-accent px-5 py-4 text-sm",
                i % 2 === 0 ? "bg-[#111111]" : "bg-[#0f0f0f]"
              )}
            >
              <span className="font-medium text-white/50">{s.label}</span>
              <span className="font-semibold text-white">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex gap-2 border-b border-[#222222]">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-semibold transition-colors sm:px-6",
                activeTab === t.id ? "text-accent" : "text-white/50 hover:text-white"
              )}
            >
              {t.label}
              {activeTab === t.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-8">
          {activeTab === "overview" && (
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
                <h3 className="font-display text-base font-bold text-white">Premium Quality</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  180 GSM performance fabric engineered for durability and comfort.
                </p>
              </div>
              <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
                <h3 className="font-display text-base font-bold text-white">Full Custom</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Your logo, colors and design — built to your exact specifications.
                </p>
              </div>
              <div className="rounded-xl border border-[#222222] bg-[#111111] p-6">
                <h3 className="font-display text-base font-bold text-white">Fast Delivery</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  15 days production time from confirmed design to dispatch.
                </p>
              </div>
            </div>
          )}

          {activeTab === "fabric" && (
            <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 md:p-8">
              <p className="text-sm leading-relaxed text-white/70">
                Built from 180 GSM recycled poly-interlock fabric — a lightweight,
                breathable knit that holds its shape through repeated wash cycles
                without fading or pilling. The 4-way stretch weave moves with the
                body, while moisture-wicking fibers pull sweat away from the skin
                to keep athletes dry and cool through a full match or session.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                <span className="font-semibold text-white">Care instructions:</span>{" "}
                Machine wash cold, inside out. Do not bleach. Tumble dry low or
                hang to dry. Do not iron directly on printed graphics.
              </p>
            </div>
          )}

          {activeTab === "customization" && (
            <div className="rounded-xl border border-[#222222] bg-[#111111] p-6 md:p-8">
              <p className="text-sm font-semibold text-white">What can be customized:</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Colors and full sublimation print design</li>
                <li>• Player numbers and squad list</li>
                <li>• Team logos and sponsor crests</li>
                <li>• Player names</li>
                <li>• Custom patches and badges</li>
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-white/70">
                Every order includes a{" "}
                <span className="font-semibold text-white">free design proof</span> before
                production begins, so you can confirm colors, layout and text before we cut fabric.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                <span className="font-semibold text-white">File formats accepted:</span>{" "}
                AI, EPS, PDF, PNG or JPG (logos ideally as vector files for the cleanest print).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
          <div className="relative w-full max-w-lg rounded-2xl border border-accent/20 bg-[#0d0d0d] p-6 text-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSizeGuide(false)} className="absolute right-4 top-4 text-white/40 hover:text-white">✕</button>
            <h3 className="font-display text-xl font-bold text-accent mb-4">Size Guide</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wide">
                    <th className="py-2 text-left">Size</th>
                    <th className="py-2 text-center">Chest (cm)</th>
                    <th className="py-2 text-center">Waist (cm)</th>
                    <th className="py-2 text-center">Hip (cm)</th>
                    <th className="py-2 text-center">Height (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["XS", "84–88", "70–74", "88–92", "160–165"],
                    ["S", "88–92", "74–78", "92–96", "165–170"],
                    ["M", "92–96", "78–82", "96–100", "170–175"],
                    ["L", "96–100", "82–86", "100–104", "175–180"],
                    ["XL", "100–104", "86–90", "104–108", "180–185"],
                    ["2XL", "104–108", "90–94", "108–112", "185–190"],
                    ["3XL", "108–112", "94–98", "112–116", "190–195"],
                  ].map(([size, chest, waist, hip, height], i) => (
                    <tr key={size} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                      <td className="py-3 font-bold text-accent">{size}</td>
                      <td className="py-3 text-center text-white/70">{chest}</td>
                      <td className="py-3 text-center text-white/70">{waist}</td>
                      <td className="py-3 text-center text-white/70">{hip}</td>
                      <td className="py-3 text-center text-white/70">{height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-white/40">* Measurements are in centimeters. For custom sizing contact us directly.</p>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/60 transition hover:border-accent hover:text-accent"
          >
            <X size={18} />
          </button>
          <div
            className="relative h-full max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
