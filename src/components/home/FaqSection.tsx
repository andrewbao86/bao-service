"use client";

import { useTranslations } from "next-intl";
import { faqItems } from "@/lib/content/faq";

export function FaqSection() {
  const t = useTranslations("home");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-section-alt">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">{t("faqTitle")}</h2>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600">{t("faqSub")}</p>
        <div className="mt-8 space-y-6">
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-slate-200/60 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.question}</h3>
              <p className="text-slate-700 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
