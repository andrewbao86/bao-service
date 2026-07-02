"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/motion/WhatsAppFab";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { HiringHero } from "./HiringHero";

const sectionFallback = (className: string) => (
  <div className={className} aria-hidden />
);

const HiringBuildingSection = dynamic(
  () => import("./HiringBuildingSection").then((m) => m.HiringBuildingSection),
  { loading: () => sectionFallback("min-h-[14rem] animate-pulse bg-section-alt") }
);

const HiringStudySection = dynamic(
  () => import("./HiringStudySection").then((m) => m.HiringStudySection),
  { loading: () => sectionFallback("min-h-[24rem] animate-pulse bg-slate-950") }
);

const HiringPitchForm = dynamic(
  () => import("./HiringPitchForm").then((m) => m.HiringPitchForm),
  { loading: () => sectionFallback("min-h-[32rem] animate-pulse rounded-2xl bg-slate-900") }
);

const HiringTimeline = dynamic(
  () => import("./HiringTimeline").then((m) => m.HiringTimeline),
  { loading: () => sectionFallback("min-h-[16rem] animate-pulse bg-section-alt") }
);

const HiringFaq = dynamic(
  () => import("./HiringFaq").then((m) => m.HiringFaq),
  { loading: () => sectionFallback("min-h-[16rem] animate-pulse bg-white") }
);

const HiringFinalCta = dynamic(
  () => import("./HiringFinalCta").then((m) => m.HiringFinalCta),
  { loading: () => sectionFallback("min-h-[12rem] animate-pulse bg-brand-600") }
);

type HiringPageProps = {
  locale: Locale;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HiringPage({ locale }: HiringPageProps) {
  const t = useTranslations("hiring");

  const scrollToStudy = useCallback(() => scrollToSection("study-solutions"), []);
  const scrollToPitch = useCallback(() => scrollToSection("pitch-form"), []);

  return (
    <main className="min-h-screen">
      <SiteHeader locale={locale} linkToHome getStartedLabel={t("heroPitchCta")} onGetStarted={scrollToPitch} />
      <div className="pt-16">
        <HiringHero onStudyClick={scrollToStudy} onPitchClick={scrollToPitch} />
        <HiringBuildingSection />
        <HiringStudySection locale={locale} />

        <section id="pitch-form" className="scroll-mt-20 bg-section-alt py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{t("formSectionTitle")}</h2>
              <p className="mt-4 text-slate-600">{t("formSectionSub")}</p>
            </ScrollReveal>
            <div className="mt-10">
              <HiringPitchForm locale={locale} />
            </div>
          </div>
        </section>

        <HiringTimeline />
        <HiringFaq />
        <HiringFinalCta onPitchClick={scrollToPitch} />
      </div>
      <WhatsAppFab />
      <Footer locale={locale} />
    </main>
  );
}
