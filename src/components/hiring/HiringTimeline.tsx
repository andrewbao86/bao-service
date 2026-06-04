"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { hiringTimelineKeys } from "@/lib/content/hiring";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function HiringTimeline() {
  const t = useTranslations("hiring.timeline");

  return (
    <ScrollReveal>
      <section className={cn("py-20 md:py-28", section.default)}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className={cn("text-3xl font-bold md:text-4xl", text.heading)}>{t("title")}</h2>
          <p className={cn("mt-4", text.body)}>{t("sub")}</p>
          <ol className="relative mt-12 space-y-8 md:space-y-0 md:flex md:justify-between md:gap-4">
            <div
              className="absolute left-4 top-0 hidden h-full w-0.5 bg-brand-200 md:left-0 md:top-8 md:block md:h-0.5 md:w-full md:origin-left md:scale-x-100"
              aria-hidden
            />
            {hiringTimelineKeys.map((key, i) => (
              <li key={key} className="relative flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white md:mx-auto">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{t(`${key}.title`)}</h3>
                  <p className="mt-1 text-sm text-slate-600">{t(`${key}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </ScrollReveal>
  );
}
