import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { faqs, whatsappLink, BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Black Shark custom sportswear — MOQ, lead times, shipping, samples, design and payment.",
};

export default function FaqPage() {
  const half = Math.ceil(faqs.length / 2);
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before placing your first custom order."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <section className="container-x py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <FaqAccordion items={faqs.slice(0, half)} />
          </Reveal>
          <Reveal delay={0.1}>
            <FaqAccordion items={faqs.slice(half)} />
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="rounded-3xl border border-ink/10 bg-neutral-50 p-8 text-center md:p-14">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Still have questions?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-ink/60">
              Our team is happy to help with anything — from artwork advice to
              shipping timelines. Reach out and we&apos;ll respond fast.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" size="lg">
                <Mail size={18} /> Contact Us
              </ButtonLink>
              <ButtonLink
                href={whatsappLink("Hi Black Shark, I have a question about your products.")}
                external
                size="lg"
                className="bg-[#25D366] text-white hover:brightness-105"
              >
                <MessageCircle size={18} /> WhatsApp
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-ink/40">
              Or email us directly at{" "}
              <a href={`mailto:${BRAND.email}`} className="font-semibold text-ink underline">
                {BRAND.email}
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
