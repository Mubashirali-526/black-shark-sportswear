"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Check,
  ArrowRight,
  ChevronDown,
  Search,
  UploadCloud,
  FileText,
  X,
  User,
  Shirt,
  Zap,
  Palette,
  Users,
  Hand,
  ShoppingBag,
  Settings,
  Tag,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isValidEmail, isValidPhone, sanitizeInput } from "@/lib/utils";
import { countries } from "@/lib/countries";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ".pdf,.ai,.zip,.png,.jpg,.jpeg";

type Step = 1 | 2 | 3 | 4 | 5;

const stepMeta: { label: string; icon: LucideIcon; subtitle: string }[] = [
  { label: "Your Company", icon: User, subtitle: "Contact & brand info" },
  { label: "Product", icon: Shirt, subtitle: "What are you building?" },
  { label: "Specifications", icon: Settings, subtitle: "Quantities & timeline" },
  { label: "Branding", icon: Tag, subtitle: "Print & decoration" },
  { label: "Review", icon: CheckCircle, subtitle: "Ready to submit?" },
];

const categoryOptions: { name: string; subtitle: string; icon: LucideIcon }[] = [
  { name: "Team Uniforms", subtitle: "Full custom kits for clubs & schools", icon: Shirt },
  { name: "Activewear", subtitle: "Studio & performance activewear", icon: Zap },
  { name: "Sublimation Wear", subtitle: "Full custom print collection", icon: Palette },
  { name: "Youth Sportswear", subtitle: "Custom sportswear for junior athletes", icon: Users },
  { name: "Gloves", subtitle: "Professional grade custom gloves", icon: Hand },
  { name: "Bags", subtitle: "Custom team bags and backpacks", icon: ShoppingBag },
  { name: "Accessories & Apparel", subtitle: "Caps, socks & branded apparel", icon: Tag },
];

const fabricOptions: { name: string; subtitle: string }[] = [
  { name: "Performance Polyester", subtitle: "120–180 GSM" },
  { name: "Recycled rPET", subtitle: "140–200 GSM" },
  { name: "Nylon-Lycra Stretch", subtitle: "150–230 GSM" },
  { name: "GOTS Organic Cotton", subtitle: "180–280 GSM" },
  { name: "Bamboo Blend", subtitle: "160–220 GSM" },
  { name: "Not Sure / Advise Me", subtitle: "Let our team recommend" },
];

const decorationOptions: { name: string; subtitle: string }[] = [
  { name: "Dye Sublimation", subtitle: "Full-colour allover prints" },
  { name: "Tajima Embroidery", subtitle: "Logos, crests & badges" },
  { name: "3D Heat Transfer", subtitle: "Silicone names & numbers" },
  { name: "Screen Print", subtitle: "Flat-colour graphics" },
  { name: "Plain / No Print", subtitle: "Blank garments only" },
];

const quantityTiles = ["20–49", "50–99", "100–249", "250–499", "500–999", "1,000+"];
const timelineOptions = [
  "Rush — Within 3 Weeks",
  "Standard — 4–6 Weeks",
  "Relaxed — 6–10 Weeks",
  "Flexible / Planning Stage",
];
const colourwaysOptions = ["1 Colourway", "2 Colourways", "3 Colourways", "4+ Colourways"];
const skusOptions = ["1 Style", "2–3 Styles", "4–6 Styles", "7+ Styles"];
const budgetOptions = ["Under $50", "$50–$100", "$100–$250", "$250–$500", "$500–$1,000", "$1,000+", "Flexible"];
const brandAssetsOptions = [
  "Yes — Logo files ready",
  "Partial — Some assets",
  "No — Need design help",
];
const techPackOptions = ["Yes — Full tech pack", "Partial brief only", "No — Starting fresh"];
const referralOptions = [
  "Google Search",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "Referral",
  "Trade Show",
  "Other",
];

type Errors = Record<string, string>;

export function QuoteForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  // Step 1 — Your Company
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+92");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [referral, setReferral] = useState("");

  // Step 2 — Product
  const [categories, setCategories] = useState<string[]>([]);
  const [fabrics, setFabrics] = useState<string[]>([]);

  // Step 3 — Specifications
  const [quantity, setQuantity] = useState("");
  const [colourways, setColourways] = useState("");
  const [skus, setSkus] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Step 4 — Branding
  const [decoration, setDecoration] = useState<string[]>([]);
  const [brandAssets, setBrandAssets] = useState("");
  const [techPack, setTechPack] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [details, setDetails] = useState("");

  // Step 5 — Review
  const [consent, setConsent] = useState(false);

  function scrollToTop() {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function validateStep(): boolean {
    const next: Errors = {};
    if (step === 1) {
      if (firstName.trim().length < 2) next.firstName = "Please enter your first name.";
      if (lastName.trim().length < 2) next.lastName = "Please enter your last name.";
      if (!isValidEmail(email)) next.email = "Enter a valid email address.";
      if (phone && !isValidPhone(phone)) next.phone = "Enter a valid phone number.";
      if (!country) next.country = "Select your country.";
    }
    if (step === 2) {
      if (categories.length === 0) next.categories = "Select at least one product category.";
    }
    if (step === 3) {
      if (!quantity) next.quantity = "Select an estimated order quantity.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next() {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 5) as Step);
      scrollToTop();
    }
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 1) as Step);
    scrollToTop();
  }

  function resetForm() {
    setStep(1);
    setErrors({});
    setFirstName("");
    setLastName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setDialCode("+92");
    setCountry("");
    setWebsite("");
    setReferral("");
    setCategories([]);
    setFabrics([]);
    setQuantity("");
    setColourways("");
    setSkus("");
    setBudget("");
    setTimeline("");
    setDeliveryDate("");
    setDecoration([]);
    setBrandAssets("");
    setTechPack("");
    setFile(null);
    setDetails("");
    setConsent(false);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step !== 5) return;

    const next: Errors = {};
    if (!consent) next.consent = "Please accept to continue.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeInput(`${firstName} ${lastName}`),
          email: sanitizeInput(email),
          phone: sanitizeInput(`${dialCode} ${phone}`),
          company: sanitizeInput(company),
          businessType: categories.join(", "),
          country,
          city: "",
          category: categories.join(", "),
          sport: "",
          quantity,
          budget,
          deliveryDate,
          customLogo: decoration.length > 0 ? "Yes" : "No",
          customColors: "Yes",
          hasExistingDesign: brandAssets,
          decorationMethod: decoration.join(", "),
          description: sanitizeInput(details),
          hearAboutUs: referral,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
        resetForm();
      }
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  }

  function handleFile(selected: File | null) {
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, file: "File must be under 10MB." }));
      setFile(null);
      return;
    }
    setErrors((prev) => {
      if (!prev.file) return prev;
      const rest = { ...prev };
      delete rest.file;
      return rest;
    });
    setFile(selected);
  }

  function onFileDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 border-t-2 border-t-accent bg-[#111111] p-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-ink">
          <Check size={30} />
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-white">
          Quote request received!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-white/60">
          Thanks! Our sales team will review your requirements and send a tailored
          quote within 24 hours.
        </p>
        <Button onClick={() => setSent(false)} variant="outline" className="mt-6">
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {/* Progress bar */}
      <div className="mb-8 flex items-center justify-between">
        {stepMeta.map((s, i) => {
          const n = (i + 1) as Step;
          const isDone = step > n;
          const isActive = step === n;
          return (
            <div key={s.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                    isActive ? "bg-accent text-ink" : isDone ? "bg-accent/20 text-accent" : "bg-white/5 text-white/30"
                  )}
                >
                  {isDone ? <Check size={14} /> : n}
                </span>
                <span
                  className={cn(
                    "hidden text-[10px] uppercase tracking-widest sm:block",
                    isActive || isDone ? "text-accent" : "text-white/30"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < stepMeta.length - 1 && (
                <div className={cn("mx-2 h-px flex-1", isDone ? "bg-accent/40" : "bg-white/10")} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={onSubmit} noValidate>
        <StepHeader
          icon={stepMeta[step - 1].icon}
          title={stepMeta[step - 1].label}
          subtitle={step === 5 ? "Review your requirements below. Our team will respond within 12 business hours." : stepMeta[step - 1].subtitle}
          step={step}
        />

        {step === 1 && (
          <div className="space-y-5 rounded-2xl bg-[#111111] p-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name *" name="firstName" value={firstName} onChange={setFirstName} placeholder="John" error={errors.firstName} />
              <Field label="Last Name *" name="lastName" value={lastName} onChange={setLastName} placeholder="Carter" error={errors.lastName} />
            </div>

            <Field label="Company / Brand Name" name="company" value={company} onChange={setCompany} placeholder="Blaze United FC" />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Business Email *" name="email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" error={errors.email} />
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                  WhatsApp / Phone
                </label>
                <div className="flex gap-2">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    aria-label="Country code"
                    suppressHydrationWarning
                    className="h-12 w-24 shrink-0 rounded-xl border border-[#222] bg-[#1a1a1a] px-2 text-sm text-white outline-none transition-colors focus:border-accent"
                  >
                    {countries.map((c) => (
                      <option key={`${c.name}-${c.dial}`} value={c.dial}>
                        {c.dial}
                      </option>
                    ))}
                  </select>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="555 000 0000"
                    maxLength={20}
                    suppressHydrationWarning
                    className={cn(
                      "h-12 w-full rounded-xl border bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#333333] focus:border-accent",
                      errors.phone ? "border-red-500/50" : "border-[#222]"
                    )}
                  />
                </div>
                {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CountrySelect value={country} onChange={setCountry} error={errors.country} />
              <Field label="Website" name="website" value={website} onChange={setWebsite} placeholder="https://" />
            </div>

            <SelectField label="How did you hear about us?" value={referral} onChange={setReferral} options={referralOptions} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 rounded-2xl bg-[#111111] p-6">
            <div>
              <span className="mb-4 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Product Category * (Select all that apply)
              </span>
              {errors.categories && <p className="mb-3 text-xs text-red-400">{errors.categories}</p>}
              <div className="grid grid-cols-2 gap-3">
                {categoryOptions.map((c) => (
                  <MultiSelectCard
                    key={c.name}
                    name={c.name}
                    subtitle={c.subtitle}
                    icon={c.icon}
                    selected={categories.includes(c.name)}
                    onClick={() => toggle(categories, setCategories, c.name)}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-4 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Fabric Preference (Select all that apply)
              </span>
              <div className="grid grid-cols-2 gap-3">
                {fabricOptions.map((f) => (
                  <MultiSelectCard
                    key={f.name}
                    name={f.name}
                    subtitle={f.subtitle}
                    selected={fabrics.includes(f.name)}
                    onClick={() => toggle(fabrics, setFabrics, f.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 rounded-2xl bg-[#111111] p-6">
            <div>
              <span className="mb-4 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Order Quantity *
              </span>
              {errors.quantity && <p className="mb-3 text-xs text-red-400">{errors.quantity}</p>}
              <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                {quantityTiles.map((q) => (
                  <QuantityTile key={q} value={q} selected={quantity === q} onClick={() => setQuantity(q)} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SelectField label="Colourways" value={colourways} onChange={setColourways} options={colourwaysOptions} />
              <SelectField label="SKUs / Styles" value={skus} onChange={setSkus} options={skusOptions} />
              <SelectField label="Budget Per Unit" value={budget} onChange={setBudget} options={budgetOptions} />
            </div>

            <div>
              <span className="mb-4 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Required Timeline
              </span>
              <div className="grid grid-cols-2 gap-3">
                {timelineOptions.map((t) => (
                  <OptionCard key={t} label={t} selected={timeline === t} onClick={() => setTimeline(t)} />
                ))}
              </div>
            </div>

            <Field
              label="Target Delivery Date (Optional)"
              name="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={setDeliveryDate}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 rounded-2xl bg-[#111111] p-6">
            <div>
              <span className="mb-4 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Decoration / Print Methods (Select all that apply)
              </span>
              <div className="grid grid-cols-2 gap-3">
                {decorationOptions.map((d) => (
                  <MultiSelectCard
                    key={d.name}
                    name={d.name}
                    subtitle={d.subtitle}
                    selected={decoration.includes(d.name)}
                    onClick={() => toggle(decoration, setDecoration, d.name)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Brand Assets Available?" value={brandAssets} onChange={setBrandAssets} options={brandAssetsOptions} />
              <SelectField label="Tech Pack / Design Brief?" value={techPack} onChange={setTechPack} options={techPackOptions} />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Design Assets &amp; Tech Pack Files
              </label>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onFileDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                  errors.file
                    ? "border-red-500/50"
                    : dragActive
                      ? "border-accent bg-accent/5"
                      : "border-[#222] bg-[#1a1a1a] hover:border-accent/60"
                )}
              >
                <input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  suppressHydrationWarning
                  className="sr-only"
                />
                {file ? (
                  <>
                    <FileText size={24} className="text-accent" />
                    <span className="flex items-center gap-2 text-sm text-white">
                      {file.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                        aria-label="Remove file"
                        className="text-white/40 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={24} className="text-white/40" />
                    <span className="text-sm text-white/70">Upload PDF, AI, ZIP, PNG, or JPG (Max 10MB)</span>
                  </>
                )}
              </label>
              {errors.file && <p className="mt-1.5 text-xs text-red-400">{errors.file}</p>}
            </div>

            <div>
              <label htmlFor="details" className="mb-2 block text-xs font-medium uppercase tracking-[2px] text-white/40">
                Additional Notes / Special Requirements
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Describe colours, logos, special requirements, target market…"
                suppressHydrationWarning
                className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#333333] focus:border-accent"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="mb-6 rounded-2xl border border-accent/20 bg-[#111111] p-5">
              <p className="text-sm text-white/60">
                Our team will respond within 12 business hours with a detailed production quote.
              </p>
            </div>

            <ReviewCard title="Company Information">
              <ReviewRow label="Contact" value={`${firstName} ${lastName}`.trim()} />
              <ReviewRow label="Company" value={company} />
              <ReviewRow label="Email" value={email} />
              <ReviewRow label="Phone" value={phone ? `${dialCode} ${phone}` : ""} />
              <ReviewRow label="Country" value={country} />
            </ReviewCard>

            <ReviewCard title="Product Requirements">
              <ReviewRow label="Categories" value={categories.join(", ")} />
              <ReviewRow label="Fabrics" value={fabrics.join(", ")} />
            </ReviewCard>

            <ReviewCard title="Order Specifications">
              <ReviewRow label="Quantity" value={quantity ? `${quantity} units` : ""} />
              <ReviewRow label="Timeline" value={timeline} />
              <ReviewRow label="Budget/Unit" value={budget} />
              <ReviewRow label="Decoration" value={decoration.join(", ")} />
            </ReviewCard>

            <div className="mt-2">
              <label className="flex items-start gap-3 text-xs text-white/55">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  suppressHydrationWarning
                  className="mt-0.5 h-4 w-4 accent-accent"
                />
                I agree to be contacted about my quote and accept the privacy policy.
              </label>
              {errors.consent && <p className="mt-1.5 text-xs text-red-400">{errors.consent}</p>}
            </div>

            {errors.submit && <p className="mt-4 text-xs text-red-400">{errors.submit}</p>}

            <button
              type="submit"
              suppressHydrationWarning
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent text-base font-black tracking-wide text-ink transition-colors hover:brightness-105"
            >
              Submit Quote Request <ArrowRight size={18} />
            </button>
            <p className="mt-3 text-center text-xs text-white/25">
              🔒 Your information is secure and never shared.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prev}
              suppressHydrationWarning
              className="h-12 rounded-xl border border-[#333] px-6 text-sm text-white transition-colors hover:border-white/40"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 5 && (
            <button
              type="button"
              onClick={next}
              suppressHydrationWarning
              className="flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-sm font-bold text-ink"
            >
              Continue <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  subtitle,
  step,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  step: Step;
}) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#111111] p-5">
      <div className="flex items-center gap-4">
        <span className="grid shrink-0 place-items-center rounded-xl bg-accent/10 p-2.5 text-accent">
          <Icon size={20} />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-white/40">{subtitle}</p>
        </div>
      </div>
      <span className="shrink-0 text-sm text-white/30">{step} / 5</span>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-xs font-medium uppercase tracking-[2px] text-white/40">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={120}
        suppressHydrationWarning
        className={cn(
          "h-12 w-full rounded-xl border bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#333333] focus:border-accent",
          error ? "border-red-500/50" : "border-[#222]"
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-[2px] text-white/40">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        suppressHydrationWarning
        className={cn(
          "h-12 w-full rounded-xl border bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-accent",
          error ? "border-red-500/50" : "border-[#222]"
        )}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function MultiSelectCard({
  name,
  subtitle,
  icon: Icon,
  selected,
  onClick,
}: {
  name: string;
  subtitle: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      suppressHydrationWarning
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
        selected ? "border-accent bg-accent/5" : "border-[#222] hover:border-white/20"
      )}
    >
      {Icon && (
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            selected ? "bg-accent/10 text-accent" : "bg-[#1a1a1a] text-white/50"
          )}
        >
          <Icon size={18} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-white">{name}</span>
        <span className="block truncate text-xs text-white/40">{subtitle}</span>
      </span>
    </button>
  );
}

function QuantityTile({
  value,
  selected,
  onClick,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      suppressHydrationWarning
      className={cn(
        "rounded-xl border p-4 text-center transition-colors",
        selected ? "border-accent bg-accent/5" : "border-[#222] hover:border-white/20"
      )}
    >
      <span className="block font-black text-lg text-white">{value}</span>
      <span className="mt-1 block text-[10px] tracking-widest text-white/30">UNITS</span>
    </button>
  );
}

function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      suppressHydrationWarning
      className={cn(
        "rounded-2xl border p-4 text-left text-sm font-semibold transition-colors",
        selected ? "border-accent bg-accent/5 text-accent" : "border-[#222] text-white hover:border-white/20"
      )}
    >
      {label}
    </button>
  );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-2xl border border-white/5 bg-[#111111] p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-accent">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-xs uppercase tracking-wide text-white/40">{label}</span>
      <span className="text-right text-sm text-white">{value}</span>
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <label className="mb-2 block text-xs font-medium uppercase tracking-[2px] text-white/40">Country *</label>
      <input type="hidden" name="country" value={value} suppressHydrationWarning />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        suppressHydrationWarning
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border bg-[#1a1a1a] px-4 text-left text-sm outline-none transition-colors focus:border-accent",
          value ? "text-white" : "text-[#666666]",
          error ? "border-red-500/50" : "border-[#222]"
        )}
      >
        {value || "Select country…"}
        <ChevronDown size={16} className={cn("text-white/40 transition-transform", open && "rotate-180")} />
      </button>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#222] bg-[#1a1a1a] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[#222] px-3 py-2">
            <Search size={15} className="shrink-0 text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              suppressHydrationWarning
              className="w-full bg-transparent py-1 text-sm text-white outline-none placeholder:text-[#666666]"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-white/40">No matches found.</p>
            )}
            {filtered.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  onChange(c.name);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5",
                  value === c.name ? "text-accent" : "text-white/80"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
