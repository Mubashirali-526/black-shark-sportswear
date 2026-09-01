import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { inter, sora } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Black Shark Admin",
  },
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

// Separate root layout from src/app/(site)/layout.tsx — the admin panel is fully
// isolated from the public site shell (no Navbar/Footer/announcement bar). Next.js
// requires each top-level root layout to own its own <html>/<body>.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
