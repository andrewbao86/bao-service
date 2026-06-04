"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { Locale } from "@/i18n/routing";
import { studyCardIds } from "@/lib/content/hiring";
import { HiringMissionBackground } from "./HiringMissionBackground";
import { HiringStudyCard } from "./HiringStudyCard";

type HiringStudySectionProps = {
  locale: Locale;
};

export function HiringStudySection({ locale }: HiringStudySectionProps) {
  const t = useTranslations("hiring");

  return (
    <section id="study-solutions" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28 text-white">
      <HiringMissionBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-400">{t("studyLabel")}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{t("studyTitle")}</h2>
          <p className="mt-4 max-w-3xl text-slate-300">{t("studySub")}</p>
          <p className="mt-8 max-w-3xl text-xl font-semibold leading-snug text-white md:text-2xl">
            {t("studyLeadBefore")}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {studyCardIds.map((id) => (
            <ScrollReveal key={id}>
              <HiringStudyCard id={id} locale={locale} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-12 rounded-xl border border-teal-500/30 bg-teal-950/40 p-6 md:p-8">
            <p className="text-lg font-semibold text-teal-100">{t("studyLeadAfter")}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
