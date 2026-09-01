"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  category: string;
  sport: string;
  quantity: string;
  fabric: string;
  sampleRequired: string;
  budget: string;
  deliveryDate: string;
  customLogo: string;
  customColors: string;
  hasExistingDesign: string;
  decorationMethod: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  businessType: string;
  country: string;
  city: string;
  description: string;
  hearAboutUs: string;
}

const EMPTY: FormData = {
  category: "", sport: "", quantity: "", fabric: "", sampleRequired: "", budget: "", deliveryDate: "",
  customLogo: "", customColors: "", hasExistingDesign: "", decorationMethod: "",
  name: "", email: "", phone: "", company: "", jobTitle: "", businessType: "",
  country: "", city: "", description: "", hearAboutUs: "",
};

const STEPS = ["Product", "Design", "Contact", "Review"];
const SPORTS = ["Football", "Cricket", "Basketball", "Baseball", "Rugby", "Hockey", "Tennis", "Volleyball", "Athletics", "Other"];
const BUDGETS = ["Under $500", "$500 – $1,000", "$1,000 – $5,000", "$5,000 – $10,000", "$10,000+", "Not sure yet"];
const FABRICS = ["Polyester", "Cotton", "Dri-fit", "Mesh", "Fleece", "Not Sure"];
const DECORATION = ["Sublimation", "Embroidery", "Screen Print", "Heat Transfer", "Not Sure"];
const BUSINESS_TYPES = ["Sports Team / Club", "Brand / Label", "Retailer / Reseller", "Corporate / Organization", "Individual / Personal"];
const HEAR_ABOUT = ["Google Search", "Instagram", "Facebook", "WhatsApp", "Referral", "Trade Show", "Other"];

export function OrderFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function set(k: keyof FormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setStep(1); setForm(EMPTY); setErrors({}); setDone(false); setWaUrl(""); }, 300);
  }

  function validateStep(): boolean {
    const e: Partial<FormData> = {};
    if (step === 1) {
      if (!form.category) e.category = "Please select a category.";
      if (!form.quantity) e.quantity = "Please enter quantity.";
    }
    if (step === 3) {
      if (form.name.length < 2) e.name = "Please enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
      if (!form.phone) e.phone = "Please enter your WhatsApp number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validateStep()) setStep((s) => Math.min(s + 1, 4) as Step); }
  function prev() { setStep((s) => Math.max(s - 1, 1) as Step); }

  async function submit() {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setWaUrl(data.waUrl);
        setDone(true);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full w-full max-w-3xl flex-col overflow-hidden border border-accent/20 bg-[#0d0d0d] text-white shadow-[0_40px_100px_rgba(0,0,0,0.7)] sm:rounded-3xl sm:h-auto sm:max-h-[95vh]"
          >
            {/* Close */}
            <button onClick={handleClose} className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:border-accent hover:text-accent">
              <X size={15} />
            </button>

            {!done ? (
              <>
                {/* Header */}
                <div className="shrink-0 border-b border-white/8 px-8 pt-8 pb-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">Quick Quote Request</span>
                  <h3 className="mt-1 font-display text-2xl font-black text-white">Customize your order</h3>
                  <div className="mt-5 flex items-center gap-2">
                    {STEPS.map((label, i) => {
                      const s = (i + 1) as Step;
                      const isDone = step > s;
                      const isActive = step === s;
                      return (
                        <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
                          <div className={cn(
                            "h-1 w-full rounded-full transition-all duration-500",
                            isDone ? "bg-accent" : isActive ? "bg-accent/70" : "bg-white/10"
                          )} />
                          <span className={cn("text-[10px] font-semibold uppercase tracking-wider transition-colors",
                            isActive || isDone ? "text-accent" : "text-white/30"
                          )}>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.22 }}
                    >
                      {step === 1 && (
                        <div className="space-y-4">
                          <p className="text-sm text-white/50">What are you looking to manufacture?</p>
                          <Field label="Product Category *" error={errors.category}>
                            <select value={form.category} onChange={e => set("category", e.target.value)} className={selectCls(!!errors.category)}>
                              <option value="">Select category…</option>
                              {categories.map(c => <option key={c.slug} value={c.name}>{c.name}</option>)}
                            </select>
                          </Field>
                          <Field label="Sport / Use Case">
                            <select value={form.sport} onChange={e => set("sport", e.target.value)} className={selectCls(false)}>
                              <option value="">Select sport…</option>
                              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Quantity *" error={errors.quantity}>
                              <input value={form.quantity} onChange={e => set("quantity", e.target.value)} type="number" placeholder="e.g. 50" className={inputCls(!!errors.quantity)} />
                            </Field>
                            <Field label="Fabric Preference">
                              <select value={form.fabric} onChange={e => set("fabric", e.target.value)} className={selectCls(false)}>
                                <option value="">Select…</option>
                                {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                              </select>
                            </Field>
                          </div>
                          <ToggleGroup label="Sample Required?" value={form.sampleRequired} onChange={v => set("sampleRequired", v)} options={["Yes", "No"]} />
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-5">
                          <p className="text-sm text-white/50">Tell us about your design requirements.</p>
                          <ToggleGroup label="Custom Logo Required?" value={form.customLogo} onChange={v => set("customLogo", v)} options={["Yes", "No"]} />
                          <ToggleGroup label="Custom Colors Required?" value={form.customColors} onChange={v => set("customColors", v)} options={["Yes", "No"]} />
                          <ToggleGroup label="Do you have existing designs?" value={form.hasExistingDesign} onChange={v => set("hasExistingDesign", v)} options={["Yes", "No", "Need Design Help"]} />
                          <Field label="Decoration Method">
                            <div className="flex flex-wrap gap-2">
                              {DECORATION.map(d => (
                                <button key={d} type="button" onClick={() => set("decorationMethod", d)}
                                  className={cn("rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
                                    form.decorationMethod === d ? "border-accent bg-accent/10 text-accent" : "border-white/10 text-white/50 hover:border-white/30"
                                  )}>{d}</button>
                              ))}
                            </div>
                          </Field>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-4">
                          <p className="text-sm text-white/50">How can we reach you?</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Full Name *" error={errors.name}>
                              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Carter" className={inputCls(!!errors.name)} />
                            </Field>
                            <Field label="Company / Team">
                              <input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Riverside FC" className={inputCls(false)} />
                            </Field>
                          </div>
                          <Field label="Email Address *" error={errors.email}>
                            <input value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="you@email.com" className={inputCls(!!errors.email)} />
                          </Field>
                          <Field label="WhatsApp Number *" error={errors.phone}>
                            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+92 300 0000000" className={inputCls(!!errors.phone)} />
                          </Field>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Country">
                              <input value={form.country} onChange={e => set("country", e.target.value)} placeholder="e.g. United Kingdom" className={inputCls(false)} />
                            </Field>
                            <Field label="City">
                              <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. London" className={inputCls(false)} />
                            </Field>
                          </div>
                          <Field label="Business Type">
                            <select value={form.businessType} onChange={e => set("businessType", e.target.value)} className={selectCls(false)}>
                              <option value="">Select…</option>
                              {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </Field>
                          <Field label="Special Requirements">
                            <textarea value={form.description} onChange={e => set("description", e.target.value)}
                              rows={3} placeholder="Describe your project, colours, logos, sizes…"
                              className={cn(inputCls(false), "h-auto resize-none py-3")} />
                          </Field>
                          <Field label="How did you hear about us?">
                            <select value={form.hearAboutUs} onChange={e => set("hearAboutUs", e.target.value)} className={selectCls(false)}>
                              <option value="">Select…</option>
                              {HEAR_ABOUT.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                          </Field>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-4">
                          <p className="text-sm text-white/50">Review your details before submitting.</p>
                          <ReviewSection title="Product">
                            <ReviewRow label="Category" value={form.category} />
                            <ReviewRow label="Sport" value={form.sport} />
                            <ReviewRow label="Quantity" value={form.quantity} />
                            <ReviewRow label="Budget" value={form.budget} />
                            <ReviewRow label="Delivery" value={form.deliveryDate} />
                            <ReviewRow label="Fabric" value={form.fabric} />
                            <ReviewRow label="Sample Required" value={form.sampleRequired} />
                          </ReviewSection>
                          <ReviewSection title="Design">
                            <ReviewRow label="Custom Logo" value={form.customLogo} />
                            <ReviewRow label="Custom Colors" value={form.customColors} />
                            <ReviewRow label="Existing Design" value={form.hasExistingDesign} />
                            <ReviewRow label="Decoration" value={form.decorationMethod} />
                          </ReviewSection>
                          <ReviewSection title="Contact">
                            <ReviewRow label="Name" value={form.name} />
                            <ReviewRow label="Email" value={form.email} />
                            <ReviewRow label="WhatsApp" value={form.phone} />
                            <ReviewRow label="Company" value={form.company} />
                            <ReviewRow label="Location" value={[form.city, form.country].filter(Boolean).join(", ")} />
                          </ReviewSection>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-white/8 px-8 py-5 flex items-center justify-between gap-3">
                  {step > 1 ? (
                    <button onClick={prev} className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/70 transition hover:border-white/30 hover:text-white">
                      <ArrowLeft size={14} /> Back
                    </button>
                  ) : <div />}
                  {step < 4 ? (
                    <button onClick={next} className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:brightness-110">
                      Next <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button onClick={submit} disabled={loading}
                      className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:brightness-110 disabled:opacity-60">
                      {loading ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <>Submit Request <ArrowRight size={14} /></>}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center px-8 py-14 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-ink">
                  <Check size={28} />
                </div>
                <h3 className="mt-6 font-display text-2xl font-black text-white">Request Submitted!</h3>
                <p className="mt-2 max-w-sm text-sm text-white/55">
                  Your quote has been saved. Our team will contact you within 24 hours.
                  Send us a WhatsApp message for a faster response.
                </p>
                <div className="mt-7 flex flex-col gap-3 w-full max-w-xs">
                  {waUrl && (
                    <a href={waUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L.057 23.617a.75.75 0 0 0 .926.926l5.762-1.476A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.502-5.188-1.381l-.372-.214-3.853.988.995-3.851-.229-.384A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                      Chat on WhatsApp
                    </a>
                  )}
                  <button onClick={handleClose}
                    className="rounded-full border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white/60 transition hover:border-accent hover:text-accent">
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function inputCls(err: boolean) {
  return cn("h-11 w-full rounded-xl border bg-white/5 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-accent",
    err ? "border-red-400" : "border-white/10");
}
function selectCls(err: boolean) {
  return cn("h-11 w-full rounded-xl border bg-[#111] px-4 text-sm text-white outline-none transition focus:border-accent [&>option]:bg-[#111]",
    err ? "border-red-400" : "border-white/10");
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
function ToggleGroup({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} type="button" onClick={() => onChange(o)}
            className={cn("rounded-lg border px-4 py-2 text-xs font-semibold transition-all",
              value === o ? "border-accent bg-accent/10 text-accent" : "border-white/10 text-white/50 hover:border-white/30"
            )}>{o}</button>
        ))}
      </div>
    </Field>
  );
}
function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-accent">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <span className="text-white/40 shrink-0">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}
