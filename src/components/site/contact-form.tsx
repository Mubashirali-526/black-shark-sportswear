"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isValidEmail, sanitizeInput } from "@/lib/utils";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/bsuniforms7@gmail.com";
const MESSAGE_MAX = 1000;

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

function useShake(error?: string) {
  const controls = useAnimationControls();
  const prevError = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (error && error !== prevError.current) {
      controls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45 },
      });
    }
    prevError.current = error;
  }, [error, controls]);
  return controls;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = sanitizeInput(String(fd.get("name") ?? ""));
    const email = sanitizeInput(String(fd.get("email") ?? ""));
    const phone = sanitizeInput(String(fd.get("phone") ?? ""));
    const subject = sanitizeInput(String(fd.get("subject") ?? ""));
    const message = sanitizeInput(String(fd.get("message") ?? ""));

    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (subject.length < 3) next.subject = "Please add a subject.";
    if (message.length < 10) next.message = "Message must be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setServerError("");
    setSubmitting(true);
    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.success === "false" || data.success === false) {
        throw new Error(data?.message || `FormSubmit responded with ${res.status}`);
      }
      setSentName(name);
      setSent(true);
      form.reset();
    } catch (err) {
      console.error("FormSubmit send failed:", err);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#111111] p-12 text-center"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          className="grid h-16 w-16 place-items-center rounded-full bg-accent text-ink shadow-[0_0_0_8px_rgba(200,162,74,0.12),0_0_30px_-4px_rgba(200,162,74,0.5)]"
        >
          <Check size={30} />
        </motion.span>
        <h3 className="mt-6 font-display text-2xl font-bold text-white">
          Thanks, {sentName}! We&apos;ll be in touch.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-white/60">
          Your message has been received. Our team will get back to you
          within one business day.
        </p>
        <Button onClick={() => setSent(false)} variant="outline" className="mt-6">
          Send another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 bg-transparent">
      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField label="Full Name" name="name" placeholder="John Carter" error={errors.name} />
        <FloatingField label="Email" name="email" type="email" placeholder="you@email.com" error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <PhoneField label="Phone (optional)" name="phone" />
        <FloatingField label="Subject" name="subject" placeholder="How can we help?" error={errors.subject} />
      </div>
      <FloatingTextarea label="Message" name="message" error={errors.message} maxLength={MESSAGE_MAX} />
      {serverError && <p className="text-xs text-red-500">{serverError}</p>}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? (
          <>
            Sending
            <LoadingDots />
          </>
        ) : (
          <>
            <Send size={17} /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}

function LoadingDots() {
  return (
    <span className="ml-1 inline-flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

const inputBase =
  "peer h-14 w-full rounded-xl border bg-[#1a1a1a] px-4 pt-4 text-sm text-white outline-none transition-all duration-200 placeholder-transparent focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,162,74,0.18),0_0_20px_-4px_rgba(200,162,74,0.4)]";

const labelBase =
  "pointer-events-none absolute left-4 text-[#666666] transition-all duration-200 ease-out";

function FloatingField({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const floated = focused || hasValue;
  const shakeControls = useShake(error);

  return (
    <div>
      <motion.div animate={shakeControls} className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder ?? " "}
          maxLength={120}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          suppressHydrationWarning
          className={cn(inputBase, error ? "border-red-400" : "border-[#333333]")}
        />
        <label
          htmlFor={name}
          className={cn(
            labelBase,
            floated ? "top-2 text-[10px] font-semibold uppercase tracking-wide text-accent" : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      </motion.div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function PhoneField({ label, name }: { label: string; name: string }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const floated = focused || hasValue;

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-white/50">
          +92
        </span>
        <input
          id={name}
          name={name}
          type="tel"
          placeholder=" "
          maxLength={20}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(e.target.value.length > 0);
          }}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          suppressHydrationWarning
          className={cn(inputBase, "border-[#333333] pl-12")}
        />
        <label
          htmlFor={name}
          className={cn(
            labelBase,
            floated
              ? "left-4 top-2 text-[10px] font-semibold uppercase tracking-wide text-accent"
              : "left-12 top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

function FloatingTextarea({
  label,
  name,
  error,
  maxLength,
}: {
  label: string;
  name: string;
  error?: string;
  maxLength: number;
}) {
  const [focused, setFocused] = useState(false);
  const [length, setLength] = useState(0);
  const floated = focused || length > 0;
  const shakeControls = useShake(error);
  const nearLimit = length >= maxLength * 0.9;

  return (
    <div>
      <motion.div animate={shakeControls} className="relative">
        <textarea
          id={name}
          name={name}
          rows={5}
          maxLength={maxLength}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setLength(e.target.value.length)}
          suppressHydrationWarning
          className={cn(
            "peer w-full resize-none rounded-2xl border bg-[#1a1a1a] px-4 pb-3 pt-6 text-sm text-white outline-none transition-all duration-200 placeholder-transparent focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,162,74,0.18),0_0_20px_-4px_rgba(200,162,74,0.4)]",
            error ? "border-red-400" : "border-[#333333]"
          )}
        />
        <label
          htmlFor={name}
          className={cn(
            labelBase,
            floated ? "top-2 text-[10px] font-semibold uppercase tracking-wide text-accent" : "top-4 text-sm"
          )}
        >
          {label}
        </label>
        <span
          className={cn(
            "pointer-events-none absolute bottom-3 right-4 text-[11px] tabular-nums transition-colors",
            nearLimit ? "text-amber-400" : "text-white/35"
          )}
        >
          {length} / {maxLength}
        </span>
      </motion.div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
