"use client";

import { useTranslations } from "next-intl";
import { energyImages } from "@/lib/content/energyMedia";
import { section, surface, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { EnergyImageFrame } from "./EnergyImageFrame";

export function EnergyTariffBadge({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const t = useTranslations("energy");
  return (
    <span
      className={cn(
        "inline-block rounded-full text-xs font-semibold tracking-wide",
        onDark
          ? "bg-white px-4 py-1.5 text-brand-700 shadow-md ring-1 ring-white/80"
          : "bg-brand-50 px-3 py-1 text-brand-800 ring-1 ring-inset ring-brand-200",
        className
      )}
    >
      {t("tariffBadge")}
    </span>
  );
}

export function EnergyTariffCallout() {
  const t = useTranslations("energy");

  return (
    <section className={cn("py-10 md:py-12", section.default, "border-b border-slate-200/70")}>
      <div className="mx-auto max-w-6xl px-4">
        <div className={cn(surface.panel, "overflow-hidden p-0")}>
          <div className="grid gap-0 lg:grid-cols-[1fr_minmax(280px,42%)] lg:items-stretch">
            <div className="p-6 md:p-8">
              <EnergyTariffBadge />
              <h2 className={cn("mt-3 text-lg font-semibold md:text-xl", text.heading)}>
                {t("tariffEligibilityTitle")}
              </h2>
              <p className={cn("mt-2 text-sm leading-relaxed md:text-base", text.body)}>
                {t("tariffEligibilityBody")}
              </p>
              <p className={cn("mt-3 text-sm font-medium text-brand-700")}>{t("tariffCategoryName")}</p>
            </div>
            <EnergyImageFrame
              src={energyImages.malaysiaMarket}
              alt={t("tariffEligibilityImageAlt")}
              className="aspect-[16/10] min-h-[220px] w-full rounded-none ring-0 lg:aspect-auto lg:min-h-[260px] lg:h-full"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
