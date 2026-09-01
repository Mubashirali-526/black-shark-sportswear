import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Black Shark collects, uses and protects your personal data.",
};

const sections = [
  {
    h: "1. Information We Collect",
    p: "We collect information you provide directly — such as your name, email, phone number, company and shipping details — when you request a quote, place an order, subscribe to our newsletter or contact us. We also collect limited technical data (like browser type and pages visited) to improve our website.",
  },
  {
    h: "2. How We Use Your Information",
    p: "Your information is used to process quotes and orders, communicate about your projects, provide customer support, send updates you have opted into, and improve our products and services. We never sell your personal data to third parties.",
  },
  {
    h: "3. Data Sharing",
    p: "We share information only with trusted partners who help us operate — such as shipping carriers and payment processors — and only to the extent necessary. These partners are bound by confidentiality obligations.",
  },
  {
    h: "4. Data Security",
    p: "We implement industry-standard security measures, including encrypted transmission and restricted access controls, to protect your information. However, no method of transmission over the internet is completely secure.",
  },
  {
    h: "5. Cookies",
    p: "We use cookies and similar technologies to remember your preferences and understand how our site is used. You can control cookies through your browser settings.",
  },
  {
    h: "6. Your Rights",
    p: "You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us using the details below.",
  },
  {
    h: "7. Changes to This Policy",
    p: "We may update this Privacy Policy periodically. Material changes will be posted on this page with an updated revision date.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy matters. Here's how we handle your data."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <section className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-ink/50">Last updated: January 2026</p>
          <div className="mt-8 space-y-8">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="font-display text-xl font-bold text-ink">{s.h}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{s.p}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-ink/10 bg-neutral-50 p-6">
              <h2 className="font-display text-lg font-bold text-ink">Contact</h2>
              <p className="mt-2 text-sm text-ink/65">
                Questions about this policy? Email{" "}
                <a href={`mailto:${BRAND.email}`} className="font-semibold text-ink underline">
                  {BRAND.email}
                </a>{" "}
                or write to us at {BRAND.address}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
