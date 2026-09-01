import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/site/reveal";
import { BRAND, whatsappLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Black Shark for custom sportswear enquiries, quotes and support.",
};

const details = [
  { icon: MapPin, label: "Visit Us", value: BRAND.address },
  { icon: Phone, label: "Call Us", value: BRAND.phone, href: `tel:${BRAND.phone}` },
  { icon: Mail, label: "Email Us", value: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat · 9:00 AM – 7:00 PM" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Let's Build Something"
        subtitle="Questions, quotes or custom projects — we're here and we respond fast."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-[#0a0a0a] py-16 text-white md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Info */}
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Get in touch
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Reach out through any channel below, or send us a message and we&apos;ll
              reply within one business day.
            </p>

            <div className="mt-8 space-y-4">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#111111] p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-white">
                    <d.icon size={20} />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      {d.label}
                    </div>
                    {d.href ? (
                      <a href={d.href} className="mt-1 block text-sm font-medium text-white hover:text-accent">
                        {d.value}
                      </a>
                    ) : (
                      <div className="mt-1 text-sm font-medium text-white">{d.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={whatsappLink("Hi Black Shark, I'd like to get in touch.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-wide text-ink transition-transform hover:scale-[1.01]"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 sm:p-10">
              <h2 className="font-display text-2xl font-bold text-white">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Fill in the form and we&apos;ll be in touch.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="container-x">
        <div className="w-full overflow-hidden rounded-xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6731.0709979676085!2d74.54382339002808!3d32.4851137452862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391eea87b3906971%3A0xb503ec781fc3fe45!2sNeka%20Pura%2C%20Sialkot%2C%20Pakistan!5e0!3m2!1sen!2s!4v1786776818715!5m2!1sen!2s"
            width="100%"
            height="400"
            className="grayscale transition-[filter] duration-500 hover:grayscale-0"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
    </>
  );
}
