"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function HiringBuildingSection() {
  const t = useTranslations("hiring");

  const pills = [
    { key: "pillElectrical" as const },
    { key: "pillEnergy" as const },
    { key: "pillPm" as const },
  ];

  return (
    <ScrollReveal>
      <section className={cn("relative py-20 md:py-28", section.alt)}>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slate-900/10 pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className={cn("text-2xl md:text-3xl font-bold leading-snug", text.heading)}>
            {t("buildingQuote")}
          </p>
          <p className={cn("mt-6 text-base md:text-lg leading-relaxed", text.body)}>
            {t("buildingBody")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {pills.map(({ key }) => (
              <span
                key={key}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm ring-1 ring-slate-900/10"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
