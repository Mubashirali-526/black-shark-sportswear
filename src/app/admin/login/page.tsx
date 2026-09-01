import type { Metadata } from "next";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-2 bg-[#0a0a0a]">
      {/* Left panel — brand side */}
      <div className="flex flex-col justify-between border-r border-[#1a1a1a] bg-[#0c0c0c] p-12">
        {/* Top: logo row */}
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-ink">
            BS
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white">
              Black Shark
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[#444]">
              Sportswear
            </p>
          </div>
        </div>

        {/* Middle: hero text */}
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[4px] text-accent">
            Admin Portal
          </p>
          <h1 className="font-display text-4xl font-black leading-tight text-white">
            Manage Your <span className="text-accent">Business</span>
          </h1>
          <p className="mt-4 max-w-[240px] text-[13px] leading-relaxed text-[#444]">
            Full control over products, categories, and brand assets — all in
            one place.
          </p>

          <div className="mt-8 flex gap-6">
            <div>
              <p className="text-xl font-bold text-white">40+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#444]">
                Countries
              </p>
            </div>
            <div className="w-px self-stretch bg-[#1e1e1e]" />
            <div>
              <p className="text-xl font-bold text-white">500+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#444]">
                Products
              </p>
            </div>
            <div className="w-px self-stretch bg-[#1e1e1e]" />
            <div>
              <p className="text-xl font-bold text-white">20+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#444]">
                MOQ
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: security badge */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-[10px] uppercase tracking-widest text-[#333]">
            256-bit encrypted · Secure access
          </span>
        </div>
      </div>

      {/* Right panel — form side */}
      <div className="flex items-center justify-center bg-[#0f0f0f]">
        <div className="w-full max-w-sm px-4">
          <p className="mb-2 text-[10px] uppercase tracking-[4px] text-[#555]">
            Welcome back
          </p>
          <h2 className="text-2xl font-bold text-white">Sign in</h2>
          <p className="mb-8 text-xs text-[#3a3a3a]">
            Access the Black Shark administration panel
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
