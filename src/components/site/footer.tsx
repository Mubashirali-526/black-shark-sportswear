import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Facebook, Instagram, Linkedin, Whatsapp } from "./social-icons";
import { Logo } from "./logo";
import { BRAND, whatsappLink } from "@/lib/data";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Team Uniforms",
    links: [
      { href: "/categories/team-uniforms", label: "All Team Uniforms" },
      { href: "/categories/team-uniforms#football", label: "Football / Soccer" },
      { href: "/categories/team-uniforms#cricket", label: "Cricket" },
      { href: "/categories/team-uniforms#basketball", label: "Basketball" },
      { href: "/categories/team-uniforms#rugby", label: "Rugby" },
      { href: "/categories/team-uniforms#boxing", label: "Boxing & MMA" },
      { href: "/categories/team-uniforms#baseball", label: "Baseball & Softball" },
      { href: "/categories/team-uniforms#volleyball", label: "Volleyball" },
      { href: "/categories/team-uniforms#martial-arts", label: "Martial Arts" },
    ],
  },
  {
    title: "Activewear & Sublimation",
    links: [
      { href: "/categories/activewear", label: "All Activewear" },
      { href: "/categories/activewear#womens", label: "Women's Activewear" },
      { href: "/categories/activewear#mens", label: "Men's Activewear" },
      { href: "/categories/activewear#compression", label: "Compression Wear" },
      { href: "/categories/activewear#sublimation", label: "Full Body Sublimation" },
      { href: "/categories/activewear#galaxy", label: "Galaxy & Space Print" },
      { href: "/categories/activewear#geometric", label: "Geometric Print" },
      { href: "/categories/activewear#custom", label: "Custom Design" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/manufacturing", label: "Manufacturing" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/quote", label: "Request Quote" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
    ],
  },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/b1ack_shark01" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/18yxQbZWM4/?mibextid=wwXIfr" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/black-shark-3b5377277?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
  {
    icon: Whatsapp,
    label: "WhatsApp",
    href: whatsappLink("Hi Black Shark, I'd like to know more about your products."),
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-x grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              Stay Ahead of the Game
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Get early access to new collections, manufacturing insights and
              exclusive trade offers.
            </p>
          </div>
          <NewsletterForm variant="dark" />
        </div>
      </div>

      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo footer />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.15em] text-accent">
            Premium Sportswear. Built in Sialkot.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
            Custom sportswear manufacturing for teams, clubs and brands worldwide.
            Trusted by teams across 40+ countries since {BRAND.founded}.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-accent" />
              {BRAND.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={17} className="shrink-0 text-accent" />
              <a href={`tel:${BRAND.phone}`} className="hover:text-white">
                {BRAND.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={17} className="shrink-0 text-accent" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-white">
                {BRAND.email}
              </a>
            </li>
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              {col.title}
            </h4>
            <ul className="mt-5 space-y-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-accent leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:border-accent hover:bg-accent hover:text-ink"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
