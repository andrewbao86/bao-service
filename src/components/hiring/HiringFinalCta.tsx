"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { heroGradient } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { HiringMissionBackground } from "./HiringMissionBackground";

type HiringFinalCtaProps = {
  onPitchClick: () => void;
};

export function HiringFinalCta({ onPitchClick }: HiringFinalCtaProps) {
  const t = useTranslations("hiring");

  return (
    <section className={cn("relative isolate overflow-hidden py-20 md:py-28 text-white", heroGradient)}>
      <HiringMissionBackground showScanLine={false} />
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">{t("finalCtaTitle")}</h2>
        <p className="mt-4 text-lg text-slate-200">{t("finalCtaSub")}</p>
        <Button size="lg" className="mt-8" onClick={onPitchClick}>
          {t("heroPitchCta")}
        </Button>
      </div>
    </section>
  );
}
