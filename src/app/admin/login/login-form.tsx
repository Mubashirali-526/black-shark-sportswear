"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? "Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-[10px] tracking-[2px] text-[#444] uppercase">
          Email
        </label>
        <div className="flex h-12 items-center gap-3 rounded-xl border border-[#222] bg-[#141414] px-4 transition-colors focus-within:border-accent/40">
          <Mail size={16} className="shrink-0 text-[#444]" />
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-[#2a2a2a]"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-[10px] tracking-[2px] text-[#444] uppercase">
          Password
        </label>
        <div className="flex h-12 items-center gap-3 rounded-xl border border-[#222] bg-[#141414] px-4 transition-colors focus-within:border-accent/40">
          <Lock size={16} className="shrink-0 text-[#444]" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-[#2a2a2a]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-[#444] transition-colors hover:text-accent"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="-mt-2 mb-4 text-right">
        <a href="#" className="text-[11px] text-[#444] transition-colors hover:text-accent">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[11px] font-black uppercase tracking-[3px] text-ink transition-colors hover:brightness-105 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            Access Dashboard <ArrowRight size={14} />
          </>
        )}
      </button>

      <div className="mt-7 flex items-center justify-center gap-3 border-t border-[#1a1a1a] pt-5">
        <span className="text-[10px] tracking-wide text-[#2a2a2a]">Protected by Black Shark Security</span>
        <span className="rounded border border-[#1e1e1e] px-1.5 py-0.5 text-[9px] tracking-wide text-[#333]">
          v2.0
        </span>
      </div>
    </form>
  );
}
