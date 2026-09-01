import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of the Black Shark website and services.",
};

const sections = [
  {
    h: "1. Acceptance of Terms",
    p: "By accessing or using the Black Shark website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.",
  },
  {
    h: "2. Products & Custom Orders",
    p: "All custom products are made to order based on the specifications and artwork you approve. Digital proofs must be confirmed before production begins. Once approved, custom orders cannot be cancelled or refunded except in the case of manufacturing defects.",
  },
  {
    h: "3. Pricing & Quotes",
    p: "Quotes are valid for 30 days unless otherwise stated. Prices are subject to change based on order quantity, fabric selection, decoration method and shipping destination. All prices are exclusive of applicable duties and taxes unless specified.",
  },
  {
    h: "4. Payment Terms",
    p: "For custom orders, a deposit is typically required to commence production, with the balance due before dispatch. Established trade partners may arrange alternative terms in writing.",
  },
  {
    h: "5. Lead Times & Delivery",
    p: "Estimated lead times are provided in good faith and begin after proof approval and deposit receipt. While we strive for on-time delivery, we are not liable for delays caused by carriers, customs or events beyond our control.",
  },
  {
    h: "6. Intellectual Property",
    p: "You retain ownership of logos and artwork you supply and warrant that you have the rights to use them. All website content, designs and branding belonging to Black Shark remain our intellectual property.",
  },
  {
    h: "7. Returns & Defects",
    p: "Please inspect your order on delivery. Claims for defects or discrepancies must be reported within 7 days of receipt with supporting photos. Custom items are non-returnable unless defective.",
  },
  {
    h: "8. Limitation of Liability",
    p: "To the maximum extent permitted by law, Black Shark's liability for any claim is limited to the value of the products supplied. We are not liable for indirect or consequential losses.",
  },
  {
    h: "9. Governing Law",
    p: "These terms are governed by the laws of the jurisdiction in which Black Shark operates. Any disputes shall be subject to the exclusive jurisdiction of its courts.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        subtitle="The rules of engagement for working with Black Shark."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
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
              <p className="text-sm text-ink/65">
                For questions about these terms, contact{" "}
                <a href={`mailto:${BRAND.email}`} className="font-semibold text-ink underline">
                  {BRAND.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
