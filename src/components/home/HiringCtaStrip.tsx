"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function HiringCtaStrip() {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <ScrollReveal>
      <section className="relative overflow-hidden border-y border-teal-500/20 bg-gradient-to-r from-teal-950 via-slate-900 to-brand-950 py-12 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t("hiringCtaTitle")}</h2>
            <p className="mt-2 max-w-xl text-slate-300">{t("hiringCtaSub")}</p>
          </div>
          <Link href={`/${locale}/hiring?source=homepage-cta`} className="shrink-0">
            <Button size="lg" className="gap-2 bg-teal-600 hover:bg-teal-500">
              {t("hiringCtaButton")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
}
