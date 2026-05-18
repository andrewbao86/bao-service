"use client";

import { useTranslations } from "next-intl";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { CostMetricsReportViz } from "./evidence/CostMetricsReportViz";
import { MeterIntervalChartViz } from "./evidence/MeterIntervalChartViz";
import { TnbBillSummaryViz } from "./evidence/TnbBillSummaryViz";

export function EnergyEvidenceSection() {
  const t = useTranslations("energy");

  return (
    <section className={cn("py-20 md:py-28", section.alt)}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className={cn("text-2xl md:text-3xl font-semibold", text.heading)}>{t("evidenceTitle")}</h2>
        <p className={cn("mt-3 max-w-2xl text-sm md:text-base", text.body)}>{t("evidenceSub")}</p>

        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 lg:gap-y-3">
          <h3 className={cn("text-lg font-semibold lg:col-start-1 lg:row-start-1", text.heading)}>
            {t("evidenceTnbHeading")}
          </h3>
          <p className={cn("text-sm lg:col-start-1 lg:row-start-2", text.body)}>{t("evidenceTnbSub")}</p>
          <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-3 lg:self-stretch">
            <TnbBillSummaryViz />
            <MeterIntervalChartViz />
          </div>

          <h3
            className={cn(
              "mt-8 text-lg font-semibold lg:col-start-2 lg:row-start-1 lg:mt-0",
              text.heading
            )}
          >
            {t("evidenceReportHeading")}
          </h3>
          <p className={cn("text-sm lg:col-start-2 lg:row-start-2", text.body)}>{t("evidenceReportSub")}</p>
          <div className="min-h-0 lg:col-start-2 lg:row-start-3 lg:h-full">
            <CostMetricsReportViz />
          </div>
        </div>
      </div>
    </section>
  );
}
