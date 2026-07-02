"use client";

import {
  BarChart3,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Sparkles,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { ENERGY_PORTAL_URL } from "@/lib/constants";
import { surface, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { EnergyTnbMailCta } from "./EnergyTnbMailCta";

const benefitKeys = ["aiBenefit1", "aiBenefit2", "aiBenefit3", "aiBenefit4"] as const;
const promptKeys = ["aiPrompt1", "aiPrompt2", "aiPrompt3", "aiPrompt4", "aiPrompt5"] as const;
const metricKeys = ["aiMetric1", "aiMetric2", "aiMetric3"] as const;

const benefitIcons: Record<(typeof benefitKeys)[number], LucideIcon> = {
  aiBenefit1: TrendingDown,
  aiBenefit2: BarChart3,
  aiBenefit3: Lightbulb,
  aiBenefit4: RefreshCw,
};

type EnergyAiInsightsSectionProps = {
  onRequestReport: () => void;
};

export function EnergyAiInsightsSection({ onRequestReport }: EnergyAiInsightsSectionProps) {
  const t = useTranslations("energy");

  return (
    <section
      className="relative isolate overflow-hidden py-20 md:py-28"
      aria-labelledby="energy-ai-insights-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white to-teal-50/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">
          {t("aiSectionLabel")}
        </p>
        <h2
          id="energy-ai-insights-heading"
          className={cn("mt-3 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl", text.heading)}
        >
          {t("aiSectionTitle")}
        </h2>
        <p className={cn("mt-3 max-w-3xl text-base md:text-lg", text.body)}>{t("aiSectionSubtitle")}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <h3 className={cn("text-xl font-semibold md:text-2xl", text.heading)}>{t("aiSectionHeading")}</h3>
            <p className={cn("mt-4 text-sm leading-relaxed md:text-base", text.body)}>{t("aiSectionBody")}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefitKeys.map((key) => {
                const Icon = benefitIcons[key];
                return (
                  <article
                    key={key}
                    className={cn(
                      surface.card,
                      "group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-brand-200/50"
                    )}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <h4 className={cn("mt-3 text-sm font-semibold", text.heading)}>{t(`${key}Title`)}</h4>
                    <p className={cn("mt-2 text-sm leading-relaxed", text.body)}>{t(`${key}Text`)}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <EnergyTnbMailCta className="w-full sm:w-auto" onClick={onRequestReport} />
              <a
                href={ENERGY_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
              >
                {t("portalCta")}
              </a>
            </div>
          </div>

          <div
            className={cn(
              "overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-900/10",
              "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950"
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t("aiPanelHeader")}</p>
                  <p className="text-xs text-slate-400">{t("aiPanelStatus")}</p>
                </div>
              </div>
              <span className="rounded-full bg-teal-500/15 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-teal-300">
                {t("aiPanelBadge")}
              </span>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex flex-wrap gap-2">
                {promptKeys.map((key, i) => (
                  <span
                    key={key}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs leading-snug transition-colors",
                      i === 0
                        ? "bg-teal-500/20 text-teal-100 ring-1 ring-teal-400/30"
                        : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
                    )}
                  >
                    {t(key)}
                  </span>
                ))}
              </div>

              <div className="space-y-3 rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-200">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">
                      {t("aiUserLabel")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-100">{t("aiUserQuestion")}</p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-white/10 pt-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-200">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-medium uppercase tracking-wide text-teal-400/90">
                      {t("aiAssistantLabel")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-200">{t("aiResponse")}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {metricKeys.map((key) => (
                  <div
                    key={key}
                    className="rounded-lg bg-white/[0.04] px-3 py-2.5 text-center ring-1 ring-white/10"
                  >
                    <p className="text-[0.65rem] font-medium uppercase tracking-wide text-teal-300/90">
                      {t(key)}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-slate-500">{t("aiDisclaimer")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
