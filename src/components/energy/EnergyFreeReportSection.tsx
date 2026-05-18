"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { energyImages } from "@/lib/content/energyMedia";
import { heroGradient } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { whatsappEnergyLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { EnergyTnbMailCta } from "./EnergyTnbMailCta";

const bulletTranslationKeys = [
  "freeReportBullet1",
  "freeReportBullet2",
  "freeReportBullet3",
  "freeReportBullet4",
] as const;

export function EnergyFreeReportSection() {
  const t = useTranslations("energy");
  const wa = whatsappEnergyLink(WHATSAPP_MESSAGES.energyTnbReport);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-28 text-white",
        heroGradient
      )}
    >
      <Image
        src={energyImages.freeReportBackground}
        alt=""
        fill
        className="object-cover object-center opacity-25 mix-blend-overlay"
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
      <div className="absolute inset-0 bg-slate-900/30" aria-hidden />
      <section className="relative z-10 mx-auto max-w-6xl px-4">
        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              {t("freeReportTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
              {t("freeReportSub")}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {bulletTranslationKeys.map((key) => (
                <li key={key} className="flex gap-3 text-sm leading-relaxed text-slate-100">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-brand-100"
                    aria-hidden
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm md:p-8">
            <p className="text-sm font-medium text-brand-100">{t("ctaFreeReport")}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <EnergyTnbMailCta className="w-full justify-center sm:flex-1 lg:w-full" />
              <a href={wa} target="_blank" rel="noopener noreferrer" className="sm:flex-1 lg:w-full">
                <Button size="lg" variant="whatsapp" className="w-full">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {t("ctaWhatsApp")}
                </Button>
              </a>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
