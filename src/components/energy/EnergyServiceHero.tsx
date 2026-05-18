"use client";

import { useTranslations } from "next-intl";
import { BrandHero } from "@/components/motion/BrandHero";
import { text } from "@/lib/ui-classes";
import { EnergyTariffBadge } from "./EnergyTariffCallout";
import { EnergyPortalCta } from "./EnergyPortalCta";
import { EnergyTnbMailCta } from "./EnergyTnbMailCta";

export function EnergyServiceHero() {
  const t = useTranslations("energy");

  return (
    <BrandHero>
      <EnergyTariffBadge className="mb-4" onDark />
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{t("heroTitle")}</h1>
      <p className={`mt-5 text-base md:text-lg leading-relaxed ${text.onDarkMuted}`}>{t("heroSub")}</p>
      <p className={`mt-3 text-sm ${text.onDarkMuted}`}>{t("heroAudience")}</p>
      <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
        <EnergyTnbMailCta className="shrink-0" />
        <EnergyPortalCta className="shrink-0" />
      </div>
    </BrandHero>
  );
}
