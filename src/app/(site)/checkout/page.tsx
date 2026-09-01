"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Lock, ChevronRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPrice, cn, isValidEmail, isValidPhone, sanitizeInput } from "@/lib/utils";

const summaryItems = [
  {
    slug: "custom-team-jersey-set",
    name: "Custom Team Jersey Set",
    images: ["/categories/teamwear-hero.png"],
    price: 32,
    color: "Onyx Black",
    size: "L",
    qty: 12,
  },
  {
    slug: "performance-training-kit",
    name: "Performance Training Kit",
    images: ["/categories/gym-wear.png"],
    price: 28,
    color: "Shark Blue",
    size: "M",
    qty: 10,
  },
];

export default function CheckoutPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const subtotal = summaryItems.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => sanitizeInput(String(fd.get(k) ?? ""));
    const next: Record<string, string> = {};
    if (g("firstName").length < 2) next.firstName = "Required";
    if (g("lastName").length < 2) next.lastName = "Required";
    if (!isValidEmail(g("email"))) next.email = "Valid email required";
    if (!isValidPhone(g("phone"))) next.phone = "Valid phone required";
    if (g("address").length < 5) next.address = "Required";
    if (g("city").length < 2) next.city = "Required";
    if (g("zip").length < 3) next.zip = "Required";
    if (g("country").length < 2) next.country = "Required";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (done) {
    return (
      <div className="min-h-[70vh] border-t border-ink/10 bg-neutral-50">
        <div className="container-x flex flex-col items-center py-24 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-accent text-ink">
            <Check size={40} />
          </span>
          <h1 className="mt-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            Order request placed!
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink/60">
            Thank you! This is a demo checkout — no payment was taken. Our team will
            confirm your custom order details and send a final invoice shortly.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/products">Continue Shopping</ButtonLink>
            <ButtonLink href="/" variant="outline">Back Home</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] border-t border-ink/10 bg-neutral-50">
      <div className="container-x py-12 md:py-16">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink/45">
          <Link href="/products" className="hover:text-ink">Products</Link>
          <ChevronRight size={12} />
          <span className="text-ink">Checkout</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
          Checkout
        </h1>

        <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Customer info */}
          <div className="space-y-8">
            <Section title="Contact Information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input name="email" label="Email *" type="email" error={errors.email} />
                <Input name="phone" label="Phone / WhatsApp *" error={errors.phone} />
              </div>
            </Section>

            <Section title="Shipping Address">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input name="firstName" label="First Name *" error={errors.firstName} />
                <Input name="lastName" label="Last Name *" error={errors.lastName} />
              </div>
              <Input name="company" label="Company / Team (optional)" />
              <Input name="address" label="Street Address *" error={errors.address} />
              <div className="grid gap-5 sm:grid-cols-3">
                <Input name="city" label="City *" error={errors.city} />
                <Input name="zip" label="ZIP / Postal *" error={errors.zip} />
                <Input name="country" label="Country *" error={errors.country} />
              </div>
            </Section>

            <Section title="Order Notes">
              <textarea
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="Delivery instructions or customisation notes…"
                className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </Section>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-3xl border border-ink/10 bg-white p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-xl font-bold text-ink">Your Order</h2>
            <div className="mt-5 space-y-4">
              {summaryItems.map((it) => (
                <div key={it.slug} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image src={it.images[0]} alt={it.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
                      {it.qty}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-semibold text-ink line-clamp-1">
                      {it.name}
                    </span>
                    <span className="text-xs text-ink/50">
                      {it.color} · {it.size}
                    </span>
                    <span className="mt-auto text-sm font-semibold text-ink">
                      {formatPrice(it.price * it.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-3 border-t border-ink/10 pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Estimated Tax (5%)" value={formatPrice(tax)} />
              <Row label="Shipping" value="Confirmed at invoice" />
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <dt className="font-display text-base font-bold text-ink">Total</dt>
                <dd className="font-display text-lg font-bold text-ink">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <Button type="submit" size="lg" className="mt-6 w-full">
              <Lock size={16} /> Place Order
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink/40">
              <Lock size={12} /> Demo checkout — no payment is processed
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
      <h2 className="mb-5 font-display text-lg font-bold text-ink">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Input({
  name,
  label,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        maxLength={120}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition-colors focus:border-ink",
          error ? "border-red-400" : "border-ink/15"
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink/60">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
