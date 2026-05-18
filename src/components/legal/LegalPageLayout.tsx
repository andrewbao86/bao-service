"use client";

import { Suspense, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { GetStartedModal } from "@/components/shared/GetStartedModal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { Locale } from "@/i18n/routing";

export function LegalPageLayout({
  locale,
  title,
  lastUpdated,
  children,
}: {
  locale: Locale;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <SiteHeader locale={locale} onGetStarted={() => setModalOpen(true)} linkToHome />
      <div className="pt-16 py-12">
        <ScrollReveal>
          <article className="mx-auto max-w-3xl px-4 prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 text-sm not-prose">{lastUpdated}</p>
            {children}
          </article>
        </ScrollReveal>
      </div>
      <Footer locale={locale} />
      <Suspense fallback={null}>
        <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} locale={locale} />
      </Suspense>
    </main>
  );
}
