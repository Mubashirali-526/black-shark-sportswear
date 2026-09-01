"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidEmail, sanitizeInput } from "@/lib/utils";

export function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email address.");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = sanitizeInput(email);
    if (!isValidEmail(value)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  const dark = variant === "dark";

  if (status === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full px-6 py-4 text-sm font-medium",
          dark ? "bg-white/10 text-white" : "bg-ink/5 text-ink"
        )}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-ink">
          <Check size={16} />
        </span>
        You&apos;re subscribed! Thanks for joining.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5",
          dark ? "sm:bg-white/10" : "sm:border sm:border-ink/15 sm:bg-white"
        )}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email address"
          aria-label="Email address"
          maxLength={120}
          disabled={status === "loading"}
          suppressHydrationWarning
          className={cn(
            "h-12 flex-1 rounded-full bg-transparent px-5 text-sm outline-none placeholder:text-current/40 disabled:opacity-60",
            dark ? "text-white" : "text-ink"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          suppressHydrationWarning
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className={cn("mt-2 pl-4 text-xs", dark ? "text-red-300" : "text-red-500")}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}
