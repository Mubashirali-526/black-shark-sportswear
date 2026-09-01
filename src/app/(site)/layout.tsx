import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { inter, sora } from "@/lib/fonts";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsappFab } from "@/components/site/whatsapp-fab";

export const metadata: Metadata = {
  metadataBase: new URL("https://blackshark.example.com"),
  title: {
    default: "Black Shark — Premium Custom Sportswear Manufacturer",
    template: "%s | Black Shark",
  },
  description:
    "Black Shark is a premium international sportswear manufacturer specializing in custom sports uniforms, apparel and accessories for teams and brands worldwide.",
  keywords: [
    "custom sportswear",
    "sports uniforms",
    "team kits",
    "sublimation apparel",
    "sportswear manufacturer",
    "bulk sports uniforms",
  ],
  openGraph: {
    title: "Black Shark — Premium Custom Sportswear Manufacturer",
    description:
      "Custom sports uniforms, apparel and accessories engineered for champions.",
    type: "website",
  },
  robots: { index: true, follow: true },
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

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-white font-sans text-ink antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsappFab />
      </body>
    </html>
  );
}
